#!/bin/bash

set -e # exit on first error

cwd

# get current working directory (pwd doesn't cut it)
cwd=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

# run the sia-stop script
. ${cwd}/sia-stop.sh

# start sia
docker-compose up -d sia