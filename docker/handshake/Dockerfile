FROM node:14.5

WORKDIR /opt/hsd

RUN git clone https://github.com/handshake-org/hsd.git /opt/hsd && \
    npm install --production

ENV PATH="${PATH}:/opt/hsd/bin:/opt/hsd/node_modules/.bin"

ENTRYPOINT ["hsd"]
