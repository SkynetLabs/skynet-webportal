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
10. Add ssh pubkeys to `authorized_keys` file.
11. `./setup.sh`
12. Once DNS records are set you can run: `./letsencrypt-setup.sh`
