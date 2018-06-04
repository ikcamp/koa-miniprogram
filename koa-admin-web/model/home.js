const axios = require('axios');

let userData = [{
    openId: 100,
    created: 1526983766864,
    lastLogin: 1526983766868,
    name: 'Au',
    status: 1,
    sessionKey: ''
}, {
    openId: 101,
    created: 1526983766864,
    lastLogin: 1526983766868,
    name: 'ZY',
    status: 0,
    sessionKey: ''
}, {
    openId: 102,
    created: 1526983766864,
    lastLogin: 1526983766868,
    name: 'XYZ',
    status: 2,
    sessionKey: ''
}, {
    openId: 103,
    created: 1526983766864,
    lastLogin: 1526983766868,
    name: 'DL',
    status: 0,
    sessionKey: ''
}, {
    openId: 104,
    created: 1526983766864,
    lastLogin: 1526983766868,
    name: 'DF',
    status: 0,
    sessionKey: ''
}];

module.exports = {
    async getPhotos(token, pageIndex, pageSize, status) {

        let res = await axios.get(`https://api.ikcamp.cn/admin/photo/${status}?pageIndex=${pageIndex}&pageSize=${pageSize}`, { headers: { 'x-session': token } });

        return res.data.status !== 0 ? [] : res.data.data
    },
    editPhotos: function (data) {
        photoData.forEach(function (item) {
            if (item.openId === data.id) {
                item.isApproved = data.type
            }
        })
    },
    async getUsers(token, pageIndex, pageSize, status) {

        let res = await axios.get(`https://api.ikcamp.cn/admin/user/${status}?pageIndex=${pageIndex}&pageSize=${pageSize}`, { headers: { 'x-session': token } });

        return res.data.status !== 0 ? [] : res.data.data
    },
    editUsers: function (data) {
        userData.forEach(function (item) {
            if (item.openId === data.id) {
                item.status = data.type;
            }
        })
    }
}