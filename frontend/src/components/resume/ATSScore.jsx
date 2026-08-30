import { useState } from 'react'

function scoreResume(data) {
  const checks = []
  const p = data.personal || {}
  const exp = data.experience || []
  const edu = data.education || []
  const skills = data.skills || {}
  const allSkills = [...(skills.technical || []), ...(skills.soft || []), ...(skills.languages || [])]

  // Contact info (20 pts)
  checks.push({ label: 'Full name',          pts: p.fullName?.trim()  ? 5  : 0, max: 5  })
  checks.push({ label: 'Email address',      pts: p.email?.trim()     ? 5  : 0, max: 5  })
  checks.push({ label: 'Phone number',       pts: p.phone?.trim()     ? 5  : 0, max: 5  })
  checks.push({ label: 'Location',           pts: p.location?.trim()  ? 5  : 0, max: 5  })

  // Summary (10 pts)
  const sumLen = (p.summary || '').trim().length
  checks.push({ label: 'Professional summary', pts: sumLen > 100 ? 10 : sumLen > 40 ? 5 : 0, max: 10 })

  // Experience (25 pts)
  checks.push({ label: 'Work experience added', pts: exp.length > 0 ? 10 : 0, max: 10 })
  const hasBullets = exp.some(e => (e.bullets || []).filter(Boolean).length >= 2)
  checks.push({ label: '2+ bullet points per job', pts: hasBullets ? 10 : 0, max: 10 })
  // Broad metric detection — numbers, percentages, currencies, multipliers, scale words + action verbs
  const metricRegex = /\d+\s*%|\$[\d,]+|£[\d,]+|₹[\d,]+|\d+x|\d+\+|\d+k\b|\d+m\b|\bx\d+|reduced|increased|improved|grew|saved|generated|delivered|launched|scaled|led|managed|built|deployed|optimised|optimized|build|create|implement|designed|developing/i
  
  // 1. Check experience bullets
  const expMetrics = exp.some(e =>
    (e.bullets || []).some(b => b && b.trim().length > 8 && metricRegex.test(b))
  )
  
  // 2. Check projects or dedicated achievements
  const projects     = data.projects     || []
  const achievements = data.achievements || []
  const otherMetrics = 
    projects.some(p => p.description && p.description.length > 10 && metricRegex.test(p.description)) ||
    achievements.some(a => a && a.length > 5 && metricRegex.test(a))

  const hasMetrics = expMetrics || otherMetrics

  checks.push({
    label: 'Quantified achievements',
    pts:   hasMetrics ? 5 : 0,
    max:   5,
    tip:   hasMetrics ? '' : 'Add numbers, % or impact words (e.g. "reduced load time by 40%")',
  })

  // Skills (20 pts)
  checks.push({ label: '5+ skills listed',   pts: allSkills.length >= 5  ? 10 : allSkills.length > 0 ? 5 : 0, max: 10 })
  checks.push({ label: '10+ skills listed',  pts: allSkills.length >= 10 ? 10 : 0, max: 10 })

  // Education (10 pts)
  checks.push({ label: 'Education added',    pts: edu.length > 0 ? 10 : 0, max: 10 })

  // Online presence (10 pts)
  checks.push({ label: 'LinkedIn profile',   pts: p.linkedin?.trim() ? 5 : 0, max: 5 })
  checks.push({ label: 'GitHub / Portfolio', pts: (p.github?.trim() || p.website?.trim()) ? 5 : 0, max: 5 })

  // Certifications (5 pts)
  const certs = data.certifications || []
  checks.push({ label: 'Certifications',     pts: certs.length > 0 ? 5 : 0, max: 5 })

  const total = checks.reduce((s, c) => s + c.pts, 0)
  const max   = checks.reduce((s, c) => s + c.max, 0)
  const score = Math.round((total / max) * 100)

  return { score, checks, total, max }
}

function getLabel(score) {
  if (score >= 85) return { text: 'Excellent',   color: 'var(--success)' }
  if (score >= 65) return { text: 'Good',         color: 'var(--accent)'  }
  if (score >= 45) return { text: 'Needs Work',   color: 'var(--warning)' }
  return               { text: 'Incomplete',    color: 'var(--danger)'  }
}

export default function ATSScore({ data }) {
  const [open, setOpen] = useState(false)
  const { score, checks } = scoreResume(data)
  const { text, color }   = getLabel(score)

  // Ring SVG
  const r  = 28
  const cx = 36
  const circumference = 2 * Math.PI * r
  const dash = (score / 100) * circumference

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Collapsed pill */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          width: '100%', padding: '12px 14px',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: open ? '10px 10px 0 0' : 10,
          cursor: 'pointer', fontFamily: 'var(--font-body)',
          transition: 'all 0.2s',
        }}
      >
        {/* Mini ring */}
        <svg width="36" height="36" viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--border)" strokeWidth="6"/>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cx})`}
          />
          <text x={cx} y={cx+1} textAnchor="middle" dominantBaseline="central"
            style={{ fontSize: 16, fontWeight: 700, fill: color, fontFamily: 'var(--font-display)' }}>
            {score}
          </text>
        </svg>

        <div style={{ textAlign: 'left', flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>
            ATS Score
          </div>
          <div style={{ fontSize: 12, color }}>
            {text} — {score}/100
          </div>
        </div>

        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Expanded checklist */}
      {open && (
        <div style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderTop: 'none',
          borderRadius: '0 0 10px 10px',
          padding: '12px 14px',
        }}>
          {checks.map((c, i) => (
            <div key={i} style={{
              padding: '5px 0',
              borderBottom: i < checks.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: c.pts > 0 ? 'var(--success)' : 'var(--danger)', flexShrink: 0 }}>
                    {c.pts > 0 ? '✓' : '✗'}
                  </span>
                  <span style={{ fontSize: 12.5, color: c.pts > 0 ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                    {c.label}
                  </span>
                </div>
                <span style={{ fontSize: 11.5, color: c.pts > 0 ? 'var(--success)' : 'var(--text-muted)', flexShrink: 0 }}>
                  {c.pts}/{c.max}
                </span>
              </div>
              {/* Show tip when check fails */}
              {c.pts === 0 && c.tip && (
                <div style={{ fontSize: 11, color: 'var(--warning)', marginTop: 3, paddingLeft: 21, lineHeight: 1.4 }}>
                  💡 {c.tip}
                </div>
              )}
            </div>
          ))}

          {score < 85 && (
            <div style={{
              marginTop: 12, padding: '8px 12px',
              background: 'rgba(255,179,71,0.08)',
              border: '1px solid rgba(255,179,71,0.2)',
              borderRadius: 8, fontSize: 12, color: 'var(--warning)', lineHeight: 1.5,
            }}>
              💡 Fill in missing sections above to improve your ATS score and get past automated screening.
            </div>
          )}
        </div>
      )}
    </div>
  )
}