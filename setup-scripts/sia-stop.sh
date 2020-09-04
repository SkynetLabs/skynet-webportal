#!/bin/bash

set -e # exit on first error

countdown() {
    local secs=$1
    while [ $secs -gt 0 ]; do
        echo -ne "Waiting $secs\033[0K\r"
        sleep 1
        : $((secs--))
    done
}

# first stop healh-check so the server is taken our of load balancer
docker-compose stop health-check

# then wait 5 minutes for the load balancer to propagate the dns records
countdown 300

# now stop sia process
docker-compose stop sia