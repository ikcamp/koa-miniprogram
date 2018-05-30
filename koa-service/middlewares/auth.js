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
    context.state.userId = user._id
    context.state.openId = user.openId
    context.state.isAdmin = user.userType === 1
  } else {
    throw {
      status: "100001",
      message: "session key 过期"
    }
  }
  await next()
}
