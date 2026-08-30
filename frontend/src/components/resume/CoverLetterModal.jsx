import { useState, useMemo } from 'react'
import { toast } from 'react-hot-toast'

const IRUS_AI_URL = 'https://irus-ai.onrender.com'

export default function CoverLetterModal({ isOpen, onClose, resumeData }) {
  const [targetRole,    setTargetRole]    = useState(resumeData.personal?.title || 'Senior Software Engineer')
  const [companyName,   setCompanyName]   = useState('Google')
  const [hiringManager, setHiringManager] = useState('Hiring Team')
  const [tone,          setTone]          = useState('confident')
  const [copied,        setCopied]        = useState(false)

  const candidateName = resumeData.personal?.fullName || 'Nejamul Haque'
  const email = resumeData.personal?.email || 'nejamulhaque.works@gmail.com'
  const phone = resumeData.personal?.phone || ''
  const location = resumeData.personal?.location || ''
  const skills = [
    ...(resumeData.skills?.technical || []).slice(0, 5),
    ...(resumeData.skills?.soft || []).slice(0, 2)
  ].join(', ') || 'cloud infrastructure, React, Node.js, and distributed systems'

  const topExperience = resumeData.experience?.[0] || {
    company: 'Tech Innovations',
    role: targetRole,
    bullets: ['Engineered scalable microservices handling 10M+ requests daily with 99.99% uptime.']
  }

  const letterBody = useMemo(() => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const contactLine = [email, phone, location].filter(Boolean).join(' | ')

    return `${candidateName}
${contactLine}

${today}

To: ${hiringManager}
${companyName}

Dear ${hiringManager},

I am writing to express my strong enthusiasm for the ${targetRole} role at ${companyName}. With extensive experience in architecting high-performance systems and leading strategic development with ${skills}, I am eager to contribute to ${companyName}'s innovative mission.

In my recent work as ${topExperience.role || targetRole} at ${topExperience.company || 'my previous organization'}, I successfully spearheaded core architectural improvements that directly boosted reliability and feature delivery velocity. Specifically, ${topExperience.bullets?.[0] || 'I delivered mission-critical applications that scaled seamlessly to support high-volume user traffic.'}

What draws me specifically to ${companyName} is your dedication to engineering excellence and scalable impact. I thrive in collaborative, fast-paced environments where solving complex problems drives tangible product value. My technical skill set in ${skills}, combined with my passion for clean code and proactive ownership, aligns directly with what your team needs.

I would welcome the opportunity to discuss how my background, technical problem-solving skills, and passion can support ${companyName}'s growth goals. Thank you for your time and consideration.

Sincerely,

${candidateName}
${email}`
  }, [candidateName, email, phone, location, hiringManager, companyName, targetRole, skills, topExperience])

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(letterBody)
    setCopied(true)
    toast.success('Cover letter copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([letterBody], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${candidateName.toLowerCase().replace(/\s+/g, '_')}_cover_letter.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Cover letter downloaded (.txt)')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(0, 0, 0, 0.82)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 740,
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 80px rgba(0,0,0,0.85)', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(124,111,255,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
            }}>
              ✉️
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, margin: 0 }}>
                IRUS AI Cover Letter Writer
              </h3>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                Powered by irus-ai.onrender.com
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-xs"
            style={{ fontSize: 18, color: 'var(--text-muted)' }}
          >
            ×
          </button>
        </div>

        {/* Form Inputs & Customization */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: 11.5 }}>Target Job Title</label>
            <input className="input" value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Lead Engineer" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: 11.5 }}>Target Company</label>
            <input className="input" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Google" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: 11.5 }}>Hiring Manager / Team</label>
            <input className="input" value={hiringManager} onChange={e => setHiringManager(e.target.value)} placeholder="e.g. Engineering Lead" />
          </div>
        </div>

        {/* Live Letter View */}
        <div style={{ flex: 1, padding: 20, overflowY: 'auto', background: '#0d0d14' }}>
          <pre style={{
            fontFamily: 'var(--font-body)', fontSize: 12.5, lineHeight: 1.7,
            color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', margin: 0,
            background: 'var(--bg-card)', padding: '20px 24px', borderRadius: 8,
            border: '1px solid var(--border)'
          }}>
            {letterBody}
          </pre>
        </div>

        {/* Footer actions */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-secondary)', flexWrap: 'wrap', gap: 10
        }}>
          <a
            href={IRUS_AI_URL}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, fontSize: 12 }}
          >
            🤖 Launch IRUS AI Platform ↗
          </a>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleDownload} className="btn btn-secondary btn-sm">
              📥 Download (.txt)
            </button>
            <button onClick={handleCopy} className="btn btn-primary btn-sm">
              {copied ? '✓ Copied!' : '📋 Copy Letter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
