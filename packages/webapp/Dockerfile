FROM node:15.8.0-alpine

RUN apk add --no-cache autoconf automake libtool gcc make g++ zlib-dev file nasm util-linux

WORKDIR /usr/app

ARG WITH_ACCOUNTS=0

COPY src ./src
COPY static ./static
COPY gatsby-config.js .
COPY package.json .

ENV CYPRESS_INSTALL_BINARY 0
RUN yarn --no-lockfile

ENV GATSBY_TELEMETRY_DISABLED 1
ENV GATSBY_WITH_ACCOUNTS $WITH_ACCOUNTS
RUN yarn build
