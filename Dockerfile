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

EXPOSE 80

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1



LABEL traefik.http.routers.weather.rule=Host(`weather.elcoyote.dk`)
LABEL traefik.http.routers.weather.tls=true
LABEL traefik.http.routers.weather.tls.certresolver=lets-encrypt
LABEL traefik.port=80



# transfer project files
COPY ./backend /app
COPY --from=build /app/build /app/wwwroot
WORKDIR /app

# Install dependencies:
RUN pip install -r requirements.txt

# Change user so we dont run our application as root.
# RUN groupadd -g 2000 apiuser &&\ 
#     useradd -m -u 2001 -g apiuser apiuser &&\
#     chown -R apiuser:apiuser /app
# USER apiuser

# RUN useradd -ms /bin/bash apiuser &&\
#     chown -R apiuser /app

# USER apiuser


# Command to run project
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]

## test command: 
## docker run -d --name testweatherapi -p 8005:80 weatherapi