FROM node:14.15.0-alpine

WORKDIR /usr/app

COPY package.json .
RUN yarn --no-lockfile
COPY src src
COPY cli cli

RUN echo '*/5 * * * * /usr/app/cli/run critical' >> /etc/crontabs/root
RUN echo '0 * * * * /usr/app/cli/run verbose' >> /etc/crontabs/root

EXPOSE 3100
ENV NODE_ENV production
CMD [ "sh", "-c", "crond -l 0 -L /usr/app/log.txt ; node --max-http-header-size=64000 src/index.js" ]
