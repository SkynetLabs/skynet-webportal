#! /usr/bin/env bash

set -e # exit on first error

if [ -z "$1" ]; then
    echo "Please provide a skylink to blocklist" && exit 1
fi

for server in "germany.siasky.net" "us-east.siasky.net" "us-west.siasky.net" "helsinki.siasky.net" "us-va-1.siasky.net" "us-pa-2.siasky.net";
do
    echo "⌁ Blacklisting on ${server}"
    ssh -q -t user@${server} 'docker exec sia siac skynet blocklist add '$1''
    ssh -q -t user@${server} 'rm -rf /home/user/skynet_webportal/docker/data/nginx/cache' # prune nginx cache
done

echo "✓ All portals succesfully blocklisted $1"
