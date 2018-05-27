const {
  login,
  updateName,
  updateUserType,
  getUsers
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
  async login(code) {
    const session = await getSession(code)
    if (session) {
      const {
        openid,
        session_key
      } = session
      return login(openid)
    } else {
      throw new Error('登陆失败')
    }
  },
  async updateUserName(sessionKey, name) {
    return updateName(name, sessionKey)
  },
  async setUserType(id, userType) {
    return updateUserType(id, userType)
  },
  async getUsers(pageIndex, pageSize) {
    return getUsers(pageIndex, pageSize)
  },
  async getErCode() {
    const code = encodeErCode()
    await add(code)
    return code
  },
  async setSessionKeyForCode(code, sessionKey) {
    const {timespan} = decode(code)
    // 30s 过期
    if(Date.now() - timespan > 30000){
      throw new Error('ercode timeout')
    }
    await updateSessionKey(code, sessionKey)
  },
  async getSessionKeyByCode(code){
    const sessionKey = await getSessionKeyByCode(code)
    await removeData(code)
    return sessionKey
  }
}