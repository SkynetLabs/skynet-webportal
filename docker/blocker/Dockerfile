FROM golang:1.16.7
LABEL maintainer="NebulousLabs <devs@nebulous.tech>"

ENV GOOS linux
ENV GOARCH amd64

ARG branch=main

WORKDIR /root

RUN git clone --single-branch --branch ${branch} https://github.com/SkynetLabs/blocker.git && \
    cd blocker && \
    go mod download && \
    make release

ENTRYPOINT ["blocker"]
