const model = require('../model/home.js');
const axios = require('axios');

module.exports = {

    getUsers: async(ctx, next) => {
        let status = ctx.params.status || 'all';
        let count = 10;
        let index = ctx.params.page ? parseInt(ctx.params.page) : 1;

        // 调专家接口拿数据
        let res = await axios.get(
            `https://api.ikcamp.cn/admin/user/${status}?pageIndex=${index}&pageSize=${count}`, { 
                headers: { 
                    'x-session': ctx.state.token 
                } 
            }
        );

        await ctx.render('home/users',{
            menu:model.getMenu(),
            activeMenu: 1,
            users: res.data.data.data || [],
            page: Math.ceil(res.data.data.count / count),
            index: index,
            status: status
        })
    },
    editUsers: async(ctx, next) => {

        let _type = ctx.request.body.type.toString();
        let res = await axios.put(`https://api.ikcamp.cn/admin/user/${ctx.params.id}`, { userType: _type}, { 
            headers: { 'x-session': ctx.state.token } 
        });

        ctx.body = res.data;
    }
}