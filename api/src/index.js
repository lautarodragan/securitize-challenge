const apiKey = 'NSZCD6S4TKVWRS13PMQFMVTNP6H7NAGHUY'

import Big from 'big.js'
import Koa from 'koa'
import KoaRouter from'@koa/router'
import KoaBodyparser from 'koa-bodyparser'

import { Etherscan } from './etherscan.js'

const router = new KoaRouter()

const ratePairUsdEth = 'usd-eth'
const ratePairEurEth = 'eur-eth'

const ratePairs = [ratePairUsdEth, ratePairEurEth]

const etherscan = Etherscan({ apiKey })

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
  ctx.body = JSON.stringify({
    exchangeRate,
  })

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

router.get('/wallets/:address', async (ctx, next) => {
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
  ctx.body = JSON.stringify({
    balanceInWei,
    rate,
    balance,
    currency,
  })
})

const koa = new Koa()
  .use(KoaBodyparser())
  .use(router.routes())
  .use(router.allowedMethods())

const server = koa.listen(8000, '0.0.0.0')
