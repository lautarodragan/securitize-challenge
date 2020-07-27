const apiKey = 'NSZCD6S4TKVWRS13PMQFMVTNP6H7NAGHUY'

const Koa = require('koa')
const KoaRouter = require('@koa/router')
const KoaBodyparser = require('koa-bodyparser')

const { Etherscan } = require('./etherscan')

const router = new KoaRouter()

const ratePairUsdEth = 'usd-eth'
const ratePairEurEth = 'eur-eth'

const ratePairs = [ratePairUsdEth, ratePairEurEth]

const etherscan = Etherscan({ apiKey })

const exchangeRates = {
  [ratePairUsdEth]: 300,
  [ratePairEurEth]: 250,
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
    ctx.body = `Unknown exchange rate pair '${id}'. Supported pairs are [${ratePairs.join()}]`
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
  console.log('GET /wallet/:address', address)

  const balance = await etherscan.getBalance(address)

  ctx.status = 200
  ctx.body = JSON.stringify({
    balance,
  })
})

const koa = new Koa()
  .use(KoaBodyparser())
  .use(router.routes())
  .use(router.allowedMethods())

const server = koa.listen(8000, '0.0.0.0')
