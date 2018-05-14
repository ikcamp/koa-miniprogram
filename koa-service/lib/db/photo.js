const {
  Phopto, Album
} = require('./model')

module.exports = {
  async add(openId, url, albumId) {
    try{
      await Album.update({
        _id: albumId
      },{
        fm: url
      })
    }catch(e){
      console.log(e)
    }
    return Phopto.create({
      openId,
      url,
      albumId
    })
  },
  async approve(id) {
    return Phopto.update({
      _id: id
    }, {
      isApproved: true
    })
  },
  async delete(id) {
    return Phopto.deleteOne({
      _id: id
    })
  },
  async getPhotos(openId, albumId) {
    let result = await Phopto.find({
      openId,
      albumId,
      isApproved: true
    }).sort({'created': -1})
    return result
  },
  async getPhotosByAlbumId(albumId) {
    return Phopto.find({
      albumId,
      isApproved: true
    })
  },
  async getApprovingPhotos() {
    return Phopto.find({
      isApproved: false
    })
  },
  async getPhotoById(id) {
    return Phopto.findById(id)
  }
}