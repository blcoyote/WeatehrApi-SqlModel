
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class Token(BaseModel):
    access_token: str
    token_type: str
    expiry: datetime


class TokenData(BaseModel):
    username: Optional[str] = None


# Default user class, this is the one to interact with.
class User(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    username: str
    email: str
    disabled: Optional[bool] = Field(default=False)
    roles: Optional[str] = Field(default="appuser")
    created: Optional[datetime] = Field(default=datetime.utcnow())


# Dont ever return FullUser instances - ALWAYS return at 'User' at maximum, since it includes hashedpasword.
# FullUser is only need during creation or resetting of password.
class FullUser(User, table=True):
    __tablename__ = "Users"
    hashedpassword: str


# Opservation class is used for both storage and retrieval operations.
class Observation(SQLModel, table=True):
    __tablename__ = "Observations"
    id: Optional[int] = Field(default=None, primary_key=True)
    indoortempf: float
    tempf: float
    dewptf: float
    windchillf: float
    indoorhumidity: float
    humidity: float
    windspeedmph: float
    windgustmph: float
    winddir: int
    absbaromin: float
    baromin: float
    rainin: float
    dailyrainin: float
    weeklyrainin: float
    monthlyrainin: float
    solarradiation: float
    UV: int
    dateutc: datetime
    realtime: int
    rtfreq: int


def create_observation(ID: str, PASSWORD: str, indoortempf: float, tempf: float, dewptf: float,
                       windchillf: float, indoorhumidity: float, humidity: float, windspeedmph: float,
                       windgustmph: float, winddir: int, absbaromin: float, baromin: float, rainin: float,
                       dailyrainin: float, weeklyrainin: float, monthlyrainin: float, solarradiation: float,
                       UV: int, dateutc: str, softwaretype: str, action: str, realtime: int, rtfreq: int):
    return Observation(**locals())
