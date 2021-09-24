#Build and compile frontend
FROM node:13.12.0-alpine as build

#setup and install dependencies
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./frontend/package.json ./
RUN npm install --silent

#copy source files to container
COPY ./frontend ./

# build webapp
RUN npm run build



# Build host image
FROM tiangolo/uvicorn-gunicorn-fastapi

# Keeps Python from generating .pyc files in the container
# Turns off buffering for easier container logging
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

#Lablels for traefik routing
LABEL traefik.http.routers.weather.rule=Host(`weather.elcoyote.dk`) \
    traefik.http.routers.weather.tls=true \
    traefik.http.routers.weather.tls.certresolver=lets-encrypt \
    traefik.http.services.weather.loadbalancer.server.port=8000
#LABEL traefik.port=80

# transfer project files
COPY ./backend /app
COPY --from=build /app/build /app/wwwroot

WORKDIR /app

# Install dependencies:
RUN pip install -r requirements.txt

# Change user so we dont run our application as root.
RUN groupadd -r api &&\
    useradd -ms /bin/bash apiuser -g api &&\
    chown -R apiuser:api /app &&\
    chmod -R 755 /app

USER apiuser

# Tell gunicorn to use port 8080 instead of 80, since host 80 is occupied'
#ENV BIND="0.0.0.0:8080"
ENV PORT="8000"
EXPOSE 8000


# Command to run in a container - only use if base image is anything other than tiangolo/uvicorn-gunicorn-fastapi (eg python:3.9-slim), 
# but we prefer gunicorn for automated workers and ressource management
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

## test command: 
## docker run -d --name testweatherapi -p 8000:8000 weatherapi