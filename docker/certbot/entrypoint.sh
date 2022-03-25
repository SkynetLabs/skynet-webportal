#!/bin/bash

# Portal domain requires 3 domain certificates:
# - exact portal domain, ie. example.com
# - wildcard subdomain on portal domain, ie. *.example.com
#   used for skylinks served from portal subdomain
# - wildcard subdomain on hns portal domain subdomain, ie. *.hns.example.com
#   used for resolving handshake domains
DOMAINS=${PORTAL_DOMAIN},*.${PORTAL_DOMAIN},*.hns.${PORTAL_DOMAIN}

# Add server domain when it is not empty and different from portal domain
if [ ! -z "${SERVER_DOMAIN}" ] && [ "${PORTAL_DOMAIN}" != "${SERVER_DOMAIN}" ]; then
    # In case where server domain is not covered by portal domain's
    # wildcard certificate, add server domain name to domains list.
    # - server-001.example.com is covered by *.example.com
    # - server-001.servers.example.com or server-001.example-severs.com
    #   are not covered by any already requested wildcard certificates
    #
    # The condition checks whether server domain does not match portal domain
    # with exactly one level of subdomain (portal domain wildcard cert):
    # (start) [anything but the dot] + [dot] + [portal domain] (end)
    if ! printf "${SERVER_DOMAIN}" | grep -q -E "^[^\.]+\.${PORTAL_DOMAIN}$"; then
        DOMAINS=${DOMAINS},${SERVER_DOMAIN}
    fi

    # Server domain requires the same set of domain certificates as portal domain.
    # Exact server domain case is handled above.
    DOMAINS=${DOMAINS},*.${SERVER_DOMAIN},*.hns.${SERVER_DOMAIN}
fi

# The "wait" will prevent an exit from the script while background tasks are
# still active, so we are adding the line below as a method to prevent orphaning
# the background child processe. The trap fires when docker terminates the container.
trap exit TERM

while :; do
    # Execute certbot and generate or maintain certificates for given domain string.
    # --non-interactive: we are running this as an automation so we cannot be prompted
    # --agree-tos: required flag marking agreement with letsencrypt tos
    # --cert-name: output directory name
    # --email: required for generating certificates, used for communication with CA
    # --domains: comma separated list of domains (will generate one bundled SAN cert)
    # Use CERTBOT_ARGS env variable to pass any additional arguments, ie --dns-route53
    certbot certonly \
        --non-interactive --agree-tos --cert-name skynet-portal \
        --email ${EMAIL_ADDRESS} --domains ${DOMAINS} ${CERTBOT_ARGS}

    # Run a background sleep process that counts down given time
    # Certbot docs advise running maintenance process every 12 hours
    sleep 12h &
    
    # Await execution until sleep process is finished (it's a background process)
    # Syntax explanation: ${!} expands to a pid of last ran process
    wait ${!}
done
