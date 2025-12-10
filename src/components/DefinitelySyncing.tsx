import { useState, useEffect } from 'react'
import '../styles/DefinitelySyncing.css'

const STORAGE_KEY = 'defsync_last'

export default function DefinitelySyncing() {
  const [syncing, setSyncing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setLastSync(stored)
    } catch (e) {
      // ignore
    }
  }, [])

  const startSync = () => {
    setCompleted(false)
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      setCompleted(true)
      const now = new Date().toISOString()
      setLastSync(now)
      try {
        localStorage.setItem(STORAGE_KEY, now)
      } catch (e) {
        // ignore
      }
    }, 4000)
  }

  const formattedLast = lastSync ? new Date(lastSync).toLocaleString() : null

  return (
    <div className="defsync-container">
      <div className="defsync-card">
        <h1>Definitely Syncing</h1>
        <p className="defsync-sub">Syncs… something. Press the button to definitely sync it.</p>

        <div className="defsync-action">
          <button className="sync-button" onClick={startSync} disabled={syncing}>
            {syncing ? (
              <span className="spinner" aria-hidden></span>
            ) : (
              completed ? 'Sync Again' : 'Start Sync'
            )}
          </button>
        </div>

        <div className="defsync-status">
          {syncing && <div className="status-text">Syncing…</div>}
          {!syncing && completed && <div className="status-text">Sync complete.</div>}
          {formattedLast && (
            <div className="last-sync">Last sync: <span className="last-sync-time">{formattedLast}</span></div>
          )}
        </div>
      </div>
    </div>
  )
}
