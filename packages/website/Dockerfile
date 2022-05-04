# builder stage - use debian base image to avoid needing to install missing packages
FROM node:16.14.2-bullseye as builder

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

RUN yarn build

# main stage - use alpine base image to minimise the resulting image footprint
FROM node:16.14.2-alpine

WORKDIR /usr/app

# install http server for serving website files
RUN npm install --global http-server@14.1.0

COPY --from=builder /usr/app/public /usr/app/public

EXPOSE 9000

CMD ["http-server", "/usr/app/public", "-s", "-p 9000"]
