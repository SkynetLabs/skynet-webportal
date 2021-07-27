FROM caddy:2.4.3-builder AS caddy-builder

# available dns resolvers: https://github.com/caddy-dns
RUN xcaddy build --with github.com/caddy-dns/route53 \
                 --with github.com/skynetlabs/certmagic-storage-skydb

FROM caddy:2.4.3

COPY --from=caddy-builder /usr/bin/caddy /usr/bin/caddy

COPY caddy.json pre-run /etc/caddy/

CMD ["sh", "-c", "/etc/caddy/pre-run ; caddy run --config /etc/caddy/caddy.json"]
