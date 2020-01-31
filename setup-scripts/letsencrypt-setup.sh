#! /usr/bin/env bash
set -e

domain="$1"
if [[ -z $domain ]]; then
  echo "Usage $0 DOMAIN_NAME"
  exit 1
fi

sudo certbot --nginx -d "$domain" -d www."$domain"
sudo certbot renew --dry-run
