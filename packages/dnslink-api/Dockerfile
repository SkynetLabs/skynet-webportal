FROM node:16.13.2-alpine

WORKDIR /usr/app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY src/* src/

EXPOSE 3100
CMD node src/index.js
