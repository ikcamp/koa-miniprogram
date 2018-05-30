// 定义数据结构
let menuData = [{
    title: '照片管理',
    icon: 'image',
    url: '/photos'
},{
    title: '用户管理',
    icon: 'users',
    url: '/users'
}];

let photoData = [{
    openId: 100,
    url: '../assets/img/timg.jpeg',
    isApproved: null,
    albumId: 101,
    created: 1526983766864
},{
    openId: 101,
    url: '../assets/img/timg.jpeg',
    isApproved: null,
    albumId: 101,
    created: 1526983766864
},{
    openId: 102,
    url: '../assets/img/timg.jpeg',
    isApproved: false,
    albumId: 101,
    created: 1526983766864
},{
    openId: 103,
    url: '../assets/img/timg.jpeg',
    isApproved: true,
    albumId: 101,
    created: 1526983766864
},{
    openId: 104,
    url: '../assets/img/timg.jpeg',
    isApproved: null,
    albumId: 101,
    created: 1526983766864
}];

let userData = [{
    openId: 100,
    created: 1526983766864,
    lastLogin: 1526983766868,
    name: 'Au',
    status: 1,
    sessionKey: ''
},{
    openId: 101,
    created: 1526983766864,
    lastLogin: 1526983766868,
    name: 'ZY',
    status: 0,
    sessionKey: ''
},{
    openId: 102,
    created: 1526983766864,
    lastLogin: 1526983766868,
    name: 'XYZ',
    status: 2,
    sessionKey: ''
},{
    openId: 103,
    created: 1526983766864,
    lastLogin: 1526983766868,
    name: 'DL',
    status: 0,
    sessionKey: ''
},{
    openId: 104,
    created: 1526983766864,
    lastLogin: 1526983766868,
    name: 'DF',
    status: 0,
    sessionKey: ''
}];

module.exports = {
    getMenu: function() {
        return menuData;
    },
    getPhotos: function(status) {
        if (status === undefined) {
            return photoData;
        } else {
            return photoData.filter(function (photo) {
                return photo.isApproved === status;
            });
        }
    },
    editPhotos: function(data) {
        photoData.forEach(function(item){
            if(item.openId === data.id){
                item.isApproved = data.type
            }
        })
    },
    getUsers: function(status) {
        if (status === undefined) {
            return userData;
        } else {
            return userData.filter(function (user) {
                return user.status === status;
            });
        }
    },
    editUsers: function(data) {
        userData.forEach(function(item){
            if(item.openId === data.id){
                item.status = data.type;
            }
        })
    }
}

