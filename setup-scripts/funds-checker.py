#!/usr/bin/env python3

"""
funds-checker runs simple checks on a portal node using the siad API and
dispatches messages to a Discord channel.
"""

import discord, traceback, asyncio, os
from bot_utils import setup, send_msg, siad, sc_precision

setup()


async def run_checks():
    print("Running Skynet portal funds checks")
    try:
        await check_funds()
    except:  # catch all exceptions
        trace = traceback.format_exc()
        await send_msg("```\n{}\n```".format(trace), force_notify=True)


# check_funds checks that the wallet is unlocked, that it has at least 1
# allowance worth of money left, and if less than half the allowance is spent.
# If all checks pass it sends an informational message.
async def check_funds():
    print("\nChecking wallet/funds health...")
    wallet_get = siad.get_wallet()
    renter_get = siad.get_renter()

    if not wallet_get["unlocked"]:
        await send_msg("Wallet locked", force_notify=True)
        return

    confirmed_coins = int(wallet_get["confirmedsiacoinbalance"])
    unconfirmed_coins = int(wallet_get["unconfirmedincomingsiacoins"])
    unconfirmed_outgoing_coins = int(wallet_get["unconfirmedoutgoingsiacoins"])
    balance = confirmed_coins + unconfirmed_coins - unconfirmed_outgoing_coins
    print("Balance: ", balance / sc_precision)

    allowance = renter_get["settings"]["allowance"]
    allowance_funds = int(allowance["funds"])
    allocated_funds = int(renter_get["financialmetrics"]["totalallocated"])
    unallocated_funds = allowance_funds - allocated_funds

    balance_msg = "Balance: {} SC, Allowance Funds: {} SC".format(
        round(balance / sc_precision), round(allowance_funds / sc_precision)
    )
    alloc_msg = "Unallocated: {} SC, Allocated: {} SC".format(
        round(unallocated_funds / sc_precision), round(allocated_funds / sc_precision)
    )

    # Send an alert if there is less than a certain part of allowance worth of money left in the wallet.
    WALLET_ALLOWANCE_THRESHOLD = 0.3
    if balance < allowance_funds * WALLET_ALLOWANCE_THRESHOLD:
        wallet_address_res = siad.get("/wallet/address")
        wallet_msg = "Address: {}".format(wallet_address_res["address"])
        message = "__Wallet balance running low!__ {} {}".format(
            balance_msg, wallet_msg
        )
        return await send_msg(message, force_notify=True)

    # Alert devs when only a fraction of the allowance is remaining.
    SPEND_THRESHOLD = 0.9
    if allocated_funds >= SPEND_THRESHOLD * allowance_funds:
        message = "__More than {:.0%} of allowance spent!__ {}".format(
            SPEND_THRESHOLD, alloc_msg
        )
        return await send_msg(message, force_notify=True)

    # Send an informational heartbeat if all checks passed.
    await send_msg("Funds checks passed. {} {}".format(balance_msg, alloc_msg))


loop = asyncio.get_event_loop()
loop.run_until_complete(run_checks())
