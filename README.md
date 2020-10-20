# Skynet Portal

## Web application

Use `yarn workspace webapp start` to start the development server.

Use `yarn workspace webapp build` to compile the application to `/public` directory.

You can use the below build parameters to customize your web application.

- development example `GATSBY_API_URL=https://siasky.dev yarn workspace webapp start`
- production example `GATSBY_API_URL=https://siasky.net yarn workspace webapp build`

List of available parameters:

- `GATSBY_API_URL`: override api url (defaults to location origin)

## Contributing

### Testing Your Code

Before pushing your code you should verify that it will pass our online test
suite.

**Cypress Tests**
Verify the Cypress test suite by doing the following:

1. In one terminal screen run `GATSBY_API_URL=https://siasky.net yarn workspace webapp start`
1. In a second terminal screen run `yarn workspace webapp cypress run`

## Setting up complete skynet server

A setup guide with installation scripts can be found in [setup-scripts/README.md](./setup-scripts/README.md).
