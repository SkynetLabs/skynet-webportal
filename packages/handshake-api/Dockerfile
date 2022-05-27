FROM node:18.2.0-alpine

WORKDIR /usr/app

COPY packages/handshake-api/package.json \
     packages/handshake-api/yarn.lock \
     ./

RUN yarn --frozen-lockfile

COPY packages/handshake-api/src/* src/

ENV HSD_NETWORK="main"
ENV HSD_HOST="0.0.0.0"
ENV HSD_PORT=12037
ENV HSD_API_KEY="foo"

EXPOSE 3100
ENV NODE_ENV production
CMD ["node", "src/index.js"]
