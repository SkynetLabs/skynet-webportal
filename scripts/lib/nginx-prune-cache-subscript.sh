#!/usr/local/bin/bash

# This subscript is expected to be run inside docker container using 'bash'
# image. The image is based on Alpine Linux. It's tools (find, stat, awk, sort)
# are non-standard versions from BusyBox.

MAX_CACHE_DIR_SIZE=20000000000
MAX_KEEP_FILE_SIZE=1000000000

total=0

# We sort files by time, newest files are first. Format is:
# time (last modification as seconds since Epoch), filepath, size (bytes)
find /home/user/skynet-webportal/docker/data/nginx/cache -type f -exec stat -c "%Y %n %s" {} + | sort -rgk1 | while read line
do
    size=$(echo $line | awk '{print $3}')
    new_total=$(($total + $size))

    # We always delete all files larger than MAX_KEEP_FILE_SIZE.
    # We keep all files smaller than MAX_KEEP_FILE_SIZE when cache size is
    # below MAX_CACHE_DIR_SIZE, then we delete also smaller files.
    if (("$size" <= "$MAX_KEEP_FILE_SIZE" && "$new_total" < "$MAX_CACHE_DIR_SIZE"))
    then
        total=$new_total
        continue
    fi

    filename=$(echo $line | awk '{print $2}')
    rm $filename
done
