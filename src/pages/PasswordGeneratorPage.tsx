import PasswordGenerator from '../components/PasswordGenerator'

function PasswordGeneratorPage() {
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
            <a href="/#tools">Tools</a>
            <a href="/#about">About</a>
          </div>
        </div>
      </nav>

      <PasswordGenerator />
    </div>
  )
}

export default PasswordGeneratorPage
