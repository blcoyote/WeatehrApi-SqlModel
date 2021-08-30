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
FROM library/python:3.9-slim-buster

# Change user so we dont run our application as root.
RUN groupadd -g 2000 apiuser && useradd -m -u 2001 -g apiuser apiuser

# Set up virtual environment
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# transfer project files
COPY ./weatherApi /app
COPY --from=build /app/build /app/wwwroot
WORKDIR /app

# Install dependencies:
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# expose port 80 and let nginx handle https
EXPOSE 80

# Command to run project
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]


## test command: 
## docker run -d --name testweatherapi -p 8001:80 weatherapi