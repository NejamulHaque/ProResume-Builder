import { useState } from 'react'
import { Link } from 'react-router-dom'
import LoginForm        from '../components/auth/LoginForm.jsx'
import RegisterForm     from '../components/auth/RegisterForm.jsx'
import GoogleAuthButton from '../components/auth/GoogleAuthButton.jsx'
import { PORTFOLIO_URL, IRUS_AI_URL } from '../lib/constants.js'

export default function AuthPage() {
  const [mode, setMode] = useState('login')

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Apple Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 350,
        background: 'radial-gradient(circle, rgba(41, 151, 255, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Floating Top Back to Home Button */}
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 20 }}>
        <Link
          to="/"
          className="btn btn-secondary btn-sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            textDecoration: 'none',
            fontSize: 13
          }}
        >
          <span>←</span> Overview
        </Link>
      </div>

      {/* Main Apple Bento Card */}
      <div style={{
        width: '100%',
        maxWidth: 920,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-2xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        zIndex: 1,
        marginTop: 20
      }} className="page-enter">

        {/* Left Side: Brand Showcase */}
        <div style={{
          padding: '44px 38px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            {/* Logo */}
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit', marginBottom: 36 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#ffffff',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 800
              }}>
                P
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: -0.4 }}>
                Pro<span style={{ color: 'var(--accent)' }}>Resume</span>
              </span>
            </Link>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.3, marginBottom: 12 }}>
              Precision resume engineering. Powered by AI &amp; LaTeX.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 32, letterSpacing: '-0.01em' }}>
              Create recruiter-grade, ATS-compliant resumes with real-time Overleaf editing and 10-day zero-leak cloud privacy.
            </p>

            {/* Feature Perks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
                <span style={{ color: 'var(--accent)' }}>●</span>
                <span><strong>IRUS AI Copilot</strong> integration (<a href={IRUS_AI_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>irus-ai</a>)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
                <span style={{ color: 'var(--warning)' }}>●</span>
                <span><strong>10-Day Ephemeral Retention</strong> for maximum data privacy</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
                <span style={{ color: 'var(--success)' }}>●</span>
                <span><strong>98% Verified ATS Screening</strong> keyword pass rate</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
                <span style={{ color: 'var(--text-primary)' }}>●</span>
                <span><strong>High-DPI Vector PDFs</strong> with zero watermarks</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 36, paddingTop: 20, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
            Developed by{' '}
            <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
              Nejamul Haque
            </a>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div style={{ padding: '44px 38px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {/* Apple Segmented Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-pill)',
            padding: 4,
            marginBottom: 24,
          }}>
            {[
              { id: 'login',    label: 'Sign In'        },
              { id: 'register', label: 'Create Account' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.18s',
                  background: mode === tab.id ? '#ffffff' : 'transparent',
                  color:      mode === tab.id ? '#000000' : 'var(--text-secondary)',
                  boxShadow:  mode === tab.id ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <GoogleAuthButton />

          <div className="divider" style={{ margin: '18px 0' }}>or continue with email</div>

          {/* Email form */}
          {mode === 'login'
            ? <LoginForm    onSwitch={() => setMode('register')} />
            : <RegisterForm onSwitch={() => setMode('login')}    />}

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
            By continuing, you acknowledge our 10-day ephemeral cloud retention policy.
          </p>
        </div>

      </div>
    </div>
  )
}
