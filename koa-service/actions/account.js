const {
  login,
  update,
  updateUserType,
  getUsersByType,
  getUsersCountByType,
  getUsers,
  getUsersCount

} = require('../lib/db/user')
const {
  add, updateSessionKey, getSessionKey, removeData
} = require('../lib/db/code')
const {
  getSession
} = require('../lib/wx')
const {
  encodeErCode,
  decode
} = require('../lib/crypto')
module.exports = {
  async login (code) {
    const session = await getSession(code)
    if (session) {
      const {
        openid
      } = session
      return login(openid)
    } else {
      throw new Error('登陆失败')
    }
  },
  async update (id, data) {
    return update(id, data)
  },
  async setUserType (id, userType) {
    return updateUserType(id, userType)
  },
  async getUsersByType (type, pageIndex, pageSize) {
    let userType, count, users
    switch (type) {
      case 'admin':
        userType = 1
        break
      case 'blocked':
        userType = -1
        break
      case 'ordinary':
        userType = 0
        break
    }
    if (userType !== undefined) {
      [count, users] = await Promise.all([getUsersCountByType(userType), getUsersByType(userType, pageIndex, pageSize)])
    } else {
      [count, users] = await Promise.all([getUsersCount(), getUsers(pageIndex, pageSize)])
    }
    return {
      count,
      data: users
    }
  },
  async getErCode () {
    const code = encodeErCode()
    await add(code)
    setTimeout(() => {
      removeData(code)
    }, 30000)
    return code
  },
  async setSessionKeyForCode (code, sessionKey) {
    const {timespan} = decode(code)
    // 30s 过期
    if (Date.now() - timespan > 30000) {
      throw new Error('time out')
    }
    await updateSessionKey(code, sessionKey)
  },
  async getSessionKeyByCode (code) {
    const sessionKey = await getSessionKey(code)
    if (sessionKey) {
      await removeData(code)
    }
    return sessionKey
  }
}
