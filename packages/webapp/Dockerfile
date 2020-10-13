FROM node:14.13.1-alpine

RUN apk add --no-cache autoconf automake libtool gcc make g++ zlib-dev file nasm util-linux

WORKDIR /usr/app

COPY src ./src
COPY static ./static
COPY gatsby-config.js .
COPY package.json .

ENV CYPRESS_INSTALL_BINARY 0
ENV GATSBY_TELEMETRY_DISABLED 1
RUN yarn --no-lockfile
RUN yarn build
