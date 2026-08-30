import { useState } from 'react'
import { toast } from 'react-hot-toast'

const LOCALES = [
  {
    code: 'de',
    name: 'German (Lebenslauf)',
    flag: '🇩🇪',
    summaryPrefix: 'Engagierter Informatik-Student mit Schwerpunkt auf Backend-Architektur, Linux-Systemadministration und Infrastruktur-Automatisierung.',
    sectionTitles: { exp: 'Berufserfahrung', edu: 'Ausbildung', skills: 'Kenntnisse & Fähigkeiten', proj: 'Projekte & Labs', cert: 'Zertifikate' }
  },
  {
    code: 'fr',
    name: 'French (CV Professionnel)',
    flag: '🇫🇷',
    summaryPrefix: 'Étudiant motivé en informatique spécialisé dans l\'architecture backend, l\'administration des systèmes Linux et l\'automatisation des infrastructures.',
    sectionTitles: { exp: 'Expérience Professionnelle', edu: 'Formation & Diplômes', skills: 'Compétences Techniques', proj: 'Projets & Réalisations', cert: 'Certifications' }
  },
  {
    code: 'es',
    name: 'Spanish (Curriculum Vitae)',
    flag: '🇪🇸',
    summaryPrefix: 'Estudiante motivado de Ciencias de la Computación especializado en arquitectura backend, administración de sistemas Linux y automatización de infraestructura.',
    sectionTitles: { exp: 'Experiencia Laboral', edu: 'Educación & Formación', skills: 'Habilidades Técnicas', proj: 'Proyectos & Labs', cert: 'Certificaciones' }
  },
  {
    code: 'en',
    name: 'English (FAANG Standard)',
    flag: '🇺🇸',
    summaryPrefix: 'Motivated Computer Science undergraduate specializing in backend architecture, system administration, and infrastructure automation.',
    sectionTitles: { exp: 'Professional Experience', edu: 'Education', skills: 'Technical Skills', proj: 'Projects & Technical Labs', cert: 'Certifications' }
  }
]

export default function ResumeTranslatorModal({ isOpen, onClose, resumeData, onApplyLocale }) {
  const [selectedLocale, setSelectedLocale] = useState('de')

  if (!isOpen) return null

  const handleApply = () => {
    const loc = LOCALES.find(l => l.code === selectedLocale)
    if (!loc) return

    const updated = {
      ...resumeData,
      personal: {
        ...resumeData.personal,
        summary: loc.summaryPrefix
      }
    }
    onApplyLocale(updated)
    toast.success(`Applied ${loc.name} formatting! 🌍`)
    onClose()
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
        borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 520,
        boxShadow: '0 25px 80px rgba(0,0,0,0.85)', overflow: 'hidden', padding: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🌍</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, margin: 0 }}>
              Multi-Language Resume Localizer
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-xs" style={{ fontSize: 18, color: 'var(--text-muted)' }}>
            ×
          </button>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 20 }}>
          Targeting international roles in Germany, France, or Latin America? Adapt summary headers and regional conventions with 1 click.
        </p>

        {/* Locale options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {LOCALES.map(loc => (
            <div
              key={loc.code}
              onClick={() => setSelectedLocale(loc.code)}
              style={{
                background: selectedLocale === loc.code ? 'rgba(124,111,255,0.12)' : 'var(--bg-card)',
                border: `1px solid ${selectedLocale === loc.code ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 10, padding: '12px 16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 0.15s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{loc.flag}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)' }}>
                    {loc.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                    {loc.sectionTitles.exp} • {loc.sectionTitles.skills}
                  </div>
                </div>
              </div>

              {selectedLocale === loc.code && (
                <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            Cancel
          </button>
          <button onClick={handleApply} className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
            Apply Localization 🌍
          </button>
        </div>
      </div>
    </div>
  )
}
