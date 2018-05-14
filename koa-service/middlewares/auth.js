const {
  findBySessionKey
} = require('../lib/db/user')
module.exports = async function (context, next) {
  const sessionKey = context.get('x-session')
  if (!sessionKey) {
    throw new Error('当前请求需要在请求头中传递x-session')
  }
  const user = await findBySessionKey(sessionKey)
  if (user) {
    context.state.openId = user.openId
    context.state.isAdmin = user.isAdmin
  } else {
    throw new Error('sessionKey 无效')
  }
  await next()
}