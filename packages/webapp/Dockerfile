FROM node:14.9.0

WORKDIR /usr/app

COPY src ./src
COPY static ./static
COPY gatsby-config.js .
COPY package.json .

ENV CYPRESS_INSTALL_BINARY 0
ENV GATSBY_TELEMETRY_DISABLED 1
RUN yarn --no-lockfile  --network-timeout 100000
RUN yarn build 
