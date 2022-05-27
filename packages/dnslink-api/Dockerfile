FROM node:18.2.0-alpine

WORKDIR /usr/app

COPY packages/dnslink-api/package.json \
     packages/dnslink-api/yarn.lock \
     ./

RUN yarn --frozen-lockfile

COPY packages/dnslink-api/src/* src/

EXPOSE 3100
CMD ["node", "src/index.js"]
