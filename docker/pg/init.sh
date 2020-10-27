#!/usr/bin/env bash

#if [ $REPLICATION_PASSWORD == "" ]; then
#  echo "Replication password not found. Exiting."
#  exit 1
#fi

# Ask Karol how to set the replication password in a secure way (.env?) on container build.
# For the moment it will be hardcoded in the compose file.
# TODO This is one approach (not finished) to setting a password.
#echo $REPLICATION_PASSWORD | xargs createuser -U postgres repuser -P -c 5 --replication

# TODO Let's try without a password, by using trust between local containers.
createuser -U postgres repuser -c 5 --replication
mkdir -p /var/lib/postgresql/main/mnt/server/archivedir
mv /var/lib/postgresql/skynet_init_conf/* /var/lib/postgresql/data/
