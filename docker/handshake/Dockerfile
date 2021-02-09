FROM node:15.8.0-alpine

WORKDIR /opt/hsd

RUN apk add --no-cache bash unbound-dev gmp-dev g++ gcc make python2 git
RUN git clone https://github.com/handshake-org/hsd.git /opt/hsd
RUN npm install --production

ENV PATH="${PATH}:/opt/hsd/bin:/opt/hsd/node_modules/.bin"

ENTRYPOINT ["hsd"]
