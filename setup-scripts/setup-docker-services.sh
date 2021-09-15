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
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version # sanity check

# Create dummy .env file for docker-compose usage with variables
# * PORTAL_DOMAIN - (required) is a skynet portal domain (ex. siasky.net)
# * SERVER_DOMAIN - (optional) is an optional direct server domain (ex. eu-ger-1.siasky.net) - leave blank unless it is different than PORTAL_DOMAIN
# * SKYNET_PORTAL_API - absolute url to the portal api ie. https://siasky.net (general portal address)
# * SKYNET_SERVER_API - absolute url to the server api ie. https://eu-ger-1.siasky.net (direct server address, if this is single server portal use the same address as SKYNET_PORTAL_API)
# * SKYNET_DASHBOARD_URL - (optional) absolute url to the portal dashboard ie. https://account.siasky.net
# * EMAIL_ADDRESS - this is the administrator contact email you need to supply for communication regarding SSL certification
# * HSD_API_KEY - this is auto generated secure key for your handshake service integration
# * CLOUDFLARE_AUTH_TOKEN - (optional) if using cloudflare as dns loadbalancer (need to change it in Caddyfile too)
# * AWS_ACCESS_KEY_ID - (optional) if using route53 as a dns loadbalancer
# * AWS_SECRET_ACCESS_KEY - (optional) if using route53 as a dns loadbalancer
# * API_PORT - (optional) the port on which siad is listening, defaults to 9980
# * PORTAL_NAME - a string representing name of your portal e.g. `siasky.xyz` or `my skynet portal` (internal use only)
# * DISCORD_WEBHOOK_URL - (required if using Discord notifications) discord webhook url (generate from discord app)
# * DISCORD_MENTION_USER_ID - (optional) add `/cc @user` mention to important messages from webhook (has to be id not user name)
# * DISCORD_MENTION_ROLE_ID - (optional) add `/cc @role` mention to important messages from webhook (has to be id not role name)
# * SKYNET_DB_USER - (optional) if using `accounts` this is the MongoDB username
# * SKYNET_DB_PASS - (optional) if using `accounts` this is the MongoDB password
# * SKYNET_DB_HOST - (optional) if using `accounts` this is the MongoDB address or container name
# * SKYNET_DB_PORT - (optional) if using `accounts` this is the MongoDB port
# * COOKIE_DOMAIN - (optional) if using `accounts` this is the domain to which your cookies will be issued
# * COOKIE_HASH_KEY - (optional) if using `accounts` hashing secret, at least 32 bytes
# * COOKIE_ENC_KEY - (optional) if using `accounts` encryption key, at least 32 bytes
# * CR_IP - (optional) if using `accounts` the public IP/domain of your server, e.g. `helsinki.siasky.net`
# * CR_CLUSTER_NODES - (optional) if using `accounts` the list of servers (with ports) which make up your CockroachDB cluster, e.g. `helsinki.siasky.net:26257,germany.siasky.net:26257,us-east.siasky.net:26257`
if ! [ -f /home/user/skynet-webportal/.env ]; then
    HSD_API_KEY=$(openssl rand -base64 32) # generate safe random key for handshake
    printf "PORTAL_DOMAIN=siasky.net\nSERVER_DOMAIN=\nSKYNET_PORTAL_API=https://siasky.net\nSKYNET_SERVER_API=https://eu-dc-1.siasky.net\nSKYNET_DASHBOARD_URL=https://account.example.com\nEMAIL_ADDRESS=email@example.com\nSIA_WALLET_PASSWORD=\nHSD_API_KEY=${HSD_API_KEY}\nCLOUDFLARE_AUTH_TOKEN=\nAWS_ACCESS_KEY_ID=\nAWS_SECRET_ACCESS_KEY=\nPORTAL_NAME=\DISCORD_WEBHOOK_URL=\nDISCORD_MENTION_USER_ID=\nDISCORD_MENTION_ROLE_ID=\n" > /home/user/skynet-webportal/.env
fi

# Start docker container with nginx and client
docker-compose -f docker-compose.yml up --build -d
