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
  async update (id, photo) {
    return Phopto.update({
      _id: id
    }, photo)
  },
  async approve (id, state) {
    return Phopto.update({
      _id: id
    }, {
      isApproved: state || true
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
  async getPhotosCount (userId, albumId) {
    return Phopto.count({
      userId,
      albumId,
      isApproved: true,
      isDelete: false
    })
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
  async getPhotosByAlbumIdCount (albumId) {
    return Phopto.count({
      albumId,
      isApproved: true,
      isDelete: false
    })
  },
  async getApprovingPhotos (pageIndex, pageSize) {
    return Phopto.find({
      isApproved: null,
      isDelete: false
    }).skip((pageIndex - 1) * pageSize).limit(pageSize)
  },
  async getApprovingPhotosCount () {
    return Phopto.count({
      isApproved: null,
      isDelete: false
    })
  },
  async getAll (pageIndex, pageSize) {
    return Phopto.find({
      isDelete: false
    }).skip((pageIndex - 1) * pageSize).limit(pageSize)
  },
  async getAllCount () {
    return Phopto.count({
      isDelete: false
    })
  },
  async getApprovedPhotos (pageIndex, pageSize) {
    return Phopto.find({
      isApproved: true,
      isDelete: false
    }).skip((pageIndex - 1) * pageSize).limit(pageSize)
  },
  async getApprovedPhotosCount () {
    return Phopto.count({
      isApproved: true,
      isDelete: false
    })
  },
  async getUnApprovedPhotos (pageIndex, pageSize) {
    return Phopto.find({
      isApproved: false,
      isDelete: false
    }).skip((pageIndex - 1) * pageSize).limit(pageSize)
  },
  async getUnApprovedPhotosCount () {
    return Phopto.count({
      isApproved: false,
      isDelete: false
    })
  },
  async getPhotoById (id) {
    return Phopto.findById(id)
  }
}
