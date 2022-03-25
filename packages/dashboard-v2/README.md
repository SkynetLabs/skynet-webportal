# Skynet Account Dashboard

Code behind [account.skynetpro.net](https://account.skynetpro.net/)

## Development

This is a Gatsby application. To run it locally, all you need is:

- `yarn install`
- `yarn start`

## Accessing remote APIs

To be able to log in on a local environment with your production credentials, you'll need to make the browser believe you're actually on the same domain, otherwise the browser will block the session cookie.

To do the trick, edit your `/etc/hosts` file and add a record like this:

```
127.0.0.1 local.skynetpro.net
```

then run `yarn develop:secure` -- it will run `gatsby develop` with `--https --host=local.skynetpro.net -p=443` options.
If you're on macOS, you may need to `sudo` the command to successfully bind to port `443`.

> **NOTE:** This should become easier once we have a docker image for the new dashboard.
