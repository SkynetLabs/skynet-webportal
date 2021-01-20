#!/bin/bash

BACKUP=$1
if [[ $BACKUP == "" ]]; then
  echo "No backup name given. It should look like '2020-01-29'."
  exit 1
fi

docker exec cockroach \
  cockroach sql \
  --host cockroach:26257 \
  --certs-dir=/certs \
  --execute="RESTORE DATABASE defaultdb FROM 's3://skynet-crdb-backups/backups/$DT?AWS_ACCESS_KEY_ID=$AWS_KEY_ID&AWS_SECRET_ACCESS_KEY=$AWS_SECRET_KET';"
