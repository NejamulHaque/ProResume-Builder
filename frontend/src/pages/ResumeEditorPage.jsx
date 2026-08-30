import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth }       from '../hooks/useAuth.jsx'
import { useAutoSave }   from '../hooks/useAutoSave.js'
import { getResume, createResume, updateResume, signOut } from '../lib/supabase.js'
import { DEFAULT_RESUME_DATA, SAMPLE_RESUME_DATA } from '../lib/resumeDefaults.js'
import { resumeToLatex, latexToResume, downloadTexFile, generateJakesLatex } from '../lib/latexConverter.js'
import ResumeForm        from '../components/resume/ResumeForm.jsx'
import ResumePreview, { ResumePrintTarget } from '../components/resume/ResumePreview.jsx'
import ExportButton      from '../components/resume/ExportButton.jsx'
import ATSScore          from '../components/resume/ATSScore.jsx'
import ShareResumeButton from '../components/resume/ShareResumeButton.jsx'
import { AutoDeleteModal, AutoDeleteBanner } from '../components/ui/AutoDeleteNotice.jsx'
import JobDescriptionMatcher from '../components/resume/JobDescriptionMatcher.jsx'
import SampleDataPicker from '../components/resume/SampleDataPicker.jsx'
import IRUSAssistant from '../components/resume/IRUSAssistant.jsx'
import CoverLetterModal from '../components/resume/CoverLetterModal.jsx'
import LatexEditor from '../components/resume/LatexEditor.jsx'
import SecurityScannerModal from '../components/resume/SecurityScannerModal.jsx'
import ResumeTranslatorModal from '../components/resume/ResumeTranslatorModal.jsx'

const ACCENT_PALETTES = [
  { id: 'indigo',  name: 'Indigo',  color: '#7c6fff' },
  { id: 'emerald', name: 'Emerald', color: '#3de0a0' },
  { id: 'rose',    name: 'Rose',    color: '#ff6b9d' },
  { id: 'gold',    name: 'Gold',    color: '#b8860b' },
  { id: 'cyan',    name: 'Cyan',    color: '#00d4aa' },
  { id: 'purple',  name: 'Purple',  color: '#a855f7' },
  { id: 'crimson', name: 'Crimson', color: '#ef4444' },
]

const FONT_OPTIONS = [
  { id: 'sans',  name: 'Modern Sans', font: '"Segoe UI",system-ui,sans-serif' },
  { id: 'serif', name: 'Classic Serif', font: 'Georgia,"Times New Roman",serif' },
  { id: 'mono',  name: 'Code Mono', font: '"JetBrains Mono","Fira Code",monospace' },
]

// ─── Mobile tab bar for editor ─────────────────────
function EditorMobileTabs({ activeTab, onChange }) {
  const tabs = [
    { id: 'form',    label: 'Edit',    icon: '✏️' },
    { id: 'latex',   label: 'LaTeX',   icon: '⌨️' },
    { id: 'preview', label: 'Preview', icon: '👁' },
    { id: 'ats',     label: 'ATS',     icon: '📊' },
  ]
  return (
    <div style={{
      display: 'flex', background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex: 1, padding: '11px 8px', border: 'none', cursor: 'pointer',
          background: activeTab === t.id ? 'var(--bg-card)' : 'transparent',
          color: activeTab === t.id ? 'var(--accent)' : 'var(--text-muted)',
          borderBottom: activeTab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'all 0.15s',
        }}>
          <span>{t.icon}</span> {t.label}
        </button>
      ))}
    </div>
  )
}

// ─── Professional Top Bar (Sleek 3-Zone Architecture) ───
function EditorBar({
  title, template, onTitleChange, onTemplateChange, onSave, saving,
  onTogglePreview, previewVisible, resumeId, isPublic, onVisibilityToggle,
  isMobile, onLogout, onSelectPreset, onShowNotice, resumeData, onApplySummary,
  onExportJSON, onImportJSON, zoom, setZoom, onOpenCoverLetter,
  editorMode, onToggleEditorMode, onExportTex, onToggleAts, atsScore,
  onOpenSecurityScanner, onOpenTranslator, showQrCode, onToggleQrCode
}) {
  const [toolsOpen, setToolsOpen] = useState(false)
  const [aiMenuOpen, setAiMenuOpen] = useState(false)
  const toolsRef = useRef(null)
  const aiRef = useRef(null)

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) setToolsOpen(false)
      if (aiRef.current && !aiRef.current.contains(e.target)) setAiMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div style={{
      height: 60, background: 'rgba(15, 15, 24, 0.95)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 18px', flexShrink: 0, gap: 14, zIndex: 100,
    }}>
      
      {/* ── ZONE 1: Context & Title ────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, minWidth: 0 }}>
        <button
          onClick={() => window.history.back()}
          className="btn btn-ghost btn-xs"
          style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}
          title="Back to Dashboard"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          <span className="desktop-only" style={{ fontSize: 12.5, fontWeight: 600 }}>Dashboard</span>
        </button>

        <span className="desktop-only" style={{ color: 'var(--border-light)', fontSize: 14 }}>/</span>

        <input
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          className="editor-bar-title"
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', outline: 'none',
            color: 'var(--text-primary)', fontSize: 13, fontWeight: 700,
            fontFamily: 'var(--font-display)', width: isMobile ? 110 : 160, minWidth: 0,
            borderRadius: 8, padding: '5px 10px', transition: 'border-color 0.15s',
          }}
          placeholder="Resume title…"
          title="Click to rename resume"
        />

        {/* Auto-delete / TTL info pill */}
        <button
          onClick={onShowNotice}
          className="btn btn-ghost btn-xs"
          style={{
            padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
            background: 'rgba(255, 179, 71, 0.12)', color: 'var(--warning)',
            border: '1px solid rgba(255, 179, 71, 0.25)'
          }}
          title="10-Day Ephemeral Retention Rule"
        >
          ⏳ 10d
        </button>
      </div>

      {/* ── ZONE 2: Studio Mode & Intelligence ─────── */}
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          
          {/* Segmented Mode Switcher */}
          <div style={{
            display: 'flex', background: 'var(--bg-primary)',
            border: '1px solid var(--border)', borderRadius: 10, padding: 3, gap: 2
          }}>
            <button
              onClick={() => onToggleEditorMode('form')}
              style={{
                background: editorMode === 'form' ? 'var(--accent)' : 'transparent',
                color: editorMode === 'form' ? '#fff' : 'var(--text-muted)',
                border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <span>✏️</span> Visual Form
            </button>
            <button
              onClick={() => onToggleEditorMode('latex')}
              style={{
                background: editorMode === 'latex' ? '#10b981' : 'transparent',
                color: editorMode === 'latex' ? '#fff' : 'var(--text-muted)',
                border: 'none', borderRadius: 7, padding: '5px 12px', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <span>⌨️</span> Overleaf LaTeX
            </button>
          </div>

          {/* IRUS AI Assistant Trigger */}
          <IRUSAssistant resumeData={resumeData} onApplySummary={onApplySummary} />

          {/* DevSecOps Security Audit */}
          <button
            onClick={onOpenSecurityScanner}
            className="btn btn-ghost btn-xs"
            style={{
              background: 'rgba(61,224,160,0.1)', color: 'var(--success)',
              border: '1px solid rgba(61,224,160,0.3)', padding: '5px 10px',
              borderRadius: 8, fontSize: 12, fontWeight: 700
            }}
            title="Run DevSecOps Security & Secret Leak Scanner"
          >
            🛡️ Audit
          </button>

          {/* ATS Score Indicator */}
          <button
            onClick={onToggleAts}
            className="btn btn-ghost btn-xs"
            style={{
              background: atsScore >= 80 ? 'rgba(61,224,160,0.12)' : 'rgba(255,107,157,0.12)',
              color: atsScore >= 80 ? 'var(--success)' : 'var(--accent-2)',
              border: `1px solid ${atsScore >= 80 ? 'rgba(61,224,160,0.3)' : 'rgba(255,107,157,0.3)'}`,
              padding: '5px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700
            }}
            title="ATS Match Readiness Score"
          >
            🎯 {atsScore}% ATS
          </button>

        </div>
      )}

      {/* ── ZONE 3: Actions & Export ────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        
        {/* Template selector */}
        {!isMobile && (
          <select
            value={template}
            onChange={e => onTemplateChange(e.target.value)}
            className="editor-bar-template"
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', padding: '6px 10px', borderRadius: 8,
              fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)', cursor: 'pointer'
            }}
          >
            <option value="modern">🎨 Modern</option>
            <option value="minimal">🖋️ Minimal</option>
            <option value="executive">👑 Executive</option>
            <option value="technical">💻 Technical</option>
            <option value="creative">✨ Creative</option>
          </select>
        )}

        {/* Tools Menu Dropdown (Presets, Cover Letter, Translator, Backup) */}
        <div ref={toolsRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setToolsOpen(!toolsOpen)}
            className="btn btn-secondary btn-xs"
            style={{ padding: '6px 10px', fontSize: 12, fontWeight: 600, borderRadius: 8 }}
            title="More Resume Tools & Presets"
          >
            ⚙️ Tools ▾
          </button>

          {toolsOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 6,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 12, padding: 8, width: 220, zIndex: 200,
              boxShadow: '0 16px 40px rgba(0,0,0,0.7)', animation: 'slideUp 0.15s ease',
              display: 'flex', flexDirection: 'column', gap: 4
            }}>
              <button
                onClick={() => { setToolsOpen(false); onOpenCoverLetter(); }}
                className="btn btn-ghost btn-xs"
                style={{ justifyContent: 'flex-start', padding: '8px 10px', width: '100%', fontSize: 12 }}
              >
                ✉️ Cover Letter Generator
              </button>
              <button
                onClick={() => { setToolsOpen(false); onOpenTranslator(); }}
                className="btn btn-ghost btn-xs"
                style={{ justifyContent: 'flex-start', padding: '8px 10px', width: '100%', fontSize: 12 }}
              >
                🌍 Multi-Language Translation
              </button>
              <button
                onClick={() => { setToolsOpen(false); onToggleQrCode(); }}
                className="btn btn-ghost btn-xs"
                style={{ justifyContent: 'flex-start', padding: '8px 10px', width: '100%', fontSize: 12 }}
              >
                📱 Toggle Header QR Code {showQrCode ? '(ON)' : '(OFF)'}
              </button>
              <button
                onClick={() => { setToolsOpen(false); onExportTex(); }}
                className="btn btn-ghost btn-xs"
                style={{ justifyContent: 'flex-start', padding: '8px 10px', width: '100%', fontSize: 12 }}
              >
                📄 Export Overleaf .tex
              </button>
              <button
                onClick={() => { setToolsOpen(false); onExportJSON(); }}
                className="btn btn-ghost btn-xs"
                style={{ justifyContent: 'flex-start', padding: '8px 10px', width: '100%', fontSize: 12 }}
              >
                📦 Export JSON Backup
              </button>
              <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />
              <div style={{ padding: '4px 10px' }}>
                <SampleDataPicker onSelectPreset={(p) => { setToolsOpen(false); onSelectPreset(p); }} />
              </div>
            </div>
          )}
        </div>

        <ShareResumeButton resumeId={resumeId} isPublic={isPublic} onToggle={onVisibilityToggle} />

        {/* Primary Export Button */}
        <ExportButton title={title} />

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={saving}
          className="btn btn-primary btn-xs"
          style={{ padding: '6px 14px', fontSize: 12, fontWeight: 700, borderRadius: 8 }}
        >
          {saving ? <div className="spinner sm" /> : 'Save'}
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="btn btn-ghost btn-xs"
          title="Sign out"
          style={{ color: 'var(--danger)', padding: '6px' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function ResumeEditorPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const location   = useLocation()
  const { user, logout }   = useAuth()

  const [title,          setTitle]          = useState('NEJAMUL HAQUE - Resume')
  const [template,       setTemplate]       = useState(location.state?.template || 'modern')
  const [accentColor,    setAccentColor]    = useState('#7c6fff')
  const [customFont,     setCustomFont]     = useState('"Segoe UI",system-ui,sans-serif')
  const [editorMode,     setEditorMode]     = useState('form') // 'form' | 'latex'
  
  // Default to official resume (Nejamul Haque)
  const [data,           setData]           = useState(SAMPLE_RESUME_DATA)
  const [latexCode,      setLatexCode]      = useState(() => resumeToLatex(SAMPLE_RESUME_DATA))
  
  const [isPublic,       setIsPublic]       = useState(false)
  const [createdAt,      setCreatedAt]      = useState(new Date().toISOString())
  const [loading,        setLoading]        = useState(Boolean(id))
  const [manualSaving,   setManualSaving]   = useState(false)
  const [previewVisible, setPreviewVisible] = useState(true)
  const [mobileTab,      setMobileTab]      = useState('form')
  const [isMobile,       setIsMobile]       = useState(() => window.innerWidth < 900)
  const [show10DayNotice, setShow10DayNotice] = useState(false)
  const [showCoverLetter, setShowCoverLetter] = useState(false)
  const [showSecurityScanner, setShowSecurityScanner] = useState(false)
  const [showTranslator,  setShowTranslator]   = useState(false)
  const [showQrCode,      setShowQrCode]       = useState(false)
  const [showAtsDrawer,   setShowAtsDrawer]   = useState(false)
  const [zoom,           setZoom]           = useState(0.82)

  // Track viewport resize
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Show 10-day notice once per session when editing
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('proresume_seen_10day_notice')
    if (!hasSeen) {
      setShow10DayNotice(true)
      sessionStorage.setItem('proresume_seen_10day_notice', 'true')
    }
  }, [])

  // Load existing resume if editing an ID
  useEffect(() => {
    if (!id) return
    let active = true
    getResume(id).then(({ data: row, error }) => {
      if (!active) return
      if (error || !row) {
        toast.error('Could not load resume')
        navigate('/dashboard')
        return
      }
      setTitle(row.title)
      setTemplate(row.template)
      const resData = row.data && Object.keys(row.data).length ? row.data : SAMPLE_RESUME_DATA
      setData(resData)
      setLatexCode(resumeToLatex(resData))
      setIsPublic(row.is_public)
      setCreatedAt(row.created_at || new Date().toISOString())
      setLoading(false)
    })
    return () => { active = false }
  }, [id, navigate])

  // Save callback for auto-save hook
  const saveToDb = useCallback(async (currentData, currentTitle, currentTpl) => {
    if (!user) return
    if (id) {
      await updateResume(id, { title: currentTitle, template: currentTpl, data: currentData })
    } else {
      const { data: created, error } = await createResume(user.id, currentTitle, currentTpl, currentData)
      if (!error && created) {
        navigate(`/resume/${created.id}`, { replace: true })
      }
    }
  }, [id, user, navigate])

  const { status: autoSaveStatus, triggerChange, flushSave } = useAutoSave({
    saveFn: saveToDb,
    data,
    title,
    template,
    delay: 2000,
  })

  // Mutators
  const handleDataChange = useCallback((newData) => {
    setData(newData)
    setLatexCode(resumeToLatex(newData))
    triggerChange(newData, title, template)
  }, [title, template, triggerChange])

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle)
    triggerChange(data, newTitle, template)
  }

  const handleTemplateChange = (newTpl) => {
    setTemplate(newTpl)
    triggerChange(data, title, newTpl)
  }

  const handleToggleEditorMode = (mode) => {
    if (mode === 'latex') {
      setLatexCode(resumeToLatex(data))
    }
    setEditorMode(mode)
  }

  // Handle LaTeX compilation to live preview
  const handleLatexCompile = (code) => {
    setLatexCode(code)
    const parsed = latexToResume(code, data)
    setData(parsed)
    triggerChange(parsed, title, template)
  }

  const handleApplySummary = (summaryText) => {
    const updated = {
      ...data,
      personal: {
        ...data.personal,
        summary: summaryText
      }
    }
    handleDataChange(updated)
  }

  // Calculate live ATS readiness score
  const atsScore = useMemo(() => {
    let score = 0
    if (data.personal?.fullName) score += 15
    if (data.personal?.email) score += 10
    if (data.personal?.phone) score += 5
    if (data.personal?.summary?.length > 30) score += 15
    if (data.experience?.length > 0) score += 20
    if (data.education?.length > 0) score += 15
    if (data.skills?.technical?.length >= 5) score += 10
    if (data.projects?.length > 0) score += 10
    return Math.min(score, 100)
  }, [data])

  // Manual save
  const handleManualSave = async () => {
    setManualSaving(true)
    try {
      await flushSave(data, title, template)
      toast.success('Saved successfully to database!')
    } catch {
      toast.error('Save failed')
    } finally {
      setManualSaving(false)
    }
  }

  // Export JSON backup
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify({ title, template, data }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_backup.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('JSON backup downloaded!')
  }

  // Export Overleaf .tex source
  const handleExportTex = () => {
    const code = resumeToLatex(data)
    downloadTexFile(title, code)
    toast.success('Overleaf .tex source exported!')
  }

  // Visibility toggle
  const handleVisibilityToggle = async (val) => {
    setIsPublic(val)
    if (id) {
      const { error } = await updateResume(id, { is_public: val })
      if (error) {
        setIsPublic(!val)
        toast.error('Failed to update visibility')
      } else {
        toast.success(`Resume is now ${val ? 'public' : 'private'}`)
      }
    }
  }

  // 1-Click Role Presets
  const handleSelectPreset = (presetData) => {
    handleDataChange(presetData)
  }

  // Sign out handler
  const handleLogout = async () => {
    if (window.confirm('Sign out of ProResume? Make sure you have downloaded your PDF copy!')) {
      if (logout) await logout()
      await signOut()
      toast.success('Signed out')
      navigate('/')
    }
  }

  // Add missing skill from ATS Job Matcher
  const handleAddMissingSkill = (skill) => {
    const currTechnical = data.skills?.technical || []
    if (!currTechnical.includes(skill)) {
      const updated = {
        ...data,
        skills: {
          ...data.skills,
          technical: [...currTechnical, skill]
        }
      }
      handleDataChange(updated)
      toast.success(`Added "${skill}" to Technical Skills!`)
    }
  }

  if (loading) {
    return (
      <div className="full-page-center" style={{ gap: 14, flexDirection: 'column' }}>
        <div className="spinner lg" />
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading your resume…</span>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Auto-Delete Pop-Up Modal */}
      <AutoDeleteModal
        isOpen={show10DayNotice}
        onClose={() => setShow10DayNotice(false)}
      />

      {/* Cover Letter Generator Modal */}
      <CoverLetterModal
        isOpen={showCoverLetter}
        onClose={() => setShowCoverLetter(false)}
        resumeData={data}
      />

      {/* DevSecOps Security & Leak Scanner Modal */}
      <SecurityScannerModal
        isOpen={showSecurityScanner}
        onClose={() => setShowSecurityScanner(false)}
        resumeData={data}
        latexCode={latexCode}
      />

      {/* Multi-Language Translator Modal */}
      <ResumeTranslatorModal
        isOpen={showTranslator}
        onClose={() => setShowTranslator(false)}
        resumeData={data}
        onApplyLocale={handleDataChange}
      />

      {/* Sticky 10-day retention warning bar */}
      <AutoDeleteBanner
        createdAt={createdAt}
        onDownload={() => {
          const btn = document.querySelector('[data-export-btn="true"]')
          if (btn) btn.click()
        }}
      />

      {/* Top Bar */}
      <EditorBar
        title={title}
        template={template}
        onTitleChange={handleTitleChange}
        onTemplateChange={handleTemplateChange}
        onSave={handleManualSave}
        saving={manualSaving || autoSaveStatus === 'saving'}
        onTogglePreview={() => setPreviewVisible(v => !v)}
        previewVisible={previewVisible}
        resumeId={id}
        isPublic={isPublic}
        onVisibilityToggle={handleVisibilityToggle}
        isMobile={isMobile}
        onLogout={handleLogout}
        onSelectPreset={handleSelectPreset}
        onShowNotice={() => setShow10DayNotice(true)}
        resumeData={data}
        onApplySummary={handleApplySummary}
        onExportJSON={handleExportJSON}
        zoom={zoom}
        setZoom={setZoom}
        onOpenCoverLetter={() => setShowCoverLetter(true)}
        editorMode={editorMode}
        onToggleEditorMode={handleToggleEditorMode}
        onExportTex={handleExportTex}
        onToggleAts={() => setShowAtsDrawer(!showAtsDrawer)}
        atsScore={atsScore}
        onOpenSecurityScanner={() => setShowSecurityScanner(true)}
        onOpenTranslator={() => setShowTranslator(true)}
        showQrCode={showQrCode}
        onToggleQrCode={() => setShowQrCode(!showQrCode)}
      />

      {/* Mobile tabs */}
      {isMobile && <EditorMobileTabs activeTab={mobileTab} onChange={setMobileTab} />}

      {/* Main editor area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        
        {/* FORM / LATEX CODE PANEL */}
        {editorMode === 'form' ? (
          <div
            className="editor-form-panel"
            style={{
              flex: (isMobile && mobileTab !== 'form') ? 0 : 1,
              display: (isMobile && mobileTab !== 'form') ? 'none' : 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              borderRight: (!isMobile && previewVisible) ? '1px solid var(--border)' : 'none',
              background: 'var(--bg-primary)',
            }}
          >
            {/* ATS Job Matcher Collapsible Widget */}
            <div style={{ padding: '16px 20px 0' }}>
              <JobDescriptionMatcher
                currentSkills={[
                  ...(data.skills?.technical || []),
                  ...(data.skills?.soft || []),
                  ...(data.skills?.languages || [])
                ]}
                onAddSkill={handleAddMissingSkill}
              />
            </div>

            <ResumeForm data={data} onChange={handleDataChange} />
          </div>
        ) : (
          <div
            style={{
              flex: (isMobile && mobileTab !== 'latex') ? 0 : 1,
              display: (isMobile && mobileTab !== 'latex') ? 'none' : 'flex',
              flexDirection: 'column',
              height: '100%',
              borderRight: (!isMobile && previewVisible) ? '1px solid var(--border)' : 'none',
            }}
          >
            <LatexEditor
              latexCode={latexCode}
              onChange={setLatexCode}
              onCompile={handleLatexCompile}
              title={title}
              resumeData={data}
            />
          </div>
        )}

        {/* PREVIEW PANEL */}
        {(!isMobile ? previewVisible : mobileTab === 'preview') && (
          <div
            className="editor-preview-panel"
            style={{
              flex: 1.25,
              background: '#090d14',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px 16px 70px',
              position: 'relative',
            }}
          >
            {/* Advanced Theme Customizer & Zoom Bar */}
            <div style={{
              position: 'sticky', top: 0, zIndex: 20,
              background: 'rgba(13, 17, 23, 0.94)', backdropFilter: 'blur(16px)',
              border: '1px solid var(--border)', borderRadius: 14,
              padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 12, marginBottom: 18, boxShadow: 'var(--shadow-lg)', flexWrap: 'wrap'
            }}>
              
              {/* Color Palette Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Palette:</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {ACCENT_PALETTES.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setAccentColor(p.color)}
                      style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: p.color, border: accentColor === p.color ? '2px solid #fff' : '2px solid transparent',
                        cursor: 'pointer', boxShadow: accentColor === p.color ? `0 0 8px ${p.color}` : 'none',
                        transition: 'all 0.15s'
                      }}
                      title={p.name}
                    />
                  ))}
                </div>
              </div>

              {/* Font Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Font:</span>
                <select
                  value={customFont}
                  onChange={e => setCustomFont(e.target.value)}
                  style={{
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    color: 'var(--text-primary)', fontSize: 11.5, borderRadius: 6,
                    padding: '3px 8px', cursor: 'pointer'
                  }}
                >
                  {FONT_OPTIONS.map(f => (
                    <option key={f.id} value={f.font}>{f.name}</option>
                  ))}
                </select>
              </div>

              {/* QR Code & Translation Toggles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={() => setShowQrCode(!showQrCode)}
                  className="btn btn-ghost btn-xs"
                  style={{
                    padding: '3px 8px', fontSize: 11.5,
                    background: showQrCode ? 'rgba(124,111,255,0.2)' : 'transparent',
                    color: showQrCode ? 'var(--accent)' : 'var(--text-secondary)',
                    border: '1px solid var(--border)', borderRadius: 6
                  }}
                  title="Toggle Portfolio QR Code on Resume Header"
                >
                  📱 QR Code {showQrCode ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => setShowTranslator(true)}
                  className="btn btn-ghost btn-xs"
                  style={{
                    padding: '3px 8px', fontSize: 11.5,
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)', borderRadius: 6
                  }}
                  title="Multi-Language Resume Localizer"
                >
                  🌍 Translate
                </button>
              </div>

              {/* Zoom Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Zoom:</span>
                <button
                  onClick={() => setZoom(z => Math.max(0.5, Number((z - 0.05).toFixed(2))))}
                  className="btn btn-ghost btn-xs"
                  style={{ padding: '2px 6px', fontSize: 12 }}
                >
                  −
                </button>
                <span style={{ fontSize: 11.5, fontWeight: 700, minWidth: 32, textAlign: 'center' }}>
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(z => Math.min(1.2, Number((z + 0.05).toFixed(2))))}
                  className="btn btn-ghost btn-xs"
                  style={{ padding: '2px 6px', fontSize: 12 }}
                >
                  +
                </button>
                <button
                  onClick={() => setZoom(0.82)}
                  className="btn btn-ghost btn-xs"
                  style={{ fontSize: 10.5, color: 'var(--accent)' }}
                >
                  Reset
                </button>
              </div>

            </div>

            {/* Document Paper Container */}
            <div style={{
              background: '#fff', borderRadius: 4,
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.75)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              position: 'relative'
            }}>
              <ResumePreview
                data={data}
                template={template}
                scale={zoom}
                accentColor={accentColor}
                customFont={customFont}
                showQrCode={showQrCode}
              />
            </div>

            {/* Page Count Indicator */}
            <div style={{
              marginTop: 18, fontSize: 11.5, color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.04)', padding: '4px 12px', borderRadius: 20
            }}>
              <span style={{ color: 'var(--success)' }}>●</span>
              <span>Page 1 of 1 — Optimal Recruiter Length</span>
            </div>

          </div>
        )}

        {/* ATS PANEL (mobile only) */}
        {isMobile && mobileTab === 'ats' && (
          <div style={{ flex: 1, padding: 24, overflowY: 'auto', background: 'var(--bg-primary)' }}>
            <ATSScore data={data} />
          </div>
        )}
      </div>

      {/* Single Native Print Target */}
      <ResumePrintTarget
        data={data}
        template={template}
        accentColor={accentColor}
        customFont={customFont}
        showQrCode={showQrCode}
      />
    </div>
  )
}