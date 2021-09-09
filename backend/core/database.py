from sqlmodel import create_engine, Session, SQLModel, select
from core import data_models
from loguru import logger
from core.settings import get_settings

engine = create_engine(get_settings().PG_URL, echo=get_settings().DEBUG_MODE)
# SQLModel.metadata.create_all(engine)


@logger.catch
def user_lookup(username: str):
    with Session(engine) as session:
        statement = select(data_models.FullUser).where(
            data_models.FullUser.username == username)
        results = session.exec(statement).one_or_none()
        return results
