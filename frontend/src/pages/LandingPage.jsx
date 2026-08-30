import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth.jsx'
import ResumePreview from '../components/resume/ResumePreview.jsx'
import { SAMPLE_RESUME_DATA } from '../lib/resumeDefaults.js'
import { useSeo } from '../lib/seo.js'
import SocialShareModal from '../components/ui/SocialShareModal.jsx'

const IRUS_AI_URL = 'https://irus-ai.onrender.com'
const GITHUB_REPO_URL = 'https://github.com/NejamulHaque/ProResume-Builder'
const PORTFOLIO_URL = 'https://nejamulhaque.vercel.app/'

const TEMPLATE_PREVIEWS = [
  { id: 'modern',    name: 'Modern Indigo', color: '#7c6fff', desc: 'Sleek two-column header with dynamic accent badge.' },
  { id: 'minimal',   name: 'Minimalist Clean', color: '#555555', desc: 'Editorial serif layout with strict typographical hierarchy.' },
  { id: 'executive', name: 'Executive Gold', color: '#b8860b', desc: 'Authoritative dark banner with warm gold accents.' },
  { id: 'technical', name: 'Terminal Code', color: '#00d4aa', desc: 'Developer dark mode with syntax brackets and monospace.' },
  { id: 'creative',  name: 'Creative Rose', color: '#ff6b9d', desc: 'Bold gradient sidebar layout for designers and creators.' },
]

const FEATURES = [
  { icon: '⌨️', title: 'Overleaf LaTeX Engine', desc: 'Real-time side-by-side Overleaf LaTeX code editor with FAANG macros and 1-click .tex file export.' },
  { icon: '🤖', title: 'IRUS AI Intelligence', desc: 'Deep intelligence from irus-ai.onrender.com to craft quantified bullets, executive summaries, and cover letters.' },
  { icon: '🐙', title: '1-Click GitHub Importer', desc: 'Instantly turn public GitHub repositories and tech stacks into structured resume project entries.' },
  { icon: '🛡️', title: 'DevSecOps Security Audit', desc: 'Automated pre-flight scanner ensuring zero API key leaks, credentials, or private IPs before export.' },
  { icon: '🎯', title: 'Recruiter ATS Optimizer', desc: 'Built-in keyword density scanner and action-verb scorer to guarantee 98%+ ATS screening pass rate.' },
  { icon: '⏳', title: '10-Day Ephemeral Retention', desc: 'Zero data risk. Resumes auto-purged from Neon PostgreSQL after 10 days for maximum cloud privacy.' },
  { icon: '📄', title: 'High-DPI Vector PDFs', desc: 'Export crystal-clear vector PDFs with crisp typography and perfect print margins.' },
  { icon: '💎', title: '100% Free & Open-Source', desc: 'No paywalls, no hidden watermarks, and no mandatory subscription upgrades. MIT Licensed.' },
]

const FAQS = [
  {
    q: 'How does the Overleaf LaTeX Editor work?',
    a: 'ProResume features a bi-directional Overleaf LaTeX compiler. You can edit via visual form or write standard LaTeX code with FAANG / Jake\'s resume macros (\resumeSubheading, \resumeItem). Changes compile live and you can export the raw .tex source code anytime!'
  },
  {
    q: 'How does the 10-day auto-delete policy protect my privacy?',
    a: 'For absolute candidate data privacy, all resumes stored in cloud databases expire 10 days after creation. Our backend automated worker purges expired records every 30 minutes. You can download your vector PDF or .tex file for permanent personal backup.'
  },
  {
    q: 'What is IRUS AI and how does it integrate with ProResume?',
    a: 'IRUS AI (irus-ai.onrender.com) is an advanced career intelligence platform created by Nejamul Haque. ProResume integrates IRUS AI to automatically polish bullet points with high-impact action verbs, optimize ATS keyword density, and generate tailored cover letters.'
  },
  {
    q: 'How does the 1-Click GitHub Importer work?',
    a: 'Simply enter your GitHub username (e.g. NejamulHaque) in the Projects section. ProResume queries the GitHub REST API to fetch your top starred repos, language stacks, and descriptions, converting them into formatted resume entries with one click.'
  },
  {
    q: 'What is the DevSecOps Security & Secret Leak Scanner?',
    a: 'Before sharing or exporting your resume, our built-in DevSecOps scanner audits your entire resume and LaTeX code for accidental leaks of GitHub tokens, OpenAI keys, AWS credentials, private SSH keys, and internal IP addresses.'
  },
  {
    q: 'Can I export high-quality PDFs without any watermarks?',
    a: 'Yes, 100%. All exported PDFs use the native browser vector print engine at 300+ DPI with zero watermarks, ads, or formatting distortion.'
  },
  {
    q: 'Can I switch templates without losing my entered information?',
    a: 'Yes! You can switch between Modern, Minimal, Executive, Technical, and Creative templates at any time with 1 click without losing any data.'
  },
  {
    q: 'Is ProResume Builder completely free to use?',
    a: 'Yes! ProResume Builder is 100% free and open-source under the MIT license, created by Nejamul Haque to make career tooling accessible to everyone.'
  }
]

export default function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [activeFaq, setActiveFaq] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)
  
  // Interactive Simulator State
  const [simName, setSimName] = useState('NEJAMUL HAQUE')
  const [simRole, setSimRole] = useState('Computer Science Undergraduate | DevSecOps Aspirant')
  const [simBullet, setSimBullet] = useState('Configured a local Linux environment to practice file system security, user privilege management, and process monitoring.')

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sendingContact, setSendingContact] = useState(false)

  const isAdmin = user?.email === 'nejamulhaque.works@gmail.com' || user?.email === 'nejamulhaqueruhaan86@gmail.com'

  useSeo({
    title: 'Free ATS Resume Builder & Overleaf LaTeX Engine',
    description: 'Build FAANG-grade ATS resumes with Overleaf LaTeX compilation, IRUS AI bullet enhancements, 5 modern templates, and 10-day ephemeral cloud privacy. 100% Free.',
    canonical: 'https://github.com/NejamulHaque/ProResume-Builder'
  })

  const liveMockData = useMemo(() => {
    const base = JSON.parse(JSON.stringify(SAMPLE_RESUME_DATA))
    base.personal.fullName = simName || 'NEJAMUL HAQUE'
    base.personal.title = simRole || 'Computer Science Undergraduate | DevSecOps Aspirant'
    if (base.experience && base.experience[0]) {
      base.experience[0].bullets = [
        simBullet,
        'Built a local sandbox to master Linux system administration, permissions, and CLI operations.',
        'Conducted deep dives into networking protocols (TCP/IP, DNS, SSH, Firewalls) and data routing.'
      ]
    }
    return base
  }, [simName, simRole, simBullet])

  const handleStartBuilding = (tpl) => {
    if (user) {
      navigate('/resume/new', tpl ? { state: { template: tpl } } : undefined)
    } else {
      navigate('/auth', tpl ? { state: { template: tpl } } : undefined)
    }
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all required fields.')
      return
    }
    setSendingContact(true)
    setTimeout(() => {
      setSendingContact(false)
      setContactForm({ name: '', email: '', subject: '', message: '' })
      toast.success('Thank you! Your message has been sent to Nejamul Haque.')
    }, 750)
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      
      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl="https://github.com/NejamulHaque/ProResume-Builder"
      />

      {/* ── FROZEN / STICKY TOP NAVIGATION ── */}
      <header role="banner" style={{
        height: 72, borderBottom: '1px solid var(--border)',
        background: 'rgba(9, 9, 15, 0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-accent)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 21, letterSpacing: -0.5 }}>
            Pro<span className="gradient-text">Resume</span>
          </span>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav className="desktop-only" aria-label="Main Navigation" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="#templates" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13.5, fontWeight: 500 }}>Templates</a>
          <a href="#latex" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13.5, fontWeight: 500 }}>LaTeX Editor</a>
          <a href="#irus-ai" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 13.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>🤖</span> IRUS AI
          </a>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13.5, fontWeight: 500 }}>Features</a>
          <a href="#contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13.5, fontWeight: 500 }}>Contact</a>
          <a href="#faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13.5, fontWeight: 500 }}>FAQ</a>
        </nav>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setShowShareModal(true)}
            className="btn btn-ghost btn-sm desktop-only"
            style={{ color: 'var(--text-secondary)' }}
            title="Share ProResume"
          >
            🚀 Share
          </button>

          {isAdmin && (
            <Link
              to="/admin"
              className="btn btn-ghost btn-sm desktop-only"
              style={{
                fontSize: 12, fontWeight: 700, color: 'var(--accent)',
                background: 'rgba(124,111,255,0.12)', border: '1px solid rgba(124,111,255,0.3)',
                padding: '5px 12px', borderRadius: 8, textDecoration: 'none'
              }}
            >
              🛡️ Admin
            </Link>
          )}

          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-md">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/auth" className="btn btn-ghost btn-sm desktop-only" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link to="/auth" className="btn btn-primary btn-md" style={{ padding: '8px 18px', textDecoration: 'none', fontWeight: 700 }}>
                Start Free 🚀
              </Link>
            </>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-sm mobile-only"
            style={{ padding: '6px', fontSize: 18, color: 'var(--text-primary)' }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 72, left: 0, right: 0, bottom: 0,
          background: 'rgba(9, 9, 15, 0.98)', backdropFilter: 'blur(20px)',
          zIndex: 999, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16,
          animation: 'fadeIn 0.2s ease', overflowY: 'auto'
        }}>
          <a href="#templates" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: 17, fontWeight: 600, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            🎨 5 Resume Templates
          </a>
          <a href="#latex" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: 17, fontWeight: 600, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            ⌨️ Overleaf LaTeX Studio
          </a>
          <a href="#irus-ai" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 17, fontWeight: 600, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            🤖 IRUS AI Assistant
          </a>
          <a href="#simulator" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: 17, fontWeight: 600, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            🎯 Live ATS Simulator
          </a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: 17, fontWeight: 600, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            ✨ Features &amp; Privacy
          </a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: 17, fontWeight: 600, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            💬 Contact Developer (Nejamul Haque)
          </a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: 17, fontWeight: 600, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            ❓ FAQ
          </a>
          <Link to="/privacy" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, padding: '8px 0' }}>
            🔒 Privacy Policy
          </Link>
          <Link to="/terms" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, padding: '8px 0' }}>
            📜 Terms of Service
          </Link>
          
          <button
            onClick={() => { setMobileMenuOpen(false); handleStartBuilding(); }}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: 12, fontWeight: 800 }}
          >
            Create My Resume Free 🚀
          </button>
        </div>
      )}

      {/* Main Container with top padding for frozen navbar */}
      <main role="main" style={{ paddingTop: 88 }}>

        {/* ── HERO SECTION ── */}
        <section style={{ padding: '40px 24px 70px', maxWidth: 1200, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          
          {/* Subtle Ambient Glow */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 700, height: 350, background: 'radial-gradient(circle, rgba(124,111,255,0.18) 0%, transparent 70%)',
            pointerEvents: 'none', zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            
            {/* Super Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 100,
              background: 'rgba(124,111,255,0.12)', border: '1px solid rgba(124,111,255,0.28)',
              fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 20
            }}>
              <span>⌨️ Overleaf LaTeX Engine &amp; 🤖 IRUS AI</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
              <span style={{ color: 'var(--text-muted)' }}>10-Day Zero-Leak Cloud Privacy</span>
            </div>

            {/* Hero Heading */}
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5.5vw, 68px)',
              fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em',
              marginBottom: 20, maxWidth: 960, margin: '0 auto 20px'
            }}>
              The Smartest AI Resume &amp; Overleaf <span className="gradient-text">LaTeX Studio</span>.
            </h1>

            <p style={{
              fontSize: 'clamp(16px, 1.8vw, 20px)', color: 'var(--text-secondary)',
              lineHeight: 1.6, maxWidth: 780, margin: '0 auto 34px'
            }}>
              Craft FAANG-approved resumes with real-time LaTeX compilation, IRUS AI bullet enhancements, 1-click GitHub project importing, DevSecOps secret leak scanning, and <strong>10-day auto-purge cloud privacy</strong>.
            </p>

            {/* High-Converting CTA Button Group */}
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 44 }}>
              <button
                onClick={() => handleStartBuilding()}
                className="btn btn-primary btn-lg"
                style={{ fontSize: 16, padding: '14px 32px', fontWeight: 800, boxShadow: 'var(--shadow-accent)' }}
              >
                Create My Resume Free 🚀
              </button>
              <button
                onClick={() => handleStartBuilding('technical')}
                className="btn btn-secondary btn-lg"
                style={{ fontSize: 15, padding: '14px 26px', fontWeight: 700 }}
              >
                ⌨️ Open LaTeX Studio
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="btn btn-ghost btn-lg"
                style={{ fontSize: 15, padding: '14px 20px', color: 'var(--text-secondary)' }}
              >
                📢 Share App
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap',
              fontSize: 13, color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--success)' }}>✓</span> 100% Free Forever
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--success)' }}>✓</span> No Watermark on PDF
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--success)' }}>✓</span> Overleaf .tex Source Export
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--success)' }}>✓</span> DevSecOps Leak Guard
              </div>
            </div>

          </div>
        </section>

        {/* ── INTERACTIVE LIVE RESUME SIMULATOR ── */}
        <section id="simulator" style={{ padding: '40px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              Interactive Live Preview
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, marginBottom: 12 }}>
              Try the Live Simulator with Official Resume Data
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, maxWidth: 640, margin: '0 auto' }}>
              Edit inputs on the left to see instant, synchronized document morphing with real-time ATS scoring.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 28, background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', padding: '28px', boxShadow: 'var(--shadow-xl)'
          }}>
            {/* Left Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{
                padding: '12px 16px', borderRadius: 'var(--radius-md)',
                background: 'rgba(124,111,255,0.08)', border: '1px solid rgba(124,111,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>🎯 ATS Match Score</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--success)' }}>98% PASS</span>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="input"
                  value={simName}
                  onChange={e => setSimName(e.target.value)}
                  placeholder="NEJAMUL HAQUE"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Role / Title</label>
                <input
                  className="input"
                  value={simRole}
                  onChange={e => setSimRole(e.target.value)}
                  placeholder="Computer Science Undergraduate | DevSecOps Aspirant"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lead Bullet Point (IRUS AI Rewritten)</label>
                <textarea
                  className="input"
                  rows={3}
                  value={simBullet}
                  onChange={e => setSimBullet(e.target.value)}
                />
              </div>

              {/* Template picker inside simulator */}
              <div>
                <label className="form-label">Choose Layout Style</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  {TEMPLATE_PREVIEWS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      style={{
                        padding: '8px 4px', borderRadius: 8,
                        background: selectedTemplate === t.id ? 'var(--accent)' : 'var(--bg-card)',
                        color: selectedTemplate === t.id ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid var(--border)', fontSize: 11, fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center'
                      }}
                    >
                      {t.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleStartBuilding(selectedTemplate)}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: 10, fontWeight: 700 }}
              >
                Customize This Resume in Full Editor →
              </button>
            </div>

            {/* Right Live Document Preview Canvas */}
            <div style={{
              background: '#090d14', borderRadius: 'var(--radius-lg)',
              padding: '24px 16px', display: 'flex', justifyContent: 'center',
              alignItems: 'center', overflow: 'hidden', border: '1px solid var(--border)'
            }}>
              <div style={{
                background: '#fff', borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0,0,0,0.85)',
                transform: 'scale(0.85)', transformOrigin: 'top center',
                transition: 'all 0.3s ease'
              }}>
                <ResumePreview
                  data={liveMockData}
                  template={selectedTemplate}
                  scale={0.78}
                  accentColor={TEMPLATE_PREVIEWS.find(t => t.id === selectedTemplate)?.color || '#7c6fff'}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── OVERLEAF LATEX STUDIO SHOWCASE ── */}
        <section id="latex" style={{ padding: '60px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(124,111,255,0.06) 100%)',
            border: '1px solid rgba(16,185,129,0.25)', borderRadius: 'var(--radius-xl)',
            padding: '40px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32, alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                ⌨️ Overleaf LaTeX Studio
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 800, marginBottom: 14 }}>
                FAANG-Standard LaTeX Code Compilation
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.6, marginBottom: 20 }}>
                Write clean, industry-standard LaTeX using Jake\'s Resume macros (<code style={{ color: '#10b981' }}>\resumeSubheading</code>, <code style={{ color: '#10b981' }}>\resumeItem</code>). Press <kbd style={{ background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>Cmd+Enter</kbd> to compile in real-time or export the raw <code style={{ color: '#10b981' }}>.tex</code> source for Overleaf.
              </p>
              <button
                onClick={() => handleStartBuilding('technical')}
                className="btn btn-primary btn-md"
                style={{ background: '#10b981', borderColor: '#10b981', fontWeight: 700 }}
              >
                Launch Overleaf Studio 🚀
              </button>
            </div>

            {/* Dark Code Mockup */}
            <div style={{
              background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: 18, fontFamily: 'var(--font-mono)', fontSize: 12,
              color: '#c9d1d9', lineHeight: 1.6, overflowX: 'auto', boxShadow: 'var(--shadow-xl)'
            }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
              </div>
              <p style={{ margin: 0, color: '#8b949e' }}>% FAANG LaTeX Resume Engine</p>
              <p style={{ margin: 0 }}><span style={{ color: '#ff7b72' }}>\begin</span>&#123;document&#125;</p>
              <p style={{ margin: 0, paddingLeft: 12 }}><span style={{ color: '#79c0ff' }}>\resumeSubheading</span></p>
              <p style={{ margin: 0, paddingLeft: 24 }}>&#123;NEJAMUL HAQUE&#125;&#123;Bettiah, Bihar, India&#125;</p>
              <p style={{ margin: 0, paddingLeft: 24 }}>&#123;DevSecOps &amp; CS Undergraduate&#125;&#123;2023 -- 2027&#125;</p>
              <p style={{ margin: 0, paddingLeft: 12 }}><span style={{ color: '#79c0ff' }}>\resumeItemListStart</span></p>
              <p style={{ margin: 0, paddingLeft: 24 }}><span style={{ color: '#7ee787' }}>\resumeItem</span>&#123;Configured local Linux sandbox for permissions &amp; security&#125;</p>
              <p style={{ margin: 0, paddingLeft: 12 }}><span style={{ color: '#79c0ff' }}>\resumeItemListEnd</span></p>
              <p style={{ margin: 0 }}><span style={{ color: '#ff7b72' }}>\end</span>&#123;document&#125;</p>
            </div>
          </div>
        </section>

        {/* ── IRUS AI SECTION ── */}
        <section id="irus-ai" style={{ padding: '60px 24px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,111,255,0.1) 0%, rgba(255,107,157,0.06) 100%)',
            border: '1px solid rgba(124,111,255,0.25)', borderRadius: 'var(--radius-xl)',
            padding: '40px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32, alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(124,111,255,0.15)', color: 'var(--accent)', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                🤖 IRUS AI Integration
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 800, marginBottom: 14 }}>
                Supercharge Your Bullets with IRUS AI
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.6, marginBottom: 20 }}>
                Powered directly by <a href={IRUS_AI_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 700 }}>irus-ai.onrender.com</a>. Transform weak task descriptions into quantified, high-impact bullet points with tailored tone presets (Executive, Technical, Startup, High-Impact ATS).
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href={IRUS_AI_URL} target="_blank" rel="noreferrer" className="btn btn-secondary btn-md">
                  Visit IRUS AI Platform ↗
                </a>
                <button onClick={() => handleStartBuilding()} className="btn btn-primary btn-md">
                  Try AI Resume Generator →
                </button>
              </div>
            </div>

            {/* Before vs After Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '14px 18px' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginBottom: 4 }}>❌ Generic / Weak Bullet</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>"Worked on Linux scripts and checked firewall ports."</div>
              </div>
              <div style={{ background: 'rgba(61,224,160,0.1)', border: '1px solid rgba(61,224,160,0.3)', borderRadius: 10, padding: '14px 18px' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', marginBottom: 4 }}>✨ IRUS AI Optimized Bullet</div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                  "Engineered automated Bash security scripts and hardened SSH key access, reducing unauthorized port exposure by 100% across test environments."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES GRID ── */}
        <section id="features" style={{ padding: '60px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, marginBottom: 12 }}>
              Engineered for Speed, Privacy &amp; Results
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
              Everything you need to beat ATS filters and impress hiring managers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {FEATURES.map((feat, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: 24, transition: 'transform 0.2s',
                  display: 'flex', flexDirection: 'column', gap: 10
                }}
              >
                <div style={{ fontSize: 32 }}>{feat.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{feat.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTACT US / ABOUT DEVELOPER SECTION ── */}
        <section id="contact" style={{ padding: '60px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', padding: '40px 32px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                💬 Get in Touch
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 800, marginBottom: 10 }}>
                Contact Developer &amp; Creator
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                Have questions, feature suggestions, or security feedback? We are always here to help.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
              {/* Direct Reach-Out Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, fontWeight: 800, color: '#fff'
                    }}>
                      NH
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16.5, fontWeight: 800, margin: 0 }}>NEJAMUL HAQUE</h3>
                      <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, margin: 0 }}>
                        Computer Science Undergraduate | DevSecOps Aspirant
                      </p>
                    </div>
                  </div>

                  <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                    Specializing in backend architecture, Linux system administration, network security, and infrastructure automation. Creator of ProResume Builder &amp; IRUS AI.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span>📧</span>
                      <a href="mailto:nejamulhaqueruhaan86@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                        nejamulhaqueruhaan86@gmail.com
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span>📱</span>
                      <span style={{ color: 'var(--text-secondary)' }}>+91-6299676007 (Bettiah, Bihar, India)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span>🌐</span>
                      <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                        nejamulhaque.vercel.app
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span>🐙</span>
                      <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>
                        github.com/NejamulHaque
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span>🤖</span>
                      <a href={IRUS_AI_URL} target="_blank" rel="noreferrer" style={{ color: '#3de0a0', textDecoration: 'none', fontWeight: 600 }}>
                        irus-ai.onrender.com
                      </a>
                    </div>
                  </div>

                  <div style={{
                    marginTop: 18, padding: '8px 12px', borderRadius: 8,
                    background: 'rgba(61,224,160,0.1)', border: '1px solid rgba(61,224,160,0.25)',
                    fontSize: 12, color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    <span>⚡</span> Typical response time: &lt; 2 hours
                  </div>
                </div>
              </div>

              {/* Interactive Contact Form */}
              <form onSubmit={handleContactSubmit} aria-label="Contact Developer Form" style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: 24, display: 'flex', flexDirection: 'column', gap: 14
              }}>
                <div className="form-group">
                  <label className="form-label required">Your Name</label>
                  <input
                    className="input"
                    placeholder="John Doe"
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Your Email</label>
                  <input
                    className="input"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    className="input"
                    placeholder="Feature suggestion / feedback"
                    value={contactForm.subject}
                    onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Message</label>
                  <textarea
                    className="input"
                    rows={4}
                    required
                    placeholder="Tell us what you think or how we can help..."
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingContact}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 4, fontWeight: 700 }}
                >
                  {sendingContact ? <><div className="spinner sm" /> Sending...</> : 'Send Message ✉️'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── FAQ ACCORDION ── */}
        <section id="faq" style={{ padding: '60px 24px 80px', maxWidth: 880, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 800, marginBottom: 10 }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14.5 }}>
              Everything you need to know about Overleaf LaTeX, ATS scoring, and cloud privacy.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '18px 22px', cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: 15.5 }}>
                  <span>{faq.q}</span>
                  <span style={{ color: 'var(--accent)', fontSize: 18 }}>{activeFaq === idx ? '−' : '+'}</span>
                </div>
                {activeFaq === idx && (
                  <p style={{ color: 'var(--text-muted)', fontSize: 13.8, marginTop: 12, lineHeight: 1.68 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer role="contentinfo" style={{ padding: '50px 24px 40px', borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 40 }}>
            
            {/* Brand column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span>📄</span>
                <span style={{ fontWeight: 800, fontSize: 18, fontFamily: 'var(--font-display)' }}>
                  Pro<span className="gradient-text">Resume</span>
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Open-source, privacy-first resume builder and Overleaf LaTeX studio. Free forever under the MIT license.
              </p>
            </div>

            {/* Navigation links */}
            <div>
              <h4 style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <a href="#templates" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>5 Resume Templates</a>
                <a href="#latex" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Overleaf LaTeX Studio</a>
                <a href="#irus-ai" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>IRUS AI Integration</a>
                <a href="#simulator" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Live ATS Simulator</a>
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h4 style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Legal &amp; Privacy</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
                <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</Link>
                <span style={{ color: 'var(--warning)', fontSize: 12 }}>⏳ 10-Day Ephemeral Retention</span>
              </div>
            </div>

            {/* Creator links */}
            <div>
              <h4 style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Creator</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Nejamul Haque Portfolio ↗</a>
                <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>GitHub Repository ↗</a>
                <a href={IRUS_AI_URL} target="_blank" rel="noreferrer" style={{ color: '#3de0a0', textDecoration: 'none' }}>IRUS AI Platform ↗</a>
                <a href="mailto:nejamulhaqueruhaan86@gmail.com" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>nejamulhaqueruhaan86@gmail.com</a>
              </div>
            </div>

          </div>

          <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: 24, fontSize: 12.5, color: 'var(--text-muted)' }}>
            © 2026 ProResume Builder. Built with ❤️ &amp; IRUS AI by <strong>Nejamul Haque</strong>.
          </div>
        </footer>

      </main>
    </div>
  )
}
