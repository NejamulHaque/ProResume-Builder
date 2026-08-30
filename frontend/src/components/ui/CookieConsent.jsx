import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('proresume_cookie_consent')
    if (!saved) {
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = (choice) => {
    localStorage.setItem('proresume_cookie_consent', choice)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside
      aria-label="Cookie consent banner"
      style={{
        position: 'fixed', bottom: 20, left: 20, right: 20, maxWidth: 520, margin: '0 auto',
        zIndex: 1000, background: 'rgba(21, 21, 33, 0.96)', backdropFilter: 'blur(16px)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        padding: '18px 20px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
        animation: 'slideUp 0.3s ease', display: 'flex', flexDirection: 'column', gap: 12
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ fontSize: 20 }}>🍪</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>
            Privacy & Cookie Preferences
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            We use essential local cookies for authentication and saving your resume drafts. We never sell your personal data. Read our{' '}
            <Link to="/privacy" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleAccept('essential')}
          className="btn btn-secondary btn-xs"
          style={{ padding: '6px 12px', fontSize: 11.5 }}
        >
          Essential Only
        </button>
        <button
          onClick={() => handleAccept('all')}
          className="btn btn-primary btn-xs"
          style={{ padding: '6px 14px', fontSize: 11.5, fontWeight: 700 }}
        >
          Accept All 🍪
        </button>
      </div>
    </aside>
  )
}
