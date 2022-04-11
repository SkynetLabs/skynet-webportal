FROM node:16.14.2-alpine

RUN apk add --no-cache autoconf=2.71-r0 automake=1.16.4-r1 build-base=0.5-r2 libtool=2.4.6-r7 nasm=2.15.05-r0 pkgconf=1.8.0-r0

WORKDIR /usr/app

COPY packages/website/package.json \
     packages/website/yarn.lock \
     ./

ENV GATSBY_TELEMETRY_DISABLED 1
ENV CYPRESS_INSTALL_BINARY 0
RUN yarn --frozen-lockfile

COPY packages/website/data ./data
COPY packages/website/src ./src
COPY packages/website/static ./static
COPY packages/website/gatsby-*.js \
     packages/website/postcss.config.js \
     packages/website/tailwind.config.js \
     ./

RUN yarn build

EXPOSE 9000

CMD ["sh", "-c", "yarn serve --host 0.0.0.0"]
