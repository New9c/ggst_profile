const input = document.getElementById('name')
const create = document.getElementById('create')
const result = document.getElementById('result')
const dlBtn = document.getElementById('download')
let currentName = ''

function load(name) {
    if (!name.trim()) return
    currentName = name.trim()
    result.innerHTML = '<div class="placeholder">Generating...</div>'
    const img = new Image()
    img.onload = () => { result.innerHTML = ''; result.appendChild(img) }
    img.onerror = () => { result.innerHTML = '<div class="error">Player not found</div>'; currentName = '' }
    img.src = '/api/player?name=' + encodeURIComponent(name.trim())
}

function downloadSvg() {
    if (!currentName) return
    const a = document.createElement('a')
    a.href = '/api/player?name=' + encodeURIComponent(currentName)
    a.download = 'ggst_profile.svg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

load("DaNew9c")
dlBtn.addEventListener('click', downloadSvg)
create.addEventListener('click', () => load(input.value))
input.addEventListener('keydown', e => { if (e.key === 'Enter') load(input.value) })
