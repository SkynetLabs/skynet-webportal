#! /usr/bin/env bash

set -e # exit on first error

sudo apt-get update
sudo apt-get -y install python3-pip

pip3 install discord.py
pip3 install python-dotenv

fundsCheck="0 0,8,16 * * * /home/user/skynet-webportal/setup-scripts/funds-checker.py /home/user/.sia/sia.env"
logsCheck="0 0,8,16 * * * /home/user/skynet-webportal/setup-scripts/log-checker.py /home/user/.sia/sia.env sia 8"

(crontab -u user -l; echo "$fundsCheck" ) | crontab -u user -
(crontab -u user -l; echo "$logsCheck" ) | crontab -u user -
