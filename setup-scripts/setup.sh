#! /usr/bin/env bash
set -e

# Copy over basic configuration files.
cp ./tmux.conf ~/.tmux.conf
cp ./bashrc ~/.bashrc
source ~/.bashrc

# Add SSH keys and set SSH configs
sudo cp ./ssh_config /etc/ssh/ssh_config
mkdir -p ~/.ssh
cat ./authorized_keys >>  ~/.ssh/authorized_keys

# Nodejs install prerequisite https://nodejs.org/en/download/package-manager/
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -

# Yarn install prerequisite https://classic.yarnpkg.com/en/docs/install
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

# Apt installations.
sudo apt-get update
sudo apt-get -y install ufw tmux ranger htop nload nginx certbot \
  python-certbot-nginx nodejs gcc g++ make yarn git vim

# terminfo for alacritty terminal via ssh
# If you don't use the alacritty terminal you can remove this step.
wget -c https://raw.githubusercontent.com/alacritty/alacritty/master/extra/alacritty.info
sudo tic -xe alacritty,alacritty-direct alacritty.info
rm alacritty.info

# Setup nginx config
sudo cp ./skynet-nginx.conf /etc/nginx/sites-available/skynet
sudo nginx -t
sudo ln -sf /etc/nginx/sites-available/skynet /etc/nginx/sites-enabled/skynet
sudo rm /etc/nginx/sites-enabled/default --force
sudo systemctl reload nginx

# Setup firewall
# TODO: disable plain HTTP eventually
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 'Nginx HTTP'

# Install Go 1.13.7.
wget -c https://dl.google.com/go/go1.13.7.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.13.7.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
rm go1.13.7.linux-amd64.tar.gz

# Sanity check that will pass if go was installed correctly.
go version

# Install Sia
git clone -b v1.4.4 https://gitlab.com/NebulousLabs/Sia ~/Sia
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

# Setup periodical /tmp cleanup so we don't run out of disk space
# - deletes anything older than 10 days from /tmp, crontab is set to run it every day at midnight
(sudo crontab -l 2>/dev/null; echo "0 0 * * * find /tmp -type f -atime +10 -delete >/dev/null 2>&1") | sudo crontab -

# Setup skynet frontend.
cd ..
yarn
yarn build
