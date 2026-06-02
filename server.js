import http from 'node:http'
import handler from './handler.js'

const PORT = parseInt(process.env.PORT || '3000', 10)
http.createServer(handler).listen(PORT, () => console.log(`> Ready on http://localhost:${PORT}`))
