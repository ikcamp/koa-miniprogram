const HOST = 'http://localhost:4001'
const SERVER_API = {
    ALBUM: '/album',
    LOGIN: '/login',
    PHOTO: '/photo'
}
const HTTP = (url, option = {}, fn = 'request') => {
    let sessionKey = wx.getStorageSync('sessionKey')
    url = HOST + url
    const opt = Object.assign({
        url,
        header: {
            'x-session': sessionKey
        }
    }, option)
    return wx[fn](opt)
}
module.exports = {
    HOST,
    FM: '../../assets/fengmian.png',
    getPics() {
        return HTTP(SERVER_API.ALBUM)
    },
    addPics(name) {
        return HTTP(SERVER_API.ALBUM, {
            method: 'post',
            data: {
                name
            }
        })
    },
    addPic(opt) {
        return HTTP(SERVER_API.PHOTO, opt, 'uploadFile')
    },
    getPic(id) {
        return HTTP(`${SERVER_API.ALBUM}/${id}`)
    },
    login(code) {
        return HTTP(SERVER_API.LOGIN, {
            data: {
                code: code
            }
        })
    },
    wxLogin() {
        const tthis = this
        return new Promise((resolve, reject) => {
            wx.login().then((res) => {
                tthis.login(res.code).then(response => {
                    const {
                        data
                    } = response.data
                    wx.setStorageSync('sessionKey', data.sessionKey)
                    resolve(data)
                }).catch(e => {
                    console.error('http error', e)
                    reject(e)
                })
            })
        })
    }
}