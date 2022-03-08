## Mar 8, 2022:
### v0.1.4
**Key Updates**
- expose generic skylink serving endpoint on domain aliases
- Add abuse scanner service, activated by adding `u` to `PORTAL_MODULES`
- Add malware scanner service, activated by adding `s` to `PORTAL_MODULES`
- Remove ORY Kratos, ORY Oathkeeper, CockroachDB.
- Add `/serverload` endpoint for CPU usage and free disk space

**Bugs Fixed**
- Add missing servers and blocklist command to the manual blocklist script.
- fixed a bug when accessing file from skylink via subdomain with a filename that had escaped characters
- Fix `blocklist-skylink.sh` script that didn't removed blocked skylink from
  nginx cache.
- fixed uploaded directory name (was "undefined" before)
- fixed empty directory upload progress (size was not calculated for directories)

**Other**
- add new critical health check that scans config and makes sure that all relevant configurations are set
- Add abuse report configuration
- Remove hardcoded Airtable default values from blocklist script. Portal
  operators need to define their own values in portal common config (LastPass).
- Add health check for the blocker container
- Drop `Skynet-Requested-Skylink` header
- Dump disk space usage when health-checker script disables portal due to
  critical free disk space.
- Enable the accounting module for skyd
- Add link to supported setup process in Gitbook.
- Set `min_free` parameter on the `proxy_cache_path` directive to `100g`
- Parameterize MongoDB replicaset in `docker-compose.mongodb.yml` via
  `SKYNET_DB_REPLICASET` from `.env` file.
- Hot reload Nginx after pruning cache files.
- Added script to prune nginx cache.
- Remove hardcoded server list from `blocklist-skylink.sh` so it removes server
  list duplication and can also be called from Ansible.
- Remove outdated portal setup documentation and point to developer docs.
- Block skylinks in batches to improve performance.
- Add trimming Airtable skylinks from Takedown Request table.
- Update handshake to use v3.0.1

## Oct 18, 2021:
### v0.1.3
**Key Updates**
- Change skyd 307 redirect code to 308
- Set caddy dns entry ttl limit to 15 minutes to remove stranded entries.
- Set skyd up to connect to the local mongodb cluster for storing TUS metadata
- Update health check disable command to require reason.
- Move MongoDB to a separate service (use `PORTAL_MODULES=m` to use it without accounts)
- Add proper handling for options response on /skynet/tus endpoint
- added unpinning skylinks from account dashboard

**Bugs Fixed**
- include tus header upload-concat in cors requests
- fixed issue with caddy requesting new certificates instead of using existing ones from file storage
- fixed the latest news link redirect in the news header
- Fix extended checks error by rounding the reported datetime.

**Other**
- Remove outdated references to NebulousLabs



## August 9th, 2021:
### v0.1.1 
Monthly release

## March 24th, 2021:
### v0.1.0 
Initial versioned release
