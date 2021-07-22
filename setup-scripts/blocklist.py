#!/usr/bin/env python3

import traceback, os, re, asyncio, requests, json
from bot_utils import setup, send_msg
# Google Imports
from googleapiclient.discovery import build
from google.oauth2 import service_account

setup()


# Set the scope as google sheets and readonly
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
SERVICE_ACCOUNT_FILE = '/home/user/skynet-webportal/setup-scripts/.blocklist_gs_keys.json'

# Set Google sheets credentials
creds = None
creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)

# The ID and range of the spreadsheet.
SPREADSHEET_ID = '1TX1FCsGCFLK0Cz_baT_njemPcAU5--QbjIDmmx_z70s'
RANGE_NAME = 'Central Blocklist-General View!C2:C'


async def run_checks():
    try:
        await block_skylinks_from_airtable()
    except:  # catch all exceptions
        trace = traceback.format_exc()
        await send_msg("```\n{}\n```".format(trace), force_notify=True)


def exec(command):
    return os.popen(command).read().strip()


async def block_skylinks_from_airtable():
    print("Pulling blocked skylinks from Google Sheets via Google Service Account API")
    # Initialize the google sheets service
    service = build('sheets', 'v4', credentials=creds)

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=SPREADSHEET_ID,
                                range=RANGE_NAME).execute()

    # Grab the skylinks
    skylinks_array = result.get('values', [])
    # skylinks_array is an array of arrays, this line flattens it into a single
    # array
    skylinks = [link for linklist in skylinks_array for link in linklist]

    print("Google Sheets returned total " + str(len(skylinks)) + " skylinks to block")

    skylinks_returned = skylinks
    skylinks = [skylink for skylink in skylinks if re.search("^[a-zA-Z0-9_-]{46}$", skylink)]

    if len(skylinks_returned) != len(skylinks):
        invalid_skylinks = [str(skylink) for skylink in list(set(skylinks_returned) - set(skylinks))]
        message = str(len(invalid_skylinks)) + " of the skylinks returned from Airtable are not valid"
        await send_msg(message, file=("\n".join(invalid_skylinks)))

    apipassword = exec("docker exec sia cat /sia-data/apipassword")
    ipaddress = exec("docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' sia")

    print("Sending blocklist request to siad")
    response = requests.post(
        "http://" + ipaddress + ":9980/skynet/blocklist",
        auth=("", apipassword),
        headers={"user-agent": "Sia-Agent"},
        data=json.dumps({"add": skylinks}),
    )

    if response.status_code == 204:
        print("Siad blocklist successfully updated with provided skylink")
    else:
        status_code = str(response.status_code)
        response_text = response.text or "empty response"
        message = "Siad blocklist endpoint responded with code " + status_code + ": " + response_text
        return await send_msg(message, force_notify=True)

    print("Searching nginx cache for blocked files")
    cached_files_count = 0
    batch_size = 1000
    for i in range(0, len(skylinks), batch_size):
        cached_files_command = (
            "find /data/nginx/cache/ -type f | xargs --no-run-if-empty -n" + str(batch_size) + " grep -Els '^Skynet-Skylink: ("
            + "|".join(skylinks[i:i+batch_size])
            + ")'"
        )
        cached_files_count+= int(exec('docker exec -it nginx bash -c "' + cached_files_command + ' | xargs -r rm -v | wc -l"'))

    if cached_files_count == 0:
        return print("No nginx cached files matching blocked skylinks were found")

    message = "Purged " + str(cached_files_count) + " blocklisted files from nginx cache"
    return await send_msg(message)


loop = asyncio.get_event_loop()
loop.run_until_complete(run_checks())

# --- BASH EQUIVALENT
# skylinks=$(curl "https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}?fields%5B%5D=${AIRTABLE_FIELD}" -H "Authorization: Bearer ${AIRTABLE_KEY}" | python3 -c "import sys, json; print('[\"' + '\",\"'.join([entry['fields']['Link'] for entry in json.load(sys.stdin)['records']]) + '\"]')")
# apipassword=$(docker exec sia cat /sia-data/apipassword)
# ipaddress=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' sia)
# curl -A "Sia-Agent" --user "":"${apipassword}" --data "{\"add\" : ${skylinks}}" "${ipaddress}:9980/skynet/blocklist"
