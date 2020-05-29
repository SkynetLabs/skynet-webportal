#! /usr/bin/env bash

set -e # exit on first error

# Setup constants
GO_VERSION=1.13.11
SIA_VERSION=1.4.8

# Install Go
wget -c https://dl.google.com/go/go${GO_VERSION}.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go${GO_VERSION}.linux-amd64.tar.gz
rm go${GO_VERSION}.linux-amd64.tar.gz

# add gopath to PATH and persist it in /etc/profile
export PATH="${PATH}:/usr/local/go/bin:/home/user/go/bin"
echo "export PATH=${PATH}" | sudo tee /etc/profile.d/go_path.sh

# Sanity check that will pass if go was installed correctly.
go version

# Install Sia
rm -rf ~/Sia
git clone --depth 1 -b v${SIA_VERSION} https://gitlab.com/NebulousLabs/Sia.git ~/Sia
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
# use -n flag to not override because these files store wallet information
cp -n setup-scripts/sia.env ~/.sia/sia.env
cp -n setup-scripts/sia-upload.env ~/.sia/sia-upload.env

# Setup persistent journal
sudo mkdir -p /var/log/journal
sudo cp setup-scripts/journald.conf /etc/systemd/journald.conf
sudo systemctl restart systemd-journald

# Restart a daemon and enable both siad nodes (don't start yet)
systemctl --user daemon-reload
systemctl --user enable siad
systemctl --user enable siad-upload

# download siastats bootstrap (consensus and transactionpool) and apply it
if ! [ -f ~/consensus.zip ]; then
    curl https://siastats.info/bootstrap/bootstrap.zip -o ~/consensus.zip
fi
unzip -o ~/consensus.zip -d ~/siad
unzip -o ~/consensus.zip -d ~/siad-upload

# start siad after the consesnsus has beed bootstraped
systemctl --user start siad
systemctl --user start siad-upload
