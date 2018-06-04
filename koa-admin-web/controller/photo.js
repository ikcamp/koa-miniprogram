const model = require('../model/home.js');
const PAGE_SIZE = 12;

module.exports = {

    getPhotos: async (ctx, next) => {

        let status = ctx.params.status || 'all';
        let style = ctx.request.query.style >> 0 || 3;
        let index = ctx.request.query.index >> 0 || 1;

        let data = await model.getPhotos(ctx.state.token, index, PAGE_SIZE, status);

        await ctx.render('home/photos', {
            list: data.data,
            path: ctx.path,
            page: Math.ceil(data.count / PAGE_SIZE),
            index,
            status,
            style
        })

    },
    editPhotos: async (ctx, next) => {
        let body = ctx.request.body;
        body.data.forEach(function (item, i) {
            let data = {
                id: item,
                type: body.type === 0 ? null : (body.type === 1 ? true : false)
            }
            model.editPhotos(data);
        });
    }
}