import { useNavigate } from 'react-router-dom'
import { TEMPLATES, TEMPLATE_COLORS } from '../../lib/resumeDefaults.js'

function TemplateDocPreview({ color }) {
  return (
    <div style={{
      width: 58, height: 74,
      background: 'rgba(255,255,255,0.06)',
      border: `2px solid ${color}45`,
      borderRadius: 5,
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Fake header */}
      <div style={{ height: 13, background: color, margin: 0, opacity: 0.85 }} />
      {/* Fake content lines */}
      {[72, 50, 65, 42, 58].map((w, i) => (
        <div key={i} style={{
          height: 4,
          background: 'rgba(255,255,255,0.14)',
          margin: `5px ${(100-w)/2}% 0`,
          borderRadius: 2,
          width: `${w}%`,
        }} />
      ))}
    </div>
  )
}

export default function TemplateGrid() {
  const navigate = useNavigate()

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
      gap: 18,
    }}>
      {TEMPLATES.map((tpl) => {
        const color = TEMPLATE_COLORS[tpl.id]
        return (
          <div
            key={tpl.id}
            onClick={() => navigate('/resume/new', { state: { template: tpl.id } })}
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${color}18`,
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.22s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = color
              e.currentTarget.style.transform   = 'translateY(-3px)'
              e.currentTarget.style.boxShadow   = 'var(--shadow-md)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = `${color}18`
              e.currentTarget.style.transform   = 'translateY(0)'
              e.currentTarget.style.boxShadow   = 'none'
            }}
          >
            {/* Preview */}
            <div style={{
              height: 132,
              background: `linear-gradient(135deg, ${color}20, ${color}08)`,
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TemplateDocPreview color={color} />
            </div>

            {/* Info */}
            <div style={{ padding: '13px 15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>
                  {tpl.name}
                </span>
                <span style={{
                  fontSize: 10.5, padding: '2px 8px', borderRadius: 4,
                  background: `${color}18`, color,
                }}>
                  {tpl.tag}
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: 13 }}>
                {tpl.desc}
              </p>
              <button className="btn btn-secondary btn-sm btn-full">
                Use Template →
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
