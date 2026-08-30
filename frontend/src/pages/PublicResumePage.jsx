import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPublicResume, supabase } from '../lib/supabase.js'
import ResumePreview, { ResumePrintTarget } from '../components/resume/ResumePreview.jsx'
import ExportButton from '../components/resume/ExportButton.jsx'

export default function PublicResumePage() {
  const { id } = useParams()
  const [resume,  setResume]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    loadResume()
    // Track view safely
    try {
      supabase.from('resume_views').insert({ resume_id: id }).then(() => {}).catch(() => {})
    } catch {}
  }, [id])

  const loadResume = async () => {
    const { data, error } = await getPublicResume(id)

    if (error || !data) {
      setError('This resume is private or does not exist.')
    } else {
      setResume(data)
    }
    setLoading(false)
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}>
      <div className="spinner lg" />
    </div>
  )

  if (error) return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: 24,
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>
        Resume Not Found
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{error}</p>
      <Link to="/" className="btn btn-primary">Go to ProResume</Link>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#12121e' }}>
      {/* 10-day retention notice banner */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(255, 179, 71, 0.15) 0%, rgba(124, 111, 255, 0.1) 100%)',
        borderBottom: '1px solid rgba(255, 179, 71, 0.3)',
        padding: '6px 20px', fontSize: 12, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', color: '#fff', flexWrap: 'wrap', gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>⏳</span>
          <span>10-Day Ephemeral Retention: Resumes are stored on Neon DB for 10 days for maximum privacy.</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--warning)', fontWeight: 600 }}>Download PDF to keep permanently</span>
      </div>

      {/* Top bar */}
      <div style={{
        background: 'rgba(15,15,24,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px', height: 58,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--text-primary)',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
          </div>
          Pro<span className="gradient-text">Resume</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {resume.title}
          </span>
          <ExportButton title={resume.title} />
          <Link to="/auth" className="btn btn-primary btn-sm">
            Create Free Resume →
          </Link>
        </div>
      </div>

      {/* Resume preview */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        padding: '40px 24px', minHeight: 'calc(100vh - 58px)',
      }}>
        <ResumePreview data={resume.data} template={resume.template} />
      </div>

      <ResumePrintTarget data={resume.data} template={resume.template} />

      {/* Footer CTA */}
      <div style={{
        textAlign: 'center', padding: '32px 24px 48px',
        borderTop: '1px solid var(--border)',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
          Like this resume? Build yours for free with ProResume.
        </p>
        <Link to="/auth" className="btn btn-primary btn-lg">
          🚀 Create Free Resume
        </Link>
      </div>
    </div>
  )
}