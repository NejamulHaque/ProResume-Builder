import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

export default function VersionHistoryModal({ isOpen, onClose, resumeId = 'default', currentData, currentTitle, onRestoreSnapshot }) {
  const storageKey = `proresume_snapshots_${resumeId}`
  const [snapshots, setSnapshots] = useState([])
  const [newLabel, setNewLabel] = useState('')

  // Load snapshots
  useEffect(() => {
    if (!isOpen) return
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setSnapshots(JSON.parse(raw))
      else setSnapshots([])
    } catch {
      setSnapshots([])
    }
  }, [isOpen, storageKey])

  if (!isOpen) return null

  const handleSaveSnapshot = (e) => {
    e.preventDefault()
    const label = newLabel.trim() || `Snapshot ${snapshots.length + 1}`
    const newSnap = {
      id: Date.now().toString(),
      label,
      title: currentTitle,
      data: currentData,
      timestamp: new Date().toISOString(),
      skillsCount: (currentData?.skills?.technical || []).length,
      expCount: (currentData?.experience || []).length
    }
    const updated = [newSnap, ...snapshots].slice(0, 15) // Keep last 15
    setSnapshots(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
    setNewLabel('')
    toast.success(`Saved snapshot: "${label}"! 📸`)
  }

  const handleRestore = (snap) => {
    if (window.confirm(`Are you sure you want to restore snapshot "${snap.label}"? Unsaved changes in your current view will be replaced.`)) {
      onRestoreSnapshot(snap.data, snap.title)
      toast.success(`Restored snapshot "${snap.label}"! 🔄`)
      onClose()
    }
  }

  const handleDelete = (id) => {
    const updated = snapshots.filter(s => s.id !== id)
    setSnapshots(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
    toast.success('Snapshot deleted')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1200,
      background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 540,
        boxShadow: '0 25px 80px rgba(0,0,0,0.85)', overflow: 'hidden', padding: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontSize: 22 }}>🛡️</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: 0 }}>
              Resume Version History & Snapshots
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-xs" style={{ fontSize: 18, color: 'var(--text-muted)' }}>
            ×
          </button>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 18 }}>
          Take milestone snapshots before interviews or roll back to any previous version of your resume anytime.
        </p>

        {/* Create Snapshot Form */}
        <form onSubmit={handleSaveSnapshot} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <input
            type="text"
            className="input"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            placeholder="Label (e.g. 'Before Google Interview', 'DevSecOps focus')..."
            style={{ flex: 1, fontSize: 12.5 }}
          />
          <button type="submit" className="btn btn-primary btn-sm" style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
            📸 Take Snapshot
          </button>
        </form>

        {/* Snapshot List */}
        <div style={{ maxHeight: 260, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {snapshots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: 13 }}>
              No snapshots saved yet. Click <strong>"Take Snapshot"</strong> above to capture your current resume milestone!
            </div>
          ) : (
            snapshots.map(snap => (
              <div
                key={snap.id}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '12px 14px', display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between', gap: 10
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)' }}>
                    {snap.label}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                    {format(new Date(snap.timestamp), 'PPp')} • {snap.expCount} roles • {snap.skillsCount} skills
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    onClick={() => handleRestore(snap)}
                    className="btn btn-secondary btn-xs"
                    style={{ fontSize: 11.5, fontWeight: 700 }}
                  >
                    🔄 Restore
                  </button>
                  <button
                    onClick={() => handleDelete(snap.id)}
                    className="btn btn-ghost btn-xs"
                    style={{ color: 'var(--danger)', fontSize: 13, padding: '3px 6px' }}
                    title="Delete snapshot"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
