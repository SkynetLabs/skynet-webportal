FROM caddy:2.1.1-builder AS caddy-builder

RUN caddy-builder github.com/caddy-dns/cloudflare github.com/caddy-dns/route53

FROM caddy:2.1.1

COPY --from=caddy-builder /usr/bin/caddy /usr/bin/caddy
