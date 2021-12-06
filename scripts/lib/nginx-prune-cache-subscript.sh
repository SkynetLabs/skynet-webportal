#!/usr/local/bin/bash

# This subscript is expected to be run inside docker container using 'bash'
# image. The image is based on Alpine Linux. It's tools (find, stat, awk, sort)
# are non-standard versions from BusyBox.

MAX_CACHE_DIR_SIZE=20000000000
MAX_KEEP_FILE_SIZE=1000000000

total=0

find /home/user/skynet-webportal/docker/data/nginx/cache -type f -exec stat -c "%Y %n %s" {} + | sort -rgk1 | while read line
do
    size=$(echo $line | awk '{print $3}')
    new_total=$(($total + $size))
    if (("$size" <= "$MAX_KEEP_FILE_SIZE" && "$total" < "$new_total"))
    then
        total=$new_total
        continue
    fi

    filename=$(echo $line | awk '{print $2}')
    rm $filename
done
