import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { updateResume } from '../../lib/supabase.js'

export default function ShareResumeButton({ resumeId, isPublic, onToggle }) {
  const [loading, setLoading] = useState(false)
  const [copied,  setCopied]  = useState(false)

  const shareUrl = `${window.location.origin}/resume/view/${resumeId}`

  const handleToggle = async () => {
    if (!resumeId) { toast.error('Save your resume first'); return }
    setLoading(true)
    try {
      const { error } = await updateResume(resumeId, { is_public: !isPublic })
      if (error) throw error
      onToggle(!isPublic)
      toast.success(isPublic ? 'Resume is now private' : 'Resume is now public — share link is live!')
    } catch (e) {
      toast.error('Failed to update: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy — try manually')
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* Toggle public/private */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`btn btn-sm ${isPublic ? 'btn-success' : 'btn-secondary'}`}
      >
        {loading ? <div className="spinner sm" /> : (
          isPublic
            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        )}
        {isPublic ? 'Public' : 'Private'}
      </button>

      {/* Copy link (only when public) */}
      {isPublic && (
        <button
          onClick={handleCopy}
          className="btn btn-sm btn-secondary"
          title={shareUrl}
        >
          {copied
            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          }
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      )}
    </div>
  )
}