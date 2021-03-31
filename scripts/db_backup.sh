#!/bin/bash

# Get current working directory (pwd doesn't cut it)
cwd=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
# Set the environment. We only grab the entries we need because otherwise we
# need to deal with the edge cases presented by problematic values.
set -o allexport
cat $cwd/../.env | grep "AWS_ACCESS_KEY_ID\|AWS_SECRET_ACCESS_KEY\|S3_BACKUP_PATH" > .tmpenv
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
# Take the current datetime:
DT=`date +%Y-%m-%d`

### COCKROACH DB ###
# Check if a backup already exists:
totalFoundObjects=$(aws s3 ls $S3_BACKUP_PATH/cockroach/ --recursive --summarize | grep "$DT" | wc -l)
if [ "$totalFoundObjects" -eq "1" ]; then
   echo "Backup already exists for today. Exiting."
   exit 0
fi
# Create a cockroachdb backup:
docker exec cockroach \
  cockroach sql \
  --host cockroach:26257 \
  --certs-dir=/certs \
  --execute="BACKUP TO '$S3_BACKUP_PATH/cockroach/$DT?AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID&AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY';"
if [[ $? > 0 ]]; then
  echo "Creating a CockroachDB backup failed. Exiting."
  exit 1
fi

### MONGO DB ###
# Check if a backup already exists:
totalFoundObjects=$(aws s3 ls s3://skynet-crdb-backups/backups/mongo/ --recursive --summarize | grep "$DT.tgz" | wc -l)
if [ "$totalFoundObjects" -eq "1" ]; then
   echo "Backup already exists for today. Exiting."
   exit 0
fi
# Create the backup:
docker exec mongo \
  mongodump \
  -o /data/db/backups/$DT \
  mongodb://$SKYNET_DB_USER:$SKYNET_DB_PASS@$SKYNET_DB_HOST:$SKYNET_DB_PORT
if [[ $? > 0 ]]; then
  echo "Creating a MongoDB backup failed. Exiting."
  exit 1
fi
# Compress the backup:
cd $cwd/../docker/data/mongo/db/backups/ && tar -czf $DT.tgz $DT && cd -
# Upload the backup to S3:
aws s3 cp $DT.tgz s3://skynet-crdb-backups/backups/mongo/
# Clean up
rm -rf $DT.tgz $cwd/../docker/data/mongo/db/backups/$DT
