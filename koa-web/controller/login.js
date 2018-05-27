const model = require('../model/home.js');

module.exports = {
    login: async(ctx, next) => {
        ctx.body = "Please login here.";
        console.log('Hello')
    }
}