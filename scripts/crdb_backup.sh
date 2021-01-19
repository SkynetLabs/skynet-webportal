#!/bin/bash

# Take the current datetime:
DT=`date +%Y-%m-%d`
# Create the backup:
docker exec cockroach \
  cockroach sql \
  --host cockroach:26257 \
  --certs-dir=/certs \
  --execute="BACKUP TO 'http://cockroach-backup:3000/cockroach/backups/$DT';"
