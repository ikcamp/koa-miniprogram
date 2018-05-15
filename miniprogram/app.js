import "./utils/toPromise"
import SERVER from './server/index'
App({
  onLaunch() {
    wx.checkSession().then(()=>{
      if(!wx.getStorageSync('sessionKey')){
        SERVER.wxLogin().then(res=>{
          console.log("new session", res)
        })
      }
    }).catch(e=>{
      SERVER.wxLogin().then(res=>{
        console.log("new session", res)
      })
    })
  }
})