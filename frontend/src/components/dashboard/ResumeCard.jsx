import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { TEMPLATE_COLORS } from '../../lib/resumeDefaults.js'

export default function ResumeCard({ resume, onEdit, onDelete, onDuplicate }) {
  const [deleting,    setDeleting]    = useState(false)
  const [duplicating, setDuplicating] = useState(false)

  const color = TEMPLATE_COLORS[resume.template] || 'var(--accent)'

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this resume? This cannot be undone.')) return
    setDeleting(true)
    await onDelete(resume.id)
  }

  const handleDuplicate = async (e) => {
    e.stopPropagation()
    setDuplicating(true)
    await onDuplicate(resume.id)
    setDuplicating(false)
  }

  const updatedAgo = formatDistanceToNow(new Date(resume.updated_at), { addSuffix: true })

  // Calculate days left in 10-day retention
  const createdAtMs = new Date(resume.created_at || resume.updated_at).getTime()
  const expiresAtMs = createdAtMs + (10 * 86400000)
  const daysLeft = Math.max(0.5, ((expiresAtMs - Date.now()) / 86400000)).toFixed(0)

  return (
    <div
      onClick={() => onEdit(resume.id)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.22s',
        position: 'relative'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-light)'
        e.currentTarget.style.transform   = 'translateY(-3px)'
        e.currentTarget.style.boxShadow   = 'var(--shadow-md)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform   = 'translateY(0)'
        e.currentTarget.style.boxShadow   = 'none'
      }}
    >
      {/* Preview area */}
      <div style={{
        height: 152,
        background: `linear-gradient(135deg, ${color}18, ${color}07)`,
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ruled lines texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 14px, rgba(255,255,255,0.018) 14px, rgba(255,255,255,0.018) 15px)',
        }} />

        {/* Template icon */}
        <div style={{
          width: 50, height: 50, borderRadius: 13,
          background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 6px 22px ${color}55`,
          position: 'relative', zIndex: 1,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>

        {/* 10-day auto-delete tag */}
        <span style={{
          position: 'absolute', top: 10, left: 10,
          background: 'rgba(255,179,71,0.15)', color: 'var(--warning)',
          border: '1px solid rgba(255,179,71,0.3)',
          padding: '2px 7px', borderRadius: 6,
          fontSize: 10, fontWeight: 700, letterSpacing: '0.02em',
        }}>
          ⏳ {daysLeft}d left
        </span>

        {/* Public badge */}
        {resume.is_public && (
          <span style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(61,224,160,0.15)', color: 'var(--success)',
            border: '1px solid rgba(61,224,160,0.3)',
            padding: '2px 8px', borderRadius: 6,
            fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
          }}>PUBLIC</span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 14, fontWeight: 600, marginBottom: 4,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {resume.title}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>
          <span style={{ textTransform: 'capitalize' }}>{resume.template}</span>
          {' · '}Updated {updatedAgo}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 7 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(resume.id) }}
            className="btn btn-primary btn-sm"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Edit
          </button>

          <button
            onClick={handleDuplicate}
            disabled={duplicating}
            className="btn btn-secondary btn-sm btn-icon"
            title="Duplicate"
          >
            {duplicating
              ? <div className="spinner sm" />
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn btn-danger btn-sm btn-icon"
            title="Delete"
          >
            {deleting
              ? <div className="spinner sm" />
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>}
          </button>
        </div>
      </div>
    </div>
  )
}
