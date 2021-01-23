#! /usr/bin/env bash

###############################################################
# this script is an automation for restarting docker containers 
# on maintenance nodes strictly built for purpose of siasky.net
###############################################################

set -e # exit on first error

docker build --no-cache --quiet --build-arg branch=master -t sia-master /home/user/sia-dockerfile

for container in `docker container ls --format '{{.Names}}'`; do 
    docker stop $container
    docker rm $container
    docker run -d -v /home/user/nodes/$container/sia-data:/sia-data --env-file /home/user/nodes/$container/.env --name $container --log-opt max-size=100m --log-opt max-file=3 sia-master
done
