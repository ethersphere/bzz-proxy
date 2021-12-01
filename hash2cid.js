const { hashToCID } = require('./cid')

const input = process.argv[2]
const output = hashToCID(input, 'manifest')
console.log({ cid: output.toString(), ...output })

