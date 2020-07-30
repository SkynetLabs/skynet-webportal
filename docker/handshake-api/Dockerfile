FROM node:14.6.0

WORKDIR /usr/app

RUN yarn init -y
RUN yarn add express express-http-proxy hs-client

COPY *.js ./

ENV HSD_NETWORK="main"
ENV HSD_HOST="0.0.0.0"
ENV HSD_PORT=12037
ENV HSD_API_KEY="foo"

EXPOSE 3100
ENV NODE_ENV production
CMD [ "node", "index.js" ]
