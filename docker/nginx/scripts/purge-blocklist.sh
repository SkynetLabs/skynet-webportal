#!/bin/bash

# TODO:
#
# 1. the purging should batch the skylinks to purge in a single command
# 
# python example:
#
# cached_files_command = (
#     "find /data/nginx/cache/ -type f | xargs -r grep -Els '^Skynet-Skylink: ("
#     + "|".join(skylinks[i : i + batch_size])
#     + ")'"
# )
#
# cached_files_count += int(
#     exec(
#         'docker exec nginx bash -c "'
#         + cached_files_command
#         + ' | xargs -r rm -v | wc -l"'
#     )
# )

# This script reads skylinks from a file and purges them from the Nginx cache.
# It uses the atomic mkdir operation to create a lock on the file, under which
# it copies the file and truncates it.

set -e # exit on first error

# The following variables define the paths to the file containing the skylinks
# that need to be purged, the file in which we store the queued skylinks and the
# lock directory that ensures the blocker API and the crontab don't manipulate
# the same files concurrently.
NGINX_PURGE_SKYLINKS_FILE="/data/nginx/blocker/skylinks.txt"
NGINX_PURGE_SKYLINKS_QUEUED="/data/nginx/blocker/queued.txt"
NGINX_PURGE_SKYLINKS_LOCK="/data/nginx/blocker/lock"
NGINX_CACHE_DIR="/data/nginx/cache/"

purge_skylinks () {
    # read all skylinks from the queued skylinks file
    skylinks=()
    line_number=1
    while IFS="" read -r line || [ -n "$line" ];
    do
        if [[ $line =~ (^[a-zA-Z0-9_-]{46}$) ]]; then
            skylinks+=("$line")
        else
            echo "Incorrect skylink at line ${line_number}: $line"
        fi
        let line_number+=1
    done < $NGINX_PURGE_SKYLINKS_QUEUED;

    for skylink in "${skylinks[@]}";
    do
        echo ".. ⌁ Purging skylink ${skylink}"
        cached_files_command="find ${NGINX_CACHE_DIR} -type f | xargs -r grep -Els '^Skynet-Skylink: ${skylink}'"
        bash -c "${cached_files_command} | xargs -r rm"
        
        echo ".. ⌁ Skylink ${skylink} purged"
        echo "--------------------------------------------"
    done

    # remove the queue file
    rm $NGINX_PURGE_SKYLINKS_QUEUED
}

acquire_lock () {
    attempts=0
    locked=false
    until [ "$attempts" -ge 10 ]
    do 
        if ! mkdir $NGINX_PURGE_SKYLINKS_LOCK 2>/dev/null
        then
            echo "skylinks file is locked, waiting..."
            ((attempts++))
            sleep 1;
        else
            locked=true
            break
        fi
    done

    if ! $locked
    then
        echo "failed to acquire lock, warrants investigation"
        exit 1
    fi
}

release_lock () {
    rmdir $NGINX_PURGE_SKYLINKS_LOCK
}

# if there is a queue file - purge all skylinks in that file from nginx cache
if [ -f "$NGINX_PURGE_SKYLINKS_QUEUED" ]
then
    echo "found queue file, purging skylinks from file"
    purge_skylinks
    echo "✓ Done"
    exit 1
fi

# if there is no skylinks file - escape early
if [ ! -f "$NGINX_PURGE_SKYLINKS_FILE" ]
then
    echo "no skylinks found"
    echo "✓ Done"
    exit 1
fi

# move the skylinks file to the queue under lock
acquire_lock
mv $NGINX_PURGE_SKYLINKS_FILE $NGINX_PURGE_SKYLINKS_QUEUED
release_lock

# purge the skylinks from the queue file
purge_skylinks
echo "✓ Done"
exit 1
