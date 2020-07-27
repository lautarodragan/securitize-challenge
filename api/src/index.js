const apiKey = 'NSZCD6S4TKVWRS13PMQFMVTNP6H7NAGHUY'

const Koa = require('koa')
const KoaRouter = require('koa-router')
const KoaBodyparser = require('koa-bodyparser')

const router = new KoaRouter()

const ratePairUsdEth = 'usd-eth'
const ratePairEurEth = 'eur-eth'

const ratePairs = [ratePairUsdEth, ratePairEurEth]

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

const koa = new Koa()
  .use(KoaBodyparser())
  .use(router.routes())
  .use(router.allowedMethods())

const server = koa.listen(8000, '0.0.0.0')
