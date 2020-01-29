#! /usr/bin/env bash
set -e

# Copy over basic configuration files.
cp ./tmux.conf ~/.tmux.conf
cp ./bashrc ~/.bashrc
source ~/.bashrc

# Nodejs install prerequisite. From official documentation.
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -

# Yarn install prerequisite.
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

# Apt installations.
sudo apt-get update
sudo apt-get -y install tmux htop nload nginx nodejs gcc g++ make yarn git

# Install pm2
sudo npm i -g pm2

# terminfo for alacritty terminal via ssh
wget -c https://raw.githubusercontent.com/alacritty/alacritty/master/extra/alacritty.info
sudo tic -xe alacritty,alacritty-direct alacritty.info
rm alacritty.info

# Install Go 1.13.7.
wget -c https://dl.google.com/go/go1.13.7.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.13.7.linux-amd64.tar.gz
rm go1.13.7.linux-amd64.tar.gz

# Sanity check that will pass if go installed correctly.
go version

# Install Sia
git clone https://gitlab.com/NebulousLabs/Sia
cd Sia && git checkout viewnode && make
