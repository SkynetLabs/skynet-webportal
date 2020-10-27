#!/usr/bin/env bash

# This script will get the data from the master node and replicate it locally.

#if [ ! -f /var/lib/postgresql/data/pg_hba.conf ]; then
if [ "$MASTER" = "" ]; then
  echo "SETUP RUNNING!"
  ls -a /var/lib/postgresql/data
  whoami
  # TODO Do I even need to backup the empty dir?
  #  mv /var/lib/postgresql/data /var/lib/postgresql/data_old
  echo "Will run pg_basebackup"
  # TODO This below used to have a "-P" at the end, specifying password. I'll try without it by using trust between local images.
  su - postgres -c "pg_basebackup -h 10.10.10.80 -D /var/lib/postgresql/data -U repuser -v"
  echo "Result: $?"
  ls -a /var/lib/postgresql/data
else
  echo "SETUP NOT RUNNING!"
  ls -a /var/lib/postgresql/data
fi
