FROM openresty/openresty:1.19.9.1-focal

WORKDIR /

RUN luarocks install lua-resty-http && \
    luarocks install hasher && \
    openssl req -new -newkey rsa:2048 -days 3650 -nodes -x509 \
    -subj '/CN=local-certificate' \
    -keyout /etc/ssl/local-certificate.key \
    -out /etc/ssl/local-certificate.crt

COPY mo ./
COPY libs /etc/nginx/libs
COPY conf.d /etc/nginx/conf.d
COPY conf.d.templates /etc/nginx/conf.d.templates
COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

CMD [ "bash", "-c", \
      "./mo < /etc/nginx/conf.d.templates/server.account.conf > /etc/nginx/conf.d/server.account.conf ; \
       ./mo < /etc/nginx/conf.d.templates/server.api.conf > /etc/nginx/conf.d/server.api.conf; \
       ./mo < /etc/nginx/conf.d.templates/server.dnslink.conf > /etc/nginx/conf.d/server.dnslink.conf; \
       ./mo < /etc/nginx/conf.d.templates/server.hns.conf > /etc/nginx/conf.d/server.hns.conf; \
       ./mo < /etc/nginx/conf.d.templates/server.skylink.conf > /etc/nginx/conf.d/server.skylink.conf ; \
       while :; do sleep 6h & wait ${!}; /usr/local/openresty/bin/openresty -s reload; done & \
       /usr/local/openresty/bin/openresty '-g daemon off;'" \
    ]
