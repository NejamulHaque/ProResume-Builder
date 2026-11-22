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
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}>
      <div className="spinner lg" />
    </div>
  )

  if (error) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: 24,
      textAlign: 'center'
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        marginBottom: 20
      }}>
        🔒
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
        Resume Not Found
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>{error}</p>
      <Link to="/" className="btn btn-primary btn-md">Go to Overview</Link>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* 10-day retention notice banner */}
      <div style={{
        background: 'rgba(255, 159, 10, 0.08)',
        borderBottom: '1px solid rgba(255, 159, 10, 0.2)',
        padding: '8px 24px',
        fontSize: 12.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'var(--text-primary)',
        flexWrap: 'wrap',
        gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>⏳</span>
          <span>10-Day Ephemeral Retention: Cloud resumes expire after 10 days for candidate privacy.</span>
        </div>
        <span style={{ fontSize: 11.5, color: 'var(--warning)', fontWeight: 600 }}>
          Download vector PDF for permanent backup
        </span>
      </div>

      {/* Apple-style Top Bar */}
      <header style={{
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 28px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 16,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em'
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: '#ffffff',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 800
          }}>
            P
          </div>
          <span>ProResume</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }} className="desktop-only">
            {resume.title}
          </span>
          <ExportButton title={resume.title} />
          <Link to="/auth" className="btn btn-primary btn-sm">
            Create Free Resume →
          </Link>
        </div>
      </header>

      {/* Resume Preview Canvas */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '48px 24px',
        minHeight: 'calc(100vh - 56px)',
        overflowX: 'auto'
      }}>
        <div style={{
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8)',
          borderRadius: 6,
          overflow: 'hidden'
        }}>
          <ResumePreview data={resume.data} template={resume.template} />
        </div>
      </div>

      <ResumePrintTarget data={resume.data} template={resume.template} />

      {/* Footer CTA */}
      <footer style={{
        textAlign: 'center',
        padding: '48px 24px 60px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-card)'
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 18 }}>
          Engineered with ProResume Builder • 100% Free &amp; Open Source
        </p>
        <Link to="/auth" className="btn btn-primary btn-lg">
          Create Your Free Resume →
        </Link>
      </footer>
    </div>
  )
}
