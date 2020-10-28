#!/usr/bin/env bash

# This script will get the data from the master node and replicate it locally.
# This only happens if the data directory is empty.
if [ ! -f /var/lib/postgresql/data/PG_VERSION ]; then
  echo "SETUP RUNNING!"
  sleep 10
  echo "Will run pg_basebackup"
  su - postgres -c "pg_basebackup -h 10.10.10.80 -D /var/lib/postgresql/data -U repuser -v"
  echo "Finished pg_basebackup with status code $?"
  if [ "$?" != "0" ]; then
    rm -rf /var/lib/postgresql/data/*
  fi
  ls -a /var/lib/postgresql/data
  cp /var/lib/postgresql/skynet_init_conf/* /var/lib/postgresql/data
  chown postgres:postgres /var/lib/postgresql/data
  chmod 750 /var/lib/postgresql/data
  mkdir -p /var/lib/postgresql/data/mnt/server/archivedir
  # ./hi
else
  echo "Starting an existing Postgres node."
fi

su - postgres -c "/usr/lib/postgresql/13/bin/postgres -D /var/lib/postgresql/data"
