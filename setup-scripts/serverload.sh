#!/bin/bash

: '
This script writes the CPU usage and the free disk space to a file in a loop.
The results are prepended to the file, so the most recent results are at the
top.  This is so that the most recent information can easily be read from the
top of the file and the file can easily be truncated if needed.
'

# Define Loop Interval
loop_interval=60
logfile="serverload.log"
jsonfile="serverload.json"
nginx_docker_path="/usr/local/share"

# Create logfile if it doesn't exist
if [[ ! -e $logfile ]]; then
    echo "init" > $logfile 
fi

# Write the output in an infinite loop.
while true; do
    # CPU usage
    cpu=$(grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage "%"}') 
    sed -i "1iCPU: ${cpu}" $logfile

    # Disk Usage
    disk=$(df -Ph . | tail -1 | awk '{print $4}')
    sed -i "1iDISK: ${disk}" $logfile
    
    # Write the timestamp
    timestamp=$(date)
    sed -i "1iTIMESTAMP: ${timestamp}" $logfile

    # Write and copy a json file of the latest results to nginx docker container
    # to serve
    printf '{"cpu":"%s","disk":"%s","timestamp":"%s"}' "$cpu" "$disk" "$timestamp" > $jsonfile
    docker cp $jsonfile nginx:$nginx_docker_path/$jsonfile

    # Sleep
    sleep $loop_interval
done

