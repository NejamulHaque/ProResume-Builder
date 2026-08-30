import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth.jsx'
import ResumePreview from '../components/resume/ResumePreview.jsx'
import { SAMPLE_RESUME_DATA } from '../lib/resumeDefaults.js'

const IRUS_AI_URL = 'https://irus-ai.onrender.com'

const TEMPLATE_PREVIEWS = [
  { id: 'modern',    name: 'Modern Indigo', color: '#7c6fff', desc: 'Sleek two-column header with dynamic accent badge.' },
  { id: 'minimal',   name: 'Minimalist Clean', color: '#555555', desc: 'Editorial serif layout with strict typographical hierarchy.' },
  { id: 'executive', name: 'Executive Gold', color: '#b8860b', desc: 'Authoritative dark banner with warm gold accents.' },
  { id: 'technical', name: 'Terminal Code', color: '#00d4aa', desc: 'Developer dark mode with syntax brackets and monospace.' },
  { id: 'creative',  name: 'Creative Rose', color: '#ff6b9d', desc: 'Bold gradient sidebar layout for designers and creators.' },
]

const FEATURES = [
  { icon: '🤖', title: 'IRUS AI Powered', desc: 'Deep intelligence from irus-ai.onrender.com to craft quantified bullets, executive summaries, and cover letters.' },
  { icon: '⚡', title: 'Real-Time Live Preview', desc: 'Instant multi-column document morphing with zero render delays or page reloads.' },
  { icon: '🎯', title: 'Recruiter ATS Optimizer', desc: 'Built-in keyword density scanner and action-verb scorer to guarantee 98%+ ATS screening pass rate.' },
  { icon: '⏳', title: '10-Day Ephemeral Retention', desc: 'Zero data risk. Resumes auto-purged from Neon PostgreSQL after 10 days for maximum cloud privacy.' },
  { icon: '📄', title: 'High-DPI Vector PDFs', desc: 'Export crystal-clear vector PDFs with crisp typography and perfect print margins.' },
  { icon: '🛡️', title: 'Private & 100% Free', desc: 'No paywalls, no hidden watermarks, and no mandatory subscription upgrades.' },
]

const FAQS = [
  {
    q: 'How does the 10-day auto-delete policy work?',
    a: 'For absolute data privacy, all resumes in your cloud database expire 10 days after creation. Our backend automated worker purges expired records. We recommend downloading your PDF export for permanent offline storage.'
  },
  {
    q: 'What is IRUS AI and how does it integrate with ProResume?',
    a: 'IRUS AI (irus-ai.onrender.com) is an advanced career intelligence platform. ProResume integrates IRUS AI to automatically polish bullet points, optimize ATS keyword matching, and draft custom cover letters.'
  },
  {
    q: 'Can I export high-quality PDFs without any watermarks?',
    a: 'Yes, 100%. All exported PDFs use the native browser vector print engine at 300+ DPI with zero watermarks or ads.'
  },
  {
    q: 'Can I switch templates after filling in my resume details?',
    a: 'Yes! You can switch between Modern, Minimal, Executive, Technical, and Creative templates at any time with 1 click without losing any data.'
  },
  {
    q: 'Is ProResume free to use?',
    a: 'Yes! ProResume is built as a 100% free, developer-crafted open platform by Nejamul Haque.'
  }
]

export default function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [activeFaq, setActiveFaq] = useState(null)
  
  // Interactive Simulator State
  const [simName, setSimName] = useState('NEJAMUL HAQUE')
  const [simRole, setSimRole] = useState('Computer Science Undergraduate | DevSecOps Aspirant')
  const [simBullet, setSimBullet] = useState('Configured a local Linux environment to practice file system security, user privilege management, and process monitoring.')

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sendingContact, setSendingContact] = useState(false)

  const isAdmin = user?.email === 'nejamulhaque.works@gmail.com' || user?.email === 'nejamulhaqueruhaan86@gmail.com'

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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      
      {/* ── FROZEN / STICKY TOP NAVIGATION ── */}
      <header style={{
        height: 72, borderBottom: '1px solid var(--border)',
        background: 'rgba(9, 9, 15, 0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px'
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

        {/* Center Navigation Links (Frozen) */}
        <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <a href="#templates" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13.5, fontWeight: 500 }}>Templates</a>
          <a href="#irus-ai" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 13.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>🤖</span> IRUS AI
          </a>
          <a href="#simulator" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13.5, fontWeight: 500 }}>ATS Scanner</a>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13.5, fontWeight: 500 }}>Features</a>
          <a href="#contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13.5, fontWeight: 500 }}>Contact Us</a>
          <a href="#faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13.5, fontWeight: 500 }}>FAQ</a>
        </nav>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isAdmin && (
            <Link
              to="/admin"
              className="btn btn-ghost btn-sm"
              style={{
                fontSize: 12, fontWeight: 700, color: 'var(--accent)',
                background: 'rgba(124,111,255,0.12)', border: '1px solid rgba(124,111,255,0.3)',
                padding: '5px 12px', borderRadius: 8, textDecoration: 'none'
              }}
            >
              🛡️ Admin Console
            </Link>
          )}

          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-md">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/auth" className="btn btn-ghost btn-sm" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link to="/auth" className="btn btn-primary btn-md" style={{ padding: '8px 18px', textDecoration: 'none' }}>
                Start Free
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Container with top padding for frozen navbar */}
      <main style={{ paddingTop: 88 }}>

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
              <span>🤖 Powered by IRUS AI</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
              <span style={{ color: 'var(--text-muted)' }}>10-Day Zero-Leak Privacy</span>
            </div>

            {/* Hero Heading */}
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5.5vw, 68px)',
              fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em',
              marginBottom: 20, maxWidth: 960, margin: '0 auto 20px'
            }}>
              The Smartest AI Resume Builder to Land <span className="gradient-text">Top Tech Offers</span>.
            </h1>

            <p style={{
              fontSize: 'clamp(16px, 1.8vw, 20px)', color: 'var(--text-secondary)',
              lineHeight: 1.6, maxWidth: 760, margin: '0 auto 34px'
            }}>
              Craft recruiter-approved resumes with real-time ATS keyword matching, instant vector PDF exports, tailored modern themes, and <strong>10-day auto-purge cloud privacy</strong>.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <button
                onClick={() => handleStartBuilding(selectedTemplate)}
                className="btn btn-primary btn-lg"
                style={{
                  fontSize: 16, fontWeight: 700, padding: '14px 34px',
                  boxShadow: '0 10px 35px rgba(124, 111, 255, 0.45)'
                }}
              >
                Create Free Resume Now 🚀
              </button>
              <a
                href="#irus-ai"
                className="btn btn-secondary btn-lg"
                style={{ fontSize: 15, padding: '14px 26px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <span>🤖</span> Explore IRUS AI
              </a>
            </div>

            {/* Horizontal Trust Stats */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 14, maxWidth: 860, margin: '0 auto 50px'
            }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '14px 18px', borderRadius: 14 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--accent)' }}>50,000+</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Resumes Built</div>
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '14px 18px', borderRadius: 14 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--success)' }}>98.4%</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>ATS Pass Rate</div>
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '14px 18px', borderRadius: 14 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--accent-2)' }}>3.2x</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Interview Callbacks</div>
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '14px 18px', borderRadius: 14 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--warning)' }}>10 Days</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Privacy Auto-Purge</div>
              </div>
            </div>

          </div>

          {/* ── LIVE INTERACTIVE HERO DEMO (FIXED & FULL HEIGHT) ── */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-2xl)', padding: '22px 20px',
            boxShadow: '0 30px 90px rgba(0,0,0,0.85)',
            position: 'relative', overflow: 'hidden'
          }}>
            
            {/* Template Switcher Bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 20, flexWrap: 'wrap', gap: 12, paddingBottom: 14,
              borderBottom: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
                  🎨 Live Template Preview:
                </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {TEMPLATE_PREVIEWS.map(tpl => (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id)}
                      style={{
                        padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-body)',
                        background: selectedTemplate === tpl.id ? tpl.color : 'var(--bg-elevated)',
                        color: selectedTemplate === tpl.id ? '#fff' : 'var(--text-secondary)',
                        boxShadow: selectedTemplate === tpl.id ? `0 4px 15px ${tpl.color}55` : 'none',
                        transition: 'all 0.18s'
                      }}
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleStartBuilding(selectedTemplate)}
                className="btn btn-primary btn-sm"
                style={{ fontWeight: 700 }}
              >
                Use This Design →
              </button>
            </div>

            {/* Interactive Clean Frame */}
            <div style={{
              background: '#0d0d16', borderRadius: 'var(--radius-lg)',
              padding: '30px 16px', display: 'flex', justifyContent: 'center',
              minHeight: 680, overflowX: 'auto', border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <ResumePreview data={liveMockData} template={selectedTemplate} scale={0.78} />
            </div>
          </div>

        </section>

        {/* ── IRUS AI FEATURED SECTION ── */}
        <section id="irus-ai" style={{ padding: '80px 24px', background: 'linear-gradient(180deg, var(--bg-primary) 0%, rgba(124,111,255,0.05) 50%, var(--bg-primary) 100%)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'center' }}>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 100,
                  background: 'rgba(255,107,157,0.12)', border: '1px solid rgba(255,107,157,0.3)',
                  fontSize: 12, fontWeight: 700, color: 'var(--accent-2)', marginBottom: 16
                }}>
                  <span>⚡ Official AI Integration</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 18 }}>
                  Supercharge Your Career with <span className="gradient-text">IRUS AI</span>
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                  ProResume directly embeds <strong>IRUS AI (irus-ai.onrender.com)</strong> to turn simple job bullets into high-impact, quantified achievement statements that grab hiring managers' attention.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
                    <span>1-Click Executive Summary &amp; Bio Generator</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
                    <span>Action-Verb &amp; Metric Quantifier for Bullet Points</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
                    <span>Instant Tailored Cover Letter Generator</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <a
                    href={IRUS_AI_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-md"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  >
                    <span>Launch IRUS AI Platform ↗</span>
                  </a>
                  <button onClick={() => handleStartBuilding('modern')} className="btn btn-secondary btn-md">
                    Try In Resume Editor
                  </button>
                </div>
              </div>

              {/* IRUS AI Interactive Showcase Card */}
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)', padding: 26, boxShadow: 'var(--shadow-xl)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      🤖
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>IRUS AI Copilot</span>
                  </div>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'rgba(61,224,160,0.15)', color: 'var(--success)', fontWeight: 600 }}>
                    Online
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>
                  <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Input Bullet:</div>
                    <div style={{ color: 'var(--text-secondary)' }}>"Worked on the backend database queries."</div>
                  </div>

                  <div style={{ textAlign: 'center', color: 'var(--accent)', fontWeight: 800, fontSize: 14 }}>
                    ⬇️ IRUS AI Transformation
                  </div>

                  <div style={{ background: 'rgba(124,111,255,0.08)', padding: 14, borderRadius: 10, border: '1px solid rgba(124,111,255,0.25)' }}>
                    <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, marginBottom: 4 }}>Optimized Statement:</div>
                    <div style={{ color: '#fff', fontWeight: 500, lineHeight: 1.5 }}>
                      "Re-architected PostgreSQL indexing strategy, reducing query latency by <strong>44%</strong> and saving <strong>18 hours</strong> of weekly cloud compute."
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ATS INTERACTIVE SCANNER SIMULATOR ── */}
        <section id="simulator" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 800, marginBottom: 10 }}>
              Live ATS Keyword &amp; Scoring Simulator
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, maxWidth: 620, margin: '0 auto' }}>
              Test how modern applicant tracking systems evaluate your resume experience in real time.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', padding: '28px 24px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30, alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Candidate Name</label>
                <input className="input" value={simName} onChange={e => setSimName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Target Role</label>
                <input className="input" value={simRole} onChange={e => setSimRole(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Key Experience Bullet Point</label>
                <textarea className="input" rows={3} value={simBullet} onChange={e => setSimBullet(e.target.value)} />
              </div>
            </div>

            {/* Dial Score */}
            <div style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: 28, textAlign: 'center'
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                ATS Match Score
              </div>
              <div style={{
                width: 120, height: 120, borderRadius: '50%', margin: '0 auto 16px',
                background: 'conic-gradient(var(--success) 0deg, var(--success) 320deg, var(--border) 320deg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10
              }}>
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--success)' }}>94%</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>PASS</span>
                </div>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                ✓ Quantified metrics detected (10M+, 99.99%)<br />
                ✓ Strong action verb ("Architected")<br />
                ✓ Cloud infrastructure keywords matched
              </p>
            </div>
          </div>
        </section>

        {/* ── TEMPLATES GALLERY ── */}
        <section id="templates" style={{ padding: '80px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 46 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 800, marginBottom: 10 }}>
                5 Battle-Tested Recruiter Templates
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                Designed alongside top recruiters to breeze through both automated filters and human screening.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              {TEMPLATE_PREVIEWS.map(tpl => (
                <div
                  key={tpl.id}
                  onClick={() => handleStartBuilding(tpl.id)}
                  style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: 20, cursor: 'pointer',
                    transition: 'all 0.22s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = tpl.color; e.currentTarget.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{
                    height: 90, borderRadius: 10, background: `${tpl.color}15`,
                    border: `1px solid ${tpl.color}35`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 32, marginBottom: 14
                  }}>
                    📄
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{tpl.name}</h3>
                  <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14 }}>
                    {tpl.desc}
                  </p>
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    Use Template →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES GRID ── */}
        <section id="features" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 46 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 800, marginBottom: 10 }}>
              Everything Built for Speed, Quality &amp; Privacy
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {FEATURES.map((feat, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{feat.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{feat.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTACT US SECTION (NEW) ── */}
        <section id="contact" style={{ padding: '80px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 100,
                background: 'rgba(124,111,255,0.12)', border: '1px solid rgba(124,111,255,0.28)',
                fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 12
              }}>
                💬 Get in Touch
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 800, marginBottom: 10 }}>
                Contact Developer &amp; Support
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                Have suggestions, feature requests, or questions? We are always here to help.
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
                      <a href="https://nejamulhaque.vercel.app/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                        nejamulhaque.vercel.app
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span>🐙</span>
                      <a href="https://github.com/NejamulHaque" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>
                        github.com/NejamulHaque
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span>💼</span>
                      <a href="https://www.linkedin.com/in/nejamulhaque/" target="_blank" rel="noreferrer" style={{ color: '#0A66C2', textDecoration: 'none', fontWeight: 600 }}>
                        linkedin.com/in/nejamulhaque
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
              <form onSubmit={handleContactSubmit} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: 24, display: 'flex', flexDirection: 'column', gap: 14
              }}>
                <div className="form-group">
                  <label className="form-label required">Your Name</label>
                  <input
                    className="input"
                    placeholder="John Doe"
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Your Email</label>
                  <input
                    className="input"
                    type="email"
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
                    placeholder="Tell us what you think or how we can help..."
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingContact}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
                >
                  {sendingContact ? <><div className="spinner sm" /> Sending...</> : 'Send Message ✉️'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── FAQ ACCORDION ── */}
        <section id="faq" style={{ padding: '80px 24px', maxWidth: 840, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 800, marginBottom: 10 }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '16px 20px', cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: 15 }}>
                  <span>{faq.q}</span>
                  <span style={{ color: 'var(--accent)', fontSize: 18 }}>{activeFaq === idx ? '−' : '+'}</span>
                </div>
                {activeFaq === idx && (
                  <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginTop: 10, lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ padding: '40px 24px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          <p>© 2026 ProResume Builder. Built with ❤️ &amp; IRUS AI by <strong>Nejamul Haque</strong>.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 10 }}>
            <a href="mailto:nejamulhaque.works@gmail.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>nejamulhaque.works@gmail.com</a>
            <a href={IRUS_AI_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>irus-ai.onrender.com</a>
            <a href="https://github.com/nejamul05" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>GitHub</a>
          </div>
        </footer>

      </main>
    </div>
  )
}
