import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <a href="#/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            <img src="/favicon.svg" alt="likelyBroken logo" className="logo-img" />
            <span className="logo-text">likelyBroken</span>
            <span className="logo-emoji">⚙️</span>
          </a>
        </div>
        <div className="nav-links">
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault()
              navigate('/')
              setTimeout(() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' }), 60)
            }}
          >
            Tools
          </a>
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault()
              navigate('/')
              setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 60)
            }}
          >
            About
          </a>
        </div>
      </div>
    </nav>
  )
}
