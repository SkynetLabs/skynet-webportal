#! /usr/bin/env bash

set -e # exit on first error

echo "`date +"%Y-%m-%d %H:%M"` Starting backup process"

# ensure aws cli is upgraded
pip3 install --quiet --upgrade awscli

# import required environment variables from .env file
ENV_VARIABLES=("AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY" "PORTAL_DOMAIN" "SERVER_DOMAIN" "SERVER_UID")

for ENV_VARIABLE in "${ENV_VARIABLES[@]}"; do
    ENV_VARIABLE_VALUE=$(grep -v '^#' /home/user/skynet-webportal/.env | grep ${ENV_VARIABLE} || true)
    if test -z "${ENV_VARIABLE_VALUE}"; then
        if $ENV_VARIABLE ~= "SERVER_DOMAIN"; then
            echo "Environment variable ${ENV_VARIABLE} is not set" && exit 1
        fi
    fi
    export ${ENV_VARIABLE_VALUE}
done

# create bucket skynet-backup-[portaldomain] (portal domain is stripped of all non alnum characters)
# ie. siasky.net backup results in skynet-backup-siaskynet basket name
BUCKET_NAME=$(echo skynet-backup-${PORTAL_DOMAIN} | tr -cd '[[:alnum:]]-')

# create server prefix
if test -z "${SERVER_DOMAIN}"; then
    SERVER_PREFIX=$(echo ${SERVER_UID} | tr -cd '[[:alnum:]]-') # if domain name is empty use just uid
else
    SERVER_PREFIX=$(echo ${SERVER_UID}-${SERVER_DOMAIN} | tr -cd '[[:alnum:]]-') # use both uid and server domain if available
fi

aws s3api create-bucket --acl private --bucket ${BUCKET_NAME}

# sync all nginx logs
aws s3 sync --no-progress /home/user/skynet-webportal/docker/data/nginx/logs s3://${BUCKET_NAME}/${SERVER_PREFIX}/docker/data/nginx/logs

# generate and sync skylinks
docker exec sia siac skynet ls --recursive --alert-suppress > /home/user/skynet-webportal/logs/skylinks-$(date +"%Y-%m-%d").log
aws s3 cp --no-progress /home/user/skynet-webportal/logs/skylinks.log s3://${BUCKET_NAME}/${SERVER_PREFIX}/logs/skylinks.log

echo "`date +"%Y-%m-%d %H:%M"` Backup finished successfully"
