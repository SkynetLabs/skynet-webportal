#!/usr/bin/env python3

import traceback, os, re, asyncio, requests, json, discord
from bot_utils import setup, send_msg
# Google Imports
from googleapiclient.discovery import build
from google.oauth2 import service_account

bot_token = setup()
client = discord.Client()


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
        print(message) or await send_msg(client, message, file=("\n".join(invalid_skylinks)))

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
        return print(message) or await send_msg(client, message, force_notify=False)

    print("Searching nginx cache for blocked files")
    cached_files_count = 0
    for i in range(0, len(skylinks), 1000):
        cached_files_command = (
            "/usr/bin/find /data/nginx/cache/ -type f | /usr/bin/xargs --no-run-if-empty -n1000 /bin/grep -Els '^KEY: .*("
            + "|".join(skylinks[i:i+1000])
            + ")'"
        )
        cached_files_count += int(exec('docker exec -it nginx bash -c "' + cached_files_command + ' | wc -l"') or 0)

    if cached_files_count == 0:
        return print("No nginx cached files matching blocked skylinks were found")

    exec('docker exec -it nginx bash -c "' + cached_files_command + ' | xargs rm"')
    message = "Purged " + str(cached_files_count) + " blocklisted files from nginx cache"
    return print(message) or await send_msg(client, message)


async def exit_after(delay):
    await asyncio.sleep(delay)
    os._exit(0)


@client.event
async def on_ready():
    try:
        await block_skylinks_from_airtable()
    except:  # catch all exceptions
        message = "```\n{}\n```".format(traceback.format_exc())
        await send_msg(client, message, force_notify=False)
    asyncio.create_task(exit_after(3))


client.run(bot_token)

# --- BASH EQUIVALENT
# skylinks=$(curl "https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}?fields%5B%5D=${AIRTABLE_FIELD}" -H "Authorization: Bearer ${AIRTABLE_KEY}" | python3 -c "import sys, json; print('[\"' + '\",\"'.join([entry['fields']['Link'] for entry in json.load(sys.stdin)['records']]) + '\"]')")
# apipassword=$(docker exec sia cat /sia-data/apipassword)
# ipaddress=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' sia)
# curl -A "Sia-Agent" --user "":"${apipassword}" --data "{\"add\" : ${skylinks}}" "${ipaddress}:9980/skynet/blocklist"
