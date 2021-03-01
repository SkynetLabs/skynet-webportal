#!/usr/bin/env python3

import traceback, os, asyncio, requests, json, discord
from bot_utils import setup, send_msg

bot_token = setup()
client = discord.Client()

AIRTABLE_API_KEY = os.getenv('AIRTABLE_API_KEY')
AIRTABLE_BASE = os.getenv('AIRTABLE_BASE', 'app89plJvA9EqTJEc')
AIRTABLE_TABLE = os.getenv('AIRTABLE_TABLE', 'Table%201')
AIRTABLE_FIELD = os.getenv('AIRTABLE_FIELD', 'Link')

async def block_skylinks_from_airtable():
    print("Pulling blocked skylinks from airtable via api integration")
    headers = { "Authorization": "Bearer " + AIRTABLE_API_KEY }
    skylinks = []
    offset = ''
    while len(skylinks) == 0 or offset:
        query = '&'.join(['fields%5B%5D=' + AIRTABLE_FIELD, ('offset=' + offset) if offset else ''])
        airtable = requests.get(
            "https://api.airtable.com/v0/" + AIRTABLE_BASE + "/" + AIRTABLE_TABLE + "?" + query, headers=headers
        )

        if airtable.status_code != 200:
            message = "Airtable blocklist integration responded with code " + str(airtable.status_code) + ": " + (airtable.text or "empty response")
            return print(message) or await send_msg(client, message, force_notify=False)
        
        airtable_data = airtable.json()
        skylinks = skylinks + [entry['fields'][AIRTABLE_FIELD] for entry in airtable_data['records']]

        if len(skylinks) == 0:
            return print("Airtable returned 0 skylinks - make sure your configuration is correct")
        
        print(airtable_data.offset)
        offset = airtable_data.offset
        print(airtable_data.offset)
    
    print("Airtable returned " + str(len(skylinks)) + " skylinks to block")
    
    apipassword = os.popen('docker exec sia cat /sia-data/apipassword').read().strip()
    ipaddress = os.popen('docker inspect -f \'{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}\' sia').read().strip()
    
    print("Sending blocklist request to siad")
    headers = { 'user-agent': 'Sia-Agent' }
    auth = ('', apipassword)
    data = json.dumps({ 'add': skylinks })
    response = requests.post('http://' + ipaddress + ':9980/skynet/blocklist', auth = auth, headers = headers, data = data)
    
    if response.status_code == 204:
        print("Siad blocklist successfully updated with provided skylink")
    else:
        message = "Siad blocklist endpoint responded with code " + str(response.status_code) + ": " + (response.text or "empty response")
        return print(message) or await send_msg(client, message, force_notify=False)

    print("Searching nginx cache for blocked files")
    cached_files_command = '/usr/bin/find /data/nginx/cache/ -type f | /usr/bin/xargs --no-run-if-empty -n1000 /bin/grep -El \'^KEY: .*(' + '|'.join(skylinks) + ')\''
    cached_files_count = int(os.popen('docker exec -it nginx bash -c "' + cached_files_command + ' | wc -l"').read().strip())

    if cached_files_count == 0:
        return print("No nginx cached files matching blocked skylinks were found")

    os.popen('docker exec -it nginx bash -c "' + cached_files_command + ' | xargs rm"')
    message = 'Purged ' + str(cached_files_count) + ' blocklisted files from nginx cache'
    return print(message) or await send_msg(client, message)

async def exit_after(delay):
    await asyncio.sleep(delay)
    os._exit(0)

@client.event
async def on_ready():
    try:
        await block_skylinks_from_airtable()
    except:  # catch all exceptions
        await send_msg(client, "```\n{}\n```".format(traceback.format_exc()), force_notify=False)
    asyncio.create_task(exit_after(3))
    
client.run(bot_token)

# asyncio.run(on_ready())

# --- BASH EQUIVALENT
# skylinks=$(curl "https://api.airtable.com/v0/${AIRTABLE_BASE}/Table%201?fields%5B%5D=Link" -H "Authorization: Bearer ${AIRTABLE_KEY}" | python3 -c "import sys, json; print('[\"' + '\",\"'.join([entry['fields']['Link'] for entry in json.load(sys.stdin)['records']]) + '\"]')")
# apipassword=$(docker exec sia cat /sia-data/apipassword)
# ipaddress=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' sia)
# curl -A "Sia-Agent" --user "":"${apipassword}" --data "{\"add\" : ${skylinks}}" "${ipaddress}:9980/skynet/blocklist"
