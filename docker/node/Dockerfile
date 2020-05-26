FROM node:12.16.3-alpine

WORKDIR /usr/app

COPY src ./src
COPY static ./static
COPY gatsby-config.js .
COPY package.json .
COPY yarn.lock .

RUN yarn --frozen-lockfile
RUN yarn build