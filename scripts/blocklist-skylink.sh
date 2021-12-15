#! /usr/bin/env bash

# This script adds a skylink to the sia blocklist and removes the skylink from
# nginx cache. The script should be run locally on each skynet webportal
# server. The automatic script that is used to continuously sync an Airtable
# sheet list with the blocklist on the web portals is
# /setup-scripts/blocklist-airtable.py 

set -e # exit on first error

# Number of skylinks to block within one batch
BATCH_SIZE=1000

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

# Block skylinks in batches
skylinks_len=${#skylinks[@]}
for (( i = 0; i < $skylinks_len; i++ )); do
    # Add skylink to batch
    skylink="${skylinks[$i]}"
    echo ".. ⌁ Adding skylink ${skylink} to batch..."
    batch_skylinks+=("$skylink")

    # For performance reasons on each iteration we do not block a single
    # skylink, but we block skylinks in batches with BATCH_SIZE size mainly
    # because of nginx cache search.
    # If (batch len == batch size) or (we have last batch):
    if (( ${#batch_skylinks[@]} == $BATCH_SIZE || $i == $skylinks_len - 1 )); then
        echo "--------------------------------------------"

        # Add to Sia blocklist
        echo "Blocking batch skylinks in skyd..."
        skylinks_space_separated="$(IFS=' '; echo "${batch_skylinks[*]}")"
        docker exec sia siac skynet blocklist add $skylinks_space_separated

        # Remove from NGINX cache
        # NOTE:
        # If there are changes to how the NGINX cache is being cleared, the same
        # changes need to be applied to the /setup-scripts/blocklist-airtable.py
        # script.
        echo "Removing batch skylinks from Nginx cache..."
        skylinks_pipe_separated="$(IFS='|'; echo "${batch_skylinks[*]}")"
        cached_files_command="find /data/nginx/cache/ -type f | xargs -r grep -Els '^Skynet-Skylink: ($skylinks_pipe_separated)'"
        docker exec -it nginx bash -c "${cached_files_command} | xargs -r rm"

        # Clear batch
        batch_skylinks=()

        echo "--------------------------------------------"
    fi
done

# Hot reload Nginx to get rid of deleted open files
echo "Hot reloading nginx..."
docker exec nginx nginx -s reload

echo "✓ All done !"
