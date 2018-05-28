const crypto = require('./lib/crypto')

const encoded =  crypto.encode(1)
console.log(encoded)
const decoded = crypto.decode(encoded)
console.log(decoded)