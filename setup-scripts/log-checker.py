#!/usr/bin/env python3

import discord, sys, traceback, io
from bot_utils import setup, send_msg, sc_precision

from datetime import datetime, timedelta
from subprocess import Popen, PIPE

"""
log-checker checks journal logs for siad.

Arguments:
    1. path to a .env file (default is none so env variables can already be
    preset)

"""

DEFAULT_CHECK_INTERVAL = timedelta(hours=1)

bot_token = setup()
client = discord.Client()

@client.event
async def on_ready():
    await run_checks()
    await client.close()


async def run_checks():
    print("Running Skynet portal log checks")
    try:
        await check_journal()

    except: # catch all exceptions
        trace = traceback.format_exc()
        await send_msg(client, "```\n{}\n```".format(trace), force_notify=False)


# check_journal checks the journal
async def check_journal():
    print("\nChecking journal...")

    now = datetime.now()
    time = now - DEFAULT_CHECK_INTERVAL
    time_string = "{}-{}-{} {}:{}:{}".format(time.year, time.month, time.day, time.hour, time.minute, time.second)

    # Get the systemd service name as an argument, or use "siad" as default.
    service_name = "siad"
    if len(sys.argv) > 2:
        service_name = sys.argv[2]

    # Open the journal.
    proc = Popen(["journalctl", "--user-unit", service_name, "--since", time_string], stdin=PIPE, stdout=PIPE, stderr=PIPE, text=True)
    std_out, std_err = proc.communicate()

    if len(std_err) > 0:
        await send_msg(client, "Error reading journalctl output: {}".format(std_err), force_notify=True)
        return

    # If there are any critical errors. upload the whole log file.
    if "Critical" in std_out:
        upload_name = "{}-{}-{}-{}-{}:{}:{}.log".format(service_name, time.year, time.month, time.day, time.hour, time.minute, time.second)
        await send_msg(client, "Critical error found in log!", file=discord.File(io.BytesIO(std_out.encode()), filename=upload_name), force_notify=True)
        return

    # No critical errors, return a heartbeat type message.
    await send_msg(client, "No critical warnings in log (size of log portion checked: {})".format(len(std_out)))


client.run(bot_token)
