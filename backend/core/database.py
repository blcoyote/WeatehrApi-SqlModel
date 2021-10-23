from sqlmodel import create_engine, Session, select
from core import data_models
from loguru import logger
from core.settings import get_settings
from datetime import datetime, timedelta
from pydantic.tools import parse_obj_as
from fastapi import HTTPException, status

engine = create_engine(get_settings().PG_URL, echo=get_settings().DEBUG_MODE)
# SQLModel.metadata.create_all(engine)


@logger.catch
def user_lookup(username: str):
    with Session(engine) as session:
        statement = select(data_models.FullUser).where(
            data_models.FullUser.username == username)
        results = session.exec(statement).one_or_none()
        return results


@logger.catch
def get_latest(imperial: bool = False):
    # speed optimization. the query will take longer if i dont limit the range due to the amount of data in the table
    time = datetime.utcnow() - timedelta(hours=1)

    try:
        with Session(engine) as session:
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
