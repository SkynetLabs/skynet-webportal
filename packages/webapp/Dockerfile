FROM node:14.6.0-alpine

WORKDIR /usr/app

COPY src ./src
COPY static ./static
COPY gatsby-config.js .
COPY package.json .

ENV CYPRESS_INSTALL_BINARY 0
ENV GATSBY_TELEMETRY_DISABLED 1
RUN yarn --no-lockfile
RUN yarn build