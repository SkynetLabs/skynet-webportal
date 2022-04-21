#!/bin/sh

# Generate locally signed ssl certificate to be used on routes
# that do not require certificate issued by trusted CA

set -e

ME=$(basename $0)

generate_local_certificate() {
  echo >&3 "$ME: Generating locally signed ssl certificate"
  openssl req -new -newkey rsa:2048 -days 3650 -nodes -x509 \
    -subj '/CN=local-certificate' \
    -keyout /etc/ssl/local-certificate.key \
    -out /etc/ssl/local-certificate.crt
}

generate_local_certificate
