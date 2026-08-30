import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo.js'

export default function NotFoundPage() {
  useSeo({
    title: '404 — Page Not Found',
    description: 'The requested page does not exist on ProResume Builder.'
  })

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: 24, textAlign: 'center',
      color: 'var(--text-primary)'
    }}>
      <div style={{
        width: 90, height: 90, borderRadius: 24,
        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 42, marginBottom: 24, boxShadow: 'var(--shadow-accent)',
        animation: 'pulse 2s infinite'
      }}>
        🔍
      </div>

      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 64px)',
        fontWeight: 800, margin: '0 0 12px',
        background: 'linear-gradient(135deg, #fff 30%, var(--accent) 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
      }}>
        404
      </h1>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>
        Page Not Found
      </h2>

      <p style={{ color: 'var(--text-muted)', fontSize: 14.5, maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.6 }}>
        The link you followed may be broken, expired, or the page may have been moved. Return to the home page or create a fresh resume below.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-secondary btn-lg">
          ← Return to Home
        </Link>
        <Link to="/resume/new" className="btn btn-primary btn-lg">
          Create New Resume 🚀
        </Link>
      </div>

      <div style={{ marginTop: 40, fontSize: 12, color: 'var(--text-muted)' }}>
        ProResume Builder — Open-Source Project by <strong>Nejamul Haque</strong>
      </div>
    </div>
  )
}
