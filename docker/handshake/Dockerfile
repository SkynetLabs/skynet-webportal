FROM node:16.13.2-alpine

WORKDIR /opt/hsd

RUN apk update && apk add bash unbound-dev gmp-dev g++ gcc make python2 git
RUN git clone https://github.com/handshake-org/hsd.git /opt/hsd && \
    cd /opt/hsd && git checkout v3.0.1 && cd -
RUN npm install --production

ENV PATH="${PATH}:/opt/hsd/bin:/opt/hsd/node_modules/.bin"

ENTRYPOINT ["hsd"]
