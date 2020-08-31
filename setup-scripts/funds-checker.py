#!/usr/bin/env python3

"""
health-checker runs simple health checks on a portal node using the siad API and
dispatches messages to a Discord channel.
"""

import discord, traceback, asyncio, os
from bot_utils import setup, send_msg, siad, sc_precision

bot_token = setup()
client = discord.Client()


async def exit_after(delay):
    await asyncio.sleep(delay)
    os._exit(0)


@client.event
async def on_ready():
    await run_checks()
    asyncio.create_task(exit_after(30))
    await client.close()


async def run_checks():
    print("Running Skynet portal health checks")
    try:
        await check_health()

    except: # catch all exceptions
        trace = traceback.format_exc()
        await send_msg(client, "```\n{}\n```".format(trace), force_notify=True)


# check_health checks that the wallet is unlocked, that it has at least 1
# allowance worth of money left, and if more than hald the allowance is spent. If
# all checks pass it sends a informational message.
async def check_health():
    print("\nChecking wallet/funds health...")
    wallet_get = siad.get_wallet()
    renter_get = siad.get_renter()

    if not wallet_get['unlocked']:
        await send_msg(client, "Wallet locked", force_notify=True)
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


    balance_msg = "Balance: `{} SC` Allowance Funds: `{} SC`".format(round(balance/sc_precision), round(allowance_funds/sc_precision))
    alloc_msg = "Unallocated: `{} SC`\nAllocated: `{} SC`".format(round(unallocated_funds/sc_precision), round(allocated_funds/sc_precision))

    # Send an alert if there is less than 1 allowance worth of money left.
    if balance < allowance_funds:
        await send_msg(client, "Wallet balance running low. \n{}".format(balance_msg), force_notify=True)
        return

    # Alert devs when only a fraction of the allowance is remaining.
    SPEND_THRESHOLD = 0.8
    if allocated_funds  >= SPEND_THRESHOLD * allowance_funds :
        await send_msg(client, "More than {:.0%} of allowance spent: \n{}".format(SPEND_THRESHOLD, alloc_msg), force_notify=True)
        return

    # Send an informational heartbeat if all checks passed.
    await send_msg(client, "Health checks passed:\n{} \n{}".format(balance_msg, alloc_msg))


client.run(bot_token)
