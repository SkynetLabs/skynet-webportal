FROM golang:1.16.7 AS sia-builder

ENV GOOS linux
ENV GOARCH amd64

ARG branch=portal-latest

RUN git clone https://gitlab.com/SkynetLabs/skyd.git Sia --single-branch --branch ${branch} && \
    make release --directory Sia

FROM nebulouslabs/sia:1.5.6

COPY --from=sia-builder /go/bin/ /usr/bin/

RUN if [ -f "/usr/bin/skyd" ]; then mv /usr/bin/skyd /usr/bin/siad; fi && \
    if [ -f "/usr/bin/skyc" ]; then mv /usr/bin/skyc /usr/bin/siac; fi
