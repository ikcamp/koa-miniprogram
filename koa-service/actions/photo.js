const photo = require('../lib/db/photo')
const album = require('../lib/db/album')
module.exports = {
  async getPhotos (openId, albumId, pageIndex, pageSize) {
    return photo.getPhotos(openId, albumId, pageIndex, pageSize)
  },
  async getApprovingPhotos (pageIndex, pageSize) {
    return photo.getApprovingPhotos(pageIndex, pageSize)
  },
  async approve (id) {
    return photo.approve()
  },
  async delete (id) {
    return photo.delete(id)
  },
  async add (openId, url, albumId) {
    return photo.add(openId, url, albumId)
  },
  async getPhotoById (id) {
    return photo.getPhotoById(id)
  },
  async getAlbums (openId, pageIndex, pageSize) {
    let albums
    if(pageSize){
      albums = await album.getAlbums(openId, pageIndex, pageSize)
      return Promise.all(albums.map(item => {
        const id = item._id
        return photo.getPhotosByAlbumId(id).then(ps => {
          return Object.assign({
            photoCount: ps.length
          }, item)
        })
      }))
    }else{
      albums = await album.getAlbums(openId)
      return Promise.all(albums.map(async function(item){
        const id = item._id
        return await photo.getPhotosByAlbumId(id).then(ps => {
          return Object.assign({
            photoCount: ps.length,
            fm: ps[0] && ps[0].url || null
          }, item)
        })
      }))
    }
  },
  async addAlbum (openId, name) {
    return album.add(openId, name)
  },
  async updateAlbum (id, name) {
    return album.update(id, name)
  },
  async deleteAlbum (id) {
    const photos = await photo.getPhotosByAlbumId(id)
    if (photos.length) {
      throw new Error('相册还存在相片，不允许删除')
    }
    return album.delete(id)
  }
}
