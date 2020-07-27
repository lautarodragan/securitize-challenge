# Objective

Build a generic platform that return analytics on an ethereum wallets

# Tools

To get information on Ethereum wallet please use https://etherscan.io/apis.

API Key: `NSZCD6S4TKVWRS13PMQFMVTNP6H7NAGHUY`

# Requirements

1. An endpoint that returns true if the wallet is old.
A wallet is considered old if the first transaction was performed at least one year ago

1. Add 2 endpoints:
   1. Get exchange rates from Euro and US Dollar to ETH (Ethereum), those can be
stored in-memory / hardcoded (no need for a DB)
   1. Edit the exchange rate of Euro or US Dollar to ETH

1. An endpoint that gets a currency (Euro or US Dollar) and returns the balance of the ETH
in the wallet wallet in the selected currency using the exchange rates from step 2.

# Endpoints

## Wallet

- `GET /wallets/:address/is-old`

- `GET /wallet/:address/balance?currency=:currency`

`:currency` can be `usd` or `eur`.

`:address` is any valid Ethereum address.

For the balance we can use the [get address eth balance](https://api.etherscan.io/api?module=account&action=balance&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&tag=latest&apikey=YourApiKeyToken) Etherscan api endpoint.

## Exchange Rates 

- `GET /rates/:pair`

- `PUT /rates/:pair`

`:pair` can be `usd-eth` or `eur-eth`.

For these we're just gonna use a mutable variable, stored at module-level, to keep things simple.

In practice we'll want to store these in a DB, append-only, along with the date of the exchange rate, and probably a provider for the exchange rate too.

# Note on Wallet vs Address

The challenge states we want to offer analytics of an Ethereum wallet. In practice, wallets are usually a collection of addresses. The challenge is a bit vague on this matter, so I'm going to assume _wallet_ means _address_ in this context, for the sake of this challenge. 
