#!/usr/bin/env python3

from urllib.request import urlopen, Request
from dotenv import load_dotenv
from pathlib import Path

import urllib, json, os, traceback, discord, sys

# sc_precision is the number of hastings per siacoin
sc_precision = 10 ** 24

channel_name = "skynet-portal-health-check"

# Environment variable globals
api_endpoint, port, portal_name, bot_token, password = None, None, None, None, None
discord_client = None
setup_done = False

def setup():
    # Load dotenv file if possible.
    # TODO: change all scripts to use named flags/params
    if len(sys.argv) > 1:
        env_path = Path(sys.argv[1])
        load_dotenv(dotenv_path=env_path, override=True)

    global bot_token
    bot_token = os.environ["DISCORD_BOT_TOKEN"]

    global portal_name
    portal_name = os.getenv("PORTAL_NAME")

    # Get a port or use default
    global port
    port = os.getenv("API_PORT")
    if not port:
        port = "9980"

    global api_endpoint
    api_endpoint = "http://localhost:{}".format(port)

    siad.initialize()

    global setup_done
    setup_done = True

    return bot_token

# send_msg sends the msg to the specified discord channel. If force_notify is set to true it adds "@here".
async def send_msg(client, msg, force_notify=False, file=None):
    await client.wait_until_ready()

    guild = client.guilds[0]
    channels = guild.channels

    chan = None
    for c in channels:
        if c.name == channel_name:
            chan = c

    if chan is None:
        print("Can't find channel {}".format(channel_name))

    # Add the portal name.
    msg = "`{}`: {}".format(portal_name, msg)

    if force_notify:
        msg = "@here: \n{}".format(msg)
    await chan.send(msg, file=file)


#siad class provides wrappers for the necessary siad commands.
class siad:
    # initializes values for using the API (password and
    # user-agent) so that all calls to urllib.request.urlopen have these set.
    @staticmethod
    def initialize():
        # Setup a handler with the API password
        username = ""
        password_mgr = urllib.request.HTTPPasswordMgrWithDefaultRealm()
        password_mgr.add_password(None, api_endpoint, username, siad.get_password())
        handler = urllib.request.HTTPBasicAuthHandler(password_mgr)

        # Setup an opener with the correct user agent
        opener = urllib.request.build_opener(handler)
        opener.addheaders = [('User-agent', 'Sia-Agent')]

        # Install the opener.
        # Now all calls to urllib.request.urlopen use our opener.
        urllib.request.install_opener(opener)

    @staticmethod
    def get_password():
        # Get a port or use default
        password = os.getenv("SIA_API_PASSWORD")
        if not password:
            home = os.getenv("HOME")
            password_file = open(home+"/.sia/apipassword")
            password = password_file.readlines()[0].strip()
        return password

    # load_json reads the http response and decodes the JSON value
    @staticmethod
    def load_json(resp):
        return json.loads(resp.decode("utf-8"))


    @staticmethod
    def get_wallet():
        if not setup_done: setup()

        resp = urllib.request.urlopen(api_endpoint + "/wallet").read()
        return siad.load_json(resp)


    @staticmethod
    def get_renter():
        if not setup_done: setup()

        resp = urllib.request.urlopen(api_endpoint + "/renter").read()
        return siad.load_json(resp)


    @staticmethod
    def get_renter_contracts():
        if not setup_done: setup()

        resp = urllib.request.urlopen(api_endpoint + "/renter/contracts").read()
        return siad.load_json(resp)
