const RANK_THRESHOLDS = [
  { rating: 10001800, name: 'Vanquisher III Vindex', spriteX: 2, spriteY: 5, color: '#6820a0' },
  { rating: 10001700, name: 'Vanquisher II Virtus', spriteX: 1, spriteY: 5, color: '#9050d8' },
  { rating: 10001600, name: 'Vanquisher I Ignis', spriteX: 0, spriteY: 5, color: '#c880ff' },
  { rating: 10000000, name: 'Vanquisher', spriteX: 3, spriteY: 4, color: '#eeccff' },
  { rating: 40800, name: 'Diamond 3', spriteX: 2, spriteY: 4, color: '#3080c0' },
  { rating: 36600, name: 'Diamond 2', spriteX: 1, spriteY: 4, color: '#70b0e0' },
  { rating: 32400, name: 'Diamond 1', spriteX: 0, spriteY: 4, color: '#b8dcff' },
  { rating: 28400, name: 'Platinum 3', spriteX: 3, spriteY: 3, color: '#158060' },
  { rating: 24400, name: 'Platinum 2', spriteX: 2, spriteY: 3, color: '#60bea4' },
  { rating: 20400, name: 'Platinum 1', spriteX: 1, spriteY: 3, color: '#aafce8' },
  { rating: 18000, name: 'Gold 3', spriteX: 0, spriteY: 3, color: '#a08800' },
  { rating: 15600, name: 'Gold 2', spriteX: 3, spriteY: 2, color: '#d0bc44' },
  { rating: 13200, name: 'Gold 1', spriteX: 2, spriteY: 2, color: '#fff088' },
  { rating: 11000, name: 'Silver 3', spriteX: 1, spriteY: 2, color: '#6888b0' },
  { rating: 8800, name: 'Silver 2', spriteX: 0, spriteY: 2, color: '#a6bbd8' },
  { rating: 6600, name: 'Silver 1', spriteX: 3, spriteY: 1, color: '#e4eeff' },
  { rating: 5400, name: 'Bronze 3', spriteX: 2, spriteY: 1, color: '#804018' },
  { rating: 4200, name: 'Bronze 2', spriteX: 1, spriteY: 1, color: '#b87c44' },
  { rating: 3000, name: 'Bronze 1', spriteX: 0, spriteY: 1, color: '#f0b870' },
  { rating: 2000, name: 'Iron 3', spriteX: 3, spriteY: 0, color: '#404858' },
  { rating: 1000, name: 'Iron 2', spriteX: 2, spriteY: 0, color: '#7c889a' },
  { rating: 1, name: 'Iron 1', spriteX: 1, spriteY: 0, color: '#b8c8dc' },
  { rating: 0, name: 'Placement', spriteX: 0, spriteY: 0, color: 'rgba(54, 162, 235, 0.6)' },
]

function getRankInfo(rating) {
  for (const r of RANK_THRESHOLDS) {
    if (rating >= r.rating) return r
  }
  return RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1]
}

function convertRating(rating) {
  return rating > 10000000 ? rating - 10000000 : rating
}

function displayRating(rating) {
  const v = convertRating(rating)
  return rating > 10000000 ? `${v} DR` : `${v} RP`
}

function rankIconSvg(rating, size = 64, x = 0, y = 0) {
  const rank = getRankInfo(rating)
  const vx = rank.spriteX * 256
  const vy = rank.spriteY * 256
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${vx} ${vy} 256 256">
  <image href="/RatingIcon.png" width="1024" height="2048"/>
</svg>`
}

export { getRankInfo, convertRating, displayRating, rankIconSvg }
