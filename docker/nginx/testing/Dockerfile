FROM openresty/openresty:1.19.9.1-focal

WORKDIR /etc/nginx

RUN luarocks install lua-resty-http && \
    luarocks install hasher && \
    luarocks install busted

COPY rbusted /etc/nginx/

CMD /etc/nginx/rbusted --verbose --pattern=spec /usr/local/openresty/site/lualib
