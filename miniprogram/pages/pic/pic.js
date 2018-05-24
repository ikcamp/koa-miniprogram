import SERVER from "../../server/index"
import {formatTime} from "../../utils/formatTime"
const {Store} = getApp()
const dispatch = Store.dispatch
Page({
  data: {
    id: '',
    name: '相册',
    fm: SERVER.FM,
    pics: [],
    nums: 0
  },
  onLoad(options) {
    const {
      id,
      name
    } = options
    this.setData({
      id,
      name
    })
    wx.setNavigationBarTitle({
      title: name
    })
    this.getPic()
  },
  getPic() {
    SERVER.getPic(this.data.id).then(res => {
      if (res.data.status == 0) {
        const _data = res.data.data
        let pics = _data.length === 0 ? [] : this.reSort( _data )
        this.setData({
          pics,
          nums: _data.length 
        })
      }
    }).catch(e=>{
      wx.showModal({
        title: '提示',
        content: '获取照片信息失败'
      })
    })
  },
  reSort(d = []) {
    let result = []
    let flag = null
    d.forEach(e => {
      let eT = formatTime(new Date(e.created))
      e.created = eT
      e.url = SERVER.HOST + '/' + e.url
      let _index = result.length
      if (eT !== flag) {
        flag = eT
      }else{
        _index -= 1
      }
      result[_index] = result[_index] || []
      result[_index].push(e) 
    })
    this.setData({
      fm: result[0][0].url
    })
    return result
  },
  upload(evt) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera']
    }).then(res => {
      let tempFilePaths = res.tempFilePaths
      SERVER.addPic({
        filePath: tempFilePaths[0],
        name: 'file',
        formData: {
          id: this.data.id
        }
      }).then(res => {
        let data = res.data
        this.getPic()
        this.updatePics()
      }).catch(e=>{
        wx.showModal({
          title: '提示',
          content: '上传照片失败'
        })
      })
    })
  },
  updatePics(){
    SERVER.getPics().then(res => {
      const _data = res.data
      if (_data.status == 0) {
        dispatch({
          type: "MODIFY_PICS",
          datas: _data.data || []
        })
      }
    }).catch(e => {
      wx.showModal({
        title: '提示',
        content: '更新相册信息失败'
      })
    })
  },
  previewImage(e) {
    let current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: [current]
    })
  }
})