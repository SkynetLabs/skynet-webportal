FROM node:16.5.0-alpine

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY src/* src/

ENV HSD_NETWORK="main"
ENV HSD_HOST="0.0.0.0"
ENV HSD_PORT=12037
ENV HSD_API_KEY="foo"

EXPOSE 3100
ENV NODE_ENV production
CMD [ "node src" ]
