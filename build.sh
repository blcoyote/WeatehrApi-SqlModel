#!/bin/sh
docker build -t weatherapi .
docker image tag weatherapi registry.elcoyote.dk/weatherapi
docker push registry.elcoyote.dk/weatherapi