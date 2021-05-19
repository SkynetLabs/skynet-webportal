FROM golang AS sia-builder

ENV GOOS linux
ENV GOARCH amd64

ARG branch=portal-latest

RUN git clone https://gitlab.com/SkynetLabs/skyd.git Sia --single-branch --branch ${branch}
RUN make release --directory Sia

FROM firyx/sia-dev-user:latest

COPY --from=sia-builder /go/bin/ /usr/bin/

RUN mv /usr/bin/skyd /usr/bin/siad || true && \
    mv /usr/bin/skyc /usr/bin/siac || true
