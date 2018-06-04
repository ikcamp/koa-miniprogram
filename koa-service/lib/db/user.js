const {
  User
} = require('./model')
const {
  encode,
  decode
} = require('../crypto')

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
  async login (openId) {
    let user = await getByOpenId(openId)
    if (!user) {
      user = await User.create({
        openId: openId
      })
    }
    const id = user._id
    const sessionKey = encode(id)
    await User.update({
      _id: id
    }, {
      lastLogin: Date.now()
    })
    return {
      sessionKey
    }
  },
  async findBySessionKey (sessionKey) {
    const {
      id,
      timespan
    } = decode(sessionKey)
    // sessionKey expire 3d
    if (Date.now() - timespan > 1000 * 60 * 60 * 24 * 3) {
      return null
    }
    const users = await User.find({
      _id: id
    })
    if (users.length) {
      return users[0]
    }
    return null
  },
  async update (id, data) {
    return User.update({
      _id: id
    }, data)
  },
  async updateUserType (id, type) {
    return User.update({
      _id: id
    }, {
      userType: type
    })
  },
  async getAdmins () {
    return User.find({
      userType: 1
    })
  },
  async isAdmin (id) {
    const user = await User.findById(id)
    return user.userType === 1
  },
  async isLocked (id) {
    const user = await User.findById(id)
    return user.userType === -1
  },
  async getUsersByType (type, pageIndex, pageSize) {
    return User.find({
      userType: type
    }).skip((pageIndex - 1) * pageSize).limit(pageSize)
  },
  async getUsersCountByType (type) {
    return User.count({
      userType: type
    })
  },
  async getUsers (pageIndex, pageSize) {
    return User.find().skip((pageIndex - 1) * pageSize).limit(pageSize)
  },
  async getUsersCount () {
    return User.count()
  }
}
