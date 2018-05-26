const {
  User
} = require('./model')

const getByOpenId = async (openId) => {
  const users = await User.find({
    openId: openId
  })
  if (users.length) {
    return users[0]
  }
  return null
}

module.exports = {
  async login(openId, sessionKey) {
    const user = await getByOpenId(openId)
    if (user) {
      await User.update({
        openId: openId
      }, {
        sessionKey: sessionKey,
        lastLogin: Date.now()
      })
    } else {
      await User.create({
        openId: openId,
        sessionKey: sessionKey,
        lastLogin: Date.now()
      })
    }
    return {
      sessionKey
    }
  },
  async findBySessionKey(sessionKey) {
    const users = await User.find({
      sessionKey: sessionKey
    })
    if (users.length) {
      return users[0]
    }
    return null
  },
  async updateName(name, sessionKey) {
    return User.update({
      sessionKey: sessionKey
    }, {
      name: name
    })
  },
  async updateUserType(id, type) {
    return User.update({
      _id: id
    }, {
      userType: userType
    })
  },
  async getAdmins() {
    return User.find({
      userType: 1
    })
  },
  async isAdmin(id) {
    const user = await User.findById(id)
    return user.userType === 1
  },
  async isLocked(id) {
    const user = await User.findById(id)
    return user.userType === -1
  },
  async getUsers(pageIndex, pageSize) {
    return User.find().skip((pageIndex - 1) * pageSize).limit(pageSize)
  }
}