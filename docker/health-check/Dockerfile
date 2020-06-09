FROM node:12.18.0

WORKDIR /usr/app

RUN yarn init -y
RUN yarn add express body-parser lowdb node-schedule superagent lodash http-status-codes

EXPOSE 3100

ENV NODE_ENV production
CMD [ "node", "health-check/index.js" ]