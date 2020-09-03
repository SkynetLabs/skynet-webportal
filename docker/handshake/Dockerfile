# we can't use alpine image since it fails on node-gyp
FROM node:14.9.0

WORKDIR /opt/hsd

RUN git clone https://github.com/handshake-org/hsd.git /opt/hsd
RUN npm install --production

ENV PATH="${PATH}:/opt/hsd/bin:/opt/hsd/node_modules/.bin"

ENTRYPOINT ["hsd"]
