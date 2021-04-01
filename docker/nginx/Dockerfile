FROM openresty/openresty:1.19.3.1-2-bionic

# RUN apt-get update -qq && apt-get install cron logrotate -qq
RUN luarocks install luasocket

# CMD ["sh", "-c", "service cron start;", "/usr/local/openresty/bin/openresty -g daemon off;"]
CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]
