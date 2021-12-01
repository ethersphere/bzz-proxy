const CID = require('cids')
const multicodec = require('multicodec')

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

const CODEC_MAPPING = {
    'feed': 'swarm-feed',
    'manifest': 'swarm-manifest'
}

function hashToCID(input, type) {
    if (!(type in CODEC_MAPPING)) {
        throw new Error('Unknown type.')
    }

    const hashBytes = hexToBytes(input)

    const multihash = new Uint8Array([multicodec.KECCAK_256, hashBytes.length, ...hashBytes])
    const cid = new CID(1, CODEC_MAPPING[type], multihash)

    return new Uint8Array([multicodec.SWARM_NS, ...cid.bytes])
    // return `${ base32(new Uint8Array([multicodec.SWARM_NS, ...cid.bytes])) }`
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
