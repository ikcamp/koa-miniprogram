const {
  Album
} = require('./model')

module.exports = {
  async add (openId, name) {
    return Album.create({
      openId,
      name
    })
  },
  async delete (id) {
    return Album.deleteOne({
      _id: id
    })
  },
  async update (id, name) {
    return Album.update({
      _id: id
    }, {
      name: name
    })
  },
  async getAlbums (openId, pageIndex, pageSize) {
    let result 
    if(pageSize){
      result = await Album.find({
        openId
      }).skip((pageIndex - 1) * pageSize).limit(pageSize)
    }else{
      result = await Album.find({
        openId
      }).sort({
        'updated': -1
      })
    }
    return result
  }
}
