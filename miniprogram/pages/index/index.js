import SERVER from "../../server/index"
Page({
  data: {
    hidden: true,
    Host: SERVER.HOST,
    fm: SERVER.FM,
    pics: []
  },
  onShow(){
    this.getPics()
  },
  getPics() {
    const tthis = this
    SERVER.getPics().then(res => {
      const _data = res.data
      if (_data.status == 0) {
        tthis.setData({
          pics: _data.data || []
        })
      }
    }).catch(e => {
      console.error("http error", e)
    })
  },
  create() {
    this.setData({
      hidden: false
    })
  },
  onAddPics(e) {
    const tthis = this
    const {
      name
    } = e.detail
    wx.showLoading({
      title: '网络连接中',
    })
    SERVER.addPics(name).then(res => {
      if (res.data.status == 0) {
        tthis.getPics()
      }
    }).finally(() => {
      wx.hideLoading()
      tthis.setData({
        hidden: true
      })
    })
  },
  onGoBack() {
    wx.hideLoading()
    this.setData({
      hidden: true
    })
  },
  toDetail(evt) {
    const {
      id,
      name
    } = evt.currentTarget.dataset
    wx.navigateTo({
      url: `../pic/pic?id=${id}&name=${name}`
    })
  }
})