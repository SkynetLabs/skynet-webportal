FROM node:14.6.0

WORKDIR /usr/app

RUN yarn init -y && \
    yarn add express express-http-proxy hs-client

COPY handshake-api/index.js ./

ENV HOST="localhost"
ENV PORT=3100

ENV HSD_NETWORK="main"
ENV HSD_HOST="0.0.0.0"
ENV HSD_PORT=12037
ENV HSD_API_KEY="foo"

EXPOSE $PORT

ENTRYPOINT ["node", "index.js"]
