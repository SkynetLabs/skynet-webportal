#! /usr/bin/env bash

set -e # exit on first error

# Setup constants
GO_VERSION=1.13.11
SIA_BRANCH_OR_TAG=v1.4.11

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
rm -rf /home/user/Sia
git clone https://gitlab.com/NebulousLabs/Sia.git /home/user/Sia
git -C /home/user/Sia checkout ${SIA_BRANCH_OR_TAG}
make --directory /home/user/Sia

# Setup systemd files and restart daemon
mkdir -p /home/user/.config/systemd/user
cp /home/user/skynet-webportal/setup-scripts/support/siad.service /home/user/.config/systemd/user/siad.service
cp /home/user/skynet-webportal/setup-scripts/support/siad-upload.service /home/user/.config/systemd/user/siad-upload.service

# Create siad data directories
mkdir -p /home/user/siad
mkdir -p /home/user/siad-upload

# Setup files for storing environment variables
mkdir -p /home/user/.sia
# use -n flag to not override because these files store wallet information
cp -n /home/user/skynet-webportal/setup-scripts/support/sia.env /home/user/.sia/sia.env
cp -n /home/user/skynet-webportal/setup-scripts/support/sia-upload.env /home/user/.sia/sia-upload.env

# Setup persistent journal
sudo mkdir -p /var/log/journal
sudo cp /home/user/skynet-webportal/setup-scripts/support/journald.conf /etc/systemd/journald.conf
sudo systemctl restart systemd-journald

# Restart a daemon and enable both siad nodes (don't start yet)
systemctl --user daemon-reload
systemctl --user enable siad
systemctl --user enable siad-upload

# download siastats bootstrap (consensus and transactionpool) and apply it
if ! [ -f /home/user/consensus.zip ]; then
    curl https://siastats.info/bootstrap/bootstrap.zip -o /home/user/consensus.zip
fi
if ! [ -f /home/user/siad/consensus/consensus.db ]; then
    unzip -o /home/user/consensus.zip -d /home/user/siad
fi
if ! [ -f /home/user/siad-upload/consensus/consensus.db ]; then
    unzip -o /home/user/consensus.zip -d /home/user/siad-upload
fi

# start siad after the consesnsus has beed bootstraped
systemctl --user start siad
systemctl --user start siad-upload
