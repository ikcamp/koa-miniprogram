const {
  Phopto,
  Album
} = require('./model')

module.exports = {
  async add (openId, url, albumId) {
    let _photo = await Phopto.create({
      openId,
      url,
      albumId
    })
    await Album.update({
      _id: albumId
    }, {
      photoId: _photo._id
    })
    return _photo
  },
  async approve (id) {
    return Phopto.update({
      _id: id
    }, {
      isApproved: true
    })
  },
  async delete (id) {
    return Phopto.update({
      _id: id
    }, {
      isDelete: true
    })
  },
  async getPhotos (openId, albumId, pageIndex, pageSize) {
    let result 
    if(pageSize){
      result = await Phopto.find({
        openId,
        albumId,
        isApproved: true,
        isDelete: false
      }).sort({
        'created': -1
      }).skip((pageIndex - 1) * pageSize).limit(pageSize)
    }else{
      result = result = await Phopto.find({
        openId,
        albumId,
        isApproved: true,
        isDelete: false
      }).sort({
        'created': -1
      })
    }
    return result
  },
  async getPhotosByAlbumId (albumId, pageIndex, pageSize) {
    let result
    if(pageSize){
      result = await Phopto.find({
        albumId,
        isApproved: true,
        isDelete: false
      }).skip((pageIndex - 1) * pageSize).limit(pageSize)
    }else{
      result = await Phopto.find({
        albumId,
        isApproved: true,
        isDelete: false
      })
    }
    return result
  },
  async getApprovingPhotos (pageIndex, pageSize) {
    return Phopto.find({
      isApproved: false,
      isDelete: false
    }).skip((pageIndex - 1) * pageSize).limit(pageSize)
  },
  async getPhotoById (id) {
    return Phopto.findById(id)
  }
}
