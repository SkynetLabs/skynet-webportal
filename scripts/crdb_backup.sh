#!/bin/bash

# Take the current datetime:
DT=`date +%Y-%m-%d`
# Create the backup:
docker exec cockroach \
  cockroach sql \
  --host cockroach:26257 \
  --certs-dir=/certs \
  --execute="BACKUP TO 's3://skynet-crdb-backups/backups/$DT?AWS_ACCESS_KEY_ID=$AWS_KEY_ID&AWS_SECRET_ACCESS_KEY=$AWS_SECRET_KET';"
