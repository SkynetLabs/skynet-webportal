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

# get local skyd ip adress
ipaddress=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' sia)

# get sia api password either from env variable if exists or from apipassword file in sia-data directory
apipassword=$(docker exec sia sh -c '[ ! -z "${SIA_API_PASSWORD}" ] && echo ${SIA_API_PASSWORD} || $(cat /sia-data/apipassword | tr -d '\n')')

# iterate over provided skylinks and block them one by one
for skylink in "${skylinks[@]}"; do
    echo "> Blocking ${skylink} ... "

    # POST /skynet/blocklist always returns 200 and in case of failure print error message
    curl -A Sia-Agent -u "":${apipassword} --data "{\"add\":[\"$skylink\"]}" "http://${ipaddress}:9980/skynet/blocklist"
done
