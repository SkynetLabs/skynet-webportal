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
declare -a servers=(  "eu-ger-1.siasky.net" "eu-ger-2.siasky.net" "eu-ger-3.siasky.net" "eu-ger-4.siasky.net"
                      "eu-fin-1.siasky.net" "eu-fin-2.siasky.net"
                      "us-or-1.siasky.net" "us-or-2.siasky.net"
                      "us-pa-1.siasky.net" "us-pa-2.siasky.net"
                      "us-va-1.siasky.net"
                      "siasky.xyz" "siasky.dev")
for server in "${servers[@]}";
do
    for skylink in "${skylinks[@]}";
    do
        echo ".. ⌁ Blocking skylink ${skylink} on ${server}"

        ssh -q -t user@${server} "docker exec sia siac skynet blocklist add $skylink && docker exec nginx curl -s -i -X PURGE http://localhost/$skylink | egrep \"^(OK|HTTP|X-)\""
    done
done

echo "✓ All done !"
