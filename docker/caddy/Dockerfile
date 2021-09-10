FROM caddy:2.4.5-builder AS caddy-builder

# available dns resolvers: https://github.com/caddy-dns
RUN xcaddy build --with github.com/caddy-dns/route53

FROM caddy:2.4.5-builder

COPY --from=caddy-builder /usr/bin/caddy /usr/bin/caddy

# bash required for mo to work (mo is mustache templating engine - https://github.com/tests-always-included/mo)
RUN apk add --no-cache bash

COPY caddy.json.template mo /etc/caddy/

CMD [ "sh", "-c", \
      "/etc/caddy/mo < /etc/caddy/caddy.json.template > /etc/caddy/caddy.json ; \
       caddy run --config /etc/caddy/caddy.json" \
    ]
