# Skynet Portal Setup Scripts

This directory contains a setup guide and scripts that will install and
configure some basic requirements for running a Skynet Portal. The assumption is
that we are working with a Debian Buster Minimal system or similar.

## Initial Setup

You may want to fork this repository and replace ssh keys in
`setup-scripts/support/authorized_keys` and optionally edit the `setup-scripts/support/tmux.conf` and `setup-scripts/support/bashrc` configurations to fit your needs.

### Step 0: stack overview

- dockerized services inside `docker-compose.yml`
  - [sia](https://sia.tech) ([docker hub](https://hub.docker.com/r/nebulouslabs/sia)): storage provider, heart of the portal setup
  - [caddy](https://caddyserver.com) ([docker hub](https://hub.docker.com/r/caddy/caddy)): reverse proxy (similar to nginx) that handles ssl out of a box and acts as a transparent entry point
  - [openresty](https://openresty.org) ([docker hub](https://hub.docker.com/r/openresty/openresty)): nginx custom build, acts as a cached proxy to siad and exposes all api endpoints
  - health-check: this is a simple service that runs periodically and collects health data about the server (status and response times) and exposes `/health-check` api endpoint that is deliberately delayed based on the response times of the server so potential load balancer could prioritize servers based on that (we use it with cloudflare)
- siad setup: we use "double siad" setup that has one node solely for download and one for upload to improve performance
  - we use systemd to manage siad service
  - siad is not installed as docker service for improved performance
- discord integration
  - [funds-checker](funds-checker.py): script that checks wallet balance and sends status messages to discord periodically
  - [log-checker](log-checker.py): script that scans siad logs for critical errors and reports them to discord periodically
- [blacklist-skylink](blacklist-skylink.sh): script that can be run locally from a machine that has access to all your skynet portal servers that blacklists provided skylink and prunes nginx cache to ensure it's not available any more (that is a bit much but that's the best we can do right now without paid nginx version) - if you want to use it, make sure to adjust the server addresses

### Step 1: setting up server user

1. SSH in a freshly installed Debian machine on a user with sudo access (can be root)
1. `apt-get update && apt-get install sudo` to make sure `sudo` is available
1. `adduser user` to create user called `user` (creates `/home/user` directory)
1. `usermod -a -G sudo user` to add this new user to sudo group
1. Quit the ssh session with `exit` command

You a can now ssh into your machine as the user `user`.

### Step 2: setting up environment

1. On your local machine: `ssh-copy-id user@ip-addr` to copy over your ssh key to server
1. On your local machine: `ssh user@ip-addr` to log in to server as user `user`
1. You are now logged in as `user`

**Following step will be executed on remote host logged in as a `user`:**

1. `sudo apt-get install git` to install git
1. `git clone https://github.com/NebulousLabs/skynet-webportal`
1. run setup scripts in the exact order and provide sudo password when asked (if one of them fails, you can retry just this one before proceeding further)
   1. `/home/user/skynet-webportal/setup-scripts/setup-server.sh`
   1. `/home/user/skynet-webportal/setup-scripts/setup-docker-services.sh`
   1. `/home/user/skynet-webportal/setup-scripts/setup-health-check-scripts.sh` (optional)

### Step 3: configuring siad

At this point we have almost everything running, we just need to set up your wallet and allowance:

1. Create new wallet (remember to save the seeds)
   > `docker exec -it sia siac wallet init`
1. Unlock wallet (use seed as password)
   > `docker exec -it sia siac wallet unlock`
1. Generate wallet addresse (save them for later to transfer the funds)
   > `docker exec -it sia siac wallet address`
1. Set up allowance
   > `docker exec -it sia siac renter setallowance`
   1. 10 KS (keep 25 KS in your wallet)
   1. default period
   1. default number of hosts
   1. 8 week renewal time
   1. 500 GB expected storage
   1. 500 GB expected upload
   1. 5 TB expected download
   1. default redundancy
1. Instruct siad to start making 10 contracts per block with many hosts to potentially view the whole network's files
   > `docker exec -it sia siac renter setallowance --payment-contract-initial-funding 10SC`

### Step 4: configuring docker services

1. generate and copy sia api token `printf ":$(cat /home/user/.sia/apipassword)" | base64`
1. edit `/home/user/skynet-webportal/.env` and configure following environment variables
   - `DOMAIN_NAME` (optional) is your domain name if you have it
   - `EMAIL_ADDRESS` (required) is your email address used for communication regarding SSL certification (required)
   - `SIA_WALLET_PASSWORD` (required) is your wallet password (or seed if you did not set a password)
   - `HSD_API_KEY` (optional) this is a random security key for an optional handshake integration that gets generated automatically
   - `CLOUDFLARE_AUTH_TOKEN` (optional) if using cloudflare as dns loadbalancer (need to change it in Caddyfile too)
   - `AWS_ACCESS_KEY_ID` (optional) if using route53 as a dns loadbalancer
   - `AWS_SECRET_ACCESS_KEY` (optional) if using route53 as a dns loadbalancer
1. if you have a custom domain and you configured it in `DOMAIN_NAME`, edit `/home/user/skynet-webportal/docker/caddy/Caddyfile` and uncomment `import custom.domain`
1. only for siasky.net domain instances: edit `/home/user/skynet-webportal/docker/caddy/Caddyfile`, uncomment `import siasky.net`
1. `docker-compose up -d` to restart the services so they pick up new env variables
1. `docker exec caddy caddy reload --config /etc/caddy/Caddyfile` to reload Caddyfile configuration

## Useful Commands

- Accessing siac
  > `docker exec -it sia siac`
- Checking status of siad service
  > `systemctl --user status siad`
- Stopping siad service
  > `systemctl --user stop siad`
- Starting siad service
  > `systemctl --user start siad`
- Restarting siad service
  > `systemctl --user restart siad`
- Restarting caddy gracefully after making changes to Caddyfile
  > `docker exec caddy caddy reload --config /etc/caddy/Caddyfile`
- Restarting nginx gracefully after making changes to nginx configs
  > `docker exec nginx openresty -s reload`
- Checking siad service logs (last hour)
  > `docker logs --since 1h $(docker ps -q --filter "name=^sia$")`
- Checking caddy logs (for example in case ssl certificate fails)
  > `docker logs caddy -f`
- Checking nginx logs (nginx handles all communication to siad instances)
  > `tail -n 50 docker/data/nginx/logs/access.log` to follow last 50 lines of access log
  > `tail -n 50 docker/data/nginx/logs/error.log` to follow last 50 lines of error log
