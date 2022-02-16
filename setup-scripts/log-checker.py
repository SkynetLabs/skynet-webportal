#!/usr/bin/env python3

from bot_utils import setup, send_msg
from subprocess import Popen, PIPE

import sys
import traceback
import asyncio

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

setup()


async def run_checks():
    print("Running Skynet portal log checks")
    try:
        await check_docker_logs()
    except:  # catch all exceptions
        trace = traceback.format_exc()
        await send_msg("```\n{}\n```".format(trace), force_notify=False)


# check_docker_logs checks the docker logs by filtering on the docker image name
async def check_docker_logs():
    print("\nChecking docker logs...")

    since_string = "{}h".format(CHECK_HOURS)

    # Read the logs.
    print(
        "[DEBUG] Will run `docker logs --since {} {}`".format(
            since_string, CONTAINER_NAME
        )
    )
    proc = Popen(
        ["docker", "logs", "--since", since_string, CONTAINER_NAME],
        stdin=PIPE,
        stdout=PIPE,
        stderr=PIPE,
        text=True,
    )
    std_out, std_err = proc.communicate()

    if len(std_err) > 0:
        # Trim the error log to under 1MB.
        one_mb = 1024 * 1024
        if len(std_err) > one_mb:
            pos = std_err.find("\n", -one_mb)
            std_err = std_err[pos + 1 :]
            return await send_msg(
                "Error(s) found in log!", file=std_err, force_notify=True
            )

    # If there are any critical or severe errors. upload the whole log file.
    if "Critical" in std_out or "Severe" in std_out or "panic" in std_out:
        return await send_msg(
            "Critical or Severe error found in log!",
            file=std_out,
            force_notify=True,
        )

    # No critical or severe errors, return a heartbeat type message
    return await send_msg(
        "No critical or severe warnings in log since {} hours".format(CHECK_HOURS),
    )


loop = asyncio.get_event_loop()
loop.run_until_complete(run_checks())
