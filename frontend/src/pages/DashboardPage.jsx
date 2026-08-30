import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }     from '../hooks/useAuth.jsx'
import { useResumes }  from '../hooks/useResumes.js'
import Navbar          from '../components/dashboard/Navbar.jsx'
import Sidebar, { BottomNav } from '../components/dashboard/Sidebar.jsx'
import StatsGrid       from '../components/dashboard/StatsGrid.jsx'
import ResumeCard      from '../components/dashboard/ResumeCard.jsx'
import TemplateGrid    from '../components/dashboard/TemplateGrid.jsx'
import DeveloperCard   from '../components/developer/DeveloperCard.jsx'
import { StatsGridSkeleton, ResumeGridSkeleton } from '../components/ui/Skeletons.jsx'

function EmptyResumes({ onCreate }) {
  return (
    <div style={{
      textAlign: 'center', padding: '56px 24px',
      background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
      border: '2px dashed var(--border)',
    }}>
      <div style={{ fontSize: 44, marginBottom: 14 }}>📝</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>No resumes yet</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginBottom: 24 }}>
        Create your first professional resume in minutes
      </p>
      <button onClick={onCreate} className="btn btn-primary btn-lg">
        Create Your First Resume
      </button>
    </div>
  )
}

function NewResumeCard({ onCreate }) {
  return (
    <div onClick={onCreate} style={{
      background: 'var(--bg-card)', border: '2px dashed var(--border)',
      borderRadius: 'var(--radius-lg)', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 12, minHeight: 220,
      transition: 'all 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-glow)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)' }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: 'var(--accent-glow)', border: '1px solid rgba(124,111,255,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-secondary)' }}>New Resume</span>
    </div>
  )
}

export default function DashboardPage() {
  const { user, displayName } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('resumes')
  const { resumes, loading, remove, duplicate } = useResumes(user?.id)

  const goNew  = (tpl) => navigate('/resume/new', tpl ? { state: { template: tpl } } : undefined)
  const goEdit = (id)  => navigate(`/resume/${id}`)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Desktop sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main content */}
        <main className="dash-main page-enter" style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

          {/* ── RESUMES TAB ── */}
          {activeTab === 'resumes' && (
            <div>
              <div className="page-head" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <h1 className="page-title" style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
                    Welcome back, {displayName.split(' ')[0]} 👋
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginTop: 4 }}>
                    Manage and build your professional resumes
                  </p>
                </div>
                <button className="btn btn-primary btn-lg" onClick={() => goNew()}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  New Resume
                </button>
              </div>

              {/* 10-Day Retention Notice Banner */}
              <div style={{
                background: 'linear-gradient(90deg, rgba(255, 179, 71, 0.1) 0%, rgba(124, 111, 255, 0.08) 100%)',
                border: '1px solid rgba(255, 179, 71, 0.25)', borderRadius: 'var(--radius-md)',
                padding: '12px 18px', marginBottom: 24, display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: 12, flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>⏳</span>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                    <strong>10-Day Cloud Auto-Delete Policy:</strong> Resumes are automatically deleted after 10 days for ephemeral privacy. Always export your PDF backup!
                  </div>
                </div>
                <span style={{
                  fontSize: 11.5, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
                  background: 'rgba(255,179,71,0.15)', color: 'var(--warning)', border: '1px solid rgba(255,179,71,0.3)'
                }}>
                  Neon DB Protected
                </span>
              </div>

              {/* Stats */}
              <div className="stats-grid-wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
                {loading ? <StatsGridSkeleton /> : <StatsGrid resumes={resumes} />}
              </div>

              {/* Resume grid */}
              {loading ? (
                <ResumeGridSkeleton count={3} />
              ) : resumes.length === 0 ? (
                <EmptyResumes onCreate={() => goNew()} />
              ) : (
                <div className="resume-grid-wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18 }}>
                  <NewResumeCard onCreate={() => goNew()} />
                  {resumes.map(r => (
                    <ResumeCard key={r.id} resume={r} onEdit={goEdit} onDelete={remove} onDuplicate={duplicate} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TEMPLATES TAB ── */}
          {activeTab === 'templates' && (
            <div>
              <div style={{ marginBottom: 26 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
                  Resume Templates
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginTop: 4 }}>
                  Choose a starting template — switch anytime in the editor
                </p>
              </div>
              <TemplateGrid />
            </div>
          )}

          {/* ── DEVELOPER TAB ── */}
          {activeTab === 'developer' && (
            <div>
              <div style={{ marginBottom: 26 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
                  About the Developer
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginTop: 4 }}>
                  ProResume — built with ❤️ as a free, open-source tool by <strong>Nejamul Haque</strong>
                </p>
              </div>
              <DeveloperCard />
            </div>
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}