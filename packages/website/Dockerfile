FROM node:16.9.1-alpine

RUN apk update && apk add autoconf automake build-base libtool nasm pkgconfig

WORKDIR /usr/app

COPY package.json yarn.lock ./

ENV GATSBY_TELEMETRY_DISABLED 1
ENV CYPRESS_INSTALL_BINARY 0
RUN yarn --frozen-lockfile

COPY data ./data
COPY src ./src
COPY static ./static
COPY gatsby-browser.js gatsby-config.js gatsby-node.js gatsby-ssr.js postcss.config.js tailwind.config.js ./

RUN yarn build

EXPOSE 9000

CMD ["sh", "-c", "yarn serve --host 0.0.0.0"]
