import { useState } from 'react'
import { Link } from 'react-router-dom'
import LoginForm        from '../components/auth/LoginForm.jsx'
import RegisterForm     from '../components/auth/RegisterForm.jsx'
import GoogleAuthButton from '../components/auth/GoogleAuthButton.jsx'

export default function AuthPage() {
  const [mode, setMode] = useState('login')

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '30px 20px',
      background: `
        radial-gradient(ellipse 60% 50% at 20% 30%, rgba(124,111,255,0.18) 0%, transparent 60%),
        radial-gradient(ellipse 50% 50% at 80% 70%, rgba(255,107,157,0.12) 0%, transparent 60%),
        var(--bg-primary)
      `,
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Texture grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      {/* Floating Top Back to Home Button */}
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 20 }}>
        <Link
          to="/"
          className="btn btn-secondary btn-sm"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(20,20,30,0.85)', backdropFilter: 'blur(10px)',
            textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600,
            borderRadius: 100, padding: '6px 14px'
          }}
        >
          <span>←</span> Back to Home
        </Link>
      </div>

      {/* Main Card Container */}
      <div style={{
        width: '100%', maxWidth: 940,
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-2xl)', overflow: 'hidden',
        boxShadow: '0 30px 100px rgba(0,0,0,0.85)', position: 'relative', zIndex: 1,
        marginTop: 30
      }} className="page-enter">

        {/* Left Side: Cyber Feature Showcase */}
        <div style={{
          padding: '40px 36px',
          background: 'linear-gradient(135deg, rgba(124,111,255,0.15) 0%, rgba(15,15,24,0.95) 100%)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>
          <div>
            {/* Logo */}
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit', marginBottom: 32 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11,
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-accent)',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: -0.5 }}>
                Pro<span className="gradient-text">Resume</span>
              </span>
            </Link>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, lineHeight: 1.3, marginBottom: 12 }}>
              Build &amp; Export High-Impact Resumes with AI.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 28 }}>
              Join thousands of engineers, designers, and managers landing top roles worldwide.
            </p>

            {/* Feature Perks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                <span style={{ fontSize: 18 }}>🤖</span>
                <span><strong>IRUS AI Copilot</strong> built-in (irus-ai.onrender.com)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                <span style={{ fontSize: 18 }}>⏳</span>
                <span><strong>10-Day Auto Purge</strong> for zero personal data leak</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                <span style={{ fontSize: 18 }}>🎯</span>
                <span><strong>98.4% ATS Screening Pass</strong> rate with keyword analysis</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                <span style={{ fontSize: 18 }}>📄</span>
                <span><strong>Vector Print PDFs</strong> in crisp high-DPI quality</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: 'var(--text-muted)' }}>
            Developed with ❤️ by <strong>Nejamul Haque</strong>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {/* Tab switcher */}
          <div style={{
            display: 'flex', background: 'var(--bg-elevated)',
            borderRadius: 10, padding: 4, marginBottom: 22,
          }}>
            {[
              { id: 'login',    label: 'Sign In'        },
              { id: 'register', label: 'Create Account' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id)}
                style={{
                  flex: 1, padding: '9px', border: 'none', cursor: 'pointer',
                  borderRadius: 8, fontSize: 13.5, fontWeight: 600,
                  fontFamily: 'var(--font-body)', transition: 'all 0.18s',
                  background: mode === tab.id ? 'var(--bg-card)' : 'transparent',
                  color:      mode === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow:  mode === tab.id ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <GoogleAuthButton />

          <div className="divider" style={{ margin: '16px 0' }}>or continue with email</div>

          {/* Email form */}
          {mode === 'login'
            ? <LoginForm    onSwitch={() => setMode('register')} />
            : <RegisterForm onSwitch={() => setMode('login')}    />}

          <p style={{ textAlign: 'center', marginTop: 18, fontSize: 11.5, color: 'var(--text-muted)' }}>
            By continuing, you agree to our 10-day ephemeral privacy retention policy.
          </p>
        </div>

      </div>
    </div>
  )
}
