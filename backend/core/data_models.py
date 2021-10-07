
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, validator
from sqlmodel import Field, SQLModel


# Simple classes for access control tokens
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


# Don't ever return FullUser instances - ALWAYS return 'User' at maximum, since FullUser includes hashedpasword.
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


# Reappropriate @validator decorators to perform convertions from imperial to metric on each datapoint as they are created for output.
# This saves logic/ressources in the endpoint and/or in the client looping datasets or during mapping.
class Metric_Observation(Observation):
    @validator('indoortempf', 'tempf', 'dewptf', 'windchillf', allow_reuse=True)
    def convertf(cls, v: float):
        # convert to Celcius
        v = (v - 32) * 5.0/9.0
        return round(v, 2)

    @validator('windspeedmph', 'windgustmph', allow_reuse=True)
    def convertmph(cls, v: float):
        # convert to m/s
        v = v*0.44704
        return round(v, 2)

    @validator('absbaromin', 'baromin', allow_reuse=True)
    def converthpa(cls, v: float):
        # convert to hPa
        v = v * 33.86
        return round(v, 2)

    @validator('rainin', 'dailyrainin', 'weeklyrainin', 'monthlyrainin', allow_reuse=True)
    def convertin(cls, v: float):
        # convert to hPa
        v = v * 25.4
        return round(v, 2)


# Dependency function to map an ugly pile of params to a cleaner Observation object
def create_observation(ID: str, PASSWORD: str, indoortempf: float, tempf: float, dewptf: float,
                       windchillf: float, indoorhumidity: float, humidity: float, windspeedmph: float,
                       windgustmph: float, winddir: int, absbaromin: float, baromin: float, rainin: float,
                       dailyrainin: float, weeklyrainin: float, monthlyrainin: float, solarradiation: float,
                       UV: int, dateutc: str, softwaretype: str, action: str, realtime: int, rtfreq: int):
    return Observation(**locals())
