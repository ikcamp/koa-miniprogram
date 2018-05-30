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
        const res = await axios.get(`https://api.ikcamp.cn/login/errcode/check/${ctx.query.code}`)
        console.log(res)
    }
}