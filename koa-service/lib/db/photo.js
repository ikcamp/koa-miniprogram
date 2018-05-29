const {
  Phopto,
  Album
} = require('./model')

module.exports = {
  async add (openId, url, albumId) {
    try {
      await Album.update({
        _id: albumId
      }, {
        fm: url
      })
    } catch (e) {
      console.log(e)
    }
    return Phopto.create({
      openId,
      url,
      albumId
    })
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
    let result = await Phopto.find({
      openId,
      albumId,
      isApproved: true,
      isDelete: false
    }).sort({
      'created': -1
    }).skip((pageIndex - 1) * pageSize).limit(pageSize)
    return result
  },
  async getPhotosByAlbumId (albumId, pageIndex, pageSize) {
    return Phopto.find({
      albumId,
      isApproved: true,
      isDelete: false
    }).skip((pageIndex - 1) * pageSize).limit(pageSize)
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
