#!/usr/bin/env bash

# This script will get the data from the master node and replicate it locally.
# This only happens if the data directory is empty.
if [ ! -f /var/lib/postgresql/data/PG_VERSION ]; then
  # Wait for the master DB to start. Only needed if you run both in the same docker-compose.
  sleep 10
  echo "SETUP RUNNING!"
  echo "Will run pg_basebackup"
  # 10.10.10.80
  # TODO I still need to figure out how to pass a password here. We can't use trust across hosts.
  #su - postgres -c "pg_basebackup -h pg.siasky.net -D /var/lib/postgresql/data -U repuser -v"
  su - postgres -c "pg_basebackup -h pg.siasky.net -D /var/lib/postgresql/data -U repuser -v -R -X stream"
  echo "Finished pg_basebackup with status code $?"


  # pg_basebackup -h pg.siasky.net -D /var/lib/postgresql/data -U repuser -v -P -R -X stream -C -S pg2slot
  # -v: verbose
  # -P: progress reporting
  # -R: write a minimal recovery.conf in the output dir
  # -X: method (fetch or stream)


  # Remove the data on error, so a container restart will start from scratch
  # instead of thinking it's already set up correctly.
  if [ "$?" != "0" ]; then
    rm -rf /var/lib/postgresql/data/*
  fi

  # Use the predefined configs.
  cp /var/lib/postgresql/skynet_init_conf/*.conf /var/lib/postgresql/data

  # Make sure the directories we need are there and have the right ownership.
  mkdir -p /var/lib/postgresql/data/mnt/server/archivedir
  chown postgres:postgres /var/lib/postgresql/data
  chmod 750 /var/lib/postgresql/data

  # touch /var/lib/postgresql/data/recovery.signal
  # ./hi
else
  echo "Starting an existing Postgres node."
fi

# Start postgres as user postgres while passing the right working directory:
exec su - postgres -c "/usr/lib/postgresql/13/bin/postgres -D /var/lib/postgresql/data"
