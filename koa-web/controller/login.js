const model = require('../model/home.js');
const axios = require('axios');

module.exports = {
    index: async(ctx, next) => {
        await ctx.render('login/login');
    },
    getQrcode: async(ctx, next) => {
        const res = await axios.get('https://api.ikcamp.cn/login/ercode')
        ctx.response.body = res.data.data;
    },
    checkAuth: async(ctx, next) => {
        let code = parseInt(ctx.query.code);
        const res = await axios.get(`https://api.ikcamp.cn/login/errcode/check/${code}`)
        console.log(res)
        if(res.status === 200){
            ctx.response.body = res.data.status;
        } else {
            ctx.response.body = -1;
        }
    }
}