# Build from base slim
FROM library/python:3.9-slim-buster

# Change user so we dont run as root.
RUN groupadd -g 2000 apiuser && useradd -m -u 2001 -g apiuser apiuser

# Set up virtual environment
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# transfer project files
COPY ./weatherApi /app
WORKDIR /app
# Install dependencies:
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# expose port 80 and let nginx handle https
EXPOSE 80

# Command to run project
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]