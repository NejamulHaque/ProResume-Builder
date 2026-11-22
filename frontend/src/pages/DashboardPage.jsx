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
import { PORTFOLIO_URL } from '../lib/constants.js'

function EmptyResumes({ onCreate }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '64px 24px',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-xl)',
      border: '1px dashed var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        marginBottom: 16
      }}>
        📄
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
        No resumes created yet
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 380, marginBottom: 28, lineHeight: 1.5 }}>
        Build a recruiter-grade ATS resume or start with an Overleaf LaTeX template in minutes.
      </p>
      <button onClick={onCreate} className="btn btn-primary btn-lg">
        Create Your First Resume →
      </button>
    </div>
  )
}

function NewResumeCard({ onCreate }) {
  return (
    <div
      onClick={onCreate}
      style={{
        background: 'var(--bg-card)',
        border: '1px dashed var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        minHeight: 220,
        transition: 'all var(--transition)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--text-primary)'
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
        e.currentTarget.style.transform = 'scale(1.01)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-light)'
        e.currentTarget.style.background = 'var(--bg-card)'
        e.currentTarget.style.transform = 'none'
      }}
    >
      <div style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-secondary)' }}>
        New Resume
      </span>
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Apple Desktop Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Dashboard Canvas */}
        <main className="dash-main page-enter" style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>

          {/* ── RESUMES TAB ── */}
          {activeTab === 'resumes' && (
            <div>
              <div className="page-head" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <h1 className="page-title" style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>
                    Welcome back, {displayName.split(' ')[0]}
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4, letterSpacing: '-0.01em' }}>
                    Manage and architect your professional resumes
                  </p>
                </div>
                <button className="btn btn-primary btn-md" onClick={() => goNew()}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  New Resume
                </button>
              </div>

              {/* 10-Day Retention Notice Banner */}
              <div style={{
                background: 'rgba(255, 159, 10, 0.08)',
                border: '1px solid rgba(255, 159, 10, 0.22)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 18px',
                marginBottom: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span>⏳</span>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                    <strong>10-Day Ephemeral Retention:</strong> Resumes are automatically purged after 10 days for candidate privacy. Download your vector PDF or .tex file for permanent backup.
                  </div>
                </div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(255, 159, 10, 0.15)',
                  color: 'var(--warning)',
                  border: '1px solid rgba(255, 159, 10, 0.3)'
                }}>
                  Zero Data Leak
                </span>
              </div>

              {/* Stats */}
              <div className="stats-grid-wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
                {loading ? <StatsGridSkeleton /> : <StatsGrid resumes={resumes} />}
              </div>

              {/* Resume grid */}
              {loading ? (
                <ResumeGridSkeleton count={3} />
              ) : resumes.length === 0 ? (
                <EmptyResumes onCreate={() => goNew()} />
              ) : (
                <div className="resume-grid-wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
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
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>
                  Resume Templates
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4, letterSpacing: '-0.01em' }}>
                  Choose a starting template — switch anytime in the editor
                </p>
              </div>
              <TemplateGrid />
            </div>
          )}

          {/* ── DEVELOPER TAB ── */}
          {activeTab === 'developer' && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em' }}>
                  About the Developer
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4, letterSpacing: '-0.01em' }}>
                  ProResume — built with precision as a free, open-source tool by{' '}
                  <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                    Nejamul Haque
                  </a>
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
