
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


class ApiUser(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    username: str
    email: str
    hashedpassword: str
    disabled: Optional[bool] = Field(default=False)
    roles: Optional[str] = Field(default="appuser")
    created: Optional[datetime] = Field(default=datetime.utcnow())


# to return for user requests. Dont return APIUSER since it includes hashedpasword
class User(BaseModel):
    id: int
    username: str
    full_name: Optional[str] = None
    email: Optional[str] = None
    disabled: Optional[bool] = None
    roles: Optional[str] = None
    created: Optional[datetime] = None
