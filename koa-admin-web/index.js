const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const router = require('./router');
const nunjucks = require('koa-nunjucks-2');
const path = require('path');
const static = require('koa-static');

app.use(static(path.resolve(__dirname, "./public")))

app.use(nunjucks({
    ext:'html',
    path: path.join(__dirname,'views'),
    nunjucksConfig: {
        trimBlocks: true
    }
}))

app.use(bodyParser());

// 鉴权中间件
app.use(async(ctx, next) => {
    let identity = ctx.cookies.get('isAdmin');
    let whiteList = ['/login', '/qrcode', '/token', '/check'];
    let _match = whiteList.filter(function(item){
        return item === ctx.request.path;
    })
    if(_match.length === 0 && !identity){
        ctx.status = 302;
        ctx.redirect('/login');
    } else {
        await next();
    }
});
router(app);
app.listen(3000);