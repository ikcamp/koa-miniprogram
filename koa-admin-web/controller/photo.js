const model = require('../model/home.js');

module.exports = {
    
    getPhotos: async(ctx, next) => {
        let status;
        let count = 12;
        let active = ctx.params.page ? parseInt(ctx.params.page) : 1;
        let style = ctx.request.querystring ? ctx.request.query.style : 3;

        switch(ctx.url){
            case '/photos/pending':
                status = null;
                break;
            case '/photos/accepted':
                status = true;
                break;
            case '/photos/rejected':
                status = false;
                break;
            default:
                break;
        }
        // 调专家接口拿数据
        await ctx.render('home/photos',{
            menu:model.getMenu(),
            activeMenu: 0,
            photos: model.getPhotos(status),
            page: 24/count,
            active: active,
            style: style
        })
    },
    editPhotos: async(ctx, next) => {
        let body = ctx.request.body;
        body.data.forEach(function(item, i){
            let data = {
                id: item,
                type: body.type === 0 ? null : (body.type === 1 ? true : false)
            }
            model.editPhotos(data);
        });
    }
}