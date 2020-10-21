FROM golang:1.15 AS builder
ENV GOOS linux
ENV GOARCH amd64
ENV CGO_ENABLED 0
ADD initkeys.go /go/src/initkeys/
RUN go install ./...

FROM scratch
COPY --from=builder /go/bin/initkeys /usr/local/bin/initkeys
ENTRYPOINT ["initkeys"]
