#! /usr/bin/env bash

set -e # exit on first error

# Install Go 1.13.7.
wget -c https://dl.google.com/go/go1.13.7.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.13.7.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
rm go1.13.7.linux-amd64.tar.gz

# Sanity check that will pass if go was installed correctly.
go version

# Install Sia
rm -rf ~/Sia
git clone --depth 1 -b v1.4.8 https://gitlab.com/NebulousLabs/Sia.git ~/Sia
make --directory ~/Sia

# Setup systemd files and restart daemon
mkdir -p ~/.config/systemd/user
cp setup-scripts/siad.service ~/.config/systemd/user/siad.service
cp setup-scripts/siad-upload.service ~/.config/systemd/user/siad-upload.service

# Create siad data directories
mkdir -p ~/siad
mkdir -p ~/siad-upload

# Setup files for storing environment variables
mkdir -p ~/.sia
cp setup-scripts/sia.env ~/.sia/
cp setup-scripts/sia.env ~/.sia/sia-upload.env

# Setup persistent journal
sudo mkdir -p /var/log/journal
sudo cp setup-scripts/journald.conf /etc/systemd/journald.conf
sudo systemctl restart systemd-journald

# Restart a daemon and start both siad nodes
systemctl --user daemon-reload
systemctl --user enable siad --now
systemctl --user enable siad-upload --now