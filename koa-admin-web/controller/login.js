const model = require('../model/home.js');
const axios = require('axios');

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
            ctx.cookies.set('token',res.data.data.sessionKey);
        }
    },
    checkAuth: async(ctx, next) => {
        let _token = ctx.cookies.get('token');
        const res = await axios.get('https://api.ikcamp.cn/my',{
            headers:{
                'x-session': _token
            }
        });
        ctx.response.body = res.data;
    }
}