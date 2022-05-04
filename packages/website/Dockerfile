FROM node:18.1.0-alpine

RUN apk add --no-cache build-base~=0.5 python3~=3.9

WORKDIR /usr/app

# disable gatsby telemetry and installing cypress binary
ENV GATSBY_TELEMETRY_DISABLED 1
ENV CYPRESS_INSTALL_BINARY 0

COPY packages/website/package.json \
     packages/website/yarn.lock \
     ./
RUN yarn --frozen-lockfile

COPY packages/website/data ./data
COPY packages/website/src ./src
COPY packages/website/static ./static
COPY packages/website/gatsby-*.js \
     packages/website/postcss.config.js \
     packages/website/tailwind.config.js \
     ./

EXPOSE 9000

CMD ["sh", "-c", "yarn build && yarn serve --host 0.0.0.0"]
