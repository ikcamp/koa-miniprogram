const router = require('koa-router')();

const loginController = require('./controller/login');
const photoController = require('./controller/photo');
const userController = require('./controller/user');

module.exports = (app) => {
    // 获取登陆页面
    router.get('/login',loginController.index);
    router.get('/qrcode',loginController.getQrcode);
    router.get('/check',loginController.checkAuth);
    
    // 获取照片列表
    router.get('/photos',photoController.getPhotos);
    router.get('/photos/:page',photoController.getPhotos);
    router.get('/photos/pending',photoController.getPhotos);
    router.get('/photos/accepted',photoController.getPhotos);
    router.get('/photos/rejected',photoController.getPhotos);
    // 操作照片
    router.post('/photos',photoController.editPhotos);
    
    // 获取用户列表
    router.get('/users',userController.getUsers);
    router.get('/users/:page',userController.getUsers);
    router.get('/users/admin',userController.getUsers);
    router.get('/users/ordinary',userController.getUsers);
    router.get('/users/blocked',userController.getUsers);
    // 操作用户权限
    router.post('/users',userController.editUsers);

    app.use(router.routes()).use(router.allowedMethods());
}