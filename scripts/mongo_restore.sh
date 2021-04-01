#!/bin/bash

BACKUP=$1
if [[ $BACKUP == "" ]]; then
  echo "No backup name given. It should look like '2020-01-29'."
  exit 1
fi

# Get current working directory (pwd doesn't cut it)
cwd=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
# Set the environment:
set -o allexport
source $cwd/../.env
set +o allexport
# Check for AWS credentials:
if [[ $AWS_ACCESS_KEY_ID == "" || $AWS_SECRET_ACCESS_KEY == "" ]]; then
  echo "Missing AWS credentials!"
  exit 1
fi
# Check if the backup exists:
totalFoundObjects=$(aws s3 ls s3://skynet-crdb-backups/backups/mongo/ --recursive --summarize | grep "$DT.tgz" | wc -l)
if [ "$totalFoundObjects" -eq "0" ]; then
   echo "This backup doesn't exist!"
   exit 1
fi
# Get the backup from S3:
aws s3 cp s3://skynet-crdb-backups/backups/mongo/$BACKUP.tgz $BACKUP.tgz
# Prepare a clean `to_restore` dir:
rm -rf $cwd/../docker/data/mongo/db/backups/to_restore
mkdir -p $cwd/../docker/data/mongo/db/backups/to_restore
# Decompress the backup:
tar -xzf $BACKUP.tgz -C $cwd/../docker/data/mongo/db/backups/to_restore
rm $BACKUP.tgz
# Restore the backup:
docker exec mongo \
  mongorestore \
  mongodb://$SKYNET_DB_USER:$SKYNET_DB_PASS@$SKYNET_DB_HOST:$SKYNET_DB_PORT \
  /data/db/backups/to_restore/$BACKUP
# Clean up:
rm -rf $cwd/../docker/data/mongo/db/backups/to_restore
