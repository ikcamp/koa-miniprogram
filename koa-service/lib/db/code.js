const {
  Code
} = require('./model')

module.exports = {
  async add(code) {
    return Code.create({
      code: code
    })
  },
  async updateSessionKey(code, sessionKey) {
    return Code.update({
      code: code
    }, {
      sessionKey: sessionKey
    })
  },
  async getSessionKey(code) {
    const data = await Code.findOne({
      code: code
    })
    if (data) {
      return code.sessionKey
    } else {
      throw new Error('session Key is not exist')
    }
  },
  async removeData(code){
    return Code.deleteMany({
      code: code
    })
  }
}