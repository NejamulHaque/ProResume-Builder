const SECTIONS = [
  { id: 'personal',       icon: '👤', label: 'Personal Info'   },
  { id: 'experience',     icon: '💼', label: 'Experience'      },
  { id: 'education',      icon: '🎓', label: 'Education'       },
  { id: 'skills',         icon: '⚡', label: 'Skills'          },
  { id: 'projects',       icon: '🚀', label: 'Projects'        },
  { id: 'certifications', icon: '🏆', label: 'Certifications'  },
]

export { SECTIONS }

export default function SectionNav({ active, onChange }) {
  return (
    <div style={{
      width: 48,
      background: 'var(--bg-primary)',
      borderRight: '1px solid var(--border)',
      padding: '14px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      flexShrink: 0,
    }}>
      {SECTIONS.map((sec) => {
        const isActive = active === sec.id
        return (
          <button
            key={sec.id}
            onClick={() => onChange(sec.id)}
            title={sec.label}
            style={{
              background: isActive ? 'var(--accent-glow)' : 'transparent',
              border: 'none',
              borderRight: `2.5px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
              cursor: 'pointer',
              padding: '11px 0',
              fontSize: 17,
              lineHeight: 1,
              transition: 'all 0.15s',
              opacity: isActive ? 1 : 0.4,
              width: '100%',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.opacity = '0.8' }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.opacity = '0.4' }}
          >
            {sec.icon}
          </button>
        )
      })}
    </div>
  )
}
