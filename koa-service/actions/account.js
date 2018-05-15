const {
  login, updateName
} = require('../lib/db/user')
const {
  getSession
} = require('../lib/wx')
module.exports = {
  async login (code) {
    const session = await getSession(code)
    if (session) {
      const {
        openid,
        session_key
      } = session
      return login(openid, session_key)
    } else {
      throw new Error('登陆失败')
    }
  },
  async updateUserName (sessionKey, name) {
    return updateName(name, sessionKey)
  }
}
