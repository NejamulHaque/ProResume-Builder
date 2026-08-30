import { useState } from 'react'
import UPIQRCode from './UPIQRCode.jsx'
import GumroadButton from './GumroadButton.jsx'

const DEV = {
  name:      'Nejamul Haque',
  role:      'Full-Stack & AI Engineer',
  avatar:    'NH',
  bio:       'Building tools that make job seekers more competitive. ProResume is a passion project — completely free, forever. If it helped you land an interview, consider supporting the work! Every rupee/dollar helps keep the project maintained, bug-free, and ad-free.',
  upiId:     'nejamulhaque@freecharge',
  gumroad:   'https://nejamulhaque.gumroad.com/',
  github:    'https://github.com/NejamulHaque',
  twitter:   'https://x.com/Nejamul_Haque_',
  linkedin:  'https://linkedin.com/in/nejamulhaque',
  website:   'https://portfolio-nejamulhaque.vercel.app/',
}

const SOCIAL_LINKS = [
  { label: 'GitHub',   url: DEV.github,   color: '#ffffff', bg: 'rgba(36,41,46,0.8)'        },
  { label: 'Twitter',  url: DEV.twitter,  color: '#1DA1F2', bg: 'rgba(29,161,242,0.12)'      },
  { label: 'LinkedIn', url: DEV.linkedin, color: '#0A66C2', bg: 'rgba(10,102,194,0.12)'      },
  { label: 'Website',  url: DEV.website,  color: 'var(--accent)', bg: 'var(--accent-glow)'  },
]

export default function DeveloperCard() {
  const [showQR, setShowQR] = useState(false)

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(124,111,255,0.08) 0%, rgba(255,107,157,0.05) 100%)',
      border: '1px solid rgba(124,111,255,0.22)',
      borderRadius: 'var(--radius-xl)',
      padding: 28,
      position: 'relative',
      overflow: 'hidden',
      maxWidth: 580,
    }}>
      {/* Decorative glow blob */}
      <div style={{
        position: 'absolute', top: -50, right: -50,
        width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,111,255,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Header ─────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 700, color: '#fff',
          fontFamily: 'var(--font-display)',
          boxShadow: 'var(--shadow-accent)',
        }}>
          {DEV.avatar}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 3 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>
              {DEV.name}
            </h3>
            <span className="badge badge-accent">Developer</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--accent)' }}>{DEV.role}</p>
        </div>
      </div>

      {/* ── Bio ─────────────────────────────────────── */}
      <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.68, marginBottom: 20 }}>
        {DEV.bio}
      </p>

      {/* ── Social links ────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', borderRadius: 8,
              background: link.bg, color: link.color,
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: 12, fontWeight: 500,
              textDecoration: 'none',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* ── Support section ─────────────────────────── */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: 20,
      }}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
          ☕ Support the Developer
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Gumroad */}
          <GumroadButton href={DEV.gumroad} />

          {/* UPI toggle */}
          <button
            onClick={() => setShowQR((v) => !v)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
              padding: '16px 14px', borderRadius: 12,
              background: showQR
                ? 'rgba(124,111,255,0.22)'
                : 'rgba(124,111,255,0.10)',
              border: '1px solid rgba(124,111,255,0.32)',
              color: 'var(--accent)',
              cursor: 'pointer',
              transition: 'all 0.18s',
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <path d="M14 14h3v3h-3zm3 3h3v3h-3zm-3 3h3"/>
            </svg>
            <span style={{ fontSize: 12, fontWeight: 700 }}>UPI / QR Code</span>
            <span style={{ fontSize: 10.5, opacity: 0.75 }}>{showQR ? 'Hide QR' : 'Show QR'}</span>
          </button>
        </div>

        {/* QR panel */}
        {showQR && (
          <div style={{
            marginTop: 18,
            display: 'flex', justifyContent: 'center',
            animation: 'pageEnter 0.3s ease',
          }}>
            <UPIQRCode upiId={DEV.upiId} name={DEV.name}/>
          </div>
        )}
      </div>

      {/* ── Footer note ─────────────────────────────── */}
      <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.55 }}>
        💜 ProResume is and always will be <strong style={{ color: 'var(--text-secondary)' }}>free</strong>.
        Your support keeps it that way.
      </p>
    </div>
  )
}
