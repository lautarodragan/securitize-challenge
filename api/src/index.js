import Big from 'big.js'
import cors from '@koa/cors'
import Koa from 'koa'
import KoaRouter from'@koa/router'
import KoaBodyparser from 'koa-bodyparser'
import luxon from 'luxon'

import { Etherscan } from './etherscan.js'

if (!process.env.API_KEY) {
  console.log('Error: API_KEY environment variable not set.')
  process.exit()
}

console.log('Etherscan API Key:', process.env.API_KEY)

const router = new KoaRouter()

const ratePairUsdEth = 'usd-eth'
const ratePairEurEth = 'eur-eth'

const ratePairs = [ratePairUsdEth, ratePairEurEth]

const etherscan = Etherscan({ apiKey: process.env.API_KEY })

const exchangeRates = {
  [ratePairUsdEth]: 324.35,
  [ratePairEurEth]: 250,
}

// enum Currencies...
const Currencies = {
  usd: 'usd',
  eur: 'eur',
}

router.get('/rates/:id', (ctx, next) => {
  const { id } = ctx.params
  console.log('GET /rates/:id', id)

  if (!ratePairs.includes(id)) {
    ctx.status = 422
    ctx.body = `Unknown exchange rate pair '${id}'. Supported pairs are [${ratePairs.join()}]`
    return
  }

  const exchangeRate = exchangeRates[id]

  ctx.status = 200
  ctx.body = {
    exchangeRate,
  }

})

router.put('/rates/:id', (ctx, next) => {
  const { id } = ctx.params
  console.log('PUT /rates/:id', id, ctx.request.body)

  if (!ratePairs.includes(id)) {
    ctx.status = 422
    ctx.body = `Unexpected exchange rate pair '${id}'. Supported pairs are [${ratePairs.join()}]`
    return
  }

  if (!ctx.request.body || !ctx.request.body.rate) {
    ctx.status = 422
    ctx.body = `Rate field in body not present.`
    return
  }

  const { rate } = ctx.request.body

  exchangeRates[id] = rate

  ctx.status = 201
})

router.get('/wallets/:address/balance', async (ctx, next) => {
  const { address } = ctx.params
  const { currency = Currencies.usd } = ctx.query

  console.log('GET /wallet/:address', address, currency)

  if (![Currencies.usd, Currencies.eur].includes(currency)) {
    ctx.status = 422
    ctx.body = `Unexpected currency ${currency}. Supported currencies are [${Object.values(Currencies)}]`
    return
  }

  const { result: balanceInWei } = await etherscan.getBalance(address)
  const rate = exchangeRates[`${currency}-eth`]
  const balance = Big(balanceInWei).times(rate).div(1e9).div(1e9).toFixed(2)

  ctx.status = 200
  ctx.body = {
    balanceInWei,
    rate,
    balance,
    currency,
  }
})

router.get('/wallets/:address/is-old', async (ctx, next) => {
  const { address } = ctx.params

  console.log('GET /wallet/:address/is-old', { address })

  const timestamp = Math.floor(luxon.DateTime.utc().minus({ year: 1 }).toMillis() / 1000)
  const { result: endblock } = await etherscan.getBlockNumberByTimestamp(timestamp)

  console.log('GET /wallet/:address/is-old', { address, timestamp, endblock })

  const transactionsResponse = await etherscan.getNormalTransactions({
    address,
    endblock,
  })

  const isOld = transactionsResponse.status === '1' && transactionsResponse.result.length >= 1
  const transactions = transactionsResponse.result.map(({ hash, blockNumber, timeStamp }) => ({ hash, blockNumber, timeStamp }))

  console.log('GET /wallet/:address/is-old', { address, timestamp, endblock, transactions })

  ctx.status = 200
  ctx.body = {
    isOld,
  }
})

const koa = new Koa()
  .use(cors())
  .use(KoaBodyparser())
  .use(router.routes())
  .use(router.allowedMethods())

const server = koa.listen(8000, '0.0.0.0')
