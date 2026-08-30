import { useState } from 'react'
import SectionNav, { SECTIONS } from './SectionNav.jsx'
import { BulletImprover, SummaryGenerator } from './AIAssistant.jsx'
import { genId } from '../../lib/resumeDefaults.js'

function Field({ label, children }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      {children}
    </div>
  )
}

function TextInput({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <Field label={label}>
      <input type={type} className="input" value={value || ''}
        onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </Field>
  )
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <Field label={label}>
      <textarea className="input" value={value || ''} rows={rows}
        onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </Field>
  )
}

function Entry({ title, subtitle, onDelete, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 11, overflow: 'hidden' }}>
      <div onClick={() => setOpen(v => !v)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '11px 14px', cursor: 'pointer',
        background: open ? 'rgba(124,111,255,0.05)' : 'transparent',
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title || 'New Entry'}</div>
          {subtitle && <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 10 }}>
          <button onClick={e => { e.stopPropagation(); onDelete() }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 3, opacity: 0.65, lineHeight: 1 }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.65'}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
      {open && <div style={{ padding: 14, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>}
    </div>
  )
}

function SectionHeader({ title, onAdd, addLabel = 'Add' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15.5, fontWeight: 700 }}>{title}</h3>
      {onAdd && (
        <button onClick={onAdd} className="btn btn-sm"
          style={{ background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid rgba(124,111,255,0.3)', borderRadius: 8 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {addLabel}
        </button>
      )}
    </div>
  )
}

function SkillsInput({ label, skills, onChange }) {
  const [draft, setDraft] = useState('')
  const add = () => {
    const val = draft.trim()
    if (!val || skills.includes(val)) return
    onChange([...skills, val]); setDraft('')
  }
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input className="input" value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder="Type and press Enter" />
        <button onClick={add} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>Add</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {skills.map(s => (
          <span key={s} className="tag">{s}
            <button onClick={() => onChange(skills.filter(x => x !== s))}>×</button>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Sections ───────────────────────────────────────────────────────────────

function PersonalSection({ data, onChange }) {
  const set = (f, v) => onChange({ ...data, personal: { ...data.personal, [f]: v } })
  const p = data.personal
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <SectionHeader title="Personal Information" />
      <TextInput label="Full Name"          value={p.fullName}  onChange={v => set('fullName', v)}  placeholder="Nejamul Haque" />
      <TextInput label="Professional Title" value={p.title}     onChange={v => set('title', v)}     placeholder="Senior Software Engineer" />
      <div className="grid-2">
        <TextInput label="Email"  type="email" value={p.email}  onChange={v => set('email', v)}  placeholder="you@email.com" />
        <TextInput label="Phone"              value={p.phone}  onChange={v => set('phone', v)}  placeholder="+91 0000000000" />
      </div>
      <TextInput label="Location"  value={p.location} onChange={v => set('location', v)} placeholder="Bettiah, India" />
      <div className="grid-2">
        <TextInput label="Website"  value={p.website}  onChange={v => set('website', v)}  placeholder="yoursite.com" />
        <TextInput label="LinkedIn" value={p.linkedin} onChange={v => set('linkedin', v)} placeholder="linkedin.com/in/you" />
      </div>
      <TextInput label="GitHub" value={p.github} onChange={v => set('github', v)} placeholder="github.com/you" />
      <div className="form-group">
        <label className="form-label">Professional Summary</label>
        <textarea className="input" value={p.summary || ''} rows={4}
          onChange={e => set('summary', e.target.value)}
          placeholder="Write a compelling 2–3 sentence summary…" />
        <SummaryGenerator resumeData={data} onAccept={v => set('summary', v)} />
      </div>
    </div>
  )
}

function ExperienceSection({ data, onChange }) {
  const upd  = (id, f, v) => onChange({ ...data, experience: data.experience.map(e => e.id === id ? { ...e, [f]: v } : e) })
  const addB = (id) => onChange({ ...data, experience: data.experience.map(e => e.id === id ? { ...e, bullets: [...(e.bullets||[]), ''] } : e) })
  const updB = (id, i, v) => onChange({ ...data, experience: data.experience.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b,j) => j===i ? v : b) } : e) })
  const remB = (id, i) => onChange({ ...data, experience: data.experience.map(e => e.id === id ? { ...e, bullets: e.bullets.filter((_,j) => j!==i) } : e) })
  const add  = () => onChange({ ...data, experience: [...data.experience, { id: genId(), company: '', role: '', location: '', startDate: '', endDate: '', current: false, bullets: [''] }] })
  const rem  = (id) => onChange({ ...data, experience: data.experience.filter(e => e.id !== id) })

  return (
    <div>
      <SectionHeader title="Work Experience" onAdd={add} addLabel="Add Job" />
      {data.experience.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No experience yet.</p>}
      {data.experience.map(exp => (
        <Entry key={exp.id} title={exp.role || 'New Position'} subtitle={exp.company} onDelete={() => rem(exp.id)}>
          <div className="grid-2">
            <TextInput label="Company"   value={exp.company}  onChange={v => upd(exp.id,'company',v)}  placeholder="Company Name" />
            <TextInput label="Job Title" value={exp.role}     onChange={v => upd(exp.id,'role',v)}     placeholder="Software Engineer" />
          </div>
          <TextInput label="Location" value={exp.location} onChange={v => upd(exp.id,'location',v)} placeholder="City, State or Remote" />
          <div className="grid-2">
            <TextInput label="Start Date" type="month" value={exp.startDate} onChange={v => upd(exp.id,'startDate',v)} />
            <TextInput label="End Date"   type="month" value={exp.endDate}   onChange={v => upd(exp.id,'endDate',v)} />
          </div>
          <label className="checkbox-row">
            <input type="checkbox" checked={!!exp.current} onChange={e => upd(exp.id,'current',e.target.checked)} />
            <span>Currently working here</span>
          </label>
          <div>
            <div className="form-label" style={{ marginBottom: 8 }}>Achievements / Responsibilities</div>
            {(exp.bullets||[]).map((bullet, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                  <textarea className="input" rows={2} value={bullet}
                    onChange={e => updB(exp.id, i, e.target.value)}
                    placeholder="Describe your achievement with impact and metrics…"
                    style={{ flex: 1 }} />
                  <button onClick={() => remB(exp.id,i)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: 18, marginTop: 6, flexShrink: 0 }}>×</button>
                </div>
                {/* AI bullet improver per bullet */}
                <BulletImprover
                  bullet={bullet}
                  onAccept={improved => updB(exp.id, i, improved)}
                />
              </div>
            ))}
            <button onClick={() => addB(exp.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 13, fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 4, padding: 0, marginTop: 4 }}>
              + Add bullet point
            </button>
          </div>
        </Entry>
      ))}
    </div>
  )
}

function EducationSection({ data, onChange }) {
  const upd = (id, f, v) => onChange({ ...data, education: data.education.map(e => e.id===id ? { ...e, [f]: v } : e) })
  const add = () => onChange({ ...data, education: [...data.education, { id: genId(), institution: '', degree: '', location: '', startDate: '', endDate: '', gpa: '', honors: '' }] })
  const rem = (id) => onChange({ ...data, education: data.education.filter(e => e.id!==id) })
  return (
    <div>
      <SectionHeader title="Education" onAdd={add} addLabel="Add School" />
      {data.education.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No education yet.</p>}
      {data.education.map(edu => (
        <Entry key={edu.id} title={edu.degree||'New Degree'} subtitle={edu.institution} onDelete={() => rem(edu.id)}>
          <TextInput label="Institution"    value={edu.institution} onChange={v => upd(edu.id,'institution',v)} placeholder="University Name" />
          <TextInput label="Degree & Major" value={edu.degree}      onChange={v => upd(edu.id,'degree',v)}      placeholder="B.S. Computer Science" />
          <TextInput label="Location"       value={edu.location}    onChange={v => upd(edu.id,'location',v)}    placeholder="City, State" />
          <div className="grid-2">
            <TextInput label="Start" type="month" value={edu.startDate} onChange={v => upd(edu.id,'startDate',v)} />
            <TextInput label="End"   type="month" value={edu.endDate}   onChange={v => upd(edu.id,'endDate',v)} />
          </div>
          <div className="grid-2">
            <TextInput label="GPA (optional)"    value={edu.gpa}    onChange={v => upd(edu.id,'gpa',v)}    placeholder="3.8" />
            <TextInput label="Honors (optional)" value={edu.honors} onChange={v => upd(edu.id,'honors',v)} placeholder="Magna Cum Laude" />
          </div>
        </Entry>
      ))}
    </div>
  )
}

function SkillsSection({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, skills: { ...data.skills, [k]: v } })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <SectionHeader title="Skills" />
      <SkillsInput label="Technical Skills" skills={data.skills.technical||[]} onChange={v => set('technical',v)} />
      <SkillsInput label="Soft Skills"      skills={data.skills.soft||[]}      onChange={v => set('soft',v)} />
      <SkillsInput label="Languages"        skills={data.skills.languages||[]} onChange={v => set('languages',v)} />
    </div>
  )
}

import GithubProjectImporter from './GithubProjectImporter.jsx'

function ProjectsSection({ data, onChange }) {
  const upd = (id, f, v) => onChange({ ...data, projects: data.projects.map(p => p.id===id ? { ...p, [f]: v } : p) })
  const add = () => onChange({ ...data, projects: [...data.projects, { id: genId(), name: '', description: '', tech: [], url: '' }] })
  const rem = (id) => onChange({ ...data, projects: data.projects.filter(p => p.id!==id) })
  const handleImportGithub = (newProjects) => {
    onChange({ ...data, projects: [...(data.projects || []), ...newProjects] })
  }

  const githubUser = (data.personal?.github || '').replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '') || 'NejamulHaque'

  return (
    <div>
      <SectionHeader title="Projects" onAdd={add} addLabel="Add Project" />
      
      {/* 1-Click GitHub Repository Importer */}
      <GithubProjectImporter
        currentUsername={githubUser}
        onImportProjects={handleImportGithub}
      />

      {data.projects.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No projects yet.</p>}
      {data.projects.map(proj => (
        <Entry key={proj.id} title={proj.name||'New Project'} subtitle={proj.url} onDelete={() => rem(proj.id)}>
          <TextInput label="Project Name" value={proj.name}        onChange={v => upd(proj.id,'name',v)}        placeholder="My Awesome Project" />
          <TextArea  label="Description"  value={proj.description} onChange={v => upd(proj.id,'description',v)} placeholder="Describe the project and its impact…" />
          <TextInput label="URL / GitHub" value={proj.url}         onChange={v => upd(proj.id,'url',v)}         placeholder="github.com/you/project" />
          <SkillsInput label="Technologies" skills={proj.tech||[]} onChange={v => upd(proj.id,'tech',v)} />
        </Entry>
      ))}
    </div>
  )
}

function CertificationsSection({ data, onChange }) {
  const upd = (id, f, v) => onChange({ ...data, certifications: data.certifications.map(c => c.id===id ? { ...c, [f]: v } : c) })
  const add = () => onChange({ ...data, certifications: [...data.certifications, { id: genId(), name: '', issuer: '', date: '' }] })
  const rem = (id) => onChange({ ...data, certifications: data.certifications.filter(c => c.id!==id) })
  return (
    <div>
      <SectionHeader title="Certifications" onAdd={add} addLabel="Add Cert" />
      {data.certifications.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No certifications yet.</p>}
      {data.certifications.map(cert => (
        <Entry key={cert.id} title={cert.name||'New Certification'} subtitle={cert.issuer} onDelete={() => rem(cert.id)}>
          <TextInput label="Certification Name"   value={cert.name}   onChange={v => upd(cert.id,'name',v)}   placeholder="AWS Solutions Architect" />
          <TextInput label="Issuing Organization" value={cert.issuer} onChange={v => upd(cert.id,'issuer',v)} placeholder="Amazon Web Services" />
          <TextInput label="Date" type="month"    value={cert.date}   onChange={v => upd(cert.id,'date',v)} />
        </Entry>
      ))}
    </div>
  )
}

export default function ResumeForm({ data, onChange }) {
  const [activeSection, setActiveSection] = useState('personal')
  const render = () => {
    switch (activeSection) {
      case 'personal':       return <PersonalSection       data={data} onChange={onChange} />
      case 'experience':     return <ExperienceSection     data={data} onChange={onChange} />
      case 'education':      return <EducationSection      data={data} onChange={onChange} />
      case 'skills':         return <SkillsSection         data={data} onChange={onChange} />
      case 'projects':       return <ProjectsSection       data={data} onChange={onChange} />
      case 'certifications': return <CertificationsSection data={data} onChange={onChange} />
      default:               return null
    }
  }
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <SectionNav active={activeSection} onChange={setActiveSection} />
      <div style={{ flex: 1, padding: '18px 16px', overflowY: 'auto' }}>{render()}</div>
    </div>
  )
}