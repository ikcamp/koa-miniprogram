const axios = require('axios');
const PAGE_SIZE = 12;

module.exports = {

    getPhotos: async (ctx, next) => {

        let status = ctx.params.status || 'all';
        let style = ctx.request.query.style >> 0 || 3;
        let index = ctx.request.query.index >> 0 || 1;

        let res = await axios.get(`https://api.ikcamp.cn/admin/photo/${status}?pageIndex=${index}&pageSize=${PAGE_SIZE}`, { headers: { 'x-session': ctx.state.token } });

        await ctx.render('home/photos', {
            list: res.data.status !== 0 ? [] : res.data.data.data,
            path: ctx.path,
            page: Math.ceil(res.data.data.count / PAGE_SIZE),
            index,
            status,
            style
        })

    },
    updatePhotos: async (ctx, next) => {

        let { id } = ctx.params;
        let { isApproved } = ctx.request.body;

        let res = await axios.put(`https://api.ikcamp.cn/admin/photo/${id}`, { isApproved }, { headers: { 'x-session': ctx.state.token } });

        ctx.body = res.data;
    }
}