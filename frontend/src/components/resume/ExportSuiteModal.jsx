import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { resumeToLatex } from '../../lib/latexConverter.js'

/**
 * Converts Resume data to GitHub Profile Markdown
 */
function resumeToMarkdown(data) {
  const p = data.personal || {}
  const skills = [
    ...(data.skills?.technical || []),
    ...(data.skills?.soft || [])
  ]

  let md = `# Hi there, I'm ${p.fullName || 'a Developer'} 👋\n\n`
  if (p.title) md += `### 🚀 ${p.title}\n\n`
  if (p.summary) md += `> ${p.summary}\n\n`

  // Contacts / Links
  md += `### 🌐 Connect with Me\n`
  if (p.email) md += `- 📧 Email: [${p.email}](mailto:${p.email})\n`
  if (p.linkedin) md += `- 💼 LinkedIn: [${p.linkedin}](https://${p.linkedin.replace(/^https?:\/\//, '')})\n`
  if (p.website) md += `- 🌍 Portfolio: [${p.website}](https://${p.website.replace(/^https?:\/\//, '')})\n`
  if (p.github) md += `- 🐙 GitHub: [${p.github}](https://${p.github.replace(/^https?:\/\//, '')})\n`
  md += `\n`

  // Skills
  if (skills.length > 0) {
    md += `### 🛠️ Tech Stack & Skills\n`
    md += skills.map(s => `\`${s}\``).join(' • ') + '\n\n'
  }

  // Projects
  if (data.projects?.length > 0) {
    md += `### 🚀 Featured Projects & Technical Labs\n`
    data.projects.forEach(proj => {
      md += `#### [${proj.name}](${proj.url || '#'})\n`
      if (proj.description) md += `${proj.description}\n\n`
      if (proj.tech?.length > 0) md += `*Tech Stack:* ${proj.tech.join(', ')}\n\n`
    })
  }

  // Education & Certifications
  if (data.education?.length > 0) {
    md += `### 🎓 Education\n`
    data.education.forEach(edu => {
      md += `- **${edu.degree}** — ${edu.institution} (${edu.startDate || ''} – ${edu.endDate || 'Present'})\n`
    })
    md += `\n`
  }

  if (data.certifications?.length > 0) {
    md += `### 📜 Certifications\n`
    data.certifications.forEach(cert => {
      md += `- **${cert.name}** (${cert.issuer || ''})\n`
    })
    md += `\n`
  }

  return md
}

/**
 * Converts Resume data to Plain Text (.txt) for Legacy ATS
 */
function resumeToPlainText(data) {
  const p = data.personal || {}
  let txt = `${(p.fullName || 'NAME').toUpperCase()}\n`
  if (p.title) txt += `${p.title}\n`
  txt += `Email: ${p.email || ''} | Phone: ${p.phone || ''} | Location: ${p.location || ''}\n`
  if (p.github) txt += `GitHub: ${p.github} `
  if (p.linkedin) txt += `| LinkedIn: ${p.linkedin}`
  txt += `\n${'='.repeat(60)}\n\n`

  if (p.summary) {
    txt += `SUMMARY\n${'-'.repeat(30)}\n${p.summary}\n\n`
  }

  if (data.experience?.length > 0) {
    txt += `EXPERIENCE\n${'-'.repeat(30)}\n`
    data.experience.forEach(e => {
      txt += `${e.role} - ${e.company} (${e.startDate || ''} to ${e.current ? 'Present' : e.endDate || ''})\n`
      if (e.location) txt += `Location: ${e.location}\n`
      ;(e.bullets || []).filter(Boolean).forEach(b => {
        txt += `  * ${b}\n`
      })
      txt += `\n`
    })
  }

  if (data.projects?.length > 0) {
    txt += `PROJECTS & LABS\n${'-'.repeat(30)}\n`
    data.projects.forEach(pr => {
      txt += `${pr.name} ${pr.url ? `(${pr.url})` : ''}\n`
      if (pr.description) txt += `  ${pr.description}\n`
      if (pr.tech?.length > 0) txt += `  Stack: ${pr.tech.join(', ')}\n`
      txt += `\n`
    })
  }

  if (data.skills?.technical?.length > 0 || data.skills?.soft?.length > 0) {
    txt += `SKILLS\n${'-'.repeat(30)}\n`
    if (data.skills.technical?.length > 0) txt += `Technical: ${data.skills.technical.join(', ')}\n`
    if (data.skills.soft?.length > 0) txt += `Soft Skills: ${data.skills.soft.join(', ')}\n`
    if (data.skills.languages?.length > 0) txt += `Languages: ${data.skills.languages.join(', ')}\n`
    txt += `\n`
  }

  if (data.education?.length > 0) {
    txt += `EDUCATION\n${'-'.repeat(30)}\n`
    data.education.forEach(ed => {
      txt += `${ed.degree} - ${ed.institution} (${ed.startDate || ''} - ${ed.endDate || ''})\n`
      if (ed.gpa) txt += `GPA: ${ed.gpa}\n`
    })
    txt += `\n`
  }

  return txt
}

export default function ExportSuiteModal({ isOpen, onClose, resumeData, title = 'Resume' }) {
  const [activeTab, setActiveTab] = useState('pdf')

  if (!isOpen) return null

  const downloadFile = (filename, content, type) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Downloaded ${filename}! 🚀`)
  }

  const handleExportPDF = () => {
    onClose()
    const printBtn = document.querySelector('[data-export-btn="true"]')
    if (printBtn) printBtn.click()
    else window.print()
  }

  const handleExportTex = () => {
    const tex = resumeToLatex(resumeData)
    downloadFile(`${title.toLowerCase().replace(/\s+/g, '_')}.tex`, tex, 'text/plain')
  }

  const handleExportMarkdown = () => {
    const md = resumeToMarkdown(resumeData)
    downloadFile('README.md', md, 'text/markdown')
  }

  const handleExportPlainText = () => {
    const txt = resumeToPlainText(resumeData)
    downloadFile(`${title.toLowerCase().replace(/\s+/g, '_')}.txt`, txt, 'text/plain')
  }

  const handleExportJSON = () => {
    const json = JSON.stringify(resumeData, null, 2)
    downloadFile(`${title.toLowerCase().replace(/\s+/g, '_')}.json`, json, 'application/json')
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
        borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 580,
        boxShadow: '0 25px 80px rgba(0,0,0,0.85)', overflow: 'hidden', padding: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontSize: 22 }}>📥</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: 0 }}>
              Multi-Format Exporter Suite
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-xs" style={{ fontSize: 18, color: 'var(--text-muted)' }}>
            ×
          </button>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 20 }}>
          Export your resume across 5 industry-standard formats for job applications, GitHub profiles, and Overleaf:
        </p>

        {/* Format Options Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          
          {/* 1. Vector PDF */}
          <div
            onClick={handleExportPDF}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: 14, cursor: 'pointer', transition: 'all 0.15s',
              display: 'flex', flexDirection: 'column', gap: 4
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📄</span>
              <strong style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>Vector PDF</strong>
            </div>
            <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>High-DPI printable PDF ready for recruiters</span>
          </div>

          {/* 2. Overleaf LaTeX (.tex) */}
          <div
            onClick={handleExportTex}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: 14, cursor: 'pointer', transition: 'all 0.15s',
              display: 'flex', flexDirection: 'column', gap: 4
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>⌨️</span>
              <strong style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>Overleaf LaTeX (.tex)</strong>
            </div>
            <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Source code for Overleaf & TeX Live</span>
          </div>

          {/* 3. GitHub Profile Markdown (README.md) */}
          <div
            onClick={handleExportMarkdown}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: 14, cursor: 'pointer', transition: 'all 0.15s',
              display: 'flex', flexDirection: 'column', gap: 4
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🐙</span>
              <strong style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>GitHub README.md</strong>
            </div>
            <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Formatted for candidate GitHub profile</span>
          </div>

          {/* 4. Plain Text (.txt) */}
          <div
            onClick={handleExportPlainText}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: 14, cursor: 'pointer', transition: 'all 0.15s',
              display: 'flex', flexDirection: 'column', gap: 4
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📋</span>
              <strong style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>Plain Text (.txt)</strong>
            </div>
            <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Optimized for Taleo & Workday ATS</span>
          </div>

          {/* 5. JSON Backup (.json) */}
          <div
            onClick={handleExportJSON}
            style={{
              gridColumn: '1 / -1',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: 12, cursor: 'pointer', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>📦</span>
              <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>JSON Backup (.json)</strong>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>— Complete portable database dump</span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>Download ⬇</span>
          </div>

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
