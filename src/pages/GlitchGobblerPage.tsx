import GlitchGobbler from '../components/GlitchGobbler'
import Navbar from '../components/Navbar'

export default function GlitchGobblerPage() {
  return (
    <div className="app">
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 2rem' }}>
        <h2 className="section-title">Glitch Gobbler</h2>
        <p style={{ color: 'var(--color-gray)' }}>Click the bugs and gobble glitches — but beware the broken ones.</p>
        <GlitchGobbler />
      </div>
    </div>
  )
}
