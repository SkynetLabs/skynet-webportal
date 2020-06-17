#! /usr/bin/env bash

set -e # exit on first error

sudo apt-get update
sudo apt-get -y install python3-pip

pip3 install discord.py
pip3 install python-dotenv

downloadCheck="0 0,8,16 * * * /home/user/skynet-webportal/setup-scripts/funds-checker.py /home/user/.sia/sia.env"
uploadCheck="0 0,8,16 * * * /home/user/skynet-webportal/setup-scripts/funds-checker.py /home/user/.sia/sia-upload.env"

logCheck1="0 0,8,16 * * * /home/user/skynet-webportal/setup-scripts/log-checker.py /home/user/.sia/sia.env siad 8"
logCheck2="0 0,8,16 * * * /home/user/skynet-webportal/setup-scripts/log-checker.py /home/user/.sia/sia-upload.env siad-upload 8"

(crontab -u user -l; echo "$downloadCheck" ) | crontab -u user -
(crontab -u user -l; echo "$uploadCheck" ) | crontab -u user -

(crontab -u user -l; echo "$logCheck1" ) | crontab -u user -
(crontab -u user -l; echo "$logCheck2" ) | crontab -u user -
