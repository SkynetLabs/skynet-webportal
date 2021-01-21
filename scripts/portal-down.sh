#!/bin/bash

set -e # exit on first error

TIMEOUT=${1:-300} # default timeout is 300s
if ! [[ "$TIMEOUT" =~ ^[0-9]+$ ]]; then
    echo "Timeout has to be valid integer" && exit 1
fi

countdown() {
    local secs=$1
    while [ $secs -gt 0 ]; do
        echo -ne "Waiting $secs\033[0K\r"
        sleep 1
        : $((secs--))
    done
}

# stop healh-check so the server is taken our of load balancer
# docker exec health-check cli/disable

# then wait 5 minutes for the load balancer to propagate the dns records
countdown $TIMEOUT
