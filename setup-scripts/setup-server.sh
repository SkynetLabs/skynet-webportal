#! /usr/bin/env bash

set -e # exit on first error

# Install apt packages
sudo apt-get update
sudo apt-get -y install ufw tmux ranger htop nload gcc g++ make git vim

# Setup firewall
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80,443/tcp
sudo ufw allow proto tcp from any to 172.0.0.0/8 port 9970,9980

# Install homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
sudo apt-get install build-essential
echo 'eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)' >> /home/user/.profile
eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)
brew --version # sanity check

# Setup periodical /tmp cleanup so we don't run out of disk space
# - deletes anything older than 10 days from /tmp, crontab is set to run it every day at midnight
(sudo crontab -l 2>/dev/null; echo "0 0 * * * find /tmp -type f -atime +10 -delete >/dev/null 2>&1") | sudo crontab -

# OPTIONAL: terminfo for alacritty terminal via ssh
# If you don't use the alacritty terminal you can remove this step.
wget -c https://raw.githubusercontent.com/alacritty/alacritty/master/extra/alacritty.info
sudo tic -xe alacritty,alacritty-direct alacritty.info
rm alacritty.info