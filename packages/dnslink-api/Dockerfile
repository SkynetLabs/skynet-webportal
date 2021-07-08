FROM node:16.3.0-alpine

WORKDIR /usr/app

COPY package.json .
RUN yarn --no-lockfile
COPY src/* src/

EXPOSE 3100
CMD node src
