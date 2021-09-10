Version Scheme
--------------
Skynet Webportal uses the following versioning scheme, vX.X.X
 - First Digit signifies a major (compatibility breaking) release
 - Second Digit signifies a major (non compatibility breaking) release
 - Third Digit signifies a minor or patch release

Version History
---------------

Latest:

## Sep 10, 2021:
### deploy-2021-09-13
**Key Updates**
- Change skyd 307 redirect code to 308
- Set caddy dns entry ttl limit to 15 minutes to remove stranded entries.
- Update health check disable command to require reason.
- Add proper handling for options response on /skynet/tus endpoint

**Bugs Fixed**
- Fix extended checks error by rounding the reported datetime.

**Other**
- Remove outdated references to NebulousLabs



## August 9th, 2021:
### v0.1.1 
Monthly release

## March 24th, 2021:
### v0.1.0 
Initial versioned release
