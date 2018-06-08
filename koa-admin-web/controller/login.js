const model = require('../model/home.js');
const axios = require('axios');
const util = require('../util/util.js');

module.exports = {
    index: async(ctx, next) => {
        await ctx.render('login/login');
    },
    getQrcode: async(ctx, next) => {
        const res = await axios.get('https://api.ikcamp.cn/login/ercode');
        ctx.response.body = res.data.data;
    },
    getToken: async(ctx, next) => {
        const res = await axios.get(`https://api.ikcamp.cn/login/errcode/check/${ctx.query.code}`);
        ctx.response.body = res.data;
        if(res.data.data){
            util.setToken(ctx, res.data.data.sessionKey);
        }
    },
    checkAuth: async(ctx, next) => {
        let res = await axios.get('https://api.ikcamp.cn/my', {
            headers: {
                'x-session': util.getToken(ctx)
            }
        });
        ctx.response.body = res.data;
    },
    logout: async(ctx, next) => {
        util.redirectToLogin(ctx);
    }
}