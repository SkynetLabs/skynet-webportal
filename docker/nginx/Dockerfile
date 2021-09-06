FROM openresty/openresty:1.19.9.1-bionic

RUN luarocks install lua-resty-http && \
    openssl req -new -newkey rsa:2048 -days 3650 -nodes -x509 \
    -subj '/CN=local-certificate' \
    -keyout /etc/ssl/local-certificate.key \
    -out /etc/ssl/local-certificate.crt

COPY mo ./
COPY conf.d /etc/nginx/conf.d
COPY conf.d.templates /etc/nginx/conf.d.templates

CMD [ "bash", "-c", \
      "./mo < /etc/nginx/conf.d.templates/server.account.conf > /etc/nginx/conf.d/server.account.conf ; \
       ./mo < /etc/nginx/conf.d.templates/server.api.conf > /etc/nginx/conf.d/server.api.conf; \
       ./mo < /etc/nginx/conf.d.templates/server.hns.conf > /etc/nginx/conf.d/server.hns.conf; \
       ./mo < /etc/nginx/conf.d.templates/server.skylink.conf > /etc/nginx/conf.d/server.skylink.conf ; \
       /usr/local/openresty/bin/openresty '-g daemon off;'" \
    ]
