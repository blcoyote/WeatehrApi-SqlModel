# WeatherApi

## Purpose

Privately store data from a weatherstation while forwarding to windy's api (https://www.windy.com).
Exposes search to external apps

Backend is based on FastApi/Uvicorn/Gunicorn/SqlModel/Pydantic and a database backend, which can be any database but in this case its a postgres container.

External app for data visualisation under construction in /expofrontend. it's being built in React-Native-Expo that combiles for Android, IOS and Web in one codebase.

