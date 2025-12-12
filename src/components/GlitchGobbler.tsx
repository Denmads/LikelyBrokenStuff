import { useEffect, useRef, useState } from 'react'
import '../styles/GlitchGobbler.css'

interface Bug {
  id: string
  x: number
  y: number
  vx?: number
  vy?: number
  type?: 'normal' | 'broken' | 'power' | 'bomb'
  hp?: number
}

const rand = (min: number, max: number) => Math.random() * (max - min) + min

function GlitchGobbler() {
  const [bugs, setBugs] = useState<Bug[]>([])
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(1)
  const [lastClick, setLastClick] = useState(0)
  const [doublePoints, setDoublePoints] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('glitchgobbler_high') || '0'))
  const [showTutorial, setShowTutorial] = useState(() => localStorage.getItem('glitchgobbler_seen') === '1' ? false : true)
  const [inverted, setInverted] = useState(false)
  const spawnTimer = useRef<number | null>(null)
  const tickTimer = useRef<number | null>(null)
  const moveTimer = useRef<number | null>(null)
  const boardRef = useRef<HTMLDivElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (running) {
      spawnTimer.current = window.setInterval(() => spawnBug(), 700)
      tickTimer.current = window.setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            stopGame()
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => {
      if (spawnTimer.current) clearInterval(spawnTimer.current)
      if (tickTimer.current) clearInterval(tickTimer.current)
      if (moveTimer.current) clearInterval(moveTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  useEffect(() => {
    if (running) {
      // start movement updates for bugs
      moveTimer.current = window.setInterval(() => {
        setBugs((list) => list.map((b) => {
          if (!b.vx && !b.vy) return b
          const boardW = boardRef.current?.clientWidth || 400
          const boardH = boardRef.current?.clientHeight || 300
          let nx = b.x + (b.vx || 0)
          let ny = b.y + (b.vy || 0)
          if (nx < 10 || nx > boardW - 58) { (b as any).vx = -(b.vx || 0) }
          if (ny < 10 || ny > boardH - 58) { (b as any).vy = -(b.vy || 0) }
          nx = Math.min(Math.max(nx, 10), boardW - 58)
          ny = Math.min(Math.max(ny, 10), boardH - 58)
          return { ...b, x: nx, y: ny }
        }))
      }, 250)
    }
    return () => {
      if (moveTimer.current) clearInterval(moveTimer.current)
    }
  }, [running])

  useEffect(() => {
    if (!running && timeLeft === 0) {
      // game over
      if (score > highScore) {
        localStorage.setItem('glitchgobbler_high', String(score))
        setHighScore(score)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, timeLeft])

  const spawnBug = () => {
    const board = boardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    const size = 48
    const x = Math.min(Math.max(rand(10, rect.width - size - 10), 10), rect.width - size - 10)
    const y = Math.min(Math.max(rand(10, rect.height - size - 10), 10), rect.height - size - 10)
    // decide type: mostly normal, some broken, small chance power or bomb
    const r = Math.random()
    let type: Bug['type'] = 'normal'
    if (r < 0.06) type = 'power'
    else if (r < 0.12) type = 'bomb'
    else if (r < 0.3) type = 'broken'
    const hp = type === 'broken' ? (Math.random() < 0.5 ? 2 : 3) : 1
    // velocidades para movimiento
    const vx = Math.random() < 0.4 ? (Math.random() * 4 - 2) : 0
    const vy = Math.random() < 0.4 ? (Math.random() * 4 - 2) : 0
    const bug: Bug = { id: Math.random().toString(36).slice(2), x, y, type, hp, vx, vy }
    setBugs((s) => [...s, bug])

    // auto remove after lifetime (but broken/power bugs stick a bit longer)
    const lifetime = type === 'broken' ? 4500 + Math.random() * 3500 : type === 'power' ? 6000 : type === 'bomb' ? 3500 : 3000
    window.setTimeout(() => {
      setBugs((s) => s.filter((b) => b.id !== bug.id))
    }, lifetime)
  }

  const playSound = (type: 'click'|'broken'|'power'|'bomb'|'combo') => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext()
      const ctx = audioCtxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      const now = ctx.currentTime
      if (type === 'click') { osc.frequency.value = 620; gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18); }
      else if (type === 'broken') { osc.frequency.value = 220; osc.type = 'sawtooth'; gain.gain.exponentialRampToValueAtTime(0.18, now + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6); }
      else if (type === 'power') { osc.frequency.value = 940; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.18, now + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45); }
      else if (type === 'bomb') { osc.frequency.value = 80; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.22, now + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5); }
      else if (type === 'combo') { osc.frequency.value = 1200; osc.type = 'triangle'; gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25); }
      osc.start(now)
      osc.stop(now + 1)
    } catch (e) {
      // nothing
    }
  }

  const handleClick = (bugId: string) => {
    setBugs((s) => {
      const idx = s.findIndex((b) => b.id === bugId)
      if (idx === -1) return s
      const bug = s[idx]
      // Combo handling: clicks within 1.2s increase combo
      const now = Date.now()
      if (now - lastClick < 1200) {
        setCombo((c) => Math.min(c + 1, 8))
      } else {
        setCombo(1)
      }
      setLastClick(now)

      // simple sound for click
      playSound('click')

      // If it's broken, random effect!
      if (bug.type === 'broken' && Math.random() < 0.4) {
        // 3 possible mischiefs: teleport, multiply, or invert controls (flip board)
        const effect = Math.floor(Math.random() * 3)
        if (effect === 0) {
          // teleport
          const newX = Math.max(10, Math.floor(rand(10, (boardRef.current?.clientWidth || 400) - 58)))
          const newY = Math.max(10, Math.floor(rand(10, (boardRef.current?.clientHeight || 300) - 58)))
          s[idx] = { ...bug, x: newX, y: newY }
          setScore((prev) => Math.max(0, prev - 2))
          return [...s]
        } else if (effect === 1) {
          // multiply
          const clone: Bug = { ...bug, id: Math.random().toString(36).slice(2), x: Math.min(bug.x + 30, (boardRef.current?.clientWidth || 400) - 60) }
          setScore((prev) => Math.max(0, prev - 1))
          return [...s, clone]
        } else {
          // small penalty + invert score temporarily
          setScore((prev) => Math.max(0, prev - 3))
          // invert controls for a short while
          setInverted(true)
          setTimeout(() => setInverted(false), 3000)
          playSound('broken')
          return [...s]
        }
      }

      // normal behavior: decrement hp or remove
      // bombs
      if (bug.type === 'bomb') {
        // bomb effect: reduce time and play bomb sound and clear small bugs
        setTimeLeft((t) => Math.max(0, t - 5))
        playSound('bomb')
        setBugs((s2) => s2.filter((bb) => bb.id === bugId || Math.random() > 0.6))
        return s.filter((b) => b.id !== bugId)
      }
      if (bug.type === 'power') {
        // collect power: double points for 5s or +6s time
        setDoublePoints(true)
        playSound('power')
        setTimeout(() => setDoublePoints(false), 5000)
        setTimeLeft((t) => t + 4)
        return s.filter((b) => b.id !== bugId)
      }
      if (bug.hp && bug.hp > 1) {
        s[idx] = { ...bug, hp: bug.hp - 1 }
        setScore((prev) => prev + 5 * combo * (doublePoints ? 2 : 1))
        return [...s]
      }
      setScore((prev) => prev + ((bug.type === 'broken') ? 2 : 10) * combo * (doublePoints ? 2 : 1))
      if (combo > 1) playSound('combo')
      return s.filter((b) => b.id !== bugId)
    })
  }

  const startGame = () => {
    setScore(0)
    setTimeLeft(30)
    setBugs([])
    setCombo(1)
    setDoublePoints(false)
    setLastClick(0)
    setRunning(true)
  }

  const stopGame = () => {
    setRunning(false)
    // clear timers
    if (spawnTimer.current) clearInterval(spawnTimer.current)
    if (tickTimer.current) clearInterval(tickTimer.current)
    spawnTimer.current = null
    tickTimer.current = null
    if (moveTimer.current) clearInterval(moveTimer.current)
    moveTimer.current = null
  }

  return (
    <div className="glitch-gobbler">
      <div className="game-header">
        <div className="left">
          <div className="score">Score: {score}</div>
          <div className="combo">x{combo}</div>
          {doublePoints && <div className="double">Double!</div>}
        </div>
        <div className="right">
          <div className="time">Time: {timeLeft}s</div>
          <div className="high-score">High: {highScore}</div>
          <button className="help" onClick={() => setShowTutorial(true)}>❓</button>
        </div>
      </div>
      <div className="game-controls">
        {!running ? (
          <button className="start" onClick={startGame}>Start</button>
        ) : (
          <button className="stop" onClick={stopGame}>Stop</button>
        )}
        <button className="reset" onClick={() => { setScore(0); setBugs([]); setTimeLeft(30); }}>Reset</button>
      </div>
      <div className={"game-board" + (inverted ? ' inverted' : '')} ref={boardRef}>
        {bugs.map((bug) => (
          <div
            key={bug.id}
            className={"bug " + (bug.type === 'broken' ? 'bug-broken' : (bug.type === 'power' ? 'bug-power' : (bug.type === 'bomb' ? 'bug-bomb' : 'bug-normal'))) + (bug.hp && bug.hp > 1 ? ' bug-hp' : '')}
            style={{ left: bug.x, top: bug.y }}
            onClick={() => handleClick(bug.id)}
            role="button"
            aria-label={bug.type === 'broken' ? 'broken bug' : bug.type === 'power' ? 'power-up' : bug.type === 'bomb' ? 'bomb' : 'bug'}
          >
            {bug.hp && bug.hp > 1 ? bug.hp : '•'}
          </div>
        ))}
        {!running && timeLeft === 0 && (
          <div className="game-over">Game over — score: {score}</div>
        )}
      </div>
      {showTutorial && (
        <div className="glitch-tutorial">
          <div className="glitch-tutorial-inner">
            <h3>Glitch Gobbler — How to play</h3>
            <ul>
              <li>Click the bugs to gobble them — normal bugs give points.</li>
              <li>Broken bugs can misbehave: teleport, multiply, or invert controls. Beware!</li>
              <li>Green 'power' bugs give time and double points for 5 seconds.</li>
              <li>Bombs reduce time and may clear or multiply bugs — avoid clicking them unless you like chaos.</li>
              <li>Hit bugs quickly to build a combo multiplier for higher scores.</li>
            </ul>
            <div className="tutorial-actions">
              <button onClick={() => { setShowTutorial(false) }}>Close</button>
              <button onClick={() => { localStorage.setItem('glitchgobbler_seen', '1'); setShowTutorial(false) }}>Don't show again</button>
            </div>
          </div>
        </div>
      )}
      <div className="game-footer">
        <p>Glitches behave unpredictably — that’s the point.</p>
      </div>
    </div>
  )
}

export default GlitchGobbler
