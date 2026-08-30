import { useAuth } from '../../hooks/useAuth.jsx'
import { Link } from 'react-router-dom'

const NAV_ITEMS = [
  { id: 'resumes', label: 'My Resumes'  },
  { id: 'templates', label: 'Templates'   },
  { id: 'developer', icon: '👨‍💻', label: 'Developer'   },
]

// Desktop sidebar
export default function Sidebar({ activeTab, onTabChange }) {
  const { user } = useAuth()
  const isAdmin = user?.email === 'nejamulhaque.works@gmail.com'

  return (
    <aside className="sidebar-desktop" style={{
      width: 220,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      padding: '20px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      flexShrink: 0,
      overflowY: 'auto',
      position: 'sticky',
      top: 62,
      height: 'calc(100vh - 62px)',
    }}>
      {NAV_ITEMS.map((item) => {
        const active = activeTab === item.id
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 11,
              padding: '10px 13px', borderRadius: 10,
              background: active ? 'var(--accent-glow)' : 'transparent',
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              border: active ? '1px solid rgba(124,111,255,0.28)' : '1px solid transparent',
              cursor: 'pointer', fontSize: 13.5,
              fontWeight: active ? 500 : 400,
              fontFamily: 'var(--font-body)', transition: 'all 0.18s',
              textAlign: 'left', width: '100%',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-card)' }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </button>
        )
      })}

      {/* Admin Link ONLY if logged in as nejamulhaque.works@gmail.com */}
      {isAdmin && (
        <Link
          to="/admin"
          style={{
            display: 'flex', alignItems: 'center', gap: 11,
            padding: '10px 13px', borderRadius: 10,
            background: 'rgba(124,111,255,0.08)',
            color: 'var(--accent)',
            border: '1px solid rgba(124,111,255,0.2)',
            fontSize: 13.5, fontWeight: 600,
            fontFamily: 'var(--font-body)', textDecoration: 'none',
            marginTop: 6, transition: 'all 0.18s'
          }}
        >
          <span style={{ fontSize: 16 }}>🛡️</span>
          Admin Portal
        </Link>
      )}

      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <div style={{
          padding: '11px 13px', background: 'var(--bg-card)',
          border: '1px solid var(--border)', borderRadius: 10,
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Signed in as
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', wordBreak: 'break-all', lineHeight: 1.4 }}>
            {user?.email}
          </div>
          <div style={{
            marginTop: 8, padding: '4px 8px', borderRadius: 6,
            background: 'rgba(255, 179, 71, 0.1)', border: '1px solid rgba(255, 179, 71, 0.2)',
            fontSize: 10.5, color: 'var(--warning)', fontWeight: 600
          }}>
            ⏳ 10-Day Auto Purge Policy
          </div>
        </div>
      </div>
    </aside>
  )
}

// Mobile bottom navigation bar
export function BottomNav({ activeTab, onTabChange }) {
  const items = [
    { id: 'resumes', label: 'Resumes', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { id: 'templates', label: 'Templates', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { id: 'developer', label: 'About', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
  ]

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`bottom-nav-btn ${activeTab === item.id ? 'active' : ''}`}
        >
          {item.svg}
          {item.label}
        </button>
      ))}
    </nav>
  )
}