# Testing

### Run tests once

`docker run -v $(pwd)/../libs:/usr/local/openresty/site/lualib --rm -it $(docker build -q .)`
