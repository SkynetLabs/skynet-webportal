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
git clone -b v1.4.8 https://gitlab.com/NebulousLabs/Sia ~/Sia
make --directory ~/Sia

# Setup systemd files
mkdir -p ~/.config/systemd/user
cp siad.service ~/.config/systemd/user/siad.service
cp siad-upload.service ~/.config/systemd/user/siad-upload.service

# Setup files for storing environment variables
mkdir -p ~/.sia
cp sia.env ~/.sia/
cp sia.env ~/.sia/sia-upload.env

# Setup persistent journal
sudo mkdir -p /var/log/journal
sudo cp journald.conf /etc/systemd/journald.conf
sudo systemctl restart systemd-journald