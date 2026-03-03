import { useState, useEffect } from 'react'
import './App.css'

const BUILD_TIME = new Date().toISOString()
const COMMIT = import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local'
const BRANCH = import.meta.env.VITE_VERCEL_GIT_COMMIT_REF || 'main'
const DEPLOY_URL = import.meta.env.VITE_VERCEL_URL || 'localhost:5173'

function App() {
  const [now, setNow] = useState(new Date())
  const [uptime, setUptime] = useState(0)
  const [deployedAt] = useState(new Date())
  const [count, setCount] = useState(0)
  const [pushes] = useState([
    { id: 1, msg: 'feat: initial CI/CD setup', branch: 'main', time: '2m ago', status: 'success' },
    { id: 2, msg: 'fix: update timer precision', branch: 'main', time: '1m ago', status: 'success' },
    { id: 3, msg: 'chore: add deployment badge', branch: 'main', time: 'just now', status: 'building' },
  ])

  useEffect(() => {
    const t = setInterval(() => {
      setNow(new Date())
      setUptime(s => s + 1)
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const fmt = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0')
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
    const sc = (s % 60).toString().padStart(2, '0')
    return `${h}:${m}:${sc}`
  }

  const timeStr = now.toLocaleTimeString('en-US', { hour12: false })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">⚡ CICD Demo</div>
        <div className="deploy-badge">
          <span className="dot green" />
          <span>Deployed on Vercel</span>
        </div>
      </header>

      {/* Clock Hero */}
      <section className="clock-hero">
        <div className="clock-label">LIVE CLOCK</div>
        <div className="clock">{timeStr}</div>
        <div className="date">{dateStr}</div>
        <div className="uptime-row">
          <div className="uptime-pill">
            <span className="dot amber pulse" />
            Session Uptime: <b>{fmt(uptime)}</b>
          </div>
        </div>
      </section>

      {/* Grid */}
      <div className="grid">
        {/* Deployment Info */}
        <div className="card">
          <h3>🚀 Deployment Info</h3>
          <div className="kv-list">
            <div className="kv"><span>Commit</span><code>{COMMIT}</code></div>
            <div className="kv"><span>Branch</span><code>{BRANCH}</code></div>
            <div className="kv"><span>URL</span><code>{DEPLOY_URL}</code></div>
            <div className="kv"><span>Build Time</span><code>{new Date(BUILD_TIME).toLocaleTimeString()}</code></div>
            <div className="kv"><span>Session Start</span><code>{deployedAt.toLocaleTimeString()}</code></div>
          </div>
        </div>

        {/* Counter */}
        <div className="card center">
          <h3>🔢 Interactive Counter</h3>
          <div className="counter">{count}</div>
          <div className="btn-row">
            <button className="btn red" onClick={() => setCount(c => c - 1)}>−</button>
            <button className="btn grey" onClick={() => setCount(0)}>Reset</button>
            <button className="btn green" onClick={() => setCount(c => c + 1)}>+</button>
          </div>
          <p className="hint">State persists until next deploy</p>
        </div>

        {/* CI/CD Feed */}
        <div className="card full">
          <h3>📦 CI/CD Deploy Feed</h3>
          <p className="sub">Every git push → auto deploy via Vercel</p>
          <div className="feed">
            {pushes.map(p => (
              <div key={p.id} className={`feed-item ${p.status}`}>
                <div className="feed-icon">
                  {p.status === 'success' ? '✅' : p.status === 'building' ? '⚙️' : '❌'}
                </div>
                <div className="feed-body">
                  <div className="feed-msg">{p.msg}</div>
                  <div className="feed-meta">
                    <code>{p.branch}</code>
                    <span>{p.time}</span>
                    <span className={`status-pill ${p.status}`}>
                      {p.status === 'building' ? '⏳ Building...' : '✓ Live'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cicd-note">
            <span>💡 Push to <code>main</code> → Vercel builds → Live in ~30s</span>
          </div>
        </div>
      </div>

      <footer className="footer">
        Built with Vite + React · Deployed on Vercel · CI/CD via GitHub
      </footer>
    </div>
  )
}

export default App
