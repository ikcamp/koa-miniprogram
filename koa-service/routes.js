const Router = require('koa-router')
const router = new Router()
const account = require('./actions/account')
const auth = require('./middlewares/auth')
const photo = require('./actions/photo')
const uuid = require('uuid')
const multer = require('koa-multer')
const path = require('path')

router.get('/login', async (context, next) => {
  const code = context.query.code
  context.body = {
    status: 0,
    data: await account.login(code)
  }
})

router.get('/updateUserName', async (context, next) => {
  const {
    name
  } = context.query
  const sessionKey = context.get('x-session')
  await account.updateUserName(sessionKey, name)
})

router.get('/album', auth, async (context, next) => {
  const albums = await photo.getAlbums(context.state.openId)
  context.body = {
    data: albums,
    status: 0
  }
})

router.get('/album/:id', auth, async (context, next) => {
  const photos = await photo.getPhotos(context.state.openId ,context.params.id)
  context.body = {
    status: 0,
    data: photos
  }
})

router.post('/album', auth, async (context, next) => {
  const {name} = context.request.body
  await photo.addAlbum(context.state.openId, name)
})

router.put('/album/:id', auth, async (context, next) => {
  await photo.updateAlbum(context.params.id, context.body.name)
})

router.del('/album/:id', auth, async (context, next) => {
  await photo.deleteAlbum(context.params.id)
})

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename(req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, uuid.v4() + ext)
  }
})

const uplader = multer({
  storage: storage
})

router.post('/photo', auth, uplader.single('file'), async (context, next) => {
  const {file} = context.req
  const {id} = context.req.body
  await photo.add(context.state.openId, file.filename, id)
})

router.delete('/photo/:id', auth, async (context, next) => {
  const p = await photo.getPhotoById(context.params.id)
  if (p) {
    if (p.openId === context.state.openId || context.state.isAdmin) {
      await photo.delete(id)
    } else {
      context.throw(403, '该用户无权限')
    }
  }
})

router.get('/photo/aprove', auth, async (context, next) => {
  if (context.state.isAdmin) {
    const photos = await photo.getApprovingPhotos()
    context.body = {
      status: 0,
      data: photos
    }
  } else {
    context.throw(403, '该用户无权限')
  }
})

router.put('/photo/approve/:id', auth, async (context, next) => {
  if (context.state.isAdmin) {
    await photo.approve(context.params.id)
  } else {
    context.throw(403, '该用户无权限')
  }
})

module.exports = router