#!/bin/bash

set -e # exit on first error

while getopts d:t: flag
do
    case "${flag}" in
        d) delay=${OPTARG};;
        t) timeout=${OPTARG};;
    esac
done
delay=${delay:-0} # default to no delay
timeout=${timeout:-300} # default timeout is 300s

countdown() {
    local secs=$1
    while [ $secs -gt 0 ]; do
        echo -ne "Waiting $secs\033[0K\r"
        sleep 1
        : $((secs--))
    done
}

# delay disabling the portal
countdown $delay

# stop healh-check so the server is taken our of load balancer
docker exec health-check cli/disable

# then wait 5 minutes for the load balancer to propagate the dns records
countdown $timeout
