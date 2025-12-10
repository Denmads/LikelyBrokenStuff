import { useState, useEffect } from 'react'
import './App.css'

interface Tool {
  id: string
  title: string
  description: string
  icon: string
  link: string
  color: string
}

function App() {
  const [scrollY, setScrollY] = useState(0)
  const [hoveredTool, setHoveredTool] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const tools: Tool[] = [
    {
      id: 'todo-list',
      title: 'Todo List',
      description: 'A basic todo list stored locally.',
      icon: '✓',
      link: '/tools/todo',
      color: '#4ECDC4'
    }
  ]

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="logo-text">likelyBroken</span>
              <span className="logo-emoji">⚙️</span>
            </a>
          </div>
          <div className="nav-links">
            <a href="#tools">Tools</a>
            <a href="#about">About</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
          <div className="glitch" data-text="likelyBroken">
            <h1>likelyBroken</h1>
          </div>
          <p className="tagline">A collection of tools that are probably broken</p>
          <p className="subtitle">Where developers embrace chaos and make things work anyway</p>
          <button className="cta-button" onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore Broken Tools
          </button>
        </div>
        <div className="floating-elements">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="float" style={{ 
              '--delay': `${i * 0.2}s` 
            } as React.CSSProperties}>
              {['🔧', '⚡', '🚀', '💻', '🛠️'][i]}
            </div>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="tools-section">
        <h2 className="section-title">Featured Tools</h2>
        <div className="tools-grid">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="tool-card"
              onMouseEnter={() => setHoveredTool(tool.id)}
              onMouseLeave={() => setHoveredTool(null)}
              style={{
                borderColor: hoveredTool === tool.id ? tool.color : 'transparent',
                boxShadow: hoveredTool === tool.id ? `0 0 20px ${tool.color}40` : 'none'
              }}
            >
              <div className="tool-icon" style={{ color: tool.color }}>
                {tool.icon}
              </div>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <a href={tool.link} className="tool-link" style={{ color: tool.color }}>
                Open Tool →
              </a>
            </div>
          ))}
          <div className="tool-card coming-soon">
            <div className="tool-icon">🚀</div>
            <h3>More Tools Coming...</h3>
            <p>We're cooking up more broken tools for you. Stay tuned!</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-content">
          <h2 className="section-title">About likelyBroken</h2>
          <p>
            Welcome to the chaos! likelyBroken is your go-to destination for tools that *probably* work, 
            or at least entertain you while you debug. We specialize in questionable solutions, hilarious 
            edge cases, and the occasional "wait, how did that actually work?" moments. Our mission is to 
            make developer life more fun, one broken tool at a time.
          </p>
          <p>
            Whether you're tracking down elusive bugs, generating boilerplate, testing APIs, or 
            visualizing data, likelyBroken has got your back.
          </p>
          <div className="stats">
            <div className="stat">
              <div className="stat-number">6+</div>
              <div className="stat-label">Tools</div>
            </div>
            <div className="stat">
              <div className="stat-number">100%</div>
              <div className="stat-label">Free & Open</div>
            </div>
            <div className="stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <p>&copy; 2025 likelyBroken. Built with chaos and ❤️</p>
        <div className="footer-links">
          <a href="https://github.com/denmads/likelybroken" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="mailto:hello@likelybroken.dev">Contact</a>
          <a href="#privacy">Privacy</a>
        </div>
      </footer>
    </div>
  )
}

export default App
