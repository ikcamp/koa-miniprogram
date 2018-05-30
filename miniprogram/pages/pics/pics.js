import SERVER from "../../server/index"
import connect from "../../utils/connect"
const mapStateToProps = (state) => {
  return {
    pics: state.pics
  }
}
Page(connect(mapStateToProps)({
  data: {
    hidden: true,
    Host: SERVER.HOST,
    fm: SERVER.FM
  },
  onLoad(){
    const {userInfo} = this.__Store.getState()
    if(!userInfo || !userInfo.datas){
      wx.showModal({
        title: '授权登录',
        content: '如需正常使用小程序功能，请授权登录。',
        showCancel: false
      }).then(res=>{
        wx.reLaunch({
          url: "/pages/self/self"
        })
      })
      return
    }
    if(!wx.getStorageSync('sessionKey')){
      SERVER.wxLogin().then(res=>{
        this.getPics()
      })
    }else{
      this.getPics()
    }
  },
  getPics() {
    SERVER.getPics().then(res => {
      const _data = res.data
      if (_data.status == 0) {
        this.__dispatch({
          type: "MODIFY_PICS",
          datas: _data.data || []
        })
      }
    })
  },
  create() {
    this.setData({
      hidden: false
    })
  },
  onAddPics(e) {
    const {
      name
    } = e.detail
    wx.showLoading({
      title: '网络连接中',
    })
    SERVER.addPics(name).then(res => {
      if (res.data.status == 0) {
        this.getPics()
      }
    }).finally(() => {
      wx.hideLoading()
      this.setData({
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
}))