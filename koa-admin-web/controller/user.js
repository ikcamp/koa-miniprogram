const axios = require('axios');
const PAGE_SIZE = 10;

module.exports = {

    getUsers: async(ctx, next) => {

        let status = ctx.params.status || 'all';
        let style = 0;
        let index = ctx.request.query.index >> 0 || 1;

        let res = await axios.get(`https://api.ikcamp.cn/admin/user/${status}?pageIndex=${index}&pageSize=${PAGE_SIZE}`, { headers: { 'x-session': ctx.state.token } });

        await ctx.render('home/users', {
            list: res.data.status !== 0 ? [] : res.data.data.data,
            path: ctx.path,
            page: Math.ceil(res.data.data.count / PAGE_SIZE),
            index,
            status,
            style
        })

    },
    updateUsers: async(ctx, next) => {
        let { id } = ctx.params;
        let { userType } = ctx.request.body;

        let res = await axios.put(`https://api.ikcamp.cn/admin/user/${id}`, { userType }, { headers: { 'x-session': ctx.state.token } });

        ctx.body = res.data;
    }
}