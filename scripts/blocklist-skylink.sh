#! /usr/bin/env bash

# This script is for manual skylink blocking. It accepts either a single 
# skylink or a file containing list of skylinks. The script is intented
# for manual use and it should be run locally on each skynet webportal server. 
# The automatic script that is used to continuously sync an Airtable sheet 
# list with the blocklist on the web portals is /setup-scripts/blocklist-airtable.py 

set -e # exit on first error

if [ -z "$1" ]; then
    echo "Please provide either a skylink or a file with skylinks separated by new lines" && exit 1
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

# get local nginx ip adress
nginx_ip=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nginx)

# iterate over provided skylinks and block them one by one
for skylink in "${skylinks[@]}"; do
    printf "Blocking ${skylink} ... "
    status_code=$(curl --write-out '%{http_code}' --silent --output /dev/null --data "{\"add\":[\"$skylink\"]}" "http://${nginx_ip}:8000/skynet/blocklist")

    # print blocklist response status code
    if [ $status_code = "204" ]; then
        echo "done"
    else
        echo "error $status_code"
    fi
done
