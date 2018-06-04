const model = require('../model/home.js');
const PAGE_SIZE = 10;

module.exports = {

    getUsers: async(ctx, next) => {

        let status = ctx.params.status || 'all';
        let style = 0;
        let index = ctx.request.query.index >> 0 || 1;

        let data = await model.getUsers(ctx.state.token, index, PAGE_SIZE, status);

        await ctx.render('home/users', {
            list: data.data,
            path: ctx.path,
            page: Math.ceil(data.count / PAGE_SIZE),
            index,
            status,
            style
        })

    },
    editUsers: async(ctx, next) => {
        let body = ctx.request.body;
        body.data.forEach(function(item, i){
            let data = {
                id: item,
                type: body.type
            }
            model.editUsers(data);
        });
    }
}