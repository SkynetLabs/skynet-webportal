#!/usr/bin/env bash

echo "RUNNING init.sh"
createuser -U postgres repuser -c 5 --replication
mkdir -p /var/lib/postgresql/data/mnt/server/archivedir
mv /var/lib/postgresql/skynet_init_conf/* /var/lib/postgresql/data/
echo "EXITING init.sh"
