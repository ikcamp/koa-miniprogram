const model = require('../model/home.js');
const axios = require('axios');

module.exports = {
    
    getPhotos: async(ctx, next) => {
        let status;
        let count = 12;
        let active = ctx.params.page ? parseInt(ctx.params.page) : 1;
        let style = ctx.request.querystring ? ctx.request.query.style : 3;

        switch(ctx.url){
            case '/photos/pending':   // 未审核
                status = null;
                break;
            case '/photos/accepted':  // 已通过
                status = true;
                break;
            case '/photos/rejected':  // 未通过
                status = false;
                break;
            default:                  // 全部
                break;
        }
        // 调专家接口拿数据
        //let res = await axios.get('');
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