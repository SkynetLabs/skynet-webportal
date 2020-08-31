#!/usr/bin/env python3

import discord, sys, traceback, io, os, asyncio, re
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


# exit_after kills the script if it hasn't exited on its own after `delay` seconds
async def exit_after(delay):
    await asyncio.sleep(delay)
    sys.exit(0)


@client.event
async def on_ready():
    await run_checks()
    asyncio.create_task(exit_after(3))


async def run_checks():
    print("Running Skynet portal log checks")
    try:
        await check_load_average()
        await check_docker_logs()

    except: # catch all exceptions
        trace = traceback.format_exc()
        await send_msg(client, "```\n{}\n```".format(trace), force_notify=False)


# check_load_average monitors the system's load average value and issues a
# warning message if it exceeds 10.
async def check_load_average():
    uptime_string = os.popen("uptime").read().strip()
    # pattern = ""
    if sys.platform == "Darwin":
        pattern = "^.*load averages: \d*\.\d* \d*\.\d* (\d*\.\d*)$"
    else:
        pattern = "^.*load average: \d*\.\d*, \d*\.\d*, (\d*\.\d*)$"
    load_av = re.match(pattern, uptime_string).group(1)
    if float(load_av) > 10:
        await send_msg(client, "High system load detected: `uptime: {}`".format(uptime_string), force_notify=True)

# check_docker_logs checks the docker logs by filtering on the docker image name
async def check_docker_logs():
    print("\nChecking docker logs...")

    # Get the container name as an argument or use "sia" as default.
    container_name = "sia"
    if len(sys.argv) > 2:
        container_name = sys.argv[2]

    # Get the number of hours to look back in the logs or use 1 as default.
    check_hours = DEFAULT_CHECK_INTERVAL
    if len(sys.argv) > 3:
        check_hours = int(sys.argv[3])

    now = datetime.now()
    time = now - timedelta(hours=check_hours)
    time_string = "{}h".format(check_hours)

    # Read the logs.
    print("[DEBUG] Will run `docker logs --since {} {}`".format(time_string, container_name))
    proc = Popen(["docker", "logs", "--since", time_string, container_name], stdin=PIPE, stdout=PIPE, stderr=PIPE, text=True)
    std_out, std_err = proc.communicate()

    if len(std_err) > 0:
        # Trim the error log to under 1MB.
        one_mb = 1024*1024
        if len(std_err) > one_mb:
            pos = std_err.find("\n", -one_mb)
            std_err = std_err[pos+1:]
        upload_name = "{}-{}-{}-{}-{}:{}:{}_err.log".format(container_name, time.year, time.month, time.day, time.hour, time.minute, time.second)
        await send_msg(client, "Error(s) found in log!", file=discord.File(io.BytesIO(std_err.encode()), filename=upload_name), force_notify=True)
        # Send at most 1900 characters of logs, rounded down to the nearest new line.
        # This is a limitation in the size of Discord messages - they can be at most
        # 2000 characters long (and we send some extra characters before the error log).
        if len(std_err) > 1900:
            pos = std_err.find("\n", -1900)
            std_err = std_err[pos+1:]
        await send_msg(client, "Error(s) preview:\n{}".format(std_err), force_notify=True)
        return

    # If there are any critical errors. upload the whole log file.
    if 'Critical' in std_out or 'panic' in std_out:
        upload_name = "{}-{}-{}-{}-{}:{}:{}.log".format(container_name, time.year, time.month, time.day, time.hour, time.minute, time.second)
        await send_msg(client, "Critical error found in log!", file=discord.File(io.BytesIO(std_out.encode()), filename=upload_name), force_notify=True)
        return

    # No critical errors, return a heartbeat type message
    pretty_before = time.strftime("%I:%M%p")
    pretty_now = now.strftime("%I:%M%p")
    await send_msg(client, "No critical warnings in log from `{}` to `{}`".format(pretty_before, pretty_now))


client.run(bot_token)
