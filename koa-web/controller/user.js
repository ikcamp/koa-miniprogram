const model = require('../model/home.js');

module.exports = {

    getUsers: async(ctx, next) => {
        let status;
        let count = 10;
        let active = ctx.params.page ? parseInt(ctx.params.page) : 1;

        switch(ctx.url){
            case '/users/admin':
                status = 1
                break;
            case '/users/ordinary':
                status = 0
                break;
            case '/users/blocked':
                status = 2
                break;
            default:
                break;
        }
        // 调专家接口拿数据
        await ctx.render('home/users',{
            menu:model.getMenu(),
            activeMenu: 1,
            users: model.getUsers(status),
            page: 24/count,
            active: active
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