#! /usr/bin/env bash

set -e # exit on first error

# Install docker (cleans up old docker installation)
# sudo apt-get remove -y docker docker-engine docker.io containerd runc # fails if it is the first installation
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
docker --version # sanity check

# Install docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version # sanity check

# Create dummy .env file for docker-compose usage with veriables
# DOMAIN_NAME - the domain name your server is using ie. example.com
# EMAIL_ADDRESS - this is the administrator contact email you need to supply for communication regarding SSL certification
# SIA_API_AUTHORIZATION - the base64 encoded :apipassword string
# CLOUDFLARE_AUTH_TOKEN - cloudflare auth token for ssl generation (just for siasky.net)
if ! [ -f /home/user/skynet-webportal/.env ]; then
    HSD_API_KEY=$(openssl rand -base64 32) # generate safe random key for handshake
    printf "DOMAIN_NAME=example.com\nEMAIL_ADDRESS=email@example.com\nSIA_API_AUTHORIZATION=\nCLOUDFLARE_AUTH_TOKEN=\nHSD_API_KEY=${HSD_API_KEY}\n" > /home/user/skynet-webportal/.env
fi

# Start docker container with nginx and client
sudo docker-compose -f docker-compose.yml up --build -d