FROM node:16.5.0-alpine

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY src/* src/

EXPOSE 3100
CMD node src
