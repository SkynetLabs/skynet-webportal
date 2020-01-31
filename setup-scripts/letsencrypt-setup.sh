#! /usr/bin/env bash
set -e

sudo certbot --nginx -d siasky.net -d www.siasky.net
sudo certbot renew --dry-run
