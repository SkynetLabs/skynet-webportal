#!/usr/bin/env python3

import traceback, os, asyncio, requests, json, discord
from bot_utils import setup, send_msg

bot_token = setup()
client = discord.Client()

AIRTABLE_TABLE = "app89plJvA9EqTJEc"
AIRTABLE_FIELD = "Link"
AIRTABLE_API_KEY = os.getenv('AIRTABLE_API_KEY')

async def block_skylinks_from_airtable():
    print("Pulling blocked skylinks from airtable via api integration")
    headers = { "Authorization": "Bearer " + AIRTABLE_API_KEY }
    airtable = requests.get(
        "https://api.airtable.com/v0/" + AIRTABLE_TABLE + "/Table%201?fields%5B%5D=" + AIRTABLE_FIELD, headers=headers
    )

    if airtable.status_code != 200:
        message = "Airtable blocklist integration responded with code " + str(airtable.status_code) + ": " + (airtable.text or "empty response")
        return print(message) or await send_msg(client, message, force_notify=True)
    
    skylinks = [entry['fields'][AIRTABLE_FIELD] for entry in airtable.json()['records']]

    if len(skylinks) == 0:
        return print("Airtable returned 0 skylinks to block - make sure your table configuration is correct")
    else:
        print("Airtable returned " + str(len(skylinks)) + " skylinks to block")
    
    apipassword = os.popen('docker exec sia cat /sia-data/apipassword').read().strip()
    ipaddress = os.popen('docker inspect -f \'{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}\' sia').read().strip()
    
    print("Sending blocklist request to siad")
    headers = { 'user-agent': 'Sia-Agent' }
    auth = ('', apipassword)
    data = json.dumps({ 'add': skylinks })
    response = requests.post('http://' + ipaddress + ':9980/skynet/blocklist', auth = auth, headers = headers, data = data)
    
    if response.status_code == 204:
        print("Skylinks successfully added to siad blocklist")
    else:
        message = "Siad blocklist endpoint responded with code " + str(response.status_code) + ": " + (response.text or "empty response")
        return await print(message) or send_msg(client, message, force_notify=True)

    print("Clearing nginx cache related to blocked skylinks")
    find_all_cache_files = '/usr/bin/find /data/nginx/cache/ -type f'
    grep_pattern = '^KEY: .*(' + '|'.join(skylinks) + ')'
    filter_matching_files = '/usr/bin/xargs --no-run-if-empty -n1000 /bin/grep -El ' + grep_pattern
    print('docker exec -it nginx bash -c "' + find_all_cache_files + ' | ' + filter_matching_files + '"')
    os.popen('docker exec -it nginx bash -c "' + find_all_cache_files + ' | ' + filter_matching_files + '"')

async def exit_after(delay):
    await asyncio.sleep(delay)
    os._exit(0)

@client.event
async def on_ready():
    try:
        await block_skylinks_from_airtable()
    except:  # catch all exceptions
        await send_msg(client, "```\n{}\n```".format(traceback.format_exc()), force_notify=True)
    asyncio.create_task(exit_after(3))
    
client.run(bot_token)

# asyncio.run(on_ready())

# --- BASH EQUIVALENT
# skylinks=$(curl "https://api.airtable.com/v0/${AIRTABLE_TABLE}/Table%201?fields%5B%5D=Link" -H "Authorization: Bearer ${AIRTABLE_KEY}" | python3 -c "import sys, json; print('[\"' + '\",\"'.join([entry['fields']['Link'] for entry in json.load(sys.stdin)['records']]) + '\"]')")
# apipassword=$(docker exec sia cat /sia-data/apipassword)
# ipaddress=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' sia)
# curl -A "Sia-Agent" --user "":"${apipassword}" --data "{\"add\" : ${skylinks}}" "${ipaddress}:9980/skynet/blocklist"
