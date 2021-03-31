#!/bin/bash

# Get current working directory (pwd doesn't cut it)
cwd=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
# Set the environment. We only grab the entries we need because otherwise we
# need to deal with the edge cases presented by problematic values.
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
# Take the current datetime:
DT=$(date +%Y-%m-%d)

### COCKROACH DB ###
echo "Creating a backup of CockroachDB:"
# Check if a backup already exists:
totalFoundObjects=$(aws s3 ls $S3_BACKUP_PATH/$DT --recursive --summarize | grep "cockroach" | wc -l)
if [ "$totalFoundObjects" -ge "1" ]; then
  echo "Backup already exists for today. Skipping."
else
  # Create a cockroachdb backup:
  docker exec cockroach \
    cockroach sql \
    --host cockroach:26257 \
    --certs-dir=/certs \
    --execute="BACKUP TO '$S3_BACKUP_PATH/$DT/cockroach/?AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID&AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY';"
  if [[ $? > 0 ]]; then
    echo "Creating a CockroachDB backup failed. Skipping."
  else
    echo "Successfully backed up CockroachDB."
  fi
fi

### MONGO DB ###
echo "Creating a backup of MongoDB:"
# Check if a backup already exists:
totalFoundObjects=$(aws s3 ls $S3_BACKUP_PATH/$DT --recursive --summarize | grep "mongo" | wc -l)
if [ "$totalFoundObjects" -ge "1" ]; then
  echo "Backup already exists for today. Skipping."
else
  # Create the backup:
  docker exec mongo \
    mongodump \
    -o /data/db/backups/$DT \
    mongodb://$SKYNET_DB_USER:$SKYNET_DB_PASS@$SKYNET_DB_HOST:$SKYNET_DB_PORT
  docker exec mongo chmod o+rw /data/db/backups/
  if [[ $? > 0 ]]; then
    echo "Creating a MongoDB backup failed. Skipping."
  else
    # Compress the backup:
    cd $cwd/../docker/data/mongo/db/backups/ && ls -l && tar -czf mongo.tgz $DT && cd -
    # Upload the backup to S3:
    aws s3 cp $cwd/../docker/data/mongo/db/backups/mongo.tgz $S3_BACKUP_PATH/$DT/mongo.tgz
    # Clean up
    rm -rf $DT.tgz $cwd/../docker/data/mongo/db/backups/mongo.tgz
    echo "Finished MongoDB backup."
  fi
  docker exec mongo rm -rf /data/db/backups/$DT
fi
