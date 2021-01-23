# Skynet Portal Server Maintenance

## Moving production server

I will be using server-current.siasky.net and server-new.siasky.net in the following guide.

1. prepare server-new.siasky.net
    - follow along the [setup](./README.md) up to the "Step 3: configuring siad" point - do not set that up because we will be moving sia data from a different server
1. shutdown server-current.siasky.net and clone data
    1. `ssh user@server-current.siasky.net`
    1. `docker exec sia siac wallet seeds` and store a seed in secure place
    1. `cd /home/user/skynet-webportal` to enter portal directory
    1. `scripts/portal-down.sh` and wait until the timer runs out to ensure it is disabled
    1. `docker-compose down` to shut down all containers
    1. `sudo rsync -avz --progress /home/user/skynet-webportal user@server-new.siasky.net:/home/user/`
    1. (optionally) only if you are using skynet-monitoring
        1. `cd /home/user/skynet-monitoring` to enter monitoring directory
        1. `docker-compose down` to stop all services
        1. `sudo rsync -avz --progress /home/user/skynet-monitoring user@server-new.siasky.net:/home/user/`
1. adjust configuration and start server-new.siasky.net
    1. `cd /home/user/skynet-webportal` to enter portal directory
    1. adjust `.env` and `docker/caddy/Caddyfile`
    1. `docker-compose up -d` to start all services
    1. (optionally) only if you are using skynet-monitoring
        1. `cd /home/user/skynet-monitoring` to enter monitoring directory
        1. `docker-compose up -d` to start all services
1. clean up server-current.siasky.net
    - either wipe the server clean with new linux installation
    - or follow [reusing existing server](#) guide if you want to reuse the hardware for a new node