FROM node:15.12.0-alpine

RUN apk update && apk add autoconf automake libtool gcc make g++ zlib-dev file nasm util-linux

WORKDIR /usr/app

COPY src ./src
COPY static ./static
COPY gatsby-config.js .
COPY package.json .

ARG WITH_ACCOUNTS=0

ENV GATSBY_TELEMETRY_DISABLED 1
ENV GATSBY_WITH_ACCOUNTS $WITH_ACCOUNTS
ENV NODE_ENV production
ENV CYPRESS_INSTALL_BINARY 0

RUN yarn --no-lockfile

EXPOSE 9000

CMD [ "sh", "-c", "yarn build && yarn serve" ]
