FROM node:15.12.0-alpine

RUN apk update && apk add autoconf automake build-base libtool nasm pkgconfig

WORKDIR /usr/app

COPY package.json .

ENV GATSBY_TELEMETRY_DISABLED 1
RUN npm i --force

COPY data ./data
COPY src ./src
COPY static ./static
COPY gatsby-browser.js .
COPY gatsby-config.js .
COPY gatsby-node.js .
COPY gatsby-ssr.js .
COPY postcss.config.js .
COPY tailwind.config.js .

RUN npm run build

EXPOSE 9000

CMD ["sh", "-c", "npm run serve --host=0.0.0.0"]
