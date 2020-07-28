FROM node:14.5.0 AS webportal-builder

COPY src ./src
COPY static ./static
COPY gatsby-config.js .
COPY package.json .
COPY yarn.lock .

ENV CYPRESS_INSTALL_BINARY 0
RUN yarn --frozen-lockfile
RUN yarn build

FROM openresty/openresty:1.15.8.3-2-xenial

COPY --from=webportal-builder /public /var/www/webportal
