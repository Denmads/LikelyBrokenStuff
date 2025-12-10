import { useState, useEffect } from 'react'
import '../styles/ColorPicker.css'

function hexToHsl(hex: string) {
  // Remove '#'
  hex = hex.replace('#', '')
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)
        break
      case gNorm:
        h = (bNorm - rNorm) / d + 2
        break
      case bNorm:
        h = (rNorm - gNorm) / d + 4
        break
    }
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function funnyNameFromHex(hex: string, tone: 'poetic' | 'descriptive' | 'whimsical' = 'poetic') {
  // Name generator supporting multiple tones. Deterministic: same hex -> same name.
  try {
    const { h, s, l } = hexToHsl(hex)
    const seed = parseInt(hex.replace('#', ''), 16) || 0
    // small deterministic PRNG
    let state = seed
    const rnd = () => {
      state = (state + 0x6D2B79F5) | 0
      let t = Math.imul(state ^ (state >>> 15), 1 | state)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967295
    }

    // shared word lists
    const hueNouns = [
      'Ruby', 'Tangerine', 'Sunset', 'Golden', 'Lime', 'Mint', 'Teal', 'Sea', 'Indigo', 'Lavender', 'Magenta', 'Rose'
    ]
    const textures = [
      'Velvet', 'Mist', 'Glow', 'Drift', 'Bloom', 'Whisper', 'Haze', 'Echo', 'Frost', 'Breeze', 'Petal', 'Ember'
    ]
    const natural = [
      'Dawn', 'Dusk', 'Meadow', 'Tide', 'Cinder', 'Bramble', 'Saffron', 'Marsh', 'Aurora', 'Dew', 'Moss', 'Cliff'
    ]

    const hueIdx = Math.floor((h / 360) * hueNouns.length) % hueNouns.length
    const noun = hueNouns[hueIdx]
    const tex = textures[Math.floor(rnd() * textures.length)]
    const nat = natural[Math.floor(rnd() * natural.length)]

    const lightDesc = l < 15 ? 'Midnight' : l < 35 ? 'Dusky' : l < 55 ? 'True' : l < 75 ? 'Bright' : 'Pale'

    if (tone === 'poetic') {
      const templates = [
        () => `${lightDesc} ${noun} ${tex}`,
        () => `${noun} ${nat}`,
        () => `${tex} of ${noun}`
      ]
      return templates[Math.floor(rnd() * templates.length)]()
    }

    if (tone === 'descriptive') {
      // More technical: include hue/ saturation/ lightness rounded
      return `${noun} — H:${Math.round(h)} S:${Math.round(s)}% L:${Math.round(l)}%`
    }

    // whimsical
    const whimTemplates = [
      () => `${noun} ${tex}`,
      () => `${lightDesc} ${nat} ${noun}`,
      () => `${tex} ${noun}`
    ]
    return whimTemplates[Math.floor(rnd() * whimTemplates.length)]()
  } catch (e) {
    return 'Mysterious Gray'
  }
}

function normalizeHex(input: string) {
  let v = input.trim()
  if (!v) return '#000000'
  if (v[0] !== '#') v = '#' + v
  // expand shorthand #abc -> #aabbcc
  if (v.length === 4) {
    v = '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]
  }
  // validate basic pattern
  if (!/^#[0-9A-Fa-f]{6}$/.test(v)) return '#000000'
  return v.toLowerCase()
}

export default function ColorPicker() {
  const [hex, setHex] = useState('#4ecdc4')
  const [name, setName] = useState('')
  const [tone, setTone] = useState<'poetic' | 'descriptive' | 'whimsical'>('poetic')

  useEffect(() => {
    setName(funnyNameFromHex(hex, tone))
  }, [hex, tone])

  const onColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = normalizeHex(e.target.value)
    setHex(v)
  }

  const onHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    // allow typing without '#'
    const candidate = raw.startsWith('#') ? raw : '#' + raw
    const normalized = normalizeHex(candidate)
    setHex(normalized)
  }

  const handleHexBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const candidate = raw.startsWith('#') ? raw : '#' + raw
    setHex(normalizeHex(candidate))
  }

  return (
    <div className="color-picker-container">
      <div className="color-header">
        <h1>Color Picker</h1>
        <p className="color-subtitle">Pick a color or type a hex value — we give it a ridiculous name.</p>
      </div>

      <div className="color-body">
        <div className="preview" style={{ backgroundColor: hex }} />

        <div className="controls">
          <label className="control-label">Pick Color</label>
          <input type="color" value={hex} onChange={onColorChange} className="color-input" />

          <label className="control-label">Hex Value</label>
          <input
            className="hex-input"
            value={hex}
            onChange={onHexInput}
            onBlur={handleHexBlur}
          />

          <label className="control-label">Name Tone</label>
          <select className="tone-select" value={tone} onChange={(e) => { setTone(e.target.value as any); setName(funnyNameFromHex(hex, e.target.value as any)) }}>
            <option value="poetic">Poetic</option>
            <option value="descriptive">Descriptive</option>
            <option value="whimsical">Whimsical</option>
          </select>

          <div className="result">
            <div className="color-name">{name}</div>
            <div className="color-hex">{hex.toUpperCase()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
