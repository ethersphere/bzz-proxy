const CID = require('cids')

function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < bytes.length; i++) {
      const hexByte = hex.substr(i * 2, 2)
      bytes[i] = parseInt(hexByte, 16)
    }

    return bytes
}

function bytesToHex(bytes) {
    const hexByte = n => n.toString(16).padStart(2, '0')
    const hex = Array.from(bytes, hexByte).join('')
    return hex
}

function hashToCID(input) {
    const hashBytes = hexToBytes(input)
    const multihash = new Uint8Array([0x1b, hashBytes.length, ...hashBytes])
    const cid = new CID(1, 'dag-pb', multihash)
    return cid
}

function CIDToHash(input) {
    const cid = new CID(input)
    const hashBytes = cid.multihash.slice(2)
    return bytesToHex(hashBytes)
}

function isCID(input) {
    return input.startsWith('bafyb') && input.length === 59
}

function isHash(input) {
    return /^[0-9a-f]{64}$/i.test(input)
}

module.exports = { CIDToHash, hashToCID, isCID, isHash }
