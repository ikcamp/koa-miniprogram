const {
  Album
} = require('./model')

module.exports = {
  async add(openId, name) {
    return Album.create({
      openId,
      name
    })
  },
  async delete(id) {
    return Album.deleteOne({
      _id: id
    })
  },
  async update(id, name) {
    return Album.update({
      _id: id
    }, {
      name: name
    })
  },
  async getAlbums(openId) {
    return Album.find({
      openId
    })
  }
}