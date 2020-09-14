#!/bin/bash

set -e # exit on first error

# put the server down for maintenance
. ${cwd}/portal-down.sh

# rebuild and restart all docker containers
docker-compose build --no-cache
docker-compose down
docker-compose up -d

# enable the server again
. ${cwd}/portal-up.sh
