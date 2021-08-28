from datetime import datetime, timedelta
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
import requests
import uvicorn
from urllib import parse
from loguru import logger
from core import security, data_models, database
from core.settings import get_settings


# instantiate api.
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


# enable logging on startup
@app.on_event("startup")
async def startup_event():
    logger.add(
        f"./log/apilog_{datetime.now().strftime('%Y-%m-%d')}.log", rotation="1 day")
    logger.debug("Starting logging.")


# posting weather data from station. not user endpoint.
@app.get("/weatherstation/updateweatherstation.php")
async def store(ID: str, PASSWORD: str, indoortempf: float, tempf: float, dewptf: float,
                windchillf: float, indoorhumidity: float, humidity: float, windspeedmph: float,
                windgustmph: float, winddir: int, absbaromin: float, baromin: float, rainin: float,
                dailyrainin: float, weeklyrainin: float, monthlyrainin: float, solarradiation: float,
                UV: int, dateutc: str, softwaretype: str, action: str, realtime: int, rtfreq: int):

    if PASSWORD == get_settings().ACCESSCTL:

        observation = data_models.Observation(indoortempf=indoortempf, tempf=tempf, dewptf=dewptf, windchillf=windchillf,
                                              indoorhumidity=indoorhumidity, humidity=humidity, windspeedmph=windspeedmph,
                                              windgustmph=windgustmph, winddir=winddir, absbaromin=absbaromin, baromin=baromin,
                                              rainin=rainin, dailyrainin=dailyrainin, weeklyrainin=weeklyrainin, monthlyrainin=monthlyrainin,
                                              solarradiation=solarradiation, UV=UV, dateutc=dateutc, realtime=realtime, rtfreq=rtfreq)

        try:
            with Session(database.engine) as session:
                session.add(observation)
                session.commit()
        except Exception as ex:
            logger.exception(f"Problem saving observation: {ex}")

        try:
            if get_settings().WINDY_ENABLED:

                url = "https://stations.windy.com/pws/update/%s?winddir=%s&windspeedmph=%s&windgustmph=%s&tempf=%s&rainin=%s&baromin=%s&dewptf=%s&humidity=%s&dateutc=%s" % (
                    parse.quote_plus(get_settings().WINDYKEY), winddir, windspeedmph, windgustmph, tempf, rainin, baromin, dewptf, humidity, dateutc)
                requests.get(url)

        except Exception as ex:
            logger.error(f"Error pushing data to windy: {ex}")

        return

    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )


# returns list of Observation objects based on input criteria.
@app.get("/weatherstation/getweather")
async def get_weather(day_delta: int = 1, result_interval: int = 12, current_user: data_models.User = Depends(security.get_current_active_user)):
    time = datetime.utcnow() - timedelta(days=day_delta)
    try:
        with Session(database.engine) as session:
            statement = select(data_models.Observation).where(
                data_models.Observation.dateutc > time).order_by(
                    data_models.Observation.id.desc())
            results = session.exec(statement).all()
            return results[::result_interval]
    except Exception as ex:
        logger.exception(
            f"failed weather lookup with day_delta: {day_delta}, result_interval {result_interval}, current_user: {current_user}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database lookup failed",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Login endpoint
@app.post("/token", response_model=data_models.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        user = security.authenticate_user(database.user_lookup(
            form_data.username), form_data.username, form_data.password)
    except Exception as ex:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(
        minutes=get_settings().ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer", "expiry": datetime.now() + timedelta(minutes=get_settings().ACCESS_TOKEN_EXPIRE_MINUTES)}


# test endpoint1 to be deactivated
@app.get("/users/me/", response_model=data_models.User)
async def read_users_me(current_user: data_models.User = Depends(security.get_current_active_user)):
    return current_user


# test endpoint 2 to be deactivated
@app.get("/users/me/items/")
async def read_own_items(current_user: data_models.User = Depends(security.get_current_active_user)):
    return [{"item_id": "Foo", "owner": current_user.username}]


# Dev mode launch

if __name__ == '__main__':

    uvicorn.run(app)
