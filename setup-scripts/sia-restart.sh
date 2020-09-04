#!/bin/bash

set -e # exit on first error

# get running script directory
cwd=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

# run the sia-stop script
. ${cwd}/sia-stop.sh

# start sia
docker-compose up -d sia
