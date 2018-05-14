const Koa = require('koa')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const staticFiles = require('koa-static')
const app = new Koa()
const JSON_MIME = 'application/json'
const {open, close} = require('./lib/db/connect')
const router = require('./routes')
open()
app.use(bodyParser({multipart: true}))

app.use(staticFiles(path.resolve(__dirname, "./uploads"),{
  maxage: 30*24*60*60*1000
}))

app.use(async (context, next)=>{
  context.type = JSON_MIME
  context.body = {
    status: 0
  }
  await next()
})

app.use(async(context, next)=>{
  try {
    // await open()
    await next()
  } catch (ex) {
    console.log( "code Error http" ,ex)
    if(context.status === 404 && context.body === ''){
      context.status = ex.code || 500
    }
  }
  // await close()
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(4001)
console.log('app start at 4001')