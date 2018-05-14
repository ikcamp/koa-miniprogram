const photo = require('../lib/db/photo')
const album = require('../lib/db/album')
module.exports = {
  async getPhotos(openId, albumId) {
    return await photo.getPhotos(openId, albumId)
  },
  async getApprovingPhotos() {
    return await photo.getApprovingPhotos()
  },
  async approve(id) {
    return await photo.approve()
  },
  async delete(id) {
    return await photo.delete(id)
  },
  async add(openId,url,albumId) {
    return await photo.add(openId, url, albumId)
  },
  async getPhotoById(id) {
    return await photo.getPhotoById(id)
  },
  async getAlbums(openId) {
    const albums = await album.getAlbums(openId)
    return Promise.all(albums.map(item => {
      const id = item._id
      return photo.getPhotosByAlbumId(id).then(ps => {
        return Object.assign({
          photoCount: ps.length
        }, item)
      })
    }))
  },
  async addAlbum(openId, name) {
    return await album.add(openId, name)
  },
  async updateAlbum(id, name) {
    return await album.update(id, name)
  },
  async deleteAlbum(id) {
    const photos = await photo.getPhotosByAlbumId(id)
    if (photos.length) {
      throw new Error('相册还存在相片，不允许删除')
    }
    return await album.delete(id)
  }
}