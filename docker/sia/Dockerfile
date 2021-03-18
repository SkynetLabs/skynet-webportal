FROM golang AS sia-builder

ENV GOOS linux
ENV GOARCH amd64

ARG branch=master

RUN git clone https://gitlab.com/skynetlabs/skyd.git Sia --single-branch --branch ${branch}
RUN make release --directory Sia

FROM nebulouslabs/sia:1.5.4

COPY --from=sia-builder /go/bin/siac /go/bin/siad /usr/bin/
