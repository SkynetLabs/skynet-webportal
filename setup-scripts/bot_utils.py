#!/usr/bin/env python3

from urllib.request import urlopen, Request
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime
from discord_webhook import DiscordWebhook

import urllib, json, os, traceback, sys, re, subprocess, requests, io

# Load dotenv file if possible.
# TODO: change all scripts to use named flags/params
if len(sys.argv) > 1:
    env_path = Path(sys.argv[1])
    load_dotenv(dotenv_path=env_path, override=True)

# Get the container name as an argument or use "sia" as default.
CONTAINER_NAME = "sia"
if len(sys.argv) > 2:
    CONTAINER_NAME = sys.argv[2]

# sc_precision is the number of hastings per siacoin
sc_precision = 10 ** 24

# Environment variable globals
setup_done = False

# find out local siad ip by inspecting its docker container
def get_docker_container_ip(container_name):
    ip_regex = re.compile(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$")
    docker_cmd = (
        "docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "
        + container_name
    )
    output = subprocess.check_output(docker_cmd, shell=True).decode("utf-8")
    return ip_regex.findall(output)[0]


# sia deamon local ip address with port
api_endpoint = "http://{}:{}".format(
    get_docker_container_ip(CONTAINER_NAME), os.getenv("API_PORT", "9980")
)

# find siad api password by getting it out of the docker container
def get_api_password():
    api_password_regex = re.compile(r"^\w+$")
    docker_cmd = "docker exec {} cat /sia-data/apipassword".format(CONTAINER_NAME)
    output = subprocess.check_output(docker_cmd, shell=True).decode("utf-8")
    return api_password_regex.findall(output)[0]


def setup():
    siad.initialize()

    global setup_done
    setup_done = True


# send_msg sends the msg to the specified discord channel. If force_notify is set to true it adds "@here".
async def send_msg(msg, force_notify=False, file=None):
    try:
        webhook_url = os.getenv("DISCORD_WEBHOOK_URL")
        webhook_mention_user_id = os.getenv("DISCORD_MENTION_USER_ID")
        webhook_mention_role_id = os.getenv("DISCORD_MENTION_ROLE_ID")
        webhook = DiscordWebhook(url=webhook_url, rate_limit_retry=True)

        # prefix message with the server name
        server_name = os.getenv("SERVER_DOMAIN") or os.getenv("PORTAL_DOMAIN") or "n/a"
        msg = "**{}**: {}".format(server_name, msg)

        if file and isinstance(file, str):
            is_json = is_json_string(file)
            content_type = "application/json" if is_json else "text/plain"
            ext = "json" if is_json else "txt"
            filename = "{}-{}.{}".format(
                CONTAINER_NAME, datetime.utcnow().strftime("%Y-%m-%d-%H:%M:%S"), ext
            )
            skylink = upload_to_skynet(file, filename, content_type=content_type)
            if skylink:
                msg = "{} {}".format(msg, skylink)  # append skylink to message
            else:
                webhook.add_file(file=io.BytesIO(file.encode()), filename=filename)

        if force_notify and (webhook_mention_user_id or webhook_mention_role_id):
            webhook.allowed_mentions = {
                "users": [webhook_mention_user_id],
                "roles": [webhook_mention_role_id],
            }
            msg = "{} /cc".format(msg)  # separate message from mentions
            if webhook_mention_role_id:
                msg = "{} <@&{}>".format(msg, webhook_mention_role_id)
            if webhook_mention_user_id:
                msg = "{} <@{}>".format(msg, webhook_mention_user_id)

        webhook.content = msg
        webhook.execute()

        print("msg > " + msg)  # print message to std output for debugging purposes
    except:
        print("Failed to send message!")
        print(traceback.format_exc())


def upload_to_skynet(contents, filename="file.txt", content_type="text/plain"):
    files = {"file": (filename, contents, content_type)}
    res = requests.post("https://siasky.net/skynet/skyfile", files=files)
    if res.status_code == requests.codes["ok"]:
        res_json = res.json()
        return "https://siasky.net/" + res_json["skylink"]
    return None


def is_json_string(str):
    try:
        json.loads(str)
        return True
    except ValueError:
        return False


# siad class provides wrappers for the necessary siad commands.
class siad:
    # initializes values for using the API (password and
    # user-agent) so that all calls to urllib.request.urlopen have these set.
    @staticmethod
    def initialize():
        # Setup a handler with the API password
        username = ""
        password_mgr = urllib.request.HTTPPasswordMgrWithDefaultRealm()
        password_mgr.add_password(None, api_endpoint, username, get_api_password())
        handler = urllib.request.HTTPBasicAuthHandler(password_mgr)

        # Setup an opener with the correct user agent
        opener = urllib.request.build_opener(handler)
        opener.addheaders = [("User-agent", "Sia-Agent")]

        # Install the opener.
        # Now all calls to urllib.request.urlopen use our opener.
        urllib.request.install_opener(opener)

    # load_json reads the http response and decodes the JSON value
    @staticmethod
    def load_json(resp):
        return json.loads(resp.decode("utf-8"))

    @staticmethod
    def get(endpoint):
        if not setup_done:
            setup()

        resp = urllib.request.urlopen(api_endpoint + endpoint).read()
        return siad.load_json(resp)

    @staticmethod
    def get_wallet():
        if not setup_done:
            setup()

        resp = urllib.request.urlopen(api_endpoint + "/wallet").read()
        return siad.load_json(resp)

    @staticmethod
    def get_renter():
        if not setup_done:
            setup()

        resp = urllib.request.urlopen(api_endpoint + "/renter").read()
        return siad.load_json(resp)

    @staticmethod
    def get_renter_contracts():
        if not setup_done:
            setup()

        resp = urllib.request.urlopen(api_endpoint + "/renter/contracts").read()
        return siad.load_json(resp)
