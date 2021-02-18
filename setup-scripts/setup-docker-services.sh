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

# add user to docker group to avoid having to use sudo for every docker command
sudo usermod -aG docker user

# Install docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version # sanity check

# Create dummy .env file for docker-compose usage with variables
# * DOMAIN_NAME - the domain name your server is using ie. example.com
# * SKYNET_PORTAL_API - absolute url to the portal api ie. https://example.com
# * EMAIL_ADDRESS - this is the administrator contact email you need to supply for communication regarding SSL certification
# * HSD_API_KEY - this is auto generated secure key for your handshake service integration
# * CLOUDFLARE_AUTH_TOKEN` - (optional) if using cloudflare as dns loadbalancer (need to change it in Caddyfile too)
# * AWS_ACCESS_KEY_ID - (optional) if using route53 as a dns loadbalancer
# * AWS_SECRET_ACCESS_KEY - (optional) if using route53 as a dns loadbalancer
# * API_PORT - (optional) the port on which siad is listening, defaults to 9980
# * PORTAL_NAME - the name of the portal, required by the discord bot
# * DISCORD_BOT_TOKEN - required by the discord bot
if ! [ -f /home/user/skynet-webportal/.env ]; then
    HSD_API_KEY=$(openssl rand -base64 32) # generate safe random key for handshake
    printf "DOMAIN_NAME=example.com\nSKYNET_PORTAL_API=https://example.com\nEMAIL_ADDRESS=email@example.com\nSIA_WALLET_PASSWORD=\nHSD_API_KEY=${HSD_API_KEY}\nCLOUDFLARE_AUTH_TOKEN=\nAWS_ACCESS_KEY_ID=\nAWS_SECRET_ACCESS_KEY=\nPORTAL_NAME=\nDISCORD_BOT_TOKEN=\n" > /home/user/skynet-webportal/.env
fi

# Start docker container with nginx and client
docker-compose -f docker-compose.yml up --build -d
