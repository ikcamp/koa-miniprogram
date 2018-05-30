const env = process.env
const appKey = env.APP_KET || 'default key'
const appSecret = env.APP_SECRET || 'default secret'
const nodeEnv = env.NODE_ENV
let db = {
  name: 'mongodb://127.0.0.1:27017/xcx?authSource=admin',
  user: 'xcx',
  password: '123qwe'
}
if (nodeEnv === 'production') {
  db = {
    name: 'mongodb://127.0.0.1:27017/xcx',
    user: 'xcx',
    password: '123qwe'
  }
}

module.exports = {
  appKey,
  appSecret,
  db
}
