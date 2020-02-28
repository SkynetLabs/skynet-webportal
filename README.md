# Skynet Portal

## Setup Guide

A setup guide with scripts to install prerequisites can be found in the [setup-scripts](./setup-scripts) directory.

Once the setup guide is complete you will be running:

- `siad` configured as a Skynet Portal
- an nginx webserver serving webportal

## Web application

### Development

Use `yarn start` to start the development server.

### Production build

Use `yarn build` to compile the application to `/public` directory.

### Build parameters

You can use the below build parameters to customize your application. You can use them both on development and production builds.

- development example `GATSBY_API_URL=https://siasky.dev yarn start`
- production example `GATSBY_API_URL=https://siasky.net yarn build`

#### List of available parameters

- `GATSBY_API_URL`: you can override the api url if it is different than the location origin
