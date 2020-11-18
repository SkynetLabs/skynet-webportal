#!/usr/bin/env python3

import asyncio, json, os, re, sys, traceback, discord, requests, time
from datetime import datetime, timedelta
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

GB = 1 << 30  # 1 GiB in bytes

# Free disk space threshold used for notices and shutting down siad.
FREE_DISK_SPACE_THRESHOLD = 50 * GB
FREE_DISK_SPACE_THRESHOLD_CRITICAL = 20 * GB

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
        await check_alerts()
    except:
        trace = traceback.format_exc()
        print("[DEBUG] run_checks() failed.")
        await send_msg(
            client,
            "Failed to run the portal health checks!",
            file=trace,
            force_notify=True,
        )


# check_load_average monitors the system load average value and issues a
# warning message if it exceeds 10.
async def check_load_average():
    uptime_string = os.popen("uptime").read().strip()
    if sys.platform == "Darwin":
        pattern = "^.*load averages: \d*\.\d* \d*\.\d* (\d*\.\d*)$"
    else:
        pattern = "^.*load average: \d*\.\d*, \d*\.\d*, (\d*\.\d*)$"
    load_av = re.match(pattern, uptime_string).group(1)
    if float(load_av) > 10:
        message = "High system load detected in uptime output: {}".format(uptime_string)
        await send_msg(client, message, force_notify=True)


# check_disk checks the amount of free space on the /home partition and issues
# a warning message if it's under FREE_DISK_SPACE_THRESHOLD GB.
async def check_disk():
    # We check free disk space in 1024 byte units, so it's easy to convert.
    df = os.popen("df --block-size=1024").read().strip()
    volumes = {}
    for line in df.split("\n")[1:]:
        fields = list(filter(None, line.split(" ")))
        # -1 is "mounted on", 3 is "available space" in KiB which we want in bytes
        volumes[fields[-1]] = int(fields[3]) * 1024
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
        message = "Failed to check free disk space! Didn't find a suitable mount point to check."
        return await send_msg(client, message, file=df)

    # if we've reached a critical free disk space threshold we need to send proper notice 
    # and shut down sia container so it doesn't get corrupted
    if int(volumes[vol]) < FREE_DISK_SPACE_THRESHOLD_CRITICAL:
        free_space_gb = "{:.2f}".format(int(volumes[vol]) / GB)
        message = "CRITICAL! Very low disk space: {}GiB, **siad stopped**!".format(free_space_gb)
        inspect = os.popen("docker inspect sia").read().strip()
        inspect_json = json.loads(inspect)
        if inspect_json[0]["State"]["Running"] == True:
            os.popen("docker exec health-check cli/disable") # mark portal as unhealthy
            time.sleep(300) # wait 5 minutes to propagate dns changes
            os.popen("docker stop sia") # stop sia container
        return await send_msg(client, message, force_notify=True)

    # if we're reached a free disk space threshold we need to send proper notice
    if int(volumes[vol]) < FREE_DISK_SPACE_THRESHOLD:
        free_space_gb = "{:.2f}".format(int(volumes[vol]) / GB)
        message = "WARNING! Low disk space: {}GiB".format(free_space_gb)
        return await send_msg(client, message, force_notify=True)


# check_health checks /health-check endpoint and reports recent issues
async def check_health():
    print("\nChecking portal health status...")

    try:
        res_check = requests.get("http://localhost/health-check", verify=False)
        json_check = res_check.json()
        json_critical = requests.get(
            "http://localhost/health-check/critical", verify=False
        ).json()
        json_verbose = requests.get(
            "http://localhost/health-check/verbose", verify=False
        ).json()
    except:
        trace = traceback.format_exc()
        print("[DEBUG] check_health() failed.")
        return await send_msg(
            client, "Failed to run the checks!", file=trace, force_notify=True
        )

    critical_checks_total = 0
    critical_checks_failed = 0

    verbose_checks_total = 0
    verbose_checks_failed = 0

    failed_records = []
    failed_records_file = None

    time_limit = datetime.utcnow() - timedelta(hours=CHECK_HOURS)

    for critical in json_critical:
        time = datetime.strptime(critical["date"], "%Y-%m-%dT%H:%M:%S.%fZ")
        if time < time_limit:
            continue
        bad = False
        for check in critical["checks"]:
            critical_checks_total += 1
            if check["up"] == False:
                critical_checks_failed += 1
                bad = True
        if bad:
            failed_records.append(critical)

    for verbose in json_verbose:
        time = datetime.strptime(verbose["date"], "%Y-%m-%dT%H:%M:%S.%fZ")
        if time < time_limit:
            continue
        bad = False
        for check in verbose["checks"]:
            verbose_checks_total += 1
            if check["up"] == False:
                verbose_checks_failed += 1
                bad = True
        if bad:
            failed_records.append(verbose)

    ################################################################################
    ################ create a message
    ################################################################################

    message = ""
    force_notify = False

    if json_check["disabled"]:
        message += "__Portal manually disabled!__ "
        force_notify = True
    elif res_check.status_code is not requests.codes["ok"]:
        message += "__Portal down!!!__ "
        force_notify = True

    if critical_checks_failed:
        message += "{}/{} CRITICAL checks failed over the last {} hours! ".format(
            critical_checks_failed, critical_checks_total, CHECK_HOURS
        )
        force_notify = True
    else:
        message += "All {} critical checks passed. ".format(critical_checks_total)

    if verbose_checks_failed:
        message += "{}/{} verbose checks failed over the last {} hours! ".format(
            verbose_checks_failed, verbose_checks_total, CHECK_HOURS
        )
        force_notify = True
    else:
        message += "All {} verbose checks passed. ".format(verbose_checks_total)

    if len(failed_records):
        failed_records_file = json.dumps(failed_records, indent=2)

    # send a message if we force notification, there is a failures dump or just once daily (heartbeat) on 1 AM
    if force_notify or failed_records_file or datetime.utcnow().hour == 1:
        return await send_msg(
            client, message, file=failed_records_file, force_notify=force_notify
        )

# check_alerts checks the alerts returned from siad's daemon/alerts API
async def check_alerts():
    print("\nChecking portal siad alerts...")

    try:
        alerts_res = requests.get("http://localhost:9980/daemon/alerts",headers={"User-Agent":"Sia-Agent"}, verify=False)
        alerts_json = alerts_res.json()
    except:
        trace = traceback.format_exc()
        print("[DEBUG] check_alerts() failed.")
        return await send_msg(
            client, "Failed to run the checks!", file=trace, force_notify=True
        )

    alerts =  alerts_json['alerts']
    critical_alerts =  alerts_json['criticalalerts']
    error_alerts =  alerts_json['erroralerts']
    warning_alerts =  alerts_json['warningalerts']
    siafile_alerts = []
    siafile_alert_message = "The SiaFile mentioned in the 'Cause' is below 75% redundancy"

    # Check for siafile alerts in alerts. This is so that the alert severity
    # can change and this doesn't need to be updated
    for alert in alerts:
        if alert['msg'] == siafile_alert_message:
            siafile_alerts.append(alert)


    ################################################################################
    ################ create a message
    ################################################################################

    message = ""
    force_notify = False

    if len(critical_alerts) > 0:
        message += "{} CRITICAL Alerts found! ".format(len(critical_alerts))
        force_notify = True
    if len(error_alerts) > 0:
        message += "{} Error Alerts found! ".format(len(error_alerts))
        force_notify = True
    
    message += "{} Warning Alerts found. ".format(len(warning_alerts))
    message += "{} SiaFiles with bad health found. ".format(len(siafile_alerts))

    alerts_file = None 
    if len(alerts) > 0:
        alerts_file = json.dumps(alerts, indent=2)

    # send a message if we force notification, or just once daily (heartbeat) on 1 AM
    if force_notify or datetime.utcnow().hour == 1:
        return await send_msg(
            client, message, file=alerts_file, force_notify=force_notify
        )


client.run(bot_token)
