FROM golang AS sia-builder

ENV GOOS linux
ENV GOARCH amd64

ARG branch=master

RUN git clone https://gitlab.com/SkynetLabs/skyd.git Sia --single-branch --branch ${branch}
RUN make release --directory Sia

FROM nebulouslabs/sia:1.5.5

COPY --from=sia-builder /go/bin/skyd /usr/bin/siad
COPY --from=sia-builder /go/bin/skyc /usr/bin/siac
