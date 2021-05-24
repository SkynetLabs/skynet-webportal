FROM node:16.1.0-alpine

WORKDIR /usr/app

# schedule critical checks to run every 5 minutes (any failures will disable server)
RUN echo '*/5 * * * * /usr/app/cli/run critical > /dev/stdout' >> /etc/crontabs/root

# schedule extended checks to run on every hour (optional checks, report only)
RUN echo '0 * * * * /usr/app/cli/run extended > /dev/stdout' >> /etc/crontabs/root

COPY package.json .
RUN yarn --no-lockfile
COPY src src
COPY cli cli

EXPOSE 3100
ENV NODE_ENV production

# command consists of 3 parts:
# 1. starting crond
# 2. aliasing siasky.net and account.siasky.net with current server ip so health checks 
#    test portal end-to-end on prod domain (important for testing ssl certificates)
# 3. running api service
CMD [ "sh", "-c", "crond ; echo $(node src/whatismyip.js) siasky.net account.siasky.net >> /etc/hosts ; node --max-http-header-size=64000 src/index.js" ]
