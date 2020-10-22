FROM golang:1.15 AS builder

ENV GOOS linux
ENV GOARCH amd64
ENV CGO_ENABLED 0

ADD synckeys.go /go/src/synckeys/
RUN go get -d -u gitlab.com/NebulousLabs/errors/... && \
    go install ./...

FROM scratch

COPY --from=builder /go/bin/synckeys /usr/local/bin/synckeys

ENTRYPOINT ["synckeys"]
