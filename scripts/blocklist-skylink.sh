#! /usr/bin/env bash

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
    while read line
    do
        if [[ $line =~ ([a-zA-Z0-9_-]{46}) ]]; then
            skylinks+=("$BASH_REMATCH")
        else
            echo "Incorrect skylink: $line" && exit 1
        fi
    done < $1;
    IFS=$OLDIFS
else
    skylinks=("$1") # just single skylink passed as input argument
fi

####################################################
# iterate through all servers and block the skylinks
####################################################
for server in "germany.siasky.net" "helsinki.siasky.net" "us-west.siasky.net" "us-va-1.siasky.net" "us-pa-1.siasky.net" "us-pa-2.siasky.net" "siasky.xyz";
do
    #############################################################
    # iterate throught all skylinks and add each one to blocklist
    #############################################################
    for skylink in "${skylinks[@]}";
    do
        echo ".. ⌁ Blocking skylink ${skylink} on ${server}"
        ssh -q -t user@${server} 'docker exec sia siac skynet blocklist add '$skylink''
    done

    ######################################################
    # purge nginx cache after all the skylinks are blocked
    ######################################################
    ssh -q -t user@${server} 'docker exec nginx sh -c "rm -rf /data/nginx/cache/*"'
    echo ".... 🗑️ Pruned nginx cache on ${server}"
done

echo "✓ All done !"
