#!/usr/bin/env python3

import discord, sys, traceback, io, os, asyncio
from bot_utils import setup, send_msg, upload_to_skynet
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

# Get the container name as an argument or use "sia" as default.
CONTAINER_NAME = "sia"
if len(sys.argv) > 2:
    CONTAINER_NAME = sys.argv[2]

# Get the number of hours to look back in the logs or use 1 as default.
CHECK_HOURS = 1
if len(sys.argv) > 3:
    CHECK_HOURS = int(sys.argv[3])

# Discord messages have a limit on their length set at 2000 bytes. We use
# a lower limit in order to leave some space for additional message text.
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
    print("Running Skynet portal log checks")
    try:
        await check_docker_logs()
    except: # catch all exceptions
        trace = traceback.format_exc()
        await send_msg(client, "```\n{}\n```".format(trace), force_notify=False)


# check_docker_logs checks the docker logs by filtering on the docker image name
async def check_docker_logs():
    print("\nChecking docker logs...")

    now = datetime.now()
    time = now - timedelta(hours=CHECK_HOURS)
    time_string = "{}h".format(CHECK_HOURS)

    # Read the logs.
    print("[DEBUG] Will run `docker logs --since {} {}`".format(time_string, CONTAINER_NAME))
    proc = Popen(["docker", "logs", "--since", time_string, CONTAINER_NAME], stdin=PIPE, stdout=PIPE, stderr=PIPE, text=True)
    std_out, std_err = proc.communicate()

    if len(std_err) > 0:
        # Trim the error log to under 1MB.
        one_mb = 1024*1024
        if len(std_err) > one_mb:
            pos = std_err.find("\n", -one_mb)
            std_err = std_err[pos+1:]
            return await send_msg(client, "Error(s) found in log!", file=io.BytesIO(std_out.encode()), force_notify=False)

    # If there are any critical or severe errors. upload the whole log file.
    if 'Critical' in std_out or 'Severe' in std_out or 'panic' in std_out:
        return await send_msg(client, "Critical or Severe error found in log!", file=io.BytesIO(std_out.encode()), force_notify=True)

    # No critical or severe errors, return a heartbeat type message
    pretty_before = time.strftime("%I:%M%p")
    pretty_now = now.strftime("%I:%M%p")
    await send_msg(client, "No critical or severe warnings in log from `{}` to `{}`".format(pretty_before, pretty_now))


client.run(bot_token)
