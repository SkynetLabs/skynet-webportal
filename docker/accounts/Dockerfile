FROM golang:1.15
LABEL maintainer="NebulousLabs <devs@nebulous.tech>"

ENV GOOS linux
ENV GOARCH amd64

WORKDIR /root

RUN go get -d -u github.com/NebulousLabs/skynet-accounts/... && \
    ln -s $GOPATH/src/github.com/NebulousLabs/skynet-accounts ./ && \
    cd $GOPATH/src/github.com/NebulousLabs/skynet-accounts && \
    make release && \
    cd && \
    rm -rf $GOPATH/src/github.com/NebulousLabs/skynet-accounts

ENV SKYNET_DB_HOST="localhost"
ENV SKYNET_DB_PORT="27017"
ENV SKYNET_DB_USER="username"
ENV SKYNET_DB_PASS="password"
ENV SKYNET_ACCOUNTS_PORT=3000

ENTRYPOINT ["skynet-accounts"]
