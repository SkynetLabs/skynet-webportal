# Skynet Portal Setup Scripts

This directory contains a setup guide and scripts that will install and
configure some basic requirements for running a Skynet Portal. The assumption is
that we are working with a Debian Buster Minimal system or similar.

##  Initial Setup
(Assumes we are logged in as root on a fresh installation of Debian)

You may want to fork this repository and add your ssh pubkey to
`authorized_keys` and optionally edit the `tmux` and `bash` configurations.

0. SSH in a freshly installed Debian machine.
1. `apt-get update && apt-get install sudo`
2. `adduser user`
3. `usermod -a -G sudo user`
4. Quit the ssh session.

You a can now ssh into your machine as the user `user`.

5. On your local machine: `ssh-copy-id user@ip-addr`
6. On your local machine: `ssh user@ip-addr`
7. Now logged in as `user`: `sudo apt-get install git`
8. `git clone https://github.com/NebulousLabs/skynet-webportal`
9. `cd skynet-webportal/setup-scripts`
11. `./setup.sh`
12. Once DNS records are set you can run: `./letsencrypt-setup.sh`
13. You should also change the nginx configuration to listen on port 443
    instead.

## Setting up siad

NOTE: You must be running `siad` and `siac` by building from the `viewnode`
branch.

You still need to setup `siad` for the backend to be complete.
1. `cd ~/; mkdir siad`
2. `nohup siad &>/dev/null &`

This will start syncing `siad` in the background.

## ViewNode setup

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
`siac renter setallowance --view-contract-initial-price 10SC`

Now your node will begin making 10 contracts per block with many hosts so it can
potentially view the whole network's files.

## Running the Portal
`cd` into the parent directory and run `yarn` to build dependencies.

We recommend running the Portal through `pm2` (a nodejs process manager) in the background with the command:

`pm2 --name skynet start npm -- start`

`yarn start` will also work if not using `pm2`.

The Protal which will automatically read your `siad` API password and startup a
portal on `localhost:3000`. nginx will expose this to port 80 or 443 if you
configured it for SSL.
