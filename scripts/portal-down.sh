#!/bin/bash

set -e # exit on first error

while getopts d:t:r: flag
do
    case "${flag}" in
        d) delay=${OPTARG};;
        t) timeout=${OPTARG};;
        r) reason=${OPTARG};;
    esac
done
delay=${delay:-0} # default to no delay
timeout=${timeout:-300} # default timeout is 300s

if [[ -z $reason ]]; then
  echo "Please provide a reason for disabling the portal (use '-r <reason>')."
  exit 1
fi

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

# stop health-check so the server is taken our of load balancer
docker exec health-check cli disable $reason

# then wait 5 minutes for the load balancer to propagate the dns records
countdown $timeout
