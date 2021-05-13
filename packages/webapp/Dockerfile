FROM node:16.1.0-alpine

RUN apk update && apk add autoconf automake libtool gcc make g++ zlib-dev file nasm util-linux

WORKDIR /usr/app

COPY package.json .

ENV CYPRESS_INSTALL_BINARY 0

RUN yarn --no-lockfile

COPY src ./src
COPY static ./static
COPY gatsby-config.js .

ARG WITH_ACCOUNTS=0

ENV GATSBY_TELEMETRY_DISABLED 1
ENV GATSBY_WITH_ACCOUNTS $WITH_ACCOUNTS

EXPOSE 9000

CMD [ "sh", "-c", "yarn build && yarn serve --host 0.0.0.0" ]
