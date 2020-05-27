#! /usr/bin/env bash

set -e # exit on first error

# Copy over basic configuration files
cp setup-scripts/tmux.conf ~/.tmux.conf
cp setup-scripts/bashrc ~/.bashrc
source ~/.bashrc

# Add SSH keys and set SSH configs
sudo cp setup-scripts/ssh_config /etc/ssh/ssh_config
mkdir -p ~/.ssh
cat setup-scripts/authorized_keys >>  ~/.ssh/authorized_keys

# Install apt packages
sudo apt-get update
sudo apt-get -y install ufw tmux ranger htop nload gcc g++ make git vim unzip curl

# Setup firewall
sudo ufw --force enable # --force to make it non-interactive
sudo ufw logging low # enable logging for debugging purpose: tail -f /var/log/ufw.log
sudo ufw allow ssh # allow ssh connection to server
sudo ufw allow 80,443/tcp # allow http and https ports
sudo ufw allow proto tcp from any to 172.0.0.0/8 port 9970,9980 # expose siad api ports to local network
sudo ufw allow proto tcp from any to 192.168.0.0/16 port 9970,9980 # expose siad api ports to local network

# Setup periodical /tmp cleanup so we don't run out of disk space
# - deletes anything older than 10 days from /tmp, crontab is set to run it every day at midnight
# WARNING: if you run this job more than once, make sure to either comment this out or clean crontab from duplicates
(sudo crontab -l 2>/dev/null; echo "0 0 * * * find /tmp -type f -atime +10 -delete >/dev/null 2>&1") | sudo crontab -

# OPTIONAL: terminfo for alacritty terminal via ssh
# If you don't use the alacritty terminal you can remove this step.
wget -c https://raw.githubusercontent.com/alacritty/alacritty/master/extra/alacritty.info
sudo tic -xe alacritty,alacritty-direct alacritty.info
rm alacritty.info

# Set up file limits - siad uses a lot so we need to adjust so it doesn't choke up
sudo cp setup-scripts/limits.conf /etc/security/limits.conf

# Enable lingering services, it prevents services shutdown when you log out of the server
loginctl enable-linger user