#!/bin/bash

# We execute the nginx cache pruning subscript from docker container so that we
# can run the pruning script in user crontab without sudo.

docker run --rm -v /home/user:/home/user bash /home/user/skynet-webportal/scripts/lib/nginx-prune-cache-subscript.sh
