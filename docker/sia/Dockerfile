FROM golang AS sia-builder

ENV GOOS linux
ENV GOARCH amd64

ARG branch=portal-latest

RUN git clone https://gitlab.com/SkynetHQ/skyd.git Sia --single-branch --branch ${branch}
RUN make release --directory Sia

FROM nebulouslabs/sia:latest

COPY --from=sia-builder /go/bin/skyd /usr/bin/siad
COPY --from=sia-builder /go/bin/skyc /usr/bin/siac
