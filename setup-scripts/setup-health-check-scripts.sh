#! /usr/bin/env bash
set -e

sudo apt-get update
sudo apt-get -y install python3-pip

pip3 install discord.py

downloadCheck="0 0,8,16 * * * ~/skynet-webportal/setup-scripts/health-checker.py ~/.sia/sia.env"
uploadCheck="0 0,8,16 * * * ~/skynet-webportal/setup-scripts/health-checker.py ~/.sia/sia-upload.env"

(crontab -u userhere -l; echo "$downloadCheck" ) | crontab -u userhere -
(crontab -u userhere -l; echo "$uploadCheck" ) | crontab -u userhere -
