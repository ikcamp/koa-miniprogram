const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  openId: {
    type: String,
    index: true,
    unique: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  name: {
    type: String,
    index: true
  },
  userType: {
    type: int
  }
})

const albumSchema = new mongoose.Schema({
  openId: {
    type: String
  },
  name: {
    type: String
  },
  fm: {
    type: String
  }
})

const photoSchema = new mongoose.Schema({
  openId: {
    type: String
  },
  url: {
    type: String
  },
  isApproved: {
    type: Boolean,
    default: false,
    index: true
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId
  },
  created: {
    type: Date,
    default: Date.now
  },
  isDelete: {
    type: boolean,
    default: false
  }
})

const codeSchema = new mongoose.Schema({
  code: {
    type: String
  },
  sessionKey: String
})

module.exports = {
  User: mongoose.model('User', userSchema),
  Phopto: mongoose.model('photo', photoSchema),
  Album: mongoose.model('album', albumSchema),
  Code: mongoose.model('code', codeSchema)
}

