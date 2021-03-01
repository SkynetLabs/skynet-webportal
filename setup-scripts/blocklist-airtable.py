#!/usr/bin/env python3

import traceback, os, asyncio, requests, json, discord
from bot_utils import setup, send_msg

AIRTABLE_TABLE = "app89plJvA9EqTJEc"
AIRTABLE_FIELD = "Link"

bot_token = setup()
client = discord.Client()

async def block_skylinks_from_airtable():
    print("Pulling blocked skylinks from airtable via api integration")
    headers = { "Authorization": "Bearer " + AIRTABLE_API_KEY }
    airtable = requests.get(
        "https://api.airtable.com/v0/" + AIRTABLE_TABLE + "/Table%201?fields%5B%5D=" + AIRTABLE_FIELD, headers=headers
    ).json()
    skylinks = [entry['fields'][AIRTABLE_FIELD] for entry in airtable['records']]
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
        await send_msg(client, message, force_notify=True)

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
    
# asyncio.run(on_ready())

# --- BASH EQUIVALENT
# skylinks=$(curl "https://api.airtable.com/v0/${AIRTABLE_TABLE}/Table%201?fields%5B%5D=Link" -H "Authorization: Bearer ${AIRTABLE_KEY}" | python3 -c "import sys, json; print('[\"' + '\",\"'.join([entry['fields']['Link'] for entry in json.load(sys.stdin)['records']]) + '\"]')")
# apipassword=$(docker exec sia cat /sia-data/apipassword)
# ipaddress=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' sia)
# curl -A "Sia-Agent" --user "":"${apipassword}" --data "{\"add\" : ${skylinks}}" "${ipaddress}:9980/skynet/blocklist"
