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


AIRTABLE_API_KEY = os.getenv("AIRTABLE_API_KEY")
AIRTABLE_BASE = os.getenv("AIRTABLE_BASE")
AIRTABLE_TABLE = os.getenv("AIRTABLE_TABLE")
AIRTABLE_FIELD = os.getenv("AIRTABLE_FIELD")

# Check environment variables are defined
for value in [AIRTABLE_API_KEY, AIRTABLE_BASE, AIRTABLE_TABLE, AIRTABLE_FIELD]:
    if not value:
        sys.exit("Configuration error: Missing AirTable environment variable.")


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
            skylink.strip() for skylink in skylinks if skylink
        ]  # filter empty skylinks, most likely empty rows, trim whitespace

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

    ipaddress = exec(
        "docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nginx"
    )

    print("Sending blocklist request to siad through nginx")
    response = requests.post(
        "http://" + ipaddress + ":8000/skynet/blocklist",
        data=json.dumps({"add": skylinks}),
    )

    print(json.dumps({"add": skylinks}))

    if response.status_code != 204:
        status_code = str(response.status_code)
        response_text = response.text or "empty response"
        message = (
            "Airtable blocklist request responded with code "
            + status_code
            + ": "
            + response_text
        )
        return await send_msg(message, force_notify=False)

    return await send_msg("Siad blocklist successfully updated with provided skylink")


loop = asyncio.get_event_loop()
loop.run_until_complete(run_checks())

# --- BASH EQUIVALENT
# skylinks=$(curl "https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}?fields%5B%5D=${AIRTABLE_FIELD}" -H "Authorization: Bearer ${AIRTABLE_KEY}" | python3 -c "import sys, json; print('[\"' + '\",\"'.join([entry['fields']['Link'] for entry in json.load(sys.stdin)['records']]) + '\"]')")
# ipaddress=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nginx)
# curl --data "{\"add\" : ${skylinks}}" "${ipaddress}:8000/skynet/blocklist"
