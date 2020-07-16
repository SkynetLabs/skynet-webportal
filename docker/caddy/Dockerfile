FROM node:12.18.0 AS client-builder

COPY src ./src
COPY static ./static
COPY gatsby-config.js .
COPY package.json .
COPY yarn.lock .

ENV CYPRESS_INSTALL_BINARY 0
RUN yarn --frozen-lockfile
RUN yarn build

FROM caddy:2.1.1-builder AS caddy-builder

RUN caddy-builder github.com/caddy-dns/cloudflare

FROM caddy:2.1.1

COPY --from=client-builder /public /home/user/public_html
COPY --from=caddy-builder /usr/bin/caddy /usr/bin/caddy
