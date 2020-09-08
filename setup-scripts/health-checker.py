#!/usr/bin/env python3

import asyncio
import io
import json
import os
import re
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

# Get the number of hours to look back in the logs or use 1 as default.
CHECK_HOURS = 1
if len(sys.argv) > 3:
    CHECK_HOURS = int(sys.argv[3])

# Discord messages have a limit on their length set at 2000 bytes. We use
# a lower limit in order to leave some space for additional message text.
DISCORD_MAX_MESSAGE_LENGTH = 1900

GB = 1 << 20 # converts from KiB to GiB
# We are going to issue Discord warnings if the free space on a server falls
# under this threshold.
FREE_DISK_SPACE_THRESHOLD = 50 * GB  # 50 GiB


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
        await check_load_average()
        await check_disk()
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


# check_load_average monitors the system's load average value and issues a
# warning message if it exceeds 10.
async def check_load_average():
    uptime_string = os.popen("uptime").read().strip()
    if sys.platform == "Darwin":
        pattern = "^.*load averages: \d*\.\d* \d*\.\d* (\d*\.\d*)$"
    else:
        pattern = "^.*load average: \d*\.\d*, \d*\.\d*, (\d*\.\d*)$"
    load_av = re.match(pattern, uptime_string).group(1)
    if float(load_av) > 10:
        await send_msg(client, "High system load detected: `uptime: {}`".format(uptime_string), force_notify=True)


# check_disk checks the amount of free space on the /home partition and issues
# a warning message if it's under FREE_DISK_SPACE_THRESHOLD GB.
async def check_disk():
    # We check free disk space in 1024 byte units, so it's easy to convert.
    df = os.popen("df --block-size=1024").read().strip()
    volumes = {}
    for line in df.split("\n")[1:]:
        fields = list(filter(None, line.split(" ")))
        # -1 is "mounted on", 3 is "available space"
        volumes[fields[-1]] = fields[3]
    # List of mount point, longest to shortest. We'll use that to find the best
    # fit for the volume we want to check.
    mount_points = sorted(volumes.keys(), key=len, reverse=True)
    wd = os.popen("pwd").read().strip()
    vol = ""
    for mp in mount_points:
        if wd.startswith(mp):
            vol = mp
            break
    if vol == "":
        msg = "Failed to check free disk space! Didn't find a suitable mount point to check.\ndf output:\n{}".format(df)
        await send_msg(client, msg)
        return
    if int(volumes[vol]) < FREE_DISK_SPACE_THRESHOLD:
        free_space_gb = "{:.2f}".format(int(volumes[vol])/ GB)
        await send_msg(client, "WARNING! Low disk space: {}GiB".format(free_space_gb), force_notify=True)
        return


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

    # Check the health records.
    failed_records = []
    failed_checks = 0
    failed_critical = 0
    passed_checks_counter = 0
    time_limit = datetime.now() - timedelta(hours=CHECK_HOURS)
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
                                                                                        CHECK_HOURS)
        file = discord.File(io.BytesIO(json.dumps(failed_records, indent=2).encode()), filename="failed_checks.log")
        notifyTeam = failed_critical > 0
        await send_msg(client, message, file=file, force_notify=notifyTeam)
        return

    # Send an informational heartbeat if all checks passed.
    await send_msg(client, "Health checks passed: {}\n".format(passed_checks_counter))


client.run(bot_token)
