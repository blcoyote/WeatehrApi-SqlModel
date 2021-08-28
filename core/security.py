from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import JWTError, jwt
import secrets
import string
from loguru import logger
from core import data_models, database
from core.settings import get_settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@logger.catch
def gen_rand():
    alphabet = string.ascii_letters + string.digits + string.hexdigits + "." + "/"
    return ''.join(secrets.choice(alphabet) for i in range(40))


@logger.catch
def verify_password(plain_password, hashedpassword):
    return pwd_context.verify(plain_password, hashedpassword)


@logger.catch
def get_password_hash(password):
    return pwd_context.hash(password)

# need change to handle postgres


@logger.catch
def get_user(user: data_models.ApiUser, username: str):
    if username == user.username:
        return user


@logger.catch
def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashedpassword):
        return False
    return user


@logger.catch
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, get_settings().SECRET_KEY, algorithm=get_settings().ALGORITHM)
    return encoded_jwt


@logger.catch
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, get_settings().SECRET_KEY,
                             algorithms=[get_settings().ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = data_models.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(database.user_lookup(token_data.username),
                    username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


@logger.catch
async def get_current_active_user(current_user: data_models.ApiUser = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
