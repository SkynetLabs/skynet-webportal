# Skynet Portal Setup Scripts

> :warning: This documentation is outdated and should be used for reference
only. Portal setup documentation is located at
https://docs.siasky.net/webportal-management/overview.

This directory contains a setup guide and scripts that will install and
configure some basic requirements for running a Skynet Portal. The assumption is
that we are working with a Debian Buster Minimal system or similar.

## Latest Setup Documentation

Latest Skynet Webportal setup documentation and the setup process Skynet Labs
supports is located at https://docs.siasky.net/webportal-management/overview.

Some of the scripts and setup documentation contained in this repository
(`skynet-webportal`) can be outdated and generally should not be used.

## Initial Setup

You may want to fork this repository and replace ssh keys in
`setup-scripts/support/authorized_keys` and optionally edit the `setup-scripts/support/tmux.conf` and `setup-scripts/support/bashrc` configurations to fit your needs.

### Step 0: stack overview

- dockerized services inside `docker-compose.yml`
  - [sia](https://sia.tech) ([docker hub](https://hub.docker.com/r/nebulouslabs/sia)): storage provider, heart of the portal setup
  - [caddy](https://caddyserver.com) ([docker hub](https://hub.docker.com/r/caddy/caddy)): reverse proxy (similar to nginx) that handles ssl out of a box and acts as a transparent entry point
  - [openresty](https://openresty.org) ([docker hub](https://hub.docker.com/r/openresty/openresty)): nginx custom build, acts as a cached proxy to siad and exposes all api endpoints
  - [health-check](https://github.com/SkynetLabs/skynet-webportal/tree/master/packages/health-check): simple service that runs periodically and collects health data about the server (status and response times) - [read more](https://github.com/SkynetLabs/skynet-webportal/blob/master/packages/health-check/README.md)
  - [handshake](https://handshake.org) ([github](https://github.com/handshake-org/hsd)): full handshake node
  - [handshake-api](https://github.com/SkynetLabs/skynet-webportal/tree/master/packages/handshake-api): simple API talking to the handshake node - [read more](https://github.com/SkynetLabs/skynet-webportal/blob/master/packages/handshake-api/README.md)
  - [website](https://github.com/SkynetLabs/skynet-webportal/tree/master/packages/website): portal frontend application - [read more](https://github.com/SkynetLabs/skynet-webportal/blob/master/packages/website/README.md)
- discord integration
  - [funds-checker](funds-checker.py): script that checks wallet balance and sends status messages to discord periodically
  - [health-checker](health-checker.py): script that monitors health-check service for server health issues and reports them to discord periodically
  - [log-checker](log-checker.py): script that scans siad logs for critical errors and reports them to discord periodically
- [blocklist-skylink](../scripts/blocklist-skylink.sh): script that can be run locally from a machine that has access to all your skynet portal servers that blocklists provided skylink and prunes nginx cache to ensure it's not available any more (that is a bit much but that's the best we can do right now without paid nginx version) - if you want to use it, make sure to adjust the server addresses

### Step 1: setting up server user

1. SSH in a freshly installed Debian machine on a user with sudo access (can be root)
1. `apt-get update && apt-get install sudo libnss3-tools -y` to make sure `sudo` is available
1. `adduser user` to create user called `user` (creates `/home/user` directory)
1. `usermod -aG sudo user` to add this new user to sudo group
1. `sudo groupadd docker` to create a group for docker (it might already exist)
1. `sudo usermod -aG docker user` to add your user to that group
1. Quit the ssh session with `exit` command

You can now ssh into your machine as the user `user`.

### Step 2: setting up environment

1. On your local machine: `ssh-copy-id user@ip-addr` to copy over your ssh key to server
1. On your local machine: `ssh user@ip-addr` to log in to server as user `user`
1. You are now logged in as `user`

**Following step will be executed on remote host logged in as a `user`:**

1. `sudo apt-get install git -y` to install git
1. `git clone https://github.com/SkynetLabs/skynet-webportal`
1. `cd skynet-webportal`
1. run setup scripts in the exact order and provide sudo password when asked (if one of them fails, you can retry just this one before proceeding further)
   1. `/home/user/skynet-webportal/setup-scripts/setup-server.sh`
   1. `/home/user/skynet-webportal/setup-scripts/setup-docker-services.sh`
   1. `/home/user/skynet-webportal/setup-scripts/setup-health-check-scripts.sh` (optional)

### Step 3: configuring siad

At this point we have almost everything running, we just need to set up your wallet and allowance:

1. Create a new wallet (remember to save the seed)
   > `docker exec -it sia siac wallet init`
1. Unlock the wallet (use the seed as password)
   > `docker exec -it sia siac wallet unlock`
1. Generate a new wallet address (save it for later to transfer the funds)
   > `docker exec -it sia siac wallet address`
1. Set up allowance
   > `docker exec -it sia siac renter setallowance`
   1. 10 KS (keep 25 KS in your wallet)
   1. default period
   1. default number of hosts
   1. 4 week renewal time
   1. 500 GB expected storage
   1. 500 GB expected upload
   1. 5 TB expected download
   1. default redundancy
1. Set a maximum storage price
   > `docker exec -it sia siac renter setallowance --max-storage-price 100SC`
1. Instruct siad to start making 10 contracts per block with many hosts to potentially view the whole network's files
   > `docker exec -it sia siac renter setallowance --payment-contract-initial-funding 10SC`

### Step 4: configuring docker services

1. edit `/home/user/skynet-webportal/.env` and configure following environment variables

   - `PORTAL_DOMAIN` (required) is a skynet portal domain (ex. siasky.net)
   - `SERVER_DOMAIN` (optional) is an optional direct server domain (ex. eu-ger-1.siasky.net) - leave blank unless it is different than PORTAL_DOMAIN
   - `EMAIL_ADDRESS` is your email address used for communication regarding SSL certification (required if you're using http-01 challenge)
   - `SIA_WALLET_PASSWORD` is your wallet password (or seed if you did not set a password)
   - `HSD_API_KEY` this is a random security key for a handshake integration that gets generated automatically
   - `CLOUDFLARE_AUTH_TOKEN` (optional) if using cloudflare as dns loadbalancer (need to change it in Caddyfile too)
   - `AWS_ACCESS_KEY_ID` (optional) if using route53 as a dns loadbalancer
   - `AWS_SECRET_ACCESS_KEY` (optional) if using route53 as a dns loadbalancer
   - `PORTAL_NAME` a string representing name of your portal e.g. `siasky.xyz` or `my skynet portal`
   - `DISCORD_WEBHOOK_URL` (required if using Discord notifications) discord webhook url (generate from discord app)
   - `DISCORD_MENTION_USER_ID` (optional) add `/cc @user` mention to important messages from webhook (has to be id not user name)
   - `DISCORD_MENTION_ROLE_ID` (optional) add `/cc @role` mention to important messages from webhook (has to be id not role name)
   - `SKYNET_DB_USER` (optional) if using `accounts` this is the MongoDB username
   - `SKYNET_DB_PASS` (optional) if using `accounts` this is the MongoDB password
   - `SKYNET_DB_HOST` (optional) if using `accounts` this is the MongoDB address or container name
   - `SKYNET_DB_PORT` (optional) if using `accounts` this is the MongoDB port
   - `COOKIE_DOMAIN` (optional) if using `accounts` this is the domain to which your cookies will be issued
   - `COOKIE_HASH_KEY` (optional) if using `accounts` hashing secret, at least 32 bytes
   - `COOKIE_ENC_KEY` (optional) if using `accounts` encryption key, at least 32 bytes
   - `S3_BACKUP_PATH` (optional) is using `accounts` and backing up the databases to S3. This path should be an S3 bucket
     with path to the location in the bucket where we want to store the daily backups.

1. `docker-compose up -d` to restart the services so they pick up new env variables

## Subdomains

It might prove useful for certain skapps to be accessible through a custom subdomain. So instead of being accessed through `https://portal.com/[skylink]`, it would be accessible through `https://[skylink_base32].portal.com`. We call this "subdomain access" and it is made possible by encoding Skylinks using a base32 encoding. We have to use a base32 encoding scheme because subdomains have to be all lower case and the base64 encoded Skylink is case sensitive and thus might contain uppercase characters.

You can convert Skylinks using this [converter skapp](https://convert-skylink.hns.siasky.net). To see how the encoding and decoding works, please follow the link to the repo in the application itself.

There is also an option to access handshake domain through the subdomain using `https://[domain_name].hns.portal.com`.

To configure this on your portal, you have to make sure to configure the following:

## Useful Commands

- Starting the whole stack
  > `docker-compose up -d`
- Stopping the whole stack
  > `docker-compose down`
- Accessing siac
  > `docker exec -it sia siac`
- Portal maintenance
  - Pulling portal out for maintenance
    > `scripts/portal-down.sh`
  - Putting portal back into place after maintenance
    > `scripts/portal-up.sh`
  - Upgrading portal containers (takes care of pulling it and putting it back)
    > `scripts/portal-upgrade.sh`
- Restarting caddy gracefully after making changes to Caddyfile (no downtime)
  > `docker exec caddy caddy reload --config /etc/caddy/Caddyfile`
- Restarting nginx gracefully after making changes to nginx configs (no downtime)
  > `docker exec nginx openresty -s reload`
- Checking siad service logs (since last hour)
  > `docker logs --since 1h $(docker ps -q --filter "name=^sia$")`
- Checking caddy logs (for example in case ssl certificate fails)
  > `docker logs caddy -f`
- Checking nginx logs (nginx handles all communication to siad instances)
  > `tail -n 50 docker/data/nginx/logs/access.log` to follow last 50 lines of access log
  > `tail -n 50 docker/data/nginx/logs/error.log` to follow last 50 lines of error log
