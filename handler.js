import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { displayRating, rankIconSvg } from './rank.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUDDLE_SEARCH = 'https://puddle.farm/api/player/search?search_string='

const MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
}

function escapeXml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function svg(player) {
    const rating = displayRating(player.rating)
    const hasGlobal = player.top_global > 0
    const hasTopChar = player.top_char > 0
    const rankBadge = hasGlobal ? `<tspan fill="#ffd700"> #${player.top_global}</tspan>` : ''
    return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="210" viewBox="0 0 480 210">
  <rect width="480" height="210" fill="#262a2c" rx="16"/>
  <text x="320" y="70" text-anchor="middle" dominant-baseline="central" fill="#fff" font-size="25" font-weight="bold" font-family="Arial, sans-serif">
  <tspan fill="#fff">${escapeXml(player.name)}</tspan>
  ${rankBadge}
  </text>
  ${rankIconSvg(player.rating, 140, 35, 35)}
  <text x="320" y="140" text-anchor="middle" dominant-baseline="central" fill="#fff" font-size="25" font-weight="bold" font-family="Arial, sans-serif">
  <tspan fill="#fff">${rating}</tspan>
  <tspan fill="${hasTopChar ? "#c70202" : "#bbb"}" dx="8">${hasTopChar ? `#${player.top_char} ` : ""}${escapeXml(player.char_short)}</tspan>
  </text>
</svg>`
}

function serveStatic(res, name) {
    const ext = path.extname(name)
    if (!MIME[ext]) return false
    try {
        const content = fs.readFileSync(path.join(__dirname, 'public', name))
        res.writeHead(200, { 'Content-Type': MIME[ext] })
        res.end(content)
        return true
    } catch {
        return false
    }
}

export default async function handler(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const name = url.searchParams.get('name')
    const pathname = url.pathname.replace(/^\/|\/$/g, '')

    if (!pathname) {
        const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf-8')
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(html)
        return
    }

    if (serveStatic(res, pathname)) return

    if (!name) {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end('missing name param')
        return
    }

    try {
        const searchRes = await fetch(PUDDLE_SEARCH + encodeURIComponent(name))
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

        const pid = data.results[0].id
        const detailRes = await fetch(`https://puddle.farm/api/player/${pid}`)
        if (!detailRes.ok) {
            res.writeHead(502, { 'Content-Type': 'text/plain' })
            res.end('detail api failed')
            return
        }
        const detail = await detailRes.json()

        const player = { ...detail.ratings[0], name: detail.name, top_global: detail.top_global }
        res.writeHead(200, { 'Content-Type': 'image/svg+xml' })
        res.end(svg(player))
    } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('internal error')
    }
}
