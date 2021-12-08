#!/bin/bash

# Dumps disk usage to stdout or to the file
#
# Parameters:
# - $1 (optional): Filename to append the output to.
#
# Usage:
# - Dump disk usage to stdout:
#   ./disk-usage-dump.sh
#
# - Dump disk usage appending to th file:
#   ./disk-usage-dump.sh my-log-file.log
#
# Use docker container to get root (script can be run under regular user, no
# need for sudo)

dump () {
    echo
    echo "### Disk usage dump at $(date) ###"

    # Free disk space
    echo
    df -h /home/user

    # Root dirs
    echo
    echo "Root dirs:"
    docker run -v /:/host-root alpine:3.15.0 sh -c 'du -hs /host-root/*'

    # Home dirs
    echo
    echo "Home dirs:"
    docker run -v /home/user:/home/user alpine:3.15.0 du -hs /home/user/*

    # Skynet webportal dirs
    echo
    echo "skynet-webportal dirs:"
    docker run -v /home/user:/home/user alpine:3.15.0 du -hs /home/user/skynet-webportal/*

    # Docker data dirs
    echo
    echo "Docker data dirs:"
    docker run -v /home/user:/home/user alpine:3.15.0 du -hs /home/user/skynet-webportal/docker/data/*

    # Largest dirs/files
    echo
    echo "Dirs or files over 1GB (first 100):"
    docker run -v /home/user:/home/user alpine:3.15.0 du -h /home/user | grep -E "^[0-9]+\.?[0-9]*G" | sort -r -n | head -100
}

# Check argument is present
if [ -z "$1" ]; then
    # Dump to stdout
    dump
else
    # Handle log paths
    filename=$(basename "$1")
    dirname=$(dirname "$1")
    abs_dirname=$(realpath "$dirname")

    # Make sure log dir exists
    mkdir -p "$abs_dirname"

    # Append to file
    {
        dump
    } >> "$abs_dirname/$filename" 2>&1
fi
