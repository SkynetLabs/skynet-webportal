#! /usr/bin/env bash

# This script is meant to be used when manually adding a skylink to the
# blocklist on all the skynet web portals. The automatic script that is used to
# continuously sync a google sheets list with the blocklist on the web portals
# is /setup-scripts/blocklist-airtable.py 

set -e # exit on first error

if [ -z "$1" ]; then
    echo "Please provide either a skylink or file with skylinks separated by new lines" && exit 1
fi

#########################################################
# read either a file containing skylinks separated by new
# lines or a single skylink and put them in an array
#########################################################
skylinks=()
if test -f "$1"; then
    OLDIFS=$IFS
    IFS=','
    line_number=1
    while read line
    do
        if [[ $line =~ ([a-zA-Z0-9_-]{46}) ]]; then
            skylinks+=("$BASH_REMATCH")
        else
            echo "Incorrect skylink at line ${line_number}: $line" && exit 1
        fi
        let line_number+=1
    done < $1;
    IFS=$OLDIFS
else
    skylinks=("$1") # just single skylink passed as input argument
fi

#########################################################################
# iterate through all servers, block the skylinks and purge it from cache
#########################################################################
declare -a servers=(  "eu-ger-1.siasky.net" "eu-ger-2.siasky.net" "eu-ger-3.siasky.net" "eu-ger-4.siasky.net" "eu-ger-5.siasky.net" "eu-ger-6.siasky.net" "eu-ger-7.siasky.net" "eu-ger-8.siasky.net"
                      "eu-ger-9.siasky.net" "eu-ger-10.siasky.net" "eu-ger-11.siasky.net" "eu-ger-12.siasky.net"
                      "eu-fin-1.siasky.net" "eu-fin-2.siasky.net" "eu-fin-3.siasky.net" "eu-fin-4.siasky.net" "eu-fin-5.siasky.net" "eu-fin-6.siasky.net" "eu-fin-7-siasky.net" "eu-fin-8.siasky.net"
                      "eu-fin-9.siasky.net" "eu-fin-10.siasky.net" "eu-fin-11.siasky.net" "eu-fin-12.siasky.net" "eu-fin-13.siasky.net" "eu-fin-14.siasky.net" "eu-fin-15.siasky.net"
                      "eu-pol-1.siasky.net" "eu-pol-2.siasky.net" "eu-pol-3.siasky.net" "eu-pol-4.siasky.net" "eu-pol-5.siasky.net"
                      "us-ny-1.siasky.net" "us-ny-2.siasky.net"
                      "us-or-1.siasky.net" "us-or-2.siasky.net"
                      "us-la-1.siasky.net" "us-la-2.siasky.net" "us-la-3.siasky.net"
                      "us-pa-1.siasky.net" "us-pa-2.siasky.net"
                      "us-va-1.siasky.net" "us-va-2.siasky.net" "us-va-3.siasky.net" "us-va-4.siasky.net" "us-va-5.siasky.net" "us-va-6.siasky.net"
                      "as-hk-1.siasky.net" "as-sp-1.siasky.net" "as-sp-2.siasky.net"
                      "siasky.xyz" "dev1.siasky.dev" "dev2.siasky.dev" "dev3.siasky.dev")
for server in "${servers[@]}";
do
    for skylink in "${skylinks[@]}";
    do
        echo ".. ⌁ Blocking skylink ${skylink} on ${server}"
        
        # Add to blocklist
        ssh -q -t user@${server} "docker exec sia siac skynet blocklist add ${skylink}"
        
        # Remove from NGINX cache
        cached_files_command="find /data/nginx/cache/ -type f | xargs -r grep -Els '^Skynet-Skylink: ${skylink}'"
        ssh -q -t user@${server} "docker exec -it nginx bash -c ${cached_files_command} | xargs -r rm"
        
        echo ".. ⌁ Skylink ${skylink} Blocked on ${server}"
        echo "--------------------------------------------"
    done
done

echo "✓ All done !"
