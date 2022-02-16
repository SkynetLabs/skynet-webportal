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
