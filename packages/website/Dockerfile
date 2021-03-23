FROM node:15.12.0-alpine

RUN apk update && apk add autoconf automake build-base libtool nasm pkgconfig

WORKDIR /usr/app

COPY package.json .

ENV GATSBY_TELEMETRY_DISABLED 1
RUN yarn --no-lockfile --production

COPY src ./src
COPY gatsby-browser.js .
COPY gatsby-config.js .
COPY gatsby-node.js .
COPY gatsby-ssr.js .
COPY postcss.config.js .
COPY tailwind.config.js .

CMD ["sh", "-c", "yarn build && yarn serve"]
