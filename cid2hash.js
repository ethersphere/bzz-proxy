const { CIDToHash } = require('./cid')

const input = process.argv[2]
const output = CIDToHash(input)
console.log(output)

