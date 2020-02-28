# Skynet Portal Setup Scripts

This directory contains a setup guide and scripts that will install and
configure some basic requirements for running a Skynet Portal. The assumption is
that we are working with a Debian Buster Minimal system or similar.

## Initial Setup

(Assumes we are logged in as root on a fresh installation of Debian)

You may want to fork this repository and add your ssh pubkey to
`authorized_keys` and optionally edit the `tmux` and `bash` configurations.

0. SSH in a freshly installed Debian machine.
1. `apt-get update && apt-get install sudo`
1. `adduser user`
1. `usermod -a -G sudo user`
1. Quit the ssh session.

You a can now ssh into your machine as the user `user`.

5. On your local machine: `ssh-copy-id user@ip-addr`
6. On your local machine: `ssh user@ip-addr`
7. Now logged in as `user`: `sudo apt-get install git`
8. `git clone https://github.com/NebulousLabs/skynet-webportal`
9. `cd skynet-webportal/setup-scripts`
10. `./setup.sh`
11. Once DNS records are set you can run: `./letsencrypt-setup.sh`
12. This should edit your nginx configuration for you. If not, you should check
    that keys were created by letsencrypt in `/etc/letsencrypt/live/` and add
    the following lines into your nginx configuration. Make sure to replace
    `YOUR-DOMAIN` with your domain name.
    ```
    ssl_certificate /etc/letsencrypt/live/YOUR-DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/YOUR-DOMAIN/privkey.pem;
    ```
13. Finally make sure to check your nginx conf and reload nginx:
    `sudo nginx -t`
    `sudo systemctl reload nginx`

## Running siad

NOTE: You must be running `siad` and `siac` by building from a version at least
as recent as `v1.4.3`.

You still need to setup `siad` for the backend to be complete.

The setup script creates a systemd user service that will run `siad` in the
background and automatically restart upon failure. The `siad.service` file must
be placed in `~/.config/systemd/user/`

To use the `siad.service`, first fill out `~/.sia/sia.env` environment variables with the
correct values. You will need to initialize your wallet if you have not already
done so.

To enable the service: `systemctl --user enable siad.service`

### Useful Commands

To start the service: `systemctl --user start siad`
To stop it: `systemctl --user stop siad`
To check the status of it: `systemctl --user status siad`

To check standard err/standard out: `journalctl --user-unit siad`

## Portal Setup

When `siad` is done syncing, create a new wallet and unlock the wallet.

Then set an allowance (`siac renter setallowance`), with the suggested values
below:

- 10 KS (keep 25 KS in your wallet)
- default period
- default number of hosts
- 8 week renewal time
- 500 GB expected storage
- 500 GB expected upload
- 5 TB expected download
- default redundancy

Once your allowance is set you need to set your node to be a viewnode with the
following command:
`siac renter setallowance --payment-contract-initial-funding 10SC`

Now your node will begin making 10 contracts per block with many hosts so it can
potentially view the whole network's files.

## Running the Portal

Make sure you have [nodejs](https://nodejs.org/en/download/package-manager/) and [yarn](https://yarnpkg.com/getting-started/install) installed.
You can check that with `node -v` and `yarn -v` commands respectively.

- run `cd /home/user/skynet-webportal`
- run `yarn` to build dependencies
- run `yarn build` to build the client package

Client package will be outputted to `/public` and nginx configuration will pick it up automatically.
