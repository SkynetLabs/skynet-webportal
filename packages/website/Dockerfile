FROM node:16.14.2-alpine

RUN apk add --no-cache autoconf=2.71-r0 automake=1.16.4-r1 build-base=0.5-r2 libtool=2.4.6-r7 nasm=2.15.05-r0 pkgconfig=1.8.0-r0 && \
    rm -rf /var/cache/apk/*

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
