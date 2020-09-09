#! /usr/bin/env bash

set -e # exit on first error

# Copy over basic configuration files
cp /home/user/skynet-webportal/setup-scripts/support/tmux.conf /home/user/.tmux.conf
cp /home/user/skynet-webportal/setup-scripts/support/bashrc /home/user/.bashrc
source /home/user/.bashrc

# Add SSH keys and set SSH configs
sudo cp /home/user/skynet-webportal/setup-scripts/support/ssh_config /etc/ssh/ssh_config
mkdir -p /home/user/.ssh
cat /home/user/skynet-webportal/setup-scripts/support/authorized_keys >> /home/user/.ssh/authorized_keys

# Install apt packages
sudo apt-get update
sudo apt-get -y install ufw tmux ranger htop nload gcc g++ make git vim unzip curl

# Setup GIT credentials (so commands like git stash would work)
git config --global user.email "devs@nebulous.tech"
git config --global user.name "Sia Dev"

# Setup firewall
sudo ufw --force enable # --force to make it non-interactive
sudo ufw logging low # enable logging for debugging purpose: tail -f /var/log/ufw.log
sudo ufw allow ssh # allow ssh connection to server
sudo ufw allow 80,443/tcp # allow http and https ports

# OPTIONAL: terminfo for alacritty terminal via ssh
# If you don't use the alacritty terminal you can remove this step.
wget -c https://raw.githubusercontent.com/alacritty/alacritty/master/extra/alacritty.info
sudo tic -xe alacritty,alacritty-direct alacritty.info
rm alacritty.info

# Set up file limits - siad uses a lot so we need to adjust so it doesn't choke up
sudo cp /home/user/skynet-webportal/setup-scripts/support/limits.conf /etc/security/limits.conf
