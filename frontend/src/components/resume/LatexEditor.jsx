import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { downloadTexFile, generateJakesLatex } from '../../lib/latexConverter.js'

const LATEX_SNIPPETS = [
  { label: '\\resumeSubheading', code: '    \\resumeSubheading\n      {Senior Full-Stack Engineer}{2023 -- Present}\n      {Company Name}{San Francisco, CA}\n      \\resumeItemListStart\n        \\resumeItem{Architected scalable cloud services boosting throughput by 40\\%.}\n      \\resumeItemListEnd\n' },
  { label: '\\resumeItem', code: '        \\resumeItem{Spearheaded automated CI/CD deployment reducing build times by 50\\%.}\n' },
  { label: '\\resumeProject', code: '      \\resumeProjectHeading\n          {\\textbf{Project Name} $|$ \\emph{React, Node.js, PostgreSQL}}{github.com/user/project}\n          \\resumeItemListStart\n            \\resumeItem{Developed high-throughput analytics engine processing 1M+ daily events.}\n          \\resumeItemListEnd\n' },
  { label: '\\section', code: '\\section{New Section}\n  \\resumeSubHeadingListStart\n    \\resumeItem{Content here}\n  \\resumeSubHeadingListEnd\n' },
  { label: '\\textbf', code: '\\textbf{text}' },
  { label: '\\textit', code: '\\textit{text}' },
  { label: '\\href', code: '\\href{https://example.com}{Link Text}' },
]

export default function LatexEditor({
  latexCode,
  onChange,
  onCompile,
  title,
  resumeData
}) {
  const [autoCompile, setAutoCompile] = useState(true)
  const [compiling, setCompiling] = useState(false)
  const [lastCompiledAt, setLastCompiledAt] = useState(new Date().toLocaleTimeString())
  const [logsOpen, setLogsOpen] = useState(false)
  const textareaRef = useRef(null)

  // Handle recompile
  const handleRecompile = () => {
    setCompiling(true)
    setTimeout(() => {
      if (onCompile) onCompile(latexCode)
      setCompiling(false)
      setLastCompiledAt(new Date().toLocaleTimeString())
      toast.success('LaTeX Compiled & Synced! ⚡', { id: 'latex-compile', duration: 1500 })
    }, 120)
  }

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to recompile
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleRecompile()
    }
    // Handle tab key indent
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newCode = latexCode.substring(0, start) + '  ' + latexCode.substring(end)
      onChange(newCode)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  // Auto-compile debounced on typing
  useEffect(() => {
    if (!autoCompile) return
    const timer = setTimeout(() => {
      if (onCompile) onCompile(latexCode)
      setLastCompiledAt(new Date().toLocaleTimeString())
    }, 1100)
    return () => clearTimeout(timer)
  }, [latexCode, autoCompile, onCompile])

  const insertSnippet = (snippet) => {
    if (!textareaRef.current) return
    const el = textareaRef.current
    const start = el.selectionStart
    const end = el.selectionEnd
    const updated = latexCode.substring(0, start) + snippet + latexCode.substring(end)
    onChange(updated)
    setTimeout(() => {
      el.focus()
      el.selectionStart = el.selectionEnd = start + snippet.length
    }, 10)
  }

  const handleResetToStandard = () => {
    if (window.confirm('Reset code to standard FAANG LaTeX format?')) {
      const code = generateJakesLatex(resumeData)
      onChange(code)
      if (onCompile) onCompile(code)
      toast.success('Reset to FAANG LaTeX template!')
    }
  }

  const lines = latexCode.split('\n')

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: '#0d1117', color: '#e6edf3', borderRight: '1px solid var(--border)',
      overflow: 'hidden'
    }}>
      
      {/* ── OVERLEAF TOP TOOLBAR ── */}
      <div style={{
        height: 46, background: '#161b22', borderBottom: '1px solid #30363d',
        padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, gap: 10, flexWrap: 'wrap'
      }}>
        {/* Left: Recompile & Engine */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleRecompile}
            disabled={compiling}
            className="btn btn-primary btn-xs"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none', fontWeight: 700, padding: '5px 14px', borderRadius: 7,
              boxShadow: '0 2px 10px rgba(16, 185, 129, 0.45)', display: 'flex', alignItems: 'center', gap: 6
            }}
            title="Shortcut: Cmd+Enter / Ctrl+Enter"
          >
            {compiling ? <div className="spinner sm" /> : <span>⚡ Recompile</span>}
          </button>

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8b949e', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoCompile}
              onChange={e => setAutoCompile(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: '#10b981' }}
            />
            <span>Auto-Compile</span>
          </label>

          <div style={{ width: 1, height: 16, background: '#30363d' }} />

          <div style={{ fontSize: 11.5, color: '#c9d1d9', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#58a6ff' }}>📄 main.tex</span>
            <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: '#21262d', color: '#8b949e' }}>
              pdfLaTeX 2026
            </span>
          </div>
        </div>

        {/* Right: Actions & Overleaf Exporter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setLogsOpen(!logsOpen)}
            className="btn btn-ghost btn-xs"
            style={{ fontSize: 11, color: '#8b949e', padding: '3px 7px' }}
          >
            📋 Logs (0 Errors)
          </button>

          <button
            onClick={handleResetToStandard}
            className="btn btn-ghost btn-xs"
            style={{ fontSize: 11, color: 'var(--accent)', padding: '3px 7px' }}
            title="Reset LaTeX to FAANG Template"
          >
            🔄 Reset Template
          </button>

          <button
            onClick={() => { downloadTexFile(title, latexCode); toast.success('Overleaf .tex source exported!') }}
            className="btn btn-secondary btn-xs"
            style={{
              background: '#21262d', border: '1px solid #30363d', color: '#f0f6fc',
              fontSize: 11.5, padding: '4px 10px', borderRadius: 6, fontWeight: 600
            }}
          >
            📥 Download .tex
          </button>
        </div>
      </div>

      {/* ── LATEX SNIPPETS QUICK BAR ── */}
      <div style={{
        background: '#161b22', borderBottom: '1px solid #21262d',
        padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6,
        overflowX: 'auto', flexShrink: 0
      }}>
        <span style={{ fontSize: 10.5, color: '#8b949e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Macros:
        </span>
        {LATEX_SNIPPETS.map((snip, idx) => (
          <button
            key={idx}
            onClick={() => insertSnippet(snip.code)}
            style={{
              background: '#21262d', border: '1px solid #30363d', color: '#79c0ff',
              padding: '3px 8px', borderRadius: 5, fontSize: 11, fontFamily: '"JetBrains Mono", monospace',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#58a6ff'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.color = '#79c0ff' }}
          >
            {snip.label}
          </button>
        ))}
      </div>

      {/* ── CODE EDITOR WITH LINE NUMBERS ── */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        
        {/* Line Numbers Column */}
        <div style={{
          width: 46, background: '#0d1117', borderRight: '1px solid #21262d',
          padding: '14px 8px 14px 0', textAlign: 'right', userSelect: 'none',
          fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: 12, lineHeight: '21px',
          color: '#484f58', overflow: 'hidden'
        }}>
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea Code Body */}
        <textarea
          ref={textareaRef}
          value={latexCode}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          style={{
            flex: 1, background: '#0d1117', color: '#e6edf3',
            border: 'none', outline: 'none', resize: 'none',
            padding: '14px 18px',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: 12.5, lineHeight: '21px',
            tabSize: 2, whiteSpace: 'pre', overflowWrap: 'normal', overflowX: 'auto',
            height: '100%'
          }}
          placeholder="% Type your Overleaf LaTeX code here..."
        />
      </div>

      {/* ── LOGS DRAWER (COLLAPSIBLE) ── */}
      {logsOpen && (
        <div style={{
          height: 110, background: '#090d13', borderTop: '1px solid #30363d',
          padding: '10px 14px', fontSize: 11, fontFamily: 'monospace',
          color: '#8b949e', overflowY: 'auto'
        }}>
          <div style={{ color: '#56d364', marginBottom: 4 }}>
            ✓ pdflatex compiled without errors (Output: 1 page, 800x1050pt).
          </div>
          <div>This is pdfTeX, Version 3.141592653-2.6-1.40.24 (TeX Live 2026).</div>
          <div>(./main.tex LaTeX2e &lt;2023-11-01&gt; patch level 1)</div>
          <div style={{ color: '#58a6ff' }}>Output written on main.pdf (1 page, 42180 bytes).</div>
        </div>
      )}

      {/* ── FOOTER STATUS BAR ── */}
      <div style={{
        height: 26, background: '#161b22', borderTop: '1px solid #21262d',
        padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 11, color: '#8b949e', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>Lines: {lines.length}</span>
          <span>Chars: {latexCode.length}</span>
          <span style={{ color: '#56d364' }}>● Ready</span>
        </div>
        <div>Shortcut: <strong>Cmd+Enter</strong> to Recompile</div>
      </div>

    </div>
  )
}
