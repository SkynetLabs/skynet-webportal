#!/usr/bin/env python3

import asyncio
import io
import json
import os
import sys
import traceback
from datetime import datetime, timedelta

import discord
import requests
from bot_utils import setup, send_msg

"""
health-checker reads the /health-check endpoint of the portal and dispatches
messages to a Discord channel.
"""

# The default check interval in hours.
DEFAULT_CHECK_INTERVAL = 1
DISCORD_MAX_MESSAGE_LENGTH = 1900

bot_token = setup()
client = discord.Client()


# exit_after kills the script if it hasn't exited on its own after `delay` seconds
async def exit_after(delay):
    await asyncio.sleep(delay)
    os._exit(0)


@client.event
async def on_ready():
    await run_checks()
    asyncio.create_task(exit_after(3))


async def run_checks():
    print("Running Skynet portal health checks")
    try:
        await check_health()
    except:
        trace = traceback.format_exc()
        print("[DEBUG] run_checks() failed.")
        if len(trace) < DISCORD_MAX_MESSAGE_LENGTH:
            await send_msg(client, "```\n{}\n```".format(trace), force_notify=False)
        else:
            await send_msg(client, "Failed to run the portal health checks!",
                           file=discord.File(io.BytesIO(trace.encode()), filename="failed_checks.log"),
                           force_notify=True)


# check_health checks /health-check endpoint and reports recent issues
async def check_health():
    print("\nChecking portal health status...")

    try:
        res = requests.get("http://localhost/health-check", verify=False)
    except:
        trace = traceback.format_exc()
        print("[DEBUG] check_health() failed.")
        if len(trace) < DISCORD_MAX_MESSAGE_LENGTH:
            await send_msg(client, "```\n{}\n```".format(trace), force_notify=False)
        else:
            await send_msg(client, "Failed to run the checks!",
                           file=discord.File(io.BytesIO(trace.encode()), filename="failed_checks.log"),
                           force_notify=True)
        return

    # Get the number of hours to look back in the logs or use 1 as default.
    check_hours = DEFAULT_CHECK_INTERVAL
    if len(sys.argv) > 3:
        check_hours = int(sys.argv[3])

    # Check the health records.
    failed_records = []
    failed_checks = 0
    failed_critical = 0
    passed_checks_counter = 0
    time_limit = datetime.now() - timedelta(hours=check_hours)
    for rec in res.json():
        time = datetime.strptime(rec['date'], '%Y-%m-%dT%H:%M:%S.%fZ')
        if time < time_limit:
            continue
        bad = False
        for check in rec['checks']:
            if check['up'] == False:
                bad = True
                failed_checks += 1
                if check['critical']:
                    failed_critical += 1
        if bad:
            # We append the entire record, so we can get the full context.
            failed_records.append(rec)
        passed_checks_counter += 1

    if len(failed_records) > 0:
        message = "Found {} failed checks ({} critical) over the last {} hours!".format(failed_checks, failed_critical,
                                                                                        check_hours)
        await send_msg(client, message, file=discord.File(io.BytesIO(json.dumps(failed_records, indent=2).encode()),
                                                          filename="failed_checks.log"), force_notify=True)
        return

    # Send an informational heartbeat if all checks passed.
    await send_msg(client, "Health checks passed: {}\n".format(passed_checks_counter))


client.run(bot_token)
