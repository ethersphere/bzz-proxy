const { hashToCID } = require('./cid')

const input = process.argv[2]
const output = hashToCID(input)
console.log({ cid: output.toString(), ...output })

