FROM node:16.0.0-alpine

WORKDIR /usr/app

COPY package.json .
RUN yarn --no-lockfile
COPY src src
COPY cli cli

RUN echo '* * * * * /usr/app/cli/run critical > /dev/stdout' >> /etc/crontabs/root
RUN echo '* * * * * /usr/app/cli/run extended > /dev/stdout' >> /etc/crontabs/root

EXPOSE 3100
ENV NODE_ENV production
CMD [ "sh", "-c", "crond ; node --max-http-header-size=64000 src/index.js" ]
