FROM caddy:2.4.1-builder AS caddy-builder

# available dns resolvers: https://github.com/caddy-dns
RUN xcaddy build --with github.com/caddy-dns/route53

FROM caddy:2.4.1

COPY --from=caddy-builder /usr/bin/caddy /usr/bin/caddy
