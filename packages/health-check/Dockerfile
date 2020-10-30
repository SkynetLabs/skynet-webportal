FROM node:14.15.0-alpine

WORKDIR /usr/app

COPY package.json .
RUN yarn --no-lockfile
COPY src src
COPY cli cli

EXPOSE 3100
ENV NODE_ENV production
CMD [ "node", "--max-http-header-size=64000", "src/index.js" ]
