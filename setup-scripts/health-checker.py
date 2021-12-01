#!/usr/bin/env python3

import asyncio
import json
import os
import re
import sys
import time
import traceback
from datetime import datetime, timedelta

import requests
from bot_utils import setup, send_msg, get_docker_container_ip

"""
health-checker reads the /health-check endpoint of the portal and dispatches
messages to a Discord channel.
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

GB = 1 << 30  # 1 GiB in bytes

# Free disk space threshold used for notices and shutting down siad.
FREE_DISK_SPACE_THRESHOLD = 100 * GB
FREE_DISK_SPACE_THRESHOLD_CRITICAL = 60 * GB

# Disk usage dump log file (relative to this .py script).
DISK_USAGE_DUMP_LOG = "../../devops/disk-monitor/disk-usage-dump.log"

setup()


async def run_checks():
    print("Running Skynet portal health checks")
    try:
        await check_load_average()
        await check_disk()
        await check_health()
        await check_alerts()
        await check_portal_size()
    except:
        trace = traceback.format_exc()
        print("[DEBUG] run_checks() failed.")
        await send_msg(
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
        # Disabling pings until we have metrics solution and process to better
        # address
        await send_msg(message, force_notify=False)


# check_disk checks the amount of free space on the /home partition and issues
# a warning message if it's under FREE_DISK_SPACE_THRESHOLD GB.
async def check_disk():
    # We check free disk space in 1024 byte units, so it's easy to convert.
    df = os.popen("df --block-size=1024").read().strip()
    volumes = {}
    # Iterate over the output, ignoring the header line
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
        return await send_msg(message, file=df)

    # if we've reached a critical free disk space threshold we need to send proper notice
    # and shut down sia container so it doesn't get corrupted
    if int(volumes[vol]) < FREE_DISK_SPACE_THRESHOLD_CRITICAL:
        free_space_gb = "{:.2f}".format(int(volumes[vol]) / GB)
        message = "CRITICAL! Very low disk space: {}GiB, **siad stopped**!".format(
            free_space_gb
        )

        # dump disk usage
        script_dir = os.path.dirname(os.path.realpath(sys.argv[0]))
        os.popen(script_dir + "/disk-usage-dump.sh " + script_dir + "/" + DISK_USAGE_DUMP_LOG)

        inspect = os.popen("docker inspect sia").read().strip()
        inspect_json = json.loads(inspect)
        if inspect_json[0]["State"]["Running"] is True:
            # mark portal as unhealthy
            os.popen("docker exec health-check cli disable 'critical free disk space'")
            time.sleep(300)  # wait 5 minutes to propagate dns changes
            os.popen("docker stop sia")  # stop sia container
        return await send_msg(message, force_notify=True)

    # if we're reached a free disk space threshold we need to send proper notice
    if int(volumes[vol]) < FREE_DISK_SPACE_THRESHOLD:
        free_space_gb = "{:.2f}".format(int(volumes[vol]) / GB)
        message = "WARNING! Low disk space: {}GiB".format(free_space_gb)
        return await send_msg(message, force_notify=True)


# check_health checks /health-check endpoint and reports recent issues
async def check_health():
    print("\nChecking portal health status...")

    try:
        endpoint = "http://{}:{}".format(get_docker_container_ip("health-check"), 3100)
    except:
        message = "Could not get health check service endpoint api!"
        return await send_msg(message, force_notify=True)

    try:
        res = requests.get(endpoint + "/health-check", verify=False)
        json_check = res.json()

        server_failure = (
            res.status_code is not requests.codes["ok"]
            and json_check["disabled"] is False
        )

        res = requests.get(endpoint + "/health-check/critical", verify=False)
        json_critical = res.json()

        res = requests.get(endpoint + "/health-check/extended", verify=False)
        json_extended = res.json()
    except:
        message = traceback.format_exc()
        message += "\n" + "Request url: " + res.url if res.url else "-"
        message += (
            "\n" + "Status code: " + str(res.status_code) if res.status_code else "-"
        )
        message += "\n" + "Response body: " + res.text if res.text else "-"
        return await send_msg(
            "Failed to run health checks!", file=message, force_notify=True
        )

    critical_checks_total = 0
    critical_checks_failed = 0

    extended_checks_total = 0
    extended_checks_failed = 0

    failed_records = []
    failed_records_file = None

    time_limit = datetime.utcnow().replace(
        minute=0, second=0, microsecond=0
    ) - timedelta(hours=CHECK_HOURS)

    for critical in json_critical:
        time = datetime.strptime(critical["date"], "%Y-%m-%dT%H:%M:%S.%fZ")
        if time < time_limit:
            continue
        bad = False
        for check in critical["checks"]:
            critical_checks_total += 1
            if check["up"] is False:
                critical_checks_failed += 1
                bad = True
        if bad:
            critical["checks"] = [
                check for check in critical["checks"] if check["up"] is False
            ]
            failed_records.append(critical)

    for extended in json_extended:
        time = datetime.strptime(extended["date"], "%Y-%m-%dT%H:%M:%S.%fZ")
        if time < time_limit:
            continue
        bad = False
        for check in extended["checks"]:
            extended_checks_total += 1
            if check["up"] is False:
                extended_checks_failed += 1
                bad = True
        if bad:
            extended["checks"] = [
                check for check in extended["checks"] if check["up"] is False
            ]
            failed_records.append(extended)

    ################################################################################
    # create a message
    ################################################################################

    message = ""
    force_notify = False

    if server_failure:
        message += "__Server down!!!__ "
        force_notify = True

    if critical_checks_failed:
        message += "{}/{} CRITICAL checks failed over the last {} hours! ".format(
            critical_checks_failed, critical_checks_total, CHECK_HOURS
        )
        force_notify = True
    else:
        message += "All {} critical checks passed. ".format(critical_checks_total)

    if extended_checks_failed:
        message += "{}/{} extended checks failed over the last {} hours! ".format(
            extended_checks_failed, extended_checks_total, CHECK_HOURS
        )
        force_notify = True
    else:
        message += "All {} extended checks passed. ".format(extended_checks_total)

    if len(failed_records):
        failed_records_file = json.dumps(failed_records, indent=2)

    # send a message if we force notification, there is a failures dump or just once daily (heartbeat) on 1 AM
    if force_notify or failed_records_file or datetime.utcnow().hour == 1:
        return await send_msg(
            message, file=failed_records_file, force_notify=force_notify
        )


# contains_string is a simple helper to check if a string contains a string.
# This is faster and easier than regex for word comparisons
def contains_string(string_to_check, string_to_find):
    return string_to_find in string_to_check


# check_alerts checks the alerts returned from siad's daemon/alerts API
async def check_alerts():
    print("\nChecking portal siad alerts...")

    ################################################################################
    # parse siac
    ################################################################################

    # Alerts
    # Execute 'siac alerts' and read the response
    cmd_string = "docker exec {} siac alerts".format(CONTAINER_NAME)
    siac_alert_output = os.popen(cmd_string).read().strip()

    # Initialize variables
    num_critical_alerts = 0
    num_error_alerts = 0
    num_warning_alerts = 0
    num_siafile_alerts = 0
    siafile_alerts = []

    # Pattern strings to search for
    critical = "Severity: critical"
    error = "Severity: error"
    warning = "Severity: warning"
    health_of = "has a health of"
    siafile_alert_message = (
        "The SiaFile mentioned in the 'Cause' is below 75% redundancy"
    )

    # Split the output by line and check for type of alert and siafile alerts
    for line in siac_alert_output.split("\n"):
        # Check for the type of alert
        if contains_string(line, critical):
            num_critical_alerts += 1
        if contains_string(line, error):
            num_error_alerts += 1
        if contains_string(line, warning):
            num_warning_alerts += 1

        # Check for siafile alerts in alerts. This is so that the alert
        # severity can change and this doesn't need to be updated
        if contains_string(line, siafile_alert_message):
            num_siafile_alerts += 1
        if contains_string(line, health_of):
            siafile_alerts.append(line)

    # Repair Size
    # Execute 'siac renter' and read the response
    cmd_string = "docker exec {} siac renter".format(CONTAINER_NAME)
    siac_renter_output = os.popen(cmd_string).read().strip()

    # Initialize variables
    repair_remaining = ""

    # Pattern strings to search for
    repair_str = "Repair Data Remaining"

    # Split the output by line and check for the repair remaining
    for line in siac_renter_output.split("\n"):
        # Check for the type of alert
        if contains_string(line, repair_str):
            repair_remaining = line.split(":")[1].strip()

    ################################################################################
    # create a message
    ################################################################################

    message = ""
    force_notify = False

    if num_critical_alerts > 0:
        message += "{} CRITICAL Alerts found! ".format(num_critical_alerts)
        force_notify = True
    if num_error_alerts > 0:
        message += "{} Error Alerts found! ".format(num_error_alerts)

    # Subtract out the siafile alerts from the warning alerts since we announce
    # them separately
    num_warning_alerts -= num_siafile_alerts
    message += "{} Warning Alerts found. ".format(num_warning_alerts)
    message += "{} SiaFiles with bad health found. ".format(num_siafile_alerts)

    # Add repair size
    message += "{} of repair remaining. ".format(repair_remaining)

    # send a message if we force notification, or just once daily (heartbeat)
    # on 1 AM
    if force_notify or datetime.utcnow().hour == 1:
        return await send_msg(
            message, file=siac_alert_output, force_notify=force_notify
        )


# check_portal_size checks the number of files that the portal is managing to
# determine if it is time to rotate it out
async def check_portal_size():
    print("\nChecking portal size...")

    # Execute siac renter to check the size of the portal
    #
    # NOTE: we should leave this as always trying to execute the docker command
    # against the sia container as this will then fail for maintenance severs
    # were we don't care about this check.
    cmd_string = "docker exec sia siac renter"
    siac_renter_output = os.popen(cmd_string).read().strip()

    # Initialize variables
    num_files = 0
    max_files = 1500000  # 1.5 mln
    files_text = "Files:"
    for line in siac_renter_output.split("\n"):
        if line.strip().startswith(files_text):
            for el in line.split():
                if el.isdigit():
                    num_files = int(el)

    ################################################################################
    # create a message
    ################################################################################

    message = ""
    force_notify = False

    if num_files > max_files:
        message += "Portal has {} files! Consider rotating! ".format(num_files)
        # send notification when above 40% of the limit
        force_notify = num_files > max_files * 1.4
    else:
        message += "Portal has {} files. ".format(num_files)

    # send a message if we force notification, or just once daily (heartbeat) on 1 AM
    if force_notify or datetime.utcnow().hour == 1:
        return await send_msg(message, force_notify=force_notify)


loop = asyncio.get_event_loop()
loop.run_until_complete(run_checks())
