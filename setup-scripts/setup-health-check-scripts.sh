#! /usr/bin/env bash

set -e # exit on first error

sudo apt-get update
sudo apt-get -y install python3-pip

pip3 install discord-webhook python-dotenv requests elasticsearch-curator

# add cron entries to user crontab
crontab -u user /home/user/skynet-webportal/setup-scripts/support/crontab

# make sure the scripts are runnable
chmod +x /home/user/skynet-webportal/scripts/es_cleaner.py
