#!/bin/bash

set -e # exit on first error

# get current working directory (pwd doesn't cut it)
cwd=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

# put the server down for maintenance
. ${cwd}/portal-down.sh

# stop the docker services
docker-compose down

# clear unused docker containers so we don't run into out of disk space
# it should be done after the container have been stopped and before 
# building them again
docker system prune --force

# prune all volumes to make sure there is no leftovers
# important for webapp container, otherwise html files will not be updated)
docker volume rm $(docker volume ls -q)

# build all container without cache
docker-compose build --no-cache

# start the docker services
docker-compose up -d

# enable the server again
. ${cwd}/portal-up.sh
