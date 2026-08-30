import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth.jsx'
import { signOut } from '../../lib/supabase.js'

export default function Navbar() {
  const { displayName, avatarUrl, initials, user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const isAdmin = user?.email === 'nejamulhaque.works@gmail.com'

  const handleSignOut = async () => {
    setSigningOut(true)
    setDropOpen(false)
    try {
      if (logout) await logout()
      await signOut()
      toast.success('Signed out successfully')
      navigate('/')
    } catch (e) {
      navigate('/')
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <nav style={{
      height: 62, background: 'rgba(15,15,24,0.92)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)', padding: '0 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100, flexShrink: 0,
    }}>
      {/* Brand */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <span className="navbar-title-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>
          Pro<span className="gradient-text">Resume</span>
        </span>
      </Link>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
        
        {/* Admin Link ONLY if logged in as nejamulhaque.works@gmail.com */}
        {isAdmin && (
          <Link
            to="/admin"
            className="btn btn-ghost btn-sm"
            style={{
              fontSize: 12, fontWeight: 700, color: 'var(--accent)',
              background: 'rgba(124,111,255,0.12)', border: '1px solid rgba(124,111,255,0.28)',
              padding: '5px 12px', borderRadius: 8, textDecoration: 'none'
            }}
          >
            🛡️ Admin Console
          </Link>
        )}

        <button
          onClick={() => setDropOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 5px 5px 12px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 100, cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <span className="nav-user-name" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {displayName}
          </span>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff', overflow: 'hidden',
          }}>
            {avatarUrl
              ? <img src={avatarUrl} alt={initials} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials}
          </div>
        </button>

        {dropOpen && (
          <>
            <div onClick={() => setDropOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
            <div style={{
              position: 'absolute', top: '110%', right: 0, zIndex: 200,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: 6,
              boxShadow: 'var(--shadow-lg)', minWidth: 210,
              animation: 'pageEnter 0.18s ease',
            }}>
              <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{displayName}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2, wordBreak: 'break-all' }}>{user?.email}</div>
                {isAdmin && (
                  <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4, background: 'rgba(124,111,255,0.2)', color: 'var(--accent)', marginTop: 4 }}>
                    SUPER ADMIN
                  </span>
                )}
              </div>

              <Link
                to="/"
                onClick={() => setDropOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 8, color: 'var(--text-primary)', textDecoration: 'none' }}
              >
                🏠 Home / Landing Page
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setDropOpen(false)}
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 8, color: 'var(--accent)', textDecoration: 'none' }}
                >
                  🛡️ Admin Console
                </Link>
              )}

              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 8, color: 'var(--danger)' }}
              >
                {signingOut ? <div className="spinner sm" /> : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                )}
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}