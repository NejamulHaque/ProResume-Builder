import { formatDistanceToNow } from 'date-fns'

function StatCard({ icon, label, value, color }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px' }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color, lineHeight: 1.2 }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{label}</div>
      </div>
    </div>
  )
}

export default function StatsGrid({ resumes }) {
  const total  = resumes.length
  const pub    = resumes.filter((r) => r.is_public).length
  const latest = resumes[0]?.updated_at
  const lastStr = latest
    ? formatDistanceToNow(new Date(latest), { addSuffix: true })
    : '—'

  return (
    <div className="grid-3" style={{ marginBottom: 28 }}>
      <StatCard icon="📄" label="Total Resumes"  value={total}   color="var(--accent)"  />
      <StatCard icon="✏️" label="Last Edited"    value={lastStr} color="var(--success)" />
      <StatCard icon="🌐" label="Public Resumes" value={pub}     color="var(--warning)" />
    </div>
  )
}
