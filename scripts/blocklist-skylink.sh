#! /usr/bin/env bash

# This script adds a skylink to the sia blocklist and removes the skylink from
# nginx cache. The script should be run locally on each skynet webportal
# server. The automatic script that is used to continuously sync an Airtable
# sheet list with the blocklist on the web portals is
# /setup-scripts/blocklist-airtable.py 

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
    line_number=1

    # Read file including the last line even when it doesn't end with newline
    while IFS="" read -r line || [ -n "$line" ];
    do
        if [[ $line =~ (^[a-zA-Z0-9_-]{46}$) ]]; then
            skylinks+=("$line")
        else
            echo "Incorrect skylink at line ${line_number}: $line" && exit 1
        fi
        let line_number+=1
    done < $1;
else
    skylinks=("$1") # just single skylink passed as input argument
fi

for skylink in "${skylinks[@]}";
do
    echo ".. ⌁ Blocking skylink ${skylink}"
    
    # Add to Sia blocklist
    docker exec sia siac skynet blocklist add "${skylink}"
    
    # Remove from NGINX cache
    cached_files_command="find /data/nginx/cache/ -type f | xargs -r grep -Els '^Skynet-Skylink: ${skylink}'"
    docker exec -it nginx bash -c "${cached_files_command}" | xargs -r rm
    
    echo ".. ⌁ Skylink ${skylink} Blocked"
    echo "--------------------------------------------"
done

echo "✓ All done !"
