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
declare -a servers=(  "eu-ger-1.siasky.net" "eu-ger-2.siasky.net" "eu-ger-3.siasky.net" "eu-ger-4.siasky.net" "eu-ger-5.siasky.net" "eu-ger-6.siasky.net" "eu-ger-7.siasky.net" "eu-ger-8.siasky.net"
                      "eu-fin-1.siasky.net" "eu-fin-2.siasky.net" "eu-fin-3.siasky.net" "eu-fin-4.siasky.net"
                      "eu-pol-1.siasky.net" "eu-pol-2.siasky.net" "eu-pol-3.siasky.net"
                      "us-or-1.siasky.net" "us-or-2.siasky.net"
                      "us-pa-1.siasky.net" "us-pa-2.siasky.net"
                      "us-va-1.siasky.net" "us-va-2.siasky.net" "us-va-3.siasky.net"
                      "as-hk-1.siasky.net"
                      "siasky.xyz" "dev1.siasky.dev" "dev2.siasky.dev" "dev3.siasky.dev")
for server in "${servers[@]}";
do
    for skylink in "${skylinks[@]}";
    do
        cached_files_command="/usr/bin/find /data/nginx/cache/ -type f | /usr/bin/xargs --no-run-if-empty -n1000 /bin/grep -Els '^KEY: .*($skylink)'"        
    	echo ".. ⌁ Blocking skylink ${skylink} on ${server}"

        ssh -q -t user@${server} "docker exec sia siac skynet blocklist add $skylink && docker exec -it nginx bash -c $cached_files_command | xargs -r rm"
    done
done

echo "✓ All done !"
