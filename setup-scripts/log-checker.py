#!/usr/bin/env python3

import discord, sys, traceback, io, os, asyncio
from bot_utils import setup, send_msg
from datetime import datetime, timedelta
from subprocess import Popen, PIPE

"""
log-checker checks the docker logs for siad.

Arguments:
    1. path to a .env file (default is none so env variables can already be
    preset)

    2. docker container name name (default: "sia")

    3. number of hours to look back in log (default: 1 hour)

"""

# The default check interval in hours.
DEFAULT_CHECK_INTERVAL = 1

bot_token = setup()
client = discord.Client()


async def exit_after(delay):
    await asyncio.sleep(delay)
    exit(0)


@client.event
async def on_ready():
    await run_checks()
    asyncio.create_task(exit_after(30))
    await client.close()


async def run_checks():
    print("Running Skynet portal log checks")
    try:
        await check_docker_logs()

    except: # catch all exceptions
        trace = traceback.format_exc()
        await send_msg(client, "```\n{}\n```".format(trace), force_notify=False)


# check_docker_logs checks the docker logs by filtering on the docker image name
async def check_docker_logs():
    print("\nChecking docker logs...")

    # Get the container name as an argument or use "sia" as default.
    container_name = "sia"
    if len(sys.argv) > 2:
        container_name = sys.argv[2]

    # Get the container id for siad.
    stream = os.popen('docker ps -q --filter name=^{}$'.format(container_name))
    image_id = stream.read().strip()

    # Get the number of hours to look back in the logs or use 1 as default.
    check_hours = DEFAULT_CHECK_INTERVAL
    if len(sys.argv) > 3:
        check_hours = int(sys.argv[3])

    now = datetime.now()
    time = now - timedelta(hours=check_hours)
    time_string = "{}h".format(check_hours)

    # Read the logs.
    proc = Popen(["docker", "logs", "--since", time_string, image_id], stdin=PIPE, stdout=PIPE, stderr=PIPE, text=True)
    std_out, std_err = proc.communicate()

    if len(std_err) > 0:
        await send_msg(client, "Error reading docker logs output: {}".format(std_err), force_notify=True)
        return

    # If there are any critical errors. upload the whole log file.
    if "Critical" in std_out or "panic" in std_out:
        upload_name = "{}-{}-{}-{}-{}:{}:{}.log".format(container_name, time.year, time.month, time.day, time.hour, time.minute, time.second)
        await send_msg(client, "Critical error found in log!", file=discord.File(io.BytesIO(std_out.encode()), filename=upload_name), force_notify=True)
        return

    # No critical errors, return a heartbeat type message
    pretty_before = time.strftime("%I:%M%p")
    pretty_now = now.strftime("%I:%M%p")
    await send_msg(client, "No critical warnings in log from `{}` to `{}`".format(pretty_before, pretty_now))

client.run(bot_token)
