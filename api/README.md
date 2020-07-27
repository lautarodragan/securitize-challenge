# Objective
Build a generic platform that return analytics on an ethereum wallets

# Tools
To get information on ethereum wallet please use https://etherscan.io/apis.

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

- `GET /wallet/is-old`

- `GET /wallet/balance?currency=:currency`

`:currency` can be `usd` or `eur`.

## Exchange Rates 

- `GET /rates/:pair`

- `PUT /rates/:pair`

`:pair` can be `usd-eth` or `eur-eth`.


