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
    'manifest': 'swarm-manifest',
    'chunk': 'swarm-ns',
    'bytes': 'swarm-ns'
}

function hashToCID(input, type) {
    if (!(type in CODEC_MAPPING)) {
        throw new Error('Unknown type.')
    }

    const hashBytes = hexToBytes(input)

    const multihash = new Uint8Array([multicodec.KECCAK_256, hashBytes.length, ...hashBytes])
    const cid = new CID(1, CODEC_MAPPING[type], multihash)

    return cid
}

function CIDToHash(input) {
    const cid = new CID(input)

    // TODO: Mapping multicodec name to bytes
    if (!Object.values(CODEC_MAPPING).includes(cid.codec)) {
        throw new Error('CID with invalid codec. Use swarm related ones only.')
    }

    const hashBytes = cid.multihash.slice(2)
    return {
        reference: bytesToHex(hashBytes),
        type: 'feed'
        // type: reverseMapping(CODEC_MAPPING, cid.codec) // 'feed' | 'manifest'
    }
}

function isCID(input) {
    return input.startsWith('bafyb') && input.length === 59
}

function isHash(input) {
    return /^[0-9a-f]{64}$/i.test(input)
}

module.exports = { CIDToHash, hashToCID, isCID, isHash }
