const {
  Phopto
} = require('./model')

module.exports = {
  async add (userId, url, albumId) {
    let _photo = await Phopto.create({
      userId,
      url,
      albumId
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
  async getPhotos (userId, albumId, pageIndex, pageSize) {
    let result
    if (pageSize) {
      result = await Phopto.find({
        userId,
        albumId,
        isApproved: true,
        isDelete: false
      }).sort({
        'created': -1
      }).skip((pageIndex - 1) * pageSize).limit(pageSize)
    } else {
      result = result = await Phopto.find({
        userId,
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
    if (pageSize) {
      result = await Phopto.find({
        albumId,
        isApproved: true,
        isDelete: false
      }).skip((pageIndex - 1) * pageSize).limit(pageSize)
    } else {
      result = await Phopto.find({
        albumId,
        isApproved: true,
        isDelete: false
      }).sort({
        'updated': -1
      })
    }
    return result
  },
  async getApprovingPhotos (pageIndex, pageSize) {
    return Phopto.find({
      isApproved: null,
      isDelete: false
    }).skip((pageIndex - 1) * pageSize).limit(pageSize)
  },
  async getAll (pageIndex, pageSize) {
    return Phopto.find({
      isDelete: false
    }).skip((pageIndex - 1) * pageSize).limit(pageSize)
  },
  async getApprovedPhotos (pageIndex, pageSize) {
    return Phopto.find({
      isApproved: true,
      isDelete: false
    }).skip((pageIndex - 1) * pageSize).limit(pageSize)
  },
  async getUnApprovedPhotos (pageIndex, pageSize) {
    return Phopto.find({
      isApproved: false,
      isDelete: false
    }).skip((pageIndex - 1) * pageSize).limit(pageSize)
  },
  async getPhotoById (id) {
    return Phopto.findById(id)
  }
}
