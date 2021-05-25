FROM node:16.1.0-alpine

RUN apk update && apk add dnsmasq

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

# 1. alias siasky.net with current server ip to ommit load balancer
# 2. prepend dnsmasq nameserver so it tries to resolve first
# 3. start dnsmasq in the background
# 4. start crond in the background
# 5. start the health-check api service
CMD [ "sh", "-c", \
      "echo address=/siasky.net/$(node src/whatismyip.js) > /etc/dnsmasq.d/siasky.net.conf ; \
       echo -e \"nameserver 127.0.0.1\n$(cat /etc/resolv.conf)\" > /etc/resolv.conf ; \
       dnsmasq ; \
       crond ; \
       node --max-http-header-size=64000 src/index.js" \
    ]
