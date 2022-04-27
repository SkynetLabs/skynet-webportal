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
        # all variables except SERVER_DOMAIN are required
        if [ "${ENV_VARIABLE}" != "SERVER_DOMAIN" ]; then
            echo "Environment variable ${ENV_VARIABLE} is not set" && exit 1
        fi
    else
        export ${ENV_VARIABLE_VALUE}
    fi
done

# create bucket skynet-backup-[portaldomain] (replace dots with dashes and strip anything other than alnum)
# ie. siasky.net backup results in skynet-backup-siasky-net basket name
BUCKET_NAME=$(echo skynet-backup-${PORTAL_DOMAIN} | tr  '.'  '-' | tr -cd '[[:alnum:]]-')

# create server prefix
if test -z "${SERVER_DOMAIN}"; then
    # if domain name is empty use just uid (replace dots with dashes and strip anything other than alnum)
    SERVER_PREFIX=$(echo ${SERVER_UID} | tr  '.'  '-' | tr -cd '[[:alnum:]]-')
else
    # use both uid and server domain if available (replace dots with dashes and strip anything other than alnum)
    SERVER_PREFIX=$(echo ${SERVER_DOMAIN}-${SERVER_UID} | tr  '.'  '-' | tr -cd '[[:alnum:]]-')
    SERVER_PREFIX_LEGACY=$(echo ${SERVER_UID}-${SERVER_DOMAIN} | tr  '.'  '-' | tr -cd '[[:alnum:]]-')
fi

aws s3api create-bucket --acl private --bucket ${BUCKET_NAME}

# move old backup dir to new location if legacy backup path exists
if test -n "${SERVER_PREFIX_LEGACY}"; then
    aws s3 mv --recursive s3://${BUCKET_NAME}/${SERVER_PREFIX_LEGACY} s3://${BUCKET_NAME}/${SERVER_PREFIX} 
fi

# sync all nginx logs
mkdir -p /home/user/skynet-webportal/docker/data/nginx/logs # ensure path exists
aws s3 sync --no-progress /home/user/skynet-webportal/docker/data/nginx/logs s3://${BUCKET_NAME}/${SERVER_PREFIX}/docker/data/nginx/logs

# generate and sync skylinks dump
SKYLINKS_PATH=logs/skylinks/$(date +"%Y-%m-%d").log
mkdir -p /home/user/skynet-webportal/logs/skylinks # ensure path exists
docker exec sia siac skynet ls --recursive --alert-suppress > /home/user/skynet-webportal/${SKYLINKS_PATH}
aws s3 cp --no-progress /home/user/skynet-webportal/${SKYLINKS_PATH} s3://${BUCKET_NAME}/${SERVER_PREFIX}/${SKYLINKS_PATH}

echo "`date +"%Y-%m-%d %H:%M"` Backup finished successfully"
