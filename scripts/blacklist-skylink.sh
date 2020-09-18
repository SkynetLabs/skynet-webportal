#! /usr/bin/env bash

set -e # exit on first error

if [ -z "$1" ]; then
    echo "Please provide a skylink to blacklist" && exit 1
fi

for server in "germany.siasky.net" "us-east.siasky.net" "us-west.siasky.net" "helsinki.siasky.net" "siasky.dev";
do
    echo "⌁ Blacklisting on ${server}"
    ssh -q -t user@${server} 'docker exec sia siac skynet blacklist add '$1''
    ssh -q -t user@${server} 'rm -rf /home/user/skynet_webportal/docker/data/nginx/cache' # prune nginx cache
done

echo "✓ All portals succesfully blacklisted provided skylink"
