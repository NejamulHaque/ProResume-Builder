import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo.js'
import { PORTFOLIO_URL } from '../lib/constants.js'

export default function NotFoundPage() {
  useSeo({
    title: '404 — Page Not Found',
    description: 'The requested page does not exist on ProResume Builder.'
  })

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '40px 24px',
      textAlign: 'center',
      color: 'var(--text-primary)'
    }}>
      <div style={{
        width: 72,
        height: 72,
        borderRadius: 20,
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 32,
        marginBottom: 28,
        backdropFilter: 'blur(20px)'
      }}>
        404
      </div>

      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(32px, 5vw, 56px)',
        fontWeight: 700,
        letterSpacing: '-0.03em',
        margin: '0 0 16px',
        color: 'var(--text-primary)'
      }}>
        Page Not Found
      </h1>

      <p style={{
        color: 'var(--text-secondary)',
        fontSize: 16,
        maxWidth: 480,
        margin: '0 auto 36px',
        lineHeight: 1.6,
        letterSpacing: '-0.01em'
      }}>
        The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-secondary btn-lg">
          ← Return to Overview
        </Link>
        <Link to="/resume/new" className="btn btn-primary btn-lg">
          Create a Resume
        </Link>
      </div>

      <div style={{ marginTop: 60, fontSize: 13, color: 'var(--text-muted)' }}>
        ProResume Builder — Created with care by{' '}
        <a
          href={PORTFOLIO_URL}
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}
        >
          Nejamul Haque
        </a>
      </div>
    </div>
  )
}
