FROM golang AS sia-builder

ENV GOOS linux
ENV GOARCH amd64

ARG branch=master

RUN git clone https://gitlab.com/NebulousLabs/Sia.git --single-branch --branch ${branch}
RUN make release --directory Sia

FROM nebulouslabs/sia:alpine-1.5.0

COPY --from=sia-builder /go/bin/siac /go/bin/siad /usr/bin/
