#!/usr/bin/env python3

from bot_utils import setup, send_msg
from random import randint
from time import sleep

import traceback
import os
import sys
import re
import asyncio
import requests
import json

setup()


# Check and load Airtable environment variables
airtable_env_vars = ["AIRTABLE_API_KEY", "AIRTABLE_BASE", "AIRTABLE_TABLE", "AIRTABLE_FIELD"]

for e in airtable_env_vars:
    # Check environment variable is defined
    gete = os.getenv(e)
    if not gete:
        sys.exit("Configuration error: Environment variable " + e + " is not defined")
    # Set variable
    exec(e + " = \"" + gete + "\"")


async def run_checks():
    try:
        await block_skylinks_from_airtable()
    except:  # catch all exceptions
        trace = traceback.format_exc()
        await send_msg("```\n{}\n```".format(trace), force_notify=True)


def exec(command):
    return os.popen(command).read().strip()


async def block_skylinks_from_airtable():
    print("Pulling blocked skylinks from Airtable via api integration")
    headers = {"Authorization": "Bearer " + AIRTABLE_API_KEY}
    skylinks = []
    offset = None
    retry = 0
    while len(skylinks) == 0 or offset:
        print(
            "Requesting a batch of records from Airtable with "
            + (offset if offset else "empty")
            + " offset"
            + (" (retry " + str(retry) + ")" if retry else "")
        )
        query = "&".join(
            ["fields%5B%5D=" + AIRTABLE_FIELD, ("offset=" + offset) if offset else ""]
        )
        response = requests.get(
            "https://api.airtable.com/v0/"
            + AIRTABLE_BASE
            + "/"
            + AIRTABLE_TABLE
            + "?"
            + query,
            headers=headers,
        )

        # rate limited - sleep for 2-10 secs and retry (up to 100 times, ~10 minutes)
        # https://support.airtable.com/hc/en-us/articles/203313985-Public-REST-API
        # > 5 requests per second, per base
        if response.status_code == 429:
            if retry < 100:
                retry = retry + 1
                sleep(randint(1, 10))
                continue
            else:
                return await send_msg(
                    "Airtable: too many retries, aborting!", force_notify=True
                )
        retry = 0  # reset retry counter

        if response.status_code != 200:
            status_code = str(response.status_code)
            response_text = response.text or "empty response"
            message = (
                "Airtable blocklist integration responded with code "
                + status_code
                + ": "
                + response_text
            )
            return await send_msg(message, force_notify=False)

        data = response.json()

        if len(data["records"]) == 0:
            return print(
                "Airtable returned 0 records - make sure your configuration is correct"
            )

        skylinks = skylinks + [
            entry["fields"].get(AIRTABLE_FIELD, "") for entry in data["records"]
        ]
        skylinks = [
            skylink for skylink in skylinks if skylink
        ]  # filter empty skylinks, most likely empty rows

        offset = data.get("offset")

    print("Airtable returned total " + str(len(skylinks)) + " skylinks to block")

    skylinks_returned = skylinks
    skylinks = [
        skylink for skylink in skylinks if re.search("^[a-zA-Z0-9_-]{46}$", skylink)
    ]

    if len(skylinks_returned) != len(skylinks):
        invalid_skylinks = [
            str(skylink) for skylink in list(set(skylinks_returned) - set(skylinks))
        ]
        message = (
            str(len(invalid_skylinks))
            + " of the skylinks returned from Airtable are not valid"
        )
        await send_msg(message, file=("\n".join(invalid_skylinks)))

    apipassword = exec("docker exec sia cat /sia-data/apipassword")
    ipaddress = exec(
        "docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' sia"
    )

    print("Sending blocklist request to siad")
    response = requests.post(
        "http://" + ipaddress + ":9980/skynet/blocklist",
        auth=("", apipassword),
        headers={"user-agent": "Sia-Agent"},
        data=json.dumps({"add": skylinks}),
    )

    if response.status_code == 204:
        print("Siad blocklist successfully updated with provided skylink")
    else:
        status_code = str(response.status_code)
        response_text = response.text or "empty response"
        message = (
            "Siad blocklist endpoint responded with code "
            + status_code
            + ": "
            + response_text
        )
        return await send_msg(message, force_notify=False)

    # Remove from NGINX cache
    # NOTE:
    # If there are changes to how the NGINX cache is being cleared, the same
    # changes need to be applied to the /scripts/blocklist-skylink.sh script.
    print("Searching nginx cache for blocked files")
    cached_files_count = 0
    batch_size = 1000
    for i in range(0, len(skylinks), batch_size):
        cached_files_command = (
            "find /data/nginx/cache/ -type f | xargs -r grep -Els '^Skynet-Skylink: ("
            + "|".join(skylinks[i : i + batch_size])
            + ")'"
        )
        cached_files_count += int(
            exec(
                'docker exec nginx bash -c "'
                + cached_files_command
                + ' | xargs -r rm -v | wc -l"'
            )
        )

    if cached_files_count == 0:
        return print("No nginx cached files matching blocked skylinks were found")

    message = (
        "Purged " + str(cached_files_count) + " blocklisted files from nginx cache"
    )
    return await send_msg(message)


loop = asyncio.get_event_loop()
loop.run_until_complete(run_checks())

# --- BASH EQUIVALENT
# skylinks=$(curl "https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}?fields%5B%5D=${AIRTABLE_FIELD}" -H "Authorization: Bearer ${AIRTABLE_KEY}" | python3 -c "import sys, json; print('[\"' + '\",\"'.join([entry['fields']['Link'] for entry in json.load(sys.stdin)['records']]) + '\"]')")
# apipassword=$(docker exec sia cat /sia-data/apipassword)
# ipaddress=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' sia)
# curl -A "Sia-Agent" --user "":"${apipassword}" --data "{\"add\" : ${skylinks}}" "${ipaddress}:9980/skynet/blocklist"
