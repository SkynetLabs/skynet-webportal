FROM node:12.18.0 AS client-builder

COPY src ./src
COPY static ./static
COPY gatsby-config.js .
COPY package.json .
COPY yarn.lock .

RUN yarn --frozen-lockfile
RUN yarn build

FROM caddy:2.0.0-builder AS caddy-builder

RUN caddy-builder github.com/caddy-dns/cloudflare

FROM caddy:2.0.0

COPY --from=client-builder /public /home/user/public_html
COPY --from=caddy-builder /usr/bin/caddy /usr/bin/caddy
