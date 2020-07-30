FROM golang AS sia-builder

ENV GOOS linux
ENV GOARCH amd64

ARG branch=master

RUN git clone https://gitlab.com/NebulousLabs/Sia.git --single-branch --branch ${branch}
RUN make release --directory Sia

FROM nebulouslabs/sia:alpine-latest

COPY --from=sia-builder /go/bin/siac /sia/siac
COPY --from=sia-builder /go/bin/siad /sia/siad
