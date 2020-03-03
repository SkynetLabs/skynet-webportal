#!/usr/bin/env python3

from urllib.request import urlopen, Request
import urllib
import json
import sys


# sc_precision is the number of hastings per siacoin
sc_precision = 10 ** 24

api_endpoint = "http://localhost:9980" # TODO get port from env/param


# TODO: get values from a param
min_balance = 10_000 * sc_precision
min_unspent_renter_funds = 5_000 * sc_precision
default_renter_funds = 20_000 * sc_precision

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
        password_file = open("/home/marcin/.sia/apipassword")
        password = password_file.readlines()
        return password[0].strip()

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

# Initialize the API opener
siac.initialize()

# fail should ping discord for failures in health checks that can't be managed automatically.
def fail(err_msg):
    print("Error message: ", err_msg)


# check_wallet_health_check checks that the wallet is unlocked and has at least min_balance SC.
def check_wallet_health():
    wallet_get = siac.get_wallet()

    if not wallet_get['unlocked']:
        fail("Wallet not unlocked")

    confirmed_coins = int(wallet_get['confirmedsiacoinbalance'])
    unconfirmed_coins = int(wallet_get['unconfirmedincomingsiacoins'])
    unconfirmed_outgoing_coins = int(wallet_get['unconfirmedoutgoingsiacoins'])
    balance = confirmed_coins + unconfirmed_coins - unconfirmed_outgoing_coins

    print("Balance: ", balance / sc_precision)
    print("Min balance: ", min_balance / sc_precision)

    if balance < min_balance:
        fail("Wallet balance too low: {}".format(balance))

def check_renter_health():
    renter_get = siac.get_renter()

    allowance = renter_get['settings']['allowance']
    allowance_funds = int(allowance['funds'])
    unspent_funds = int(renter_get['financialmetrics']['unspent'])

    # if funds are under a certain amount, re-balance the wallet.
    if unspent_funds < min_unspent_renter_funds:
        #siac.set_renter_funds(default_renter_funds)
        #TODO

check_renter_health()

try:
    check_wallet_health()
    check_renter_health()

except: # catch all exceptions
    e = sys.exc_info()[0]
    fail(e)
