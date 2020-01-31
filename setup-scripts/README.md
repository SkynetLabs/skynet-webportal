# Skynet Portal Setup Scripts

This directory contains a setup guide and scripts that will install and
configure some basic requirements for running a Skynet Portal. The assumption is
that we are working with a Debian Buster Minimal system or similar.

##  Initial Setup
(Assumes we are logged in as root on a fresh installation of Debian)

1. `apt-get update && apt-get install sudo`
2. `adduser user`
3. `usermod -a -G sudo user`
4. QUIT SSH SESSION
5. ON LOCAL COMPUTER: `ssh-copy-id user@ip-addr`
6. ON LOCAL COMPUTER: `ssh user@ip-addr`
7. (LOGGED IN AS USER): `sudo apt-get install git`
8. `git clone https://github.com/NebulousLabs/skynet-webportal`
9. `cd skynet-webportal/setup-scripts`
10. Add ssh pubkeys to `authorized_keys` file.
11. `./setup.sh`
12. Once DNS records are set you can run: `./letsencrypt-setup.sh`
