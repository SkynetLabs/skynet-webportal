# Running tests locally

`docker run -v $(pwd)/docker/nginx/libs:/usr/local/openresty/site/lualib --rm -it $(docker build -q docker/nginx/testing)`
