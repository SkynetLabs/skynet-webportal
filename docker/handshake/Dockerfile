FROM node:16.11.1-alpine

WORKDIR /opt/hsd

RUN apk update && apk add bash unbound-dev gmp-dev g++ gcc make python2 git
# Checkout a specific commit until Handshake releases the next release after
# 2.4.0 then we should switch to that tag.
#
# The commit we are targetting right now contains a fix for handling the chain
# migration code for new portals.
RUN git clone https://github.com/handshake-org/hsd.git /opt/hsd && \
    cd /opt/hsd && git checkout 6f0927db32723d6320c8bff255a6ccf70b2ccd32 && cd -
RUN npm install --production

ENV PATH="${PATH}:/opt/hsd/bin:/opt/hsd/node_modules/.bin"

ENTRYPOINT ["hsd"]
