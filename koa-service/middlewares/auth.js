const {
  findBySessionKey
} = require('../lib/db/user')
module.exports = async function (context, next) {
  const sessionKey = context.get('x-session')
  if (!sessionKey) {
    context.throw(401, '请求头中未包含x-session')
  }
  const user = await findBySessionKey(sessionKey)
  if (user) {
    context.state.user = {
      id: user._id,
      name: user.name,
      avatar: user.avatar
    }
    context.state.isAdmin = user.userType === 1
  } else {
    context.throw(401, 'session 过期')
  }
  await next()
}
