#!/bin/bash

# First of all, let's pamper awscli because Python is so special:
pip3 install --upgrade awscli

BACKUP=$1
if [[ $BACKUP == "" ]]; then
  echo "No backup name given. It should look like '2020-01-29'."
  exit 1
fi

# Get current script directory (pwd doesn't cut it)
csd=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
# Set the environment:
set -o allexport
cat $csd/../.env | grep "AWS_ACCESS_KEY_ID\|AWS_SECRET_ACCESS_KEY\|S3_BACKUP_PATH\|SKYNET_DB_USER\|SKYNET_DB_PASS\|SKYNET_DB_HOST\|SKYNET_DB_PORT" >.tmpenv
source .tmpenv
rm .tmpenv
set +o allexport
# Check for AWS credentials:
if [[ $AWS_ACCESS_KEY_ID == "" || $AWS_SECRET_ACCESS_KEY == "" ]]; then
  echo "Missing AWS credentials!"
  exit 1
fi
# Check for backup path:
if [[ $S3_BACKUP_PATH == "" ]]; then
  echo "Missing S3_BACKUP_PATH!"
  exit 1
fi

### MONGO DB ###
# Check if the backup exists:
totalFoundObjects=$(aws s3 ls $S3_BACKUP_PATH/$BACKUP --recursive --summarize | grep "mongo.tgz" | wc -l)
if [ "$totalFoundObjects" -eq "0" ]; then
  echo "This backup doesn't exist!"
  exit 1
fi
# Get the backup from S3:
aws s3 cp $S3_BACKUP_PATH/$BACKUP/mongo.tgz mongo.tgz
# Prepare a clean `to_restore` dir:
rm -rf $csd/../docker/data/mongo/db/backups/to_restore
mkdir -p $csd/../docker/data/mongo/db/backups/to_restore
# Decompress the backup:
tar -xzf mongo.tgz -C $csd/../docker/data/mongo/db/backups/to_restore
rm mongo.tgz
# Restore the backup:
# The name of the backup is not `mongo` due to the way we're creating it,
# it's $BACKUP.
docker exec mongo \
  mongorestore --drop \
  mongodb://$SKYNET_DB_USER:$SKYNET_DB_PASS@$SKYNET_DB_HOST:$SKYNET_DB_PORT \
  /data/db/backups/to_restore/$BACKUP
# Clean up:
rm -rf $csd/../docker/data/mongo/db/backups/to_restore
