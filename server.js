import http from 'node:http'
import { getRankInfo, displayRating, rankIconSvg } from './rank.js'

const PUDDLE_SEARCH = 'https://puddle.farm/api/player/search?search_string='

function escapeXml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function svg(player) {
    const rating = displayRating(player.rating)
    return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="210" viewBox="0 0 480 210">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#262a2c"/>
      <stop offset="100%" stop-color="#262a2c"/>
    </linearGradient>
  </defs>
  <rect width="480" height="210" fill="url(#bg)" rx="16"/>
  <text x="320" y="70" text-anchor="middle" dominant-baseline="central" fill="#fff" font-size="25" font-weight="bold" font-family="Arial, sans-serif">${escapeXml(player.name)}</text>
  ${rankIconSvg(player.rating, 140, 35, 35)}
  <text x="320" y="140" text-anchor="middle" dominant-baseline="central" fill="#fff" font-size="25" font-weight="bold" font-family="Arial, sans-serif">${rating} (${escapeXml(player.char_short)})</text>
</svg>`
}

const server = http.createServer(async (req, res) => {
    const parsed = new URL(req.url, `http://${req.headers.host}`)
    const pathname = parsed.pathname.replace(/^\/|\/$/g, '')

    if (!pathname) {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end('Usage: /<name>, e.g. ggst.danew9c.com/DaNew9c')
        return
    }

    try {
        const searchRes = await fetch(PUDDLE_SEARCH + encodeURIComponent(pathname))
        if (!searchRes.ok) {
            res.writeHead(502, { 'Content-Type': 'text/plain' })
            res.end('search api failed')
            return
        }
        const data = await searchRes.json()
        if (!data.results || data.results.length === 0) {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.end('player not found')
            return
        }
        const player = data.results[0]
        res.writeHead(200, { 'Content-Type': 'image/svg+xml' })
        res.end(svg(player))
    } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('internal error')
    }
})

const PORT = parseInt(process.env.PORT || '3000', 10)
server.listen(PORT, () => console.log(`ggst profile svg on :${PORT}`))
