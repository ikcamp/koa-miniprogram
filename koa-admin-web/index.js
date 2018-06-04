const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const router = require('./router');
const nunjucks = require('koa-nunjucks-2');
const path = require('path');
const static = require('koa-static');
const axios = require('axios');
const util = require('./utils/util');

app.use(static(path.resolve(__dirname, "./public")))

app.use(nunjucks({
    ext: 'html',
    path: path.join(__dirname, 'views'),
    nunjucksConfig: {
        trimBlocks: true
    }
}))

app.use(bodyParser());

// 鉴权中间件
app.use(async (ctx, next) => {

    let _match = ['/login', '/qrcode', '/token', '/check'].indexOf(ctx.request.path) >= 0;

    if (!_match) {

        let token = util.getToken(ctx);

        if (!token) {
            util.redirectToLogin(ctx)
        } else {
            let res = await axios.get('https://api.ikcamp.cn/my', { headers: { 'x-session': token } });

            if (!res.data ||
                res.data.status !== 0 ||
                !res.data.data ||
                !res.data.data.isAdmin) {

                util.redirectToLogin(ctx)
            } else {
                ctx.state.ikcamp = res.data.data;
                ctx.state.token = token;
            }
        }
    }

    await next();
});

router(app);
app.listen(3000);