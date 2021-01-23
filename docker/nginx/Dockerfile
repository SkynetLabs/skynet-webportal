FROM openresty/openresty:1.19.3.1-8-bionic

RUN apt-get update -qq && apt-get install cron logrotate -qq
RUN luarocks install luasocket

# change "syslog" user to "adm" user in logrotate.conf
RUN sed -i 's/^su root syslog/su root adm/' /etc/logrotate.conf

CMD ["sh", "-c", "service cron start ; /usr/local/openresty/bin/openresty -g 'daemon off;'"]
