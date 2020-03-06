#!/usr/bin/env python3

from urllib.request import urlopen, Request
from dotenv import load_dotenv
from pathlib import Path

import urllib, json, os, traceback, discord, sys


# sc_precision is the number of hastings per siacoin
sc_precision = 10 ** 24

# Environment variable globals
api_endpoint, port, portal_name, bot_token, password = None, None, None, None, None

# Load dotenv file if possible.
if len(sys.argv) > 1:
    env_path = Path(sys.argv[1])
    load_dotenv(dotenv_path=env_path)

bot_token = os.environ["DISCORD_BOT_TOKEN"]
portal_name  = os.getenv("PORTAL_NAME")

# Get a port or use default
port = os.getenv("API_PORT")
if not port:
    port = "9980"

api_endpoint = "http://localhost:{}".format(port)


# Discord bot initialization
client = discord.Client()
channel_name = "skynet-portal-health-check"

@client.event
async def on_ready():
    await run_checks()
    await client.close()

# send_msg sends the msg to the specified discord channel. If force_notify is set to true it adds "@here".
async def send_msg(msg, force_notify=False):
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
    await chan.send(msg)

#siac class provides wrappers for the necessary siac commands.
class siac:
    # initializes values for using the API (password and
    # user-agent) so that all calls to urllib.request.urlopen have these set.
    @staticmethod
    def initialize():
        # Setup a handler with the API password
        username = ""
        password_mgr = urllib.request.HTTPPasswordMgrWithDefaultRealm()
        password_mgr.add_password(None, api_endpoint, username, siac.get_password())
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
        resp = urllib.request.urlopen(api_endpoint + "/wallet").read()
        return siac.load_json(resp)


    @staticmethod
    def get_renter():
        resp = urllib.request.urlopen(api_endpoint + "/renter").read()
        return siac.load_json(resp)


    @staticmethod
    def get_renter_contracts():
        resp = urllib.request.urlopen(api_endpoint + "/renter/contracts").read()
        return siac.load_json(resp)


# check_health checks that the wallet is unlocked, that it has at least 1
# allowance worth of money left, and if more than hald the allowance is spent. If
# all checks pass it sends a informational message.
async def check_health():
    print("\nChecking health...")
    wallet_get = siac.get_wallet()
    renter_get = siac.get_renter()

    if not wallet_get['unlocked']:
        await send_msg("Wallet locked", force_notify=True)
        return

    confirmed_coins = int(wallet_get['confirmedsiacoinbalance'])
    unconfirmed_coins = int(wallet_get['unconfirmedincomingsiacoins'])
    unconfirmed_outgoing_coins = int(wallet_get['unconfirmedoutgoingsiacoins'])
    balance = confirmed_coins + unconfirmed_coins - unconfirmed_outgoing_coins
    print("Balance: ", balance / sc_precision)

    allowance = renter_get['settings']['allowance']
    allowance_funds = int(allowance['funds'])
    allocated_funds = int(renter_get['financialmetrics']['totalallocated'])
    unallocated_funds = allowance_funds - allocated_funds

    # Send an alert if there is less than 1 allowance worth of money left.
    if balance < allowance_funds:
        await send_msg("Wallet balance running low. Balance: `{} SC` Allowance Funds: `{} SC`".format(round(balance/sc_precision), round(allowance_funds/sc_precision)), force_notify=True)
        return

    # Alert devs when 1/2 the allowance is gone
    if allocated_funds  >= unallocated_funds:
        await send_msg("Allowance half spent: \nUnallocated: `{} SC`\nAllocated: `{} SC`".format(round(unallocated_funds/sc_precision), round(allocated_funds/sc_precision)), force_notify=True)
        return

    # Send an informational heartbeat if all checks passed.
    pretty_renter_get = json.dumps(siac.get_renter(), indent=4)
    await send_msg("Health checks passed:\n\nWallet Balance: `{} SC`\n\n Renter Info:\n```\n{}\n```".format(round(balance/sc_precision), pretty_renter_get))


async def run_checks():
    # Initialize the siac API helper.
    siac.initialize()

    print("Running Skynet portal health checks")
    try:
        await check_health()

    except: # catch all exceptions
        trace = traceback.format_exc()
        await send_msg("```\n{}\n```".format(trace), force_notify=True)

client.run(bot_token)
