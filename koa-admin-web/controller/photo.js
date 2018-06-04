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

        let res = await axios.put(`https://api.ikcamp.cn/admin/photo/${id}`, ctx.request.body, { headers: { 'x-session': ctx.state.token } });

        debugger;
        ctx.body = {
            status: 0
        }
        // let body = ctx.request.body;
        // body.data.forEach(function (item, i) {
        //     let data = {
        //         id: item,
        //         type: body.type === 0 ? null : (body.type === 1 ? true : false)
        //     }
        //     model.editPhotos(data);
        // });
    }
}