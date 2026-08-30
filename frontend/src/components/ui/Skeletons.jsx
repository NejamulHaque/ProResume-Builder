// ── Skeleton primitives ───────────────────────────────────────────────────

function Bone({ w = '100%', h = 16, r = 6, style = {} }) {
  return (
    <div className="skeleton" style={{ width: w, height: h, borderRadius: r, ...style }} />
  )
}

// ── Resume card skeleton ───────────────────────────────────────────────────
export function ResumeCardSkeleton() {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    }}>
      {/* Preview area */}
      <div className="skeleton" style={{ height: 152 }} />
      <div style={{ padding: '14px 16px' }}>
        <Bone h={14} w="70%" style={{ marginBottom: 8 }} />
        <Bone h={11} w="50%" style={{ marginBottom: 14 }} />
        <div style={{ display: 'flex', gap: 7 }}>
          <Bone h={30} r={8} style={{ flex: 1 }} />
          <Bone h={30} w={34} r={8} />
          <Bone h={30} w={34} r={8} />
        </div>
      </div>
    </div>
  )
}

// ── Stats grid skeleton ────────────────────────────────────────────────────
export function StatsGridSkeleton() {
  return (
    <div className="grid-3" style={{ marginBottom: 28 }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px' }}>
          <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <Bone h={22} w="60%" style={{ marginBottom: 6 }} />
            <Bone h={11} w="80%" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Resume grid skeleton ───────────────────────────────────────────────────
export function ResumeGridSkeleton({ count = 3 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: 18,
    }}>
      {[...Array(count)].map((_, i) => <ResumeCardSkeleton key={i} />)}
    </div>
  )
}

// ── Editor form skeleton ───────────────────────────────────────────────────
export function FormSkeleton() {
  return (
    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Bone h={22} w="50%" style={{ marginBottom: 4 }} />
      {[...Array(6)].map((_, i) => (
        <div key={i}>
          <Bone h={11} w="30%" style={{ marginBottom: 6 }} />
          <Bone h={38} r={8} />
        </div>
      ))}
    </div>
  )
}