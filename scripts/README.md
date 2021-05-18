# Skynet Webportal Scripts

This package contains useful scripts for managing a Skynet Webportal.

## Available Scripts

**blocklist-skylink.sh**\
The `blocklist-skylink.sh` script adds a skylink to the blocklist on all
servers.

**maintenance-upgrade.sh**\
The `maintenance-upgrade.sh` script upgrades the docker images for nodes on
a maintenance server.

**portal-down.sh**\
The `portal-down.sh` script takes a portal out of the load balancer by disabling
the health check.

**portal-restart.sh**\
The `portal-restart.sh` script restarts a portal by taking it out of the load
balancer, restarting the docker containers, and adding the portal back to the
load balancer.

**portal-up.sh**\
The `portal-up.sh` script puts a portal back into the load balancer by enabling
the health check.

**portal-upgrade.**\
The `portal-upgrade.sh` script upgrades the docker images for a portal and
clears and leftover images.

## Webportal Upgrade Procedures

TODO...

1. 1 server upgraded at a time
1. Clusters of servers upgraded at a time
1. How to safetly revert to previous stable version. Document what those
   versions were.
1. Upgrading single subsystem
1. Upgrading multiple subsystems
