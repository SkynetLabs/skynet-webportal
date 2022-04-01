FROM openresty/openresty:1.19.9.1-focal

WORKDIR /etc/nginx

RUN luarocks install lua-resty-http && \
    luarocks install hasher && \
    luarocks install busted && \
    luarocks install luacov

COPY rbusted /etc/nginx/

CMD /etc/nginx/rbusted --verbose --coverage --pattern=spec --directory=/usr/local/openresty/site/lualib . && cd /usr/local/openresty/site/lualib && luacov
