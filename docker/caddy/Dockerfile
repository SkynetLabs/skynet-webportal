FROM caddy:2.3.0-builder AS caddy-builder

# available dns resolvers: https://github.com/caddy-dns
RUN xcaddy build --with github.com/caddy-dns/route53

FROM caddy:2.3.0

COPY --from=caddy-builder /usr/bin/caddy /usr/bin/caddy
