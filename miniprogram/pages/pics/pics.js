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
  onShow(){
    this.getPics()
  },
  getPics() {
    SERVER.getPics().then(res => {
      this.setData({ pics: res.data.data })
    })
  },
  create() {
    this.setData({ hidden: false })
  },
  onAddPics(e) {

    wx.showLoading({ title: '提交中...', mask: true })

    SERVER.addPics(e.detail.name).then(res => {
      if (res.data.status == 0) this.getPics()
    }).finally(() => {
      wx.hideLoading()
      this.setData({ hidden: true })
    })
  },
  onGoBack() {
    wx.hideLoading()
    this.setData({ hidden: true })
  },
  toDetail(evt) {
    let { id, name } = evt.currentTarget.dataset
    wx.navigateTo({ url: `../pic/pic?id=${id}&name=${name}` })
  }
}))