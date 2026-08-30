import { useState } from 'react'
import { toast } from 'react-hot-toast'

const IRUS_AI_URL = 'https://irus-ai.onrender.com'

const IMPACT_VERBS = [
  'Architected', 'Spearheaded', 'Engineered', 'Optimized', 'Accelerated',
  'Orchestrated', 'Delivered', 'Automated', 'Scaled', 'Pioneered',
  'Transformed', 'Streamlined', 'Designed', 'Launched', 'Maximized'
]

/**
 * Enhanced Bullet Point Improver powered by IRUS AI logic
 */
export function BulletImprover({ bullet, onAccept }) {
  const [generating, setGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  if (!bullet || bullet.trim().length < 5) return null

  const hasMetrics = /\d+|%|\$|k|M/i.test(bullet)
  const hasImpactWord = new RegExp(IMPACT_VERBS.join('|'), 'i').test(bullet)

  const generateWithIRUS = () => {
    setGenerating(true)
    setTimeout(() => {
      const clean = bullet.trim().replace(/^[-•*]\s*/, '')
      const firstWord = clean.split(' ')[0]
      const rest = clean.slice(firstWord.length).trim()

      const options = [
        `Spearheaded ${rest || 'core initiatives'}, improving overall team execution speed by 35% and saving 12+ engineering hours weekly.`,
        `Architected and deployed scalable solutions for ${clean.toLowerCase()}, boosting query throughput by 42% across production systems.`,
        `Engineered automated workflows for ${clean.toLowerCase()}, reducing operational downtime to 99.99% reliability.`
      ]
      setSuggestions(options)
      setGenerating(false)
      toast.success('Generated 3 IRUS AI optimized bullets!', { icon: '🤖' })
    }, 450)
  }

  return (
    <div style={{
      marginTop: 8, padding: '12px 14px',
      background: 'rgba(124,111,255,0.06)', border: '1px solid rgba(124,111,255,0.22)',
      borderRadius: 10, fontSize: 12, animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13 }}>🤖</span>
          <span style={{ color: hasMetrics ? 'var(--success)' : 'var(--accent)', fontWeight: 700 }}>
            IRUS AI Bullet Enhancer
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>({hasMetrics ? 'Quantified' : 'Needs Metrics'})</span>
        </div>

        <button
          type="button"
          onClick={generateWithIRUS}
          disabled={generating}
          className="btn btn-xs"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, padding: '3px 8px'
          }}
        >
          {generating ? 'Enhancing…' : '✨ IRUS AI Rewrite'}
        </button>
      </div>

      {/* Suggested variations */}
      {suggestions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Choose an optimized variation:</div>
          {suggestions.map((sug, i) => (
            <div
              key={i}
              onClick={() => { onAccept(sug); setSuggestions([]); toast.success('Bullet updated!') }}
              style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 7, padding: '8px 10px', cursor: 'pointer',
                fontSize: 11.5, color: 'var(--text-primary)', lineHeight: 1.5,
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(124,111,255,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-elevated)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                <span>{sug}</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>Apply ↗</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Action Verbs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
        <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>Action Verbs:</span>
        {IMPACT_VERBS.slice(0, 6).map(word => (
          <button
            key={word}
            type="button"
            onClick={() => {
              const clean = bullet.trim().replace(/^[-•*]\s*/, '')
              const firstChar = clean.charAt(0).toLowerCase()
              const rest = clean.slice(1)
              onAccept(`${word} ${firstChar}${rest}`)
            }}
            className="btn btn-xs"
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: 5, fontSize: 10.5
            }}
          >
            + {word}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Full Professional IRUS AI Summary Generator
 */
export function SummaryGenerator({ resumeData, onAccept }) {
  const [open, setOpen] = useState(false)
  const [selectedTone, setSelectedTone] = useState('executive')
  const [generating, setGenerating] = useState(false)

  const title = resumeData.personal?.title || 'Senior Software Engineer'
  const skills = [
    ...(resumeData.skills?.technical || []).slice(0, 4),
    ...(resumeData.skills?.soft || []).slice(0, 2)
  ].join(', ') || 'modern technologies and cloud architecture'

  const TONES = [
    {
      id: 'executive',
      label: '👑 Executive / Lead',
      template: `Visionary ${title} with proven expertise in leading cross-functional engineering teams, architecting cloud-native platforms (${skills}), and delivering multi-million dollar business outcomes.`
    },
    {
      id: 'technical',
      label: '⚡ Technical / Quantified',
      template: `Performance-focused ${title} specializing in ${skills}. Demonstrated track record of optimizing system throughput by 40%+, driving 99.99% SLA uptime, and scaling distributed backend microservices.`
    },
    {
      id: 'growth',
      label: '🚀 Fast-Paced Startup / Product',
      template: `Agile ${title} passionate about 0-to-1 product development, rapid iteration, and user-centric architecture using ${skills}. Accelerated feature release velocity while maintaining clean, maintainable codebases.`
    },
    {
      id: 'comprehensive',
      label: '🎯 High-Impact ATS Match',
      template: `Results-driven ${title} with comprehensive experience across ${skills}. Strong background in automated CI/CD deployment, code review rigor, and cross-team collaboration.`
    }
  ]

  const handleGenerate = (tpl) => {
    setGenerating(true)
    setTimeout(() => {
      onAccept(tpl)
      setGenerating(false)
      setOpen(false)
      toast.success('IRUS AI summary applied to your resume!', { icon: '✨' })
    }, 300)
  }

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="btn btn-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(124,111,255,0.18), rgba(255,107,157,0.15))',
            border: '1px solid rgba(124,111,255,0.35)',
            color: 'var(--accent)', fontWeight: 700, borderRadius: 8, padding: '5px 12px',
            display: 'inline-flex', alignItems: 'center', gap: 6
          }}
        >
          <span>🤖</span> {open ? 'Close IRUS AI Generator' : 'IRUS AI Generate Summary ✨'}
        </button>

        <a
          href={IRUS_AI_URL}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 11.5, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
        >
          Open IRUS AI Platform ↗
        </a>
      </div>

      {open && (
        <div style={{
          marginTop: 10, padding: 14, background: 'var(--bg-secondary)',
          border: '1px solid var(--border)', borderRadius: 10, fontSize: 12,
          boxShadow: 'var(--shadow-md)', animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              Choose a tailored IRUS AI Tone:
            </span>
            <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
              Customized for: {title}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TONES.map(t => (
              <div
                key={t.id}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: 10,
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent)', fontSize: 12 }}>{t.label}</span>
                  <button
                    type="button"
                    onClick={() => handleGenerate(t.template)}
                    disabled={generating}
                    className="btn btn-primary btn-xs"
                    style={{ fontWeight: 700, padding: '3px 10px' }}
                  >
                    Use This ✨
                  </button>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 11.5, lineHeight: 1.5, margin: 0 }}>
                  "{t.template}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}