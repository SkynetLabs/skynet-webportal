FROM node:14.6.0-alpine

WORKDIR /usr/app

COPY package.json .
RUN yarn --no-lockfile
COPY src/* src/

EXPOSE 3100
ENV NODE_ENV production
CMD [ "node", "src/index.js" ]
