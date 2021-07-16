#! /usr/bin/env bash

set -e # exit on first error

sudo apt-get update
sudo apt-get -y install python3-pip

pip3 install --upgrade DiscordWebhook python-dotenv requests elasticsearch-curator google-api-python-client google-auth-httplib2 google-auth-oauthlib

# add cron entries to user crontab
crontab -u user /home/user/skynet-webportal/setup-scripts/support/crontab
