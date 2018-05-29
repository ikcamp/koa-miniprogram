const Router = require('koa-router')
const router = new Router()
const account = require('./actions/account')
const auth = require('./middlewares/auth')
const photo = require('./actions/photo')
const uuid = require('uuid')
const multer = require('koa-multer')
const path = require('path')

async function responseOK (ctx, next) {
  ctx.body = {
    status: 0
  }
  await next()
}

router.get('/login', async (context, next) => {
  const code = context.query.code
  context.body = {
    status: 0,
    data: await account.login(code)
  }
})

router.get('/updateUserName', auth, async (context, next) => {
  const {
    name
  } = context.query
  const sessionKey = context.get('x-session') || context.cookies.get('session_id')
  await account.updateUserName(sessionKey, name)
}, responseOK)

router.get('/login/ercode', async (context, next) => {
  context.body = {
    status: 0,
    data: await account.getErCode()
  }
})

router.put('/login/ercode/:code', auth, async (context, next) => {
  const code = context.params.code
  const sessionKey = context.body.sessionKey
  await account.setSessionKeyForCode(code, sessionKey)
}, responseOK)

router.get('/login/errcode/check/:code', async (context, next) => {
  const startTime = Date.now()
  async function login () {
    const code = context.params.code
    const sessionKey = await account.getSessionKeyByCode(code)
    if (sessionKey) {
      context.cookies.set('session_id', sessionKey, {
        httpOnly: true
      })
      context.body = {
        status: 0
      }
    } else {
      if (Date.now() - startTime < 10000) {
        process.nextTick(login)
      } else {
        context.body = {
          status: -1
        }
      }
    }
  }
  await login()
})

router.get('/album', auth, async (context, next) => {
  const albums = await photo.getAlbums(context.state.openId, context.query.pageIndex || 1, context.query.pageSize || 10)
  context.body = {
    data: albums,
    status: 0
  }
})

router.get('/album/:id', auth, async (context, next) => {
  const photos = await photo.getPhotos(context.state.openId, context.params.id, context.query.pageIndex || 1, context.query.pageSize || 10)
  context.body = {
    status: 0,
    data: photos
  }
})

router.post('/album', auth, async (context, next) => {
  const {
    name
  } = context.request.body
  await photo.addAlbum(context.state.openId, name)
}, responseOK)

router.put('/album/:id', auth, async (context, next) => {
  await photo.updateAlbum(context.params.id, context.body.name)
}, responseOK)

router.del('/album/:id', auth, async (context, next) => {
  await photo.deleteAlbum(context.params.id)
}, responseOK)

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, uuid.v4() + ext)
  }
})

const uplader = multer({
  storage: storage
})

router.post('/photo', auth, uplader.single('file'), async (context, next) => {
  const {
    file
  } = context.req
  const {
    id
  } = context.req.body
  await photo.add(context.state.openId, file.filename, id)
}, responseOK)

router.delete('/photo/:id', auth, async (context, next) => {
  const p = await photo.getPhotoById(context.params.id)
  if (p) {
    if (p.openId === context.state.openId || context.state.isAdmin) {
      await photo.delete(context.params.id)
    } else {
      context.throw(403, '该用户无权限')
    }
  }
}, responseOK)

router.get('/admin/photo/aprove', auth, async (context, next) => {
  if (context.state.isAdmin) {
    const photos = await photo.getApprovingPhotos(context.query.pageIndex || 1, context.query.pageSize || 10)
    context.body = {
      status: 0,
      data: photos
    }
  } else {
    context.throw(403, '该用户无权限')
  }
})

router.put('/admin/photo/approve/:id', auth, async (context, next) => {
  if (context.state.isAdmin) {
    await photo.approve(context.params.id)
  } else {
    context.throw(403, '该用户无权限')
  }
  await next()
}, responseOK)

router.get('/admin/user', async (context, next) => {
  context.body = {
    status: 0,
    data: await account.getUsers(context.query.pageIndex || 1, context.query.pageSize || 10)
  }
  await next()
})

router.get('/admin/user/:id/userType/:type', async (context, next) => {
  const body = {
    status: 0,
    data: await account.setUserType(context.params.id, context.params.type)
  }
  context.body = body
  await next()
})

module.exports = router
