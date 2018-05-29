const crypto = require('./lib/crypto')

const encoded = crypto.encode('5b0cd3134e1e7c53aa7c9a4f')
console.log(encoded)
const decoded = crypto.decode(encoded)
console.log(decoded)
