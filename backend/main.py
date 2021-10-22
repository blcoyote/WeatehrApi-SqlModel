from fastapi import Depends, FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from pydantic.tools import parse_obj_as
from sqlmodel import Session, select
from loguru import logger
import requests
from starlette.websockets import WebSocket, WebSocketDisconnect
from starlette.types import Message
import uvicorn
from datetime import datetime, timedelta
from urllib import parse
from core import security, data_models, database, websockets
from core.settings import get_settings, VERSION
from typing import List, Optional

# instantiate api.
logger.remove(0)
logger.add(f"./log/apilog_{datetime.now().strftime('%Y-%m-%d')}.log", rotation="1 day",
           colorize=False, format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level} | <level>{message}</level>")

app = FastAPI(title='Weatherstation API',
              version=VERSION, debug=False)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# add middleware to capture logs
notifier = websockets.Notifier()


@app.middleware("http")
async def log_middle(request: Request, call_next):
    logger.debug(
        f" {request.client.host} | {request.method} {request.url}")

    logger.debug("Params:")
    for name, value in request.path_params.items():
        logger.debug(f"\t{name}: {value}")

    response = await call_next(request)
    return response


@app.on_event("startup")
async def startup_event():
    logger.debug("Starting logging.")
    await notifier.generator.asend(None)


# Posting weather data from station. not user endpoint.
# new function to reduce boilerplate on get request with large amount of params (why are professional companies creating devices that tranfer data in get requests...)
# parameters are mapped to an Observation model in Depends
@app.get("/weatherstation/updateweatherstation.php", status_code=status.HTTP_201_CREATED)
async def store(PASSWORD: str, observation: data_models.Observation = Depends(data_models.create_observation)):
    if PASSWORD == get_settings().ACCESSCTL:

        try:

            if get_settings().WINDY_ENABLED:
                url = "https://stations.windy.com/pws/update/%s?winddir=%s&windspeedmph=%s&windgustmph=%s&tempf=%s&rainin=%s&baromin=%s&dewptf=%s&humidity=%s&dateutc=%s" % (
                    parse.quote_plus(get_settings().WINDYKEY), observation.winddir, observation.windspeedmph, observation.windgustmph, observation.tempf, observation.rainin, observation.baromin, observation.dewptf, observation.humidity, observation.dateutc)
                requests.get(url)
        except Exception as ex:
            logger.exception(f"Error pushing data to windy", ex)

        try:
            with Session(database.engine) as session:
                session.add(observation)
                session.commit()
            await notifier.push(observation.dict())
        except Exception as ex:
            logger.exception("Error saving observation to database", ex)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )


# Returns list of Observation objects based on input criteria.
# TODO: rework result_interval. Currently slices results and returns every Nth item.
# To get hourly intervals enter 12 as incoming observersions are stored every 5 minutes.
# Endpoint is public. Sharing is caring.
@app.get("/weatherstation/getweather", status_code=status.HTTP_200_OK, response_model=List[data_models.Observation])
async def get_weather(day_delta: int = 1, result_interval: int = 12, imperial: Optional[bool] = False):

    if (day_delta > 31 or day_delta <= 0):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="day_delta must be between 0 and 31"
        )
    if result_interval <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="result_interval must be a non-zero positive value"
        )

    time = datetime.utcnow() - timedelta(days=day_delta)

    try:
        with Session(database.engine) as session:
            statement = select(data_models.Observation
                               ).where(data_models.Observation.dateutc > time
                                       ).order_by(data_models.Observation.id.desc())

            results = session.exec(statement).all()
            # convert to metric via inheritance with validator decorators.
            # Don't return response_model as Metric_Observation as conversions will otherwise be applied twice as its passing through the application stack
            if imperial:  # switch between imperial and metric measurements. Imperial is standard form the source.
                return results[::result_interval]
            else:
                metric_results = parse_obj_as(
                    List[data_models.Metric_Observation], results[::result_interval])
                return metric_results
    except Exception as ex:
        logger.exception(
            f"failed weather lookup with day_delta: {day_delta}, result_interval {result_interval}", ex)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database lookup failed"
        )


@app.get("/weatherstation/getlatest", status_code=status.HTTP_200_OK, response_model=data_models.Observation)
async def get_latest(imperial: Optional[bool] = False):

    # speed optimization. the query will take longer if i dont limit the range due to the amount of data in the table
    time = datetime.utcnow() - timedelta(hours=1)

    try:
        with Session(database.engine) as session:
            statement = select(data_models.Observation
                               ).where(data_models.Observation.dateutc > time
                                       ).order_by(data_models.Observation.id.desc()
                                                  )

            result = session.exec(statement).first()

            # convert to metric via inheritance with validator decorators.
            # Don't return response_model as Metric_Observation as conversions will otherwise be applied twice as its passing through the application stack
            if imperial:  # switch between imperial and metric measurements. Imperial is standard form the source.
                return result
            else:
                metric_results = parse_obj_as(
                    data_models.Metric_Observation, result)
                return metric_results

    except Exception as ex:
        logger.exception(
            f"failed weather lookup", ex)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database lookup failed"
        )


# Login endpoint, returns a token.
@app.post("/token", response_model=data_models.Token, status_code=status.HTTP_202_ACCEPTED)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):

    try:
        user = security.authenticate_user(database.user_lookup(
            form_data.username), form_data.username, form_data.password)

    except Exception as ex:
        logger.exception(f"Problem logging in that isnt 401 related")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Incorrect username or password"
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expires = timedelta(
        minutes=get_settings().ACCESS_TOKEN_EXPIRE_MINUTES
    )
    access_token = security.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expiry": datetime.now() + timedelta(minutes=get_settings().ACCESS_TOKEN_EXPIRE_MINUTES)
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await notifier.connect(websocket)
    try:
        while True:

            data = await websocket.receive_text()
            # await websocket.send_text(data)
    except WebSocketDisconnect:
        notifier.remove(websocket)


# test endpoint1 to be deactivated
@app.get("/users/me/", response_model=data_models.User, status_code=status.HTTP_200_OK)
async def read_users_me(current_user: data_models.User = Depends(security.get_current_active_user)):
    logger.info("getting user: {}",  current_user.username)
    return current_user


# Host wwwroot folder from /
app.mount("/", StaticFiles(directory="wwwroot",
          html=True), name="Vejret i Galten")

# Dev mode launcher - not needed for prod
if __name__ == '__main__':
    uvicorn.run(app)
