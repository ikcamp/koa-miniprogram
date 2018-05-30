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
router(app);
app.listen(3000);