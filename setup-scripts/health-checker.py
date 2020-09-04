#!/usr/bin/env python3

import discord, requests, traceback, asyncio, os, sys, json, io
from datetime import datetime, timedelta
from bot_utils import setup, send_msg, siad, sc_precision

"""
health-checker reads the /health-check endpoint of the portal and dispatches
messages to a Discord channel.
"""

# The default check interval in hours.
DEFAULT_CHECK_INTERVAL = 1

bot_token = setup()
client = discord.Client()


# get_hostname reads the HOSTNAME from the .env file passed as first argument
# to the script
async def get_hostname():
    if len(sys.argv) > 1:
        env_file = sys.argv[1]
    with open(env_file, 'r') as file:
        for line in file.read().split('\n'):
            pair = line.split("=")
            if pair[0] == "HOSTNAME":
                return pair[1]
    await send_msg(client, "HOSTNAME not found, cannot check health status", force_notify=True)
    os.exit(0)


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
    except: # catch all exceptions
        trace = traceback.format_exc()
        print("[DEBUG] run_checks() failed.")
        if len(trace) < 1900:
            await send_msg(client, "```\n{}\n```".format(trace), force_notify=False)
        else:
            await send_msg(client, "Failed to run the checks!", file=discord.File(io.BytesIO(trace), filename="failed_checks.log"), force_notify=True)


# check_health checks /health-check endpoint and reports recent issues
async def check_health():
    print("\nChecking wallet/funds health...")

    try:
        hostname = await get_hostname()
        res = requests.get("http://"+hostname+"/health-check")
    except: # catch all exceptions
        trace = traceback.format_exc()
        print("[DEBUG] check_health() failed.")
        if len(trace) < 1900:
            await send_msg(client, "```\n{}\n```".format(trace), force_notify=False)
        else:
            await send_msg(client, "Failed to run the checks!", file=discord.File(io.BytesIO(trace), filename="failed_checks.log"), force_notify=True)
        return

    # Get the number of hours to look back in the logs or use 1 as default.
    check_hours = DEFAULT_CHECK_INTERVAL
    if len(sys.argv) > 3:
        check_hours = int(sys.argv[3])

    # Check the health records.
    failed_checks = []
    passed_checks_counter = 0
    time_limit = datetime.now() - timedelta(hours=check_hours)
    for rec in res.json():
        time = datetime.strptime(rec['date'], '%Y-%m-%dT%H:%M:%S.%fZ')
        if time < time_limit:
            continue
        for check in rec['checks']:
            if check['up'] == False:
                # We append the entire record, so we can get the full context.
                failed_checks.append(rec)
                break
        passed_checks_counter += 1

    if len(failed_checks) > 0:
        await send_msg(client, "Found {} failed checks over the last {} hours!".format(len(failed_checks), check_hours), file=discord.File(io.BytesIO(json.dumps(failed_checks, indent=2).encode()), filename="failed_checks.log"), force_notify=True)
        return

    # Send an informational heartbeat if all checks passed.
    await send_msg(client, "Health checks passed: {}\n".format(passed_checks_counter))


client.run(bot_token)
