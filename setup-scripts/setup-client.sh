#! /usr/bin/env bash

set -e # exit on first error

# Install docker (cleans up old docker installation)
sudo apt-get remove -y docker docker-engine docker.io containerd runc
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

# Install node and yarn
brew install node yarn

# Install dependencies and build production bundle
yarn --frozen-lockfile
yarn build

# Start docker container with nginx and client
docker-compose -f docker-compose.yml up --build -d