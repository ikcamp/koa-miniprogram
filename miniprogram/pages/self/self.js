import connect from "../../utils/connect"
import SERVER from "../../server/index"
const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo
  }
}
Page(connect(mapStateToProps)({
  data: {
    motto: 'Hello World',
    canIUseUserInfo: wx.canIUse('button.open-type.getUserInfo'),
    canIUseOpenSetting: wx.canIUse('button.open-type.openSetting')
  },
  onLoad() {
    SERVER.wxLogin().finally(e=>{
      this.getUserInfo()
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getUserInfo() {
    wx.getUserInfo().then(res => {
      this.syncUserInfo(res)
    }).catch(e => {
      this.showModal()
    })
  },
  syncUserInfo(res) {
    this.__dispatch({
      type: "MODIFY_USER",
      datas: res.userInfo
    })
    SERVER.updateUserInfo({
      avatar: res.userInfo.avatarUrl,
      name: res.userInfo.nickName
    }).catch(e=>{
      console.log(e)
    })
  },
  getUserInfoHandle: function (e) {
    console.log(e)
    if (e.detail.userInfo) {
      this.syncUserInfo(e.detail)
    } else {
      const msg = "如需正常使用小程序功能，请点击【右上角】的设置图标进行授权，以便正常体验小程序。"
      this.showModal(msg)
    }
  },
  scanQrcodeHandle(e){
    wx.scanCode({
      onlyFromCamera: true
    }).then(res=>{
      SERVER.scanCode(res.result).then(e=>{
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000
        })
      }).catch(e=>{
        console.log(e)
      })
    }).catch(e=>{
      console.log(e)
    })
  },
  openSettingHandle(e){
    if(e.detail.authSetting['scope.userInfo']) this.getUserInfo()
  },
  showModal(msg) {
    msg = msg || '如需正常使用小程序功能，请点击【右上角】的设置图标，或者在【设置】-【隐私】-【授权管理】中授权，以便正常体验小程序'
    wx.showModal({
      title: '授权登录',
      content: msg,
      showCancel: false
    })
  }
}))