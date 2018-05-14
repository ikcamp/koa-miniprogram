const env = process.env
// const appKey = env.APP_KET || 'wx02a844e6e2f87fef'
const appKey = 'wx02a844e6e2f87fef'
// const appSecret = env.APP_SECRET || '24bcc94991bee32d377a9b966fc1d659'
const appSecret = '24bcc94991bee32d377a9b966fc1d659'
const nodeEnv = env.NODE_ENV
let db = {
  name: 'mongodb://127.0.0.1:27017/xcx?authSource=admin',
  user: 'xcx',
  password: '123qwe'
}
if (nodeEnv === 'production') {
  db = {
    name: 'mongodb://127.0.0.1:27017/xcx?authSource=admin',
    user:'xcx',
    password: '123qwe'
  }
}

module.exports = {
  appKey,
  appSecret,
  db
}