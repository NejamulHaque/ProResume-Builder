import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function SocialShareModal({ isOpen, onClose, shareUrl = window.location.href, title = 'Build ATS-Friendly Resumes with Overleaf LaTeX & IRUS AI on ProResume Builder!' }) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)

  const CHANNELS = [
    {
      name: 'LinkedIn',
      icon: '💼',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: '#0A66C2',
      bg: 'rgba(10,102,194,0.15)'
    },
    {
      name: 'Twitter / X',
      icon: '🐦',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: '#1DA1F2',
      bg: 'rgba(29,161,242,0.15)'
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: '#25D366',
      bg: 'rgba(37,211,102,0.15)'
    },
    {
      name: 'Reddit',
      icon: '🤖',
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: '#FF4500',
      bg: 'rgba(255,69,0,0.15)'
    },
  ]

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1200,
      background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 480,
        boxShadow: '0 25px 80px rgba(0,0,0,0.85)', overflow: 'hidden', padding: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🚀</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: 0 }}>
              Share ProResume Builder
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-xs" style={{ fontSize: 18, color: 'var(--text-muted)' }}>
            ×
          </button>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 20 }}>
          Help fellow engineers, students, and job seekers create recruiter-grade LaTeX resumes for free!
        </p>

        {/* Share buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {CHANNELS.map(ch => (
            <a
              key={ch.name}
              href={ch.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
                borderRadius: 10, background: ch.bg, color: ch.color,
                border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none',
                fontWeight: 600, fontSize: 13, transition: 'transform 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span>{ch.icon}</span>
              <span>{ch.name}</span>
            </a>
          ))}
        </div>

        {/* Copy Link Input */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            readOnly
            className="input"
            value={shareUrl}
            style={{ fontSize: 12, background: 'var(--bg-primary)' }}
          />
          <button onClick={handleCopy} className="btn btn-primary btn-sm" style={{ flexShrink: 0, fontWeight: 700 }}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}
