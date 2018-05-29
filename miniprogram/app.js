import './utils/toPromise'
import Store from './reducers/index'
import SERVER from './server/index'
App({
  Store,
  onLaunch() {
    wx.checkSession().then(()=>{
      if(!wx.getStorageSync('sessionKey')){
        SERVER.wxLogin().then(res=>{
          this.getPics()
        })
      }else{
        this.getPics()
      }
    }).catch(e=>{
      SERVER.wxLogin().then(res=>{
        this.getPics()
      })
    })
  },
  getPics(){
    SERVER.getPics().then(res => {
      const _data = res.data
      if (_data.status == 0) {
        Store.dispatch({
          type: "MODIFY_PICS",
          datas: _data.data || []
        })
      }
    })
  }
})