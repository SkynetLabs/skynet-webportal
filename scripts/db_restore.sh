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
cat $cwd/../.env | grep "AWS_ACCESS_KEY_ID\|AWS_SECRET_ACCESS_KEY\|S3_BACKUP_PATH\|SKYNET_DB_USER\|SKYNET_DB_PASS\|SKYNET_DB_HOST\|SKYNET_DB_PORT" >.tmpenv
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

### COCKROACH DB ###
# Check if the backup exists:
totalFoundObjects=$(aws s3 ls $S3_BACKUP_PATH/$BACKUP --recursive --summarize | grep "cockroach" | wc -l)
if [ "$totalFoundObjects" -eq "0" ]; then
  echo "This backup doesn't exist!"
  exit 1
fi
# Restore the backup:
docker exec cockroach \
  cockroach sql \
  --host cockroach:26257 \
  --insecure \
  --execute="DROP DATABASE defaultdb;"
docker exec cockroach \
  cockroach sql \
  --host cockroach:26257 \
  --insecure \
  --execute="RESTORE DATABASE defaultdb FROM '$S3_BACKUP_PATH/$BACKUP/cockroach?AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID&AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY';"

#### MONGO DB ###
## Check if the backup exists:
#totalFoundObjects=$(aws s3 ls $S3_BACKUP_PATH/$BACKUP --recursive --summarize | grep "mongo.tgz" | wc -l)
#if [ "$totalFoundObjects" -eq "0" ]; then
#  echo "This backup doesn't exist!"
#  exit 1
#fi
## Get the backup from S3:
#aws s3 cp $S3_BACKUP_PATH/$BACKUP/mongo.tgz mongo.tgz
## Prepare a clean `to_restore` dir:
#rm -rf $cwd/../docker/data/mongo/db/backups/to_restore
#mkdir -p $cwd/../docker/data/mongo/db/backups/to_restore
## Decompress the backup:
#tar -xzf mongo.tgz -C $cwd/../docker/data/mongo/db/backups/to_restore
#rm mongo.tgz
## Restore the backup:
#docker exec mongo \
#  mongorestore \
#  mongodb://$SKYNET_DB_USER:$SKYNET_DB_PASS@$SKYNET_DB_HOST:$SKYNET_DB_PORT \
#  /data/db/backups/to_restore/mongo
## Clean up:
#rm -rf $cwd/../docker/data/mongo/db/backups/to_restore
