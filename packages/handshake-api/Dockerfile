FROM node:16.13.0-alpine

WORKDIR /usr/app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY src/* src/

ENV HSD_NETWORK="main"
ENV HSD_HOST="0.0.0.0"
ENV HSD_PORT=12037
ENV HSD_API_KEY="foo"

EXPOSE 3100
ENV NODE_ENV production
CMD node src/index.js
