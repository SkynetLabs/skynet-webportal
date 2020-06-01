#! /usr/bin/env bash

set -e # exit on first error

if [ -z "$1" ]; then
    echo "Please provide a skylink to blacklist" && exit 1
fi

for server in "germany.siasky.net" "us-east.siasky.net" "us-west.siasky.net" "helsinki.siasky.net" "siasky.dev";
do
    echo "⌁ Connecting to ${server}"
    ssh -t user@${server} 'curl -A Sia-Agent --user "":$(cat ~/.sia/apipassword) --data '"'"'{"add":["'$1'"]}'"'"' "localhost:9980/skynet/blacklist"'
done

echo "✓ All portals succesfully blacklisted provided skylink"
