const Router = require('koa-router')
const router = new Router()
const account = require('./actions/account')
const auth = require('./middlewares/auth')
const photo = require('./actions/photo')
const uuid = require('uuid')
const multer = require('koa-multer')
const path = require('path')

function getPageParams (context) {
  return {
    pageIndex: parseInt(context.query.pageIndex) || 1,
    pageSize: parseInt(context.query.pageSize) || 10
  }
}

async function responseOK (ctx, next) {
  ctx.body = {
    status: 0
  }
  await next()
}
/**
 * 小程序登陆，接收小程序登陆获取的code
 */
router.get('/login', async (context, next) => {
  const code = context.query.code
  context.logger.info(`[login] 用户登陆Code为${code}`)
  context.body = {
    status: 0,
    data: await account.login(code)
  }
})
/**
 * 修改用户信息
 */
router.put('/user', auth, async (context, next) => {
  context.logger.info(`[user] 修改用户信息, 用户ID为${context.stale.user.id}, 修改的内容为${JSON.stringify(context.request.body)}`)
  await account.update(context.state.user.id, context.request.body)
  await next()
}, responseOK)

/**
 * 获取当前登陆的用户信息
 */
router.get('/my', auth, async (context, next) => {
  context.body = {
    status: 0,
    data: context.state.user
  }
})

/**
 * 扫码登陆，获取二维码字符串
 */
router.get('/login/ercode', async (context, next) => {
  context.logger.debug(`[login] 生成登陆二维码`)
  context.body = {
    status: 0,
    data: await account.getErCode()
  }
})

/**
 * 扫码登陆中，小程序侧调用的接口。将扫到的二维码信息传递过来
 */
router.get('/login/ercode/:code', auth, async (context, next) => {
  const code = context.params.code
  const sessionKey = context.get('x-session')
  await account.setSessionKeyForCode(code, sessionKey)
  await next()
}, responseOK)

/**
 * 轮询检查登陆状态
 */
router.get('/login/errcode/check/:code', async (context, next) => {
  const startTime = Date.now()
  async function login () {
    const code = context.params.code
    const sessionKey = await account.getSessionKeyByCode(code)
    if (sessionKey) {
      context.body = {
        status: 0,
        data: {
          sessionKey: sessionKey
        }
      }
    } else {
      if (Date.now() - startTime < 10000) {
        await new Promise((resolve) => {
          process.nextTick(() => {
            resolve()
          })
        })
        await login()
      } else {
        context.body = {
          status: -1
        }
      }
    }
  }
  await login()
})

/**
 * 获取相册列表
 */
router.get('/album', auth, async (context, next) => {
  const pageParams = getPageParams(context)
  const albums = await photo.getAlbums(context.state.user.id, pageParams.pageIndex, pageParams.pageSize)
  context.body = {
    data: albums,
    status: 0
  }
})
/**
 * 小程序种获取相册列表
 */
router.get('/xcx/album', auth, async (context, next) => {
  const albums = await photo.getAlbums(context.state.user.id)
  context.body = {
    data: albums,
    status: 0
  }
})
/**
 * 获取某个相册的相片列表
 */
router.get('/album/:id', auth, async (context, next) => {
  const pageParams = getPageParams(context)
  const photos = await photo.getPhotos(context.state.user.id, context.params.id, pageParams.pageIndex, pageParams.pageSize)
  context.body = {
    status: 0,
    data: photos
  }
})
/**
 * 小程序种获取相册的相片列表
 */
router.get('/xcx/album/:id', auth, async (context, next) => {
  const photos = await photo.getPhotos(context.state.user.id, context.params.id)
  context.body = {
    status: 0,
    data: photos
  }
})
/**
 * 添加相册
 */
router.post('/album', auth, async (context, next) => {
  const {
    name
  } = context.request.body
  await photo.addAlbum(context.state.user.id, name)
  await next()
}, responseOK)
/**
 * 修改相册
 */
router.put('/album/:id', auth, async (context, next) => {
  await photo.updateAlbum(context.params.id, context.body.name, ctx.state.user)
  await next()
}, responseOK)
/**
 * 删除相册
 */
router.del('/album/:id', auth, async (context, next) => {
  await photo.deleteAlbum(context.params.id)
  await next()
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
/**
 * 上传相片
 */
router.post('/photo', auth, uplader.single('file'), async (context, next) => {
  const {
    file
  } = context.req
  const {
    id
  } = context.req.body
  await photo.add(context.state.user.id, `https://static.ikcamp.cn/${file.filename}`, id)
  await next()
}, responseOK)
/**
 * 删除相片
 */
router.delete('/photo/:id', auth, async (context, next) => {
  const p = await photo.getPhotoById(context.params.id)
  if (p) {
    if (p.userId === context.state.user.id || context.state.user.isAdmin) {
      await photo.delete(context.params.id)
    } else {
      context.throw(403, '该用户无权限')
    }
  }
  await next()
}, responseOK)
/**
 * 按照状态获取相片列表，type类型如下：
 * pending：待审核列表
 * accepted：审核通过列表
 * rejected：审核未通过列表
 * all: 获取所有列表
 */
router.get('/admin/photo/:type', auth, async (context, next) => {
    const pageParams = getPageParams(context)
    const photos = await photo.getPhotosByType(context.params.type, pageParams.pageIndex, pageParams.pageSize)
    context.body = {
      status: 0,
      data: photos
    }
})

/**
 * 修改照片信息
 */
router.put('/admin/photo/:id/', auth, async (context, next) => {
  if (context.state.user.isAdmin) {
    await photo.updatePhoto(context.params.id, context.request.body)
  } else {
    context.throw(403, '该用户无权限')
  }
  await next()
}, responseOK)
/**
 * 获取用户列表
 * type的值的类型为：
 * admin: 管理员
 * blocked: 禁用用户
 * ordinary: 普通用户
 * all: 全部用户
 */
router.get('/admin/user/:type', async (context, next) => {
  const pageParams = getPageParams(context)
  context.body = {
    status: 0,
    data: await account.getUsersByType(context.params.type, pageParams.pageIndex, pageParams.pageSize)
  }
  await next()
})
/**
 * 修改用户类型，userType=1 为管理员， -1 未禁用用户
 */
router.put('/admin/user/:id', async (context, next) => {
  const body = {
    status: 0,
    data: await account.update(context.params.id, context.request.body)
  }
  context.body = body
  await next()
})

module.exports = router
