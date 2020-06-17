# Skynet Portal Setup Scripts

This directory contains a setup guide and scripts that will install and
configure some basic requirements for running a Skynet Portal. The assumption is
that we are working with a Debian Buster Minimal system or similar.

## Initial Setup

You may want to fork this repository and replace ssh keys in
`setup-scripts/support/authorized_keys` and optionally edit the `setup-scripts/support/tmux.conf` and `setup-scripts/support/bashrc` configurations to fit your needs.

### Step 1: setting up server user

1. SSH in a freshly installed Debian machine on a user with sudo access (can be root)
1. `apt-get update && apt-get install sudo` to make sure `sudo` is available
1. `adduser user` to create user called `user` (creates `/home/user` directory)
1. `usermod -a -G sudo user` to add this new user to sudo group
1. `usermod -a -G systemd-journal user` to add this new user to systemd-journal group
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
   1. `/home/user/skynet-webportal/setup-scripts/setup-siad.sh`
   1. `/home/user/skynet-webportal/setup-scripts/setup-docker-services.sh`
   1. `/home/user/skynet-webportal/setup-scripts/setup-health-check-scripts.sh` (optional)

### Step 3: configuring siad

At this point we have almost everything set up. We have 2 siad instances running as services and we need to set up the wallets and allowance on those.

1. Create new wallet for both siad instances (remember to save the seeds)
   1. `siac wallet init` to init download node wallet
   1. `siac-upload wallet init` to init upload node wallet
1. Unlock both wallets
   1. `siac wallet unlock` to unlock download node wallet (use seed as password)
   1. `siac-upload wallet unlock` to unlock upload node wallet (use seed as password)
1. Generate wallet addresses for both siad instances (save them for later to transfer the funds)
   1. `siac wallet address` to generate address for download node wallet
   1. `siac-upload wallet address` to generate address for upload node wallet
1. Set up allowance on both siad instances
   1. `siac renter setallowance` to set allowance on download node
      1. 10 KS (keep 25 KS in your wallet)
      1. default period
      1. default number of hosts
      1. 8 week renewal time
      1. 500 GB expected storage
      1. 500 GB expected upload
      1. 5 TB expected download
      1. default redundancy
   1. `siac-upload renter setallowance` to set allowance on upload node
      1. use the same allowance settings as download node
1. Run `siac renter setallowance --payment-contract-initial-funding 10SC` so that your download node will start making 10 contracts per block with many hosts to potentially view the whole network's files
1. Copy over apipassword from `/home/user/.sia/apipassword` and save it for the next step
1. Edit environment files for both siad instances
   1. `/home/user/.sia/sia.env` for the download node
      1. `SIA_API_PASSWORD` to previously copied apipassword (same for both instances)
      1. `SIA_WALLET_PASSWORD` to be the wallet seed
      1. `PORTAL_NAME` xxxxed part to some meaningful name like `warsaw.siasky.net`
      1. `DISCORD_BOT_TOKEN` for discord health check scripts integration
   1. `/home/user/.sia/sia-upload.env` for the upload node
      1. `SIA_API_PASSWORD` to previously copied apipassword (same for both instances)
      1. `SIA_WALLET_PASSWORD` to be the wallet seed
      1. `PORTAL_NAME` xxxxed part to some meaningful name like `warsaw.siasky.net`
      1. `DISCORD_BOT_TOKEN` for discord health check scripts integration

### Step 4: configuring docker services

1. generate and copy sia api token `printf ":$(cat /home/user/.sia/apipassword)" | base64`
1. edit `/home/user/skynet-webportal/.env` and add following environment variables separate by enter
   - `DOMAIN_NAME` is your domain name
   - `SIA_API_AUTHORIZATION` is token you just generated in the previous point
   - `CLOUDFLARE_AUTH_TOKEN` if using cloudflare as dns loadbalancer (just for siasky.net)
1. only for siasky.net domain instances: edit `/home/user/skynet-webportal/docker/caddy/Caddyfile`, uncomment `import siasky.net` and comment out `import custom.domain`
1. `sudo docker-compose restart` to restart the services so they pick up new configuration

### Useful Commands

- Accessing siac for both nodes
  - `siac` for download node
  - `siac-upload` for upload node
- Checking status of siad service
  - `systemctl --user status siad` for download node
  - `systemctl --user status siad-upload` for upload node
- Stopping siad service
  - `systemctl --user stop siad` for download node
  - `systemctl --user stop siad-upload` for upload node
- Starting siad service
  - `systemctl --user start siad` for download node
  - `systemctl --user start siad-upload` for upload node
- Restarting siad service
  - `systemctl --user restart siad` for download node
  - `systemctl --user restart siad-upload` for upload node
- Checking siad service logs (follow last 50 lines)
  - `journalctl -f -n 50 --user-unit siad` for download node
  - `journalctl -f -n 50 --user-unit siad-upload` for upload node
- Checking caddy logs (for example in case ssl certificate fails)
  - `sudo docker logs caddy -f`
- Checking nginx logs (nginx handles all communication to siad instances)
  - `tail -n 50 docker/data/nginx/logs/access.log` to follow last 50 lines of access log
  - `tail -n 50 docker/data/nginx/logs/error.log` to follow last 50 lines of error log
