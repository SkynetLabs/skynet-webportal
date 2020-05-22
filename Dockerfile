FROM openresty/openresty:xenial

RUN /usr/local/openresty/luajit/bin/luarocks install lua-resty-auto-ssl

RUN openssl req -new -newkey rsa:2048 -days 3650 -nodes -x509 -subj '/CN=sni-support-required-for-valid-ssl' -keyout /etc/ssl/resty-auto-ssl-fallback.key -out /etc/ssl/resty-auto-ssl-fallback.crt

# source: https://ssl-config.mozilla.org/#server=nginx&version=1.17.7&config=intermediate&openssl=1.1.1d&ocsp=false&guideline=5.4
RUN curl https://ssl-config.mozilla.org/ffdhe2048.txt > /etc/dhparam
RUN chown nobody /etc/dhparam

# Create /etc/resty-auto-ssl and make sure it's writable by nginx user nobody.
RUN mkdir /etc/resty-auto-ssl
RUN chown nobody /etc/resty-auto-ssl

ENTRYPOINT ["/usr/local/openresty/nginx/sbin/nginx", "-g", "daemon off;"]