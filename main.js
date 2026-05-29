const input = document.getElementById('name')
const btn = document.getElementById('create')
const result = document.getElementById('result')

function load(name) {
    if (!name.trim()) return
    const img = new Image()
    img.onload = () => { result.innerHTML = ''; result.appendChild(img) }
    img.onerror = () => { result.innerHTML = '<div class="error">Player not found</div>' }
    img.src = '/' + encodeURIComponent(name.trim())
}

load("DaNew9c")
btn.addEventListener('click', () => load(input.value))
input.addEventListener('keydown', e => { if (e.key === 'Enter') load(input.value) })
