#!/bin/bash

set -e # exit on first error

# get current working directory (pwd doesn't cut it)
cwd=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

# put the server down for maintenance
. ${cwd}/portal-down.sh

# stop the docker services
docker-compose down

# start the docker services
docker-compose up -d

# enable the server again
. ${cwd}/portal-up.sh
