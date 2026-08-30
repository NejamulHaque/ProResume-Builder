import { useState, useEffect } from 'react'

/**
 * AutoDeleteModal:
 * Displays a clear pop-up modal stating "Resume will be deleted in 10 days".
 */
export function AutoDeleteModal({ isOpen, onClose, onDownloadPdf }) {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(9, 9, 15, 0.82)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, animation: 'fadeIn 0.25s ease',
    }}>
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 480,
        padding: '30px 28px', boxShadow: '0 25px 70px rgba(0,0,0,0.7)',
        animation: 'modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow accent */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 140, height: 140,
          borderRadius: '50%', background: 'rgba(255, 179, 71, 0.15)', filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12,
            background: 'rgba(255, 179, 71, 0.15)', border: '1px solid rgba(255, 179, 71, 0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            flexShrink: 0
          }}>
            ⏳
          </div>
          <div>
            <span style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--warning)',
              background: 'rgba(255, 179, 71, 0.12)', padding: '2px 8px', borderRadius: 4,
            }}>
              Neon DB Retention Policy
            </span>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800,
              marginTop: 4, color: '#fff', letterSpacing: -0.3
            }}>
              Resume will be deleted in 10 days
            </h3>
          </div>
        </div>

        <p style={{
          color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.65, marginBottom: 20,
        }}>
          To guarantee <strong>zero long-term personal data retention</strong> and keep our cloud infrastructure fast and free, all resumes in your database are ephemeral and will be <strong>automatically deleted in 10 days</strong>.
        </p>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 24,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--success)' }}>✓</span>
            <span>Always export a <strong>High-DPI PDF</strong> after editing</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--success)' }}>✓</span>
            <span>You can duplicate or refresh your resume to reset the timer</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--accent)' }}>🔒</span>
            <span>100% private: no data is ever sold or permanently archived</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '10px 16px', fontSize: 13.5, fontWeight: 600 }}
          >
            I Understand
          </button>
          {onDownloadPdf && (
            <button
              onClick={() => { onClose(); onDownloadPdf(); }}
              className="btn btn-primary"
              style={{ flex: 1.2, padding: '10px 16px', fontSize: 13.5, fontWeight: 600 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * AutoDeleteBanner:
 * Sticky, slim notification banner with live countdown pill.
 */
export function AutoDeleteBanner({ daysLeft = 10, onDownloadPdf, onDismiss }) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div style={{
      background: 'linear-gradient(90deg, rgba(255, 179, 71, 0.12) 0%, rgba(124, 111, 255, 0.08) 100%)',
      borderBottom: '1px solid rgba(255, 179, 71, 0.25)',
      padding: '7px 16px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', fontSize: 12.5, color: '#f5f5fc',
      zIndex: 9, flexShrink: 0, gap: 12, flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <span style={{
          background: 'rgba(255, 179, 71, 0.2)', color: 'var(--warning)',
          fontWeight: 700, fontSize: 11, padding: '2px 8px', borderRadius: 100,
          border: '1px solid rgba(255, 179, 71, 0.35)', display: 'inline-flex',
          alignItems: 'center', gap: 4, flexShrink: 0
        }}>
          <span style={{ animation: 'pulse 1.5s infinite', display: 'inline-block' }}>⚠️</span>
          Auto-Delete Notice
        </span>
        <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Resume will be deleted in <strong>10 days</strong> from database for cloud privacy.
        </span>
        <span style={{
          fontSize: 11.5, color: 'var(--warning)', fontWeight: 600,
          background: 'rgba(255, 179, 71, 0.08)', padding: '1px 7px', borderRadius: 4
        }}>
          ⏱️ ~{daysLeft} days remaining
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {onDownloadPdf && (
          <button
            onClick={onDownloadPdf}
            className="btn btn-xs btn-primary"
            style={{ padding: '3px 10px', fontSize: 11.5, fontWeight: 600 }}
          >
            Save PDF
          </button>
        )}
        <button
          onClick={() => { setDismissed(true); if (onDismiss) onDismiss(); }}
          style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '2px 4px'
          }}
          title="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  )
}
