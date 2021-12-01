const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { CIDToHash, isCID } = require('./cid')

const PROXY_TARGET = process.env.PROXY_TARGET || `http://localhost:1633`
const PROXY_PORT = process.env.PROXY_PORT || 8633

function proxyPort(port) {
    try {
        return parseInt(port, 10)
    } catch (e) {
        return undefined
    }
}

function hostToBZZResource(host) {
    if (isCID(host)) {
        const { reference, type } = CIDToHash(host)

        switch (type){
            case 'feed':
                return `/bzz/${reference}` // TBD: Resolving endpoint
            case 'manifest':
                return `/bzz/${reference}` // TBD: Non-resolving endpoint
            default:
                throw new Error 'Unknown type'
        }
    } else {
        return `/bzz/${host}.eth` // TBD: Resolving endpoint
    }
}

function router(req) {
    const host = req.headers.host.split('.')[0]
    const route = `${PROXY_TARGET}${hostToBZZResource(host)}`
    const url = req.url
    console.log({ route, url })
    return route
}

const options = {
    target: `${PROXY_TARGET}/`, // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    router,
}

const bzzProxy = createProxyMiddleware(options)
const app = express();

console.log(`Starting on port ${PROXY_PORT}`)
app.use('/', bzzProxy);
app.listen(proxyPort(PROXY_PORT))
