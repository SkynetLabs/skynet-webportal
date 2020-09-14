#!/bin/bash

set -e # exit on first error

# start the health-checks service
docker exec health-check cli/enable
