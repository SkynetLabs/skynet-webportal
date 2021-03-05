#!/usr/bin/env python3

import traceback, os, re, asyncio, requests, json, discord
from bot_utils import setup, send_msg

bot_token = setup()
client = discord.Client()

AIRTABLE_API_KEY = os.getenv("AIRTABLE_API_KEY")
AIRTABLE_BASE = os.getenv("AIRTABLE_BASE", "app89plJvA9EqTJEc")
AIRTABLE_TABLE = os.getenv("AIRTABLE_TABLE", "Table%201")
AIRTABLE_FIELD = os.getenv("AIRTABLE_FIELD", "Link")


def exec(command):
    return os.popen(command).read().strip()


async def block_skylinks_from_airtable():
    print("Pulling blocked skylinks from Airtable via api integration")
    headers = {"Authorization": "Bearer " + AIRTABLE_API_KEY}
    skylinks = []
    offset = None
    while len(skylinks) == 0 or offset:
        print("Requesting a batch of records from Airtable with " + (offset if offset else "empty") + " offset")
        query = "&".join(["fields%5B%5D=" + AIRTABLE_FIELD, ("offset=" + offset) if offset else ""])
        response = requests.get(
            "https://api.airtable.com/v0/" + AIRTABLE_BASE + "/" + AIRTABLE_TABLE + "?" + query,
            headers=headers,
        )

        if response.status_code != 200:
            status_code = str(response.status_code)
            response_text = response.text or "empty response"
            message = "Airtable blocklist integration responded with code " + status_code + ": " + response_text
            return print(message) or await send_msg(client, message, force_notify=False)

        data = response.json()

        if len(data["records"]) == 0:
            return print("Airtable returned 0 records - make sure your configuration is correct")

        skylinks = skylinks + [entry["fields"].get(AIRTABLE_FIELD, "") for entry in data["records"]]
        skylinks = [skylink for skylink in skylinks if skylink] # filter empty skylinks, most likely empty rows

        offset = data.get("offset")

    print("Airtable returned total " + str(len(skylinks)) + " skylinks to block")

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
    
    f = open("/tmp/blocklist-aritable.txt", "w")
    f.write("^KEY: .*" + "^KEY: .*\n".join(skylinks))
    f.close()
    cached_files_command = (
        "/usr/bin/find /data/nginx/cache/ -type f | /usr/bin/xargs --no-run-if-empty -n1000 /bin/grep -Els --file /tmp/blocklist-aritable.txt"
    )
    cached_files_count = int(exec('docker exec -it nginx bash -c "' + cached_files_command + ' | wc -l"') or 0)

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
