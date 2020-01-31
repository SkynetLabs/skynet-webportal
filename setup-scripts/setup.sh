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
sudo apt-get -y install ufw tmux ranger htop nload nginx certbot \
  python-certbot-nginx nodejs gcc g++ make yarn git vim

# Install pm2
sudo npm i -g pm2

# terminfo for alacritty terminal via ssh
wget -c https://raw.githubusercontent.com/alacritty/alacritty/master/extra/alacritty.info
sudo tic -xe alacritty,alacritty-direct alacritty.info
rm alacritty.info

# Install Go 1.13.7.
wget -c https://dl.google.com/go/go1.13.7.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.13.7.linux-amd64.tar.gz
source ~/.bashrc
rm go1.13.7.linux-amd64.tar.gz

# Sanity check that will pass if go was installed correctly.
go version

# Install Sia
cwd=$(pwd)
cd ~/
git clone https://gitlab.com/NebulousLabs/Sia
cd Sia && git checkout viewnode && make

cd $cwd

# Setup nginx config
sudo cp ./skynet-nginx.conf /etc/nginx/sites-available/skynet
sudo nginx -t
sudo ln -s /etc/nginx/sites-available/skynet /etc/nginx/sites-enabled/skynet
sudo rm /etc/nginx/sites-enabled/default
sudo systemctl reload nginx

# Setup firewall
# TODO: disable plain HTTP eventually
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 'Nginx HTTP'

# Setup skynet frontend.
cd ~/
git clone https://github.com/NebulousLabs/skynet-webportal && cd skynet-webportal
yarn

# Start the frontend.
pm2 --name skynet start npm -- start

# Add SSH keys and set SSH configs
cd $cwd
sudo cp ./ssh_config /etc/ssh/ssh_config
mkdir -p ~/.ssh
cat ./authorized_keys >>  ~/.ssh/authorized_keys
