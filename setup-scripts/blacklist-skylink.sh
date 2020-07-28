#! /usr/bin/env bash

set -e # exit on first error

if [ -z "$1" ]; then
    echo "Please provide a skylink to blacklist" && exit 1
fi

for server in "germany.siasky.net" "us-east.siasky.net" "us-west.siasky.net" "helsinki.siasky.net" "siasky.dev";
do
    echo "⌁ Blacklisting on ${server}"
    ssh -q -t user@${server} 'curl -A Sia-Agent --user "":$(cat /home/user/.sia/apipassword) --data '"'"'{"add":["'$1'"]}'"'"' "localhost:9980/skynet/blacklist"'
    ssh -q -t user@${server} 'rm -rf /home/user/skynet_webportal/docker/data/nginx/cache' # remove cache from docker-managed portals
done

echo "✓ All portals succesfully blacklisted provided skylink"
