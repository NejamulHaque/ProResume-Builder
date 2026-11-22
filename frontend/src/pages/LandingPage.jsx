import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth.jsx'
import ResumePreview from '../components/resume/ResumePreview.jsx'
import { SAMPLE_RESUME_DATA } from '../lib/resumeDefaults.js'
import { useSeo } from '../lib/seo.js'
import SocialShareModal from '../components/ui/SocialShareModal.jsx'
import { PORTFOLIO_URL, GITHUB_REPO_URL, IRUS_AI_URL, CONTACT_EMAIL, ADMIN_EMAIL } from '../lib/constants.js'

const TEMPLATE_PREVIEWS = [
  { id: 'modern',    name: 'Modern Indigo', color: '#2997ff', badge: 'Popular', desc: 'Sleek two-column header with dynamic accent badge for software engineers.' },
  { id: 'minimal',   name: 'Minimalist Clean', color: '#86868b', badge: 'Apple Style', desc: 'Editorial serif layout with strict typographical hierarchy and maximum whitespace.' },
  { id: 'executive', name: 'Executive Gold', color: '#e5a93c', badge: 'Leadership', desc: 'Authoritative dark banner with warm gold accents for senior leaders and managers.' },
  { id: 'technical', name: 'Terminal Code', color: '#30d158', badge: 'DevSecOps', desc: 'Developer dark aesthetic with syntax brackets, command prompts, and monospace typography.' },
  { id: 'creative',  name: 'Creative Rose', color: '#ff375f', badge: 'Design', desc: 'Balanced sidebar layout with vibrant accents tailored for product designers and creators.' },
]

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
      </svg>
    ),
    title: 'Overleaf LaTeX Engine',
    desc: 'Side-by-side Overleaf LaTeX code editor with FAANG macros (\\resumeSubheading) and instant 1-click .tex source export.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><rect x="4" y="8" width="16" height="12" rx="2"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="M9 17h6"/>
      </svg>
    ),
    title: 'IRUS AI Intelligence',
    desc: 'Integrated with irus-ai.onrender.com to craft quantified action-verb bullets, executive summaries, and targeted cover letters.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>
    ),
    title: '1-Click GitHub Importer',
    desc: 'Instantly import your public GitHub repositories, stars, language stacks, and descriptions into structured resume project entries.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'DevSecOps Security Audit',
    desc: 'Automated pre-flight scanner audits your resume to ensure zero accidental leaks of API tokens, SSH keys, or private IP addresses.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    title: 'Recruiter ATS Optimizer',
    desc: 'Real-time keyword density scoring and action-verb frequency analysis to ensure your resume passes ATS filters with 98%+ rate.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: '10-Day Ephemeral Retention',
    desc: 'Maximum candidate privacy. Stored resumes are automatically purged from the cloud database after 10 days with zero data sales.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: 'High-DPI Vector PDFs',
    desc: 'Generates vector PDFs using native browser printing with crystal-clear vector text, zero rasterization blur, and no watermarks.'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    title: '100% Free & Open-Source',
    desc: 'No hidden paywalls, no mandatory premium subscriptions, and no export limits. Completely free and open under the MIT License.'
  },
]

const FAQS = [
  {
    q: 'How does the Overleaf LaTeX Studio work?',
    a: 'ProResume features a bi-directional Overleaf LaTeX compiler. You can edit via visual form inputs or write standard LaTeX code with FAANG / Jake\'s resume macros (\\resumeSubheading, \\resumeItem). Changes compile live, and you can export the raw .tex source code anytime.'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Interactive Simulator State
  const [simName, setSimName] = useState('NEJAMUL HAQUE')
  const [simRole, setSimRole] = useState('Computer Science Undergraduate | DevSecOps Aspirant')
  const [simBullet, setSimBullet] = useState('Configured a local Linux environment to practice file system security, user privilege management, and process monitoring.')

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sendingContact, setSendingContact] = useState(false)

  const isAdmin = user?.email === ADMIN_EMAIL || user?.email === 'nejamulhaqueruhaan86@gmail.com'

  useSeo({
    title: 'ATS Resume Architect & Overleaf LaTeX Studio',
    description: 'Build FAANG-grade ATS resumes with Overleaf LaTeX compilation, IRUS AI bullet enhancements, modern templates, and 10-day ephemeral cloud privacy. 100% Free.',
    canonical: 'https://proresume-six.vercel.app/'
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
    }, 600)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      
      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={GITHUB_REPO_URL}
      />

      {/* ── APPLE-STYLE FROSTED TOP NAVIGATION ── */}
      <header role="banner" style={{
        height: 56,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: '#ffffff',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: -0.5
          }}>
            P
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, letterSpacing: -0.4 }}>
            Pro<span style={{ color: 'var(--accent)' }}>Resume</span>
          </span>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav className="desktop-only" aria-label="Main Navigation" style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <a href="#templates" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'color 0.15s' }}>
            Templates
          </a>
          <a href="#simulator" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'color 0.15s' }}>
            Simulator
          </a>
          <a href="#latex" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'color 0.15s' }}>
            LaTeX Studio
          </a>
          <a href="#irus-ai" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'color 0.15s', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: 'var(--accent)' }}>●</span> IRUS AI
          </a>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'color 0.15s' }}>
            Features
          </a>
          <a href="#contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'color 0.15s' }}>
            Contact
          </a>
          <a href="#faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'color 0.15s' }}>
            FAQ
          </a>
        </nav>

        {/* Right Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setShowShareModal(true)}
            className="btn btn-ghost btn-sm desktop-only"
            style={{ color: 'var(--text-secondary)', fontSize: 12.5 }}
            title="Share ProResume"
          >
            Share
          </button>

          {isAdmin && (
            <Link
              to="/admin"
              className="btn btn-secondary btn-sm desktop-only"
              style={{ fontSize: 11.5, padding: '4px 10px' }}
            >
              Admin
            </Link>
          )}

          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/auth" className="btn btn-ghost btn-sm desktop-only" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link to="/auth" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-sm mobile-only"
            style={{ padding: '6px 10px', fontSize: 16, color: 'var(--text-primary)' }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 56,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'saturate(180%) blur(24px)',
          zIndex: 999,
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          animation: 'fadeIn 0.2s ease',
          overflowY: 'auto'
        }}>
          <a href="#templates" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: 17, fontWeight: 600, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            Templates
          </a>
          <a href="#simulator" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: 17, fontWeight: 600, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            Interactive Simulator
          </a>
          <a href="#latex" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: 17, fontWeight: 600, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            Overleaf LaTeX Studio
          </a>
          <a href="#irus-ai" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: 17, fontWeight: 600, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            IRUS AI Copilot
          </a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: 17, fontWeight: 600, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            Features
          </a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: 17, fontWeight: 600, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            Contact Creator
          </a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: 17, fontWeight: 600, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            Frequently Asked Questions
          </a>
          <div style={{ display: 'flex', gap: 16, paddingTop: 12 }}>
            <Link to="/privacy" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }}>
              Privacy Policy
            </Link>
            <Link to="/terms" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }}>
              Terms of Service
            </Link>
          </div>
          
          <button
            onClick={() => { setMobileMenuOpen(false); handleStartBuilding(); }}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: 16, fontWeight: 700 }}
          >
            Create My Resume Free →
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main role="main" style={{ paddingTop: 56 }}>

        {/* ── HERO SECTION (Apple Minimal Centered Design) ── */}
        <section style={{
          padding: '80px 24px 70px',
          maxWidth: 1040,
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Subtle Ambient Radial Glow */}
          <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 700,
            height: 380,
            background: 'radial-gradient(circle, rgba(41, 151, 255, 0.12) 0%, transparent 68%)',
            pointerEvents: 'none',
            zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            
            {/* Apple Eyebrow Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 18px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-light)',
              fontSize: 12.5,
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: 24,
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Overleaf LaTeX Studio</span>
              <span>•</span>
              <span>10-Day Ephemeral Retention</span>
            </div>

            {/* Apple Hero Headline */}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 6.2vw, 76px)',
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: '-0.035em',
              marginBottom: 24,
              maxWidth: 960,
              margin: '0 auto 24px',
              color: 'var(--text-primary)'
            }}>
              The resume platform for <span className="gradient-text">precision engineering</span>.
            </h1>

            <p style={{
              fontSize: 'clamp(17px, 2vw, 21px)',
              color: 'var(--text-secondary)',
              lineHeight: 1.55,
              maxWidth: 720,
              margin: '0 auto 38px',
              letterSpacing: '-0.015em'
            }}>
              Craft FAANG-standard resumes with live Overleaf LaTeX compilation, IRUS AI bullet enhancements, 1-click GitHub importing, and <strong>10-day auto-purge cloud privacy</strong>.
            </p>

            {/* Apple CTA Pill Group */}
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 44 }}>
              <button
                onClick={() => handleStartBuilding()}
                className="btn btn-primary btn-lg"
              >
                Create Free Resume →
              </button>
              <a
                href="#templates"
                className="btn btn-secondary btn-lg"
              >
                Explore Templates
              </a>
              <button
                onClick={() => setShowShareModal(true)}
                className="btn btn-ghost btn-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                Share
              </button>
            </div>

            {/* Trust Markers */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 28,
              flexWrap: 'wrap',
              fontSize: 13,
              color: 'var(--text-secondary)',
              letterSpacing: '-0.01em'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ color: 'var(--success)' }}>✓</span> 100% Free &amp; Open Source
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ color: 'var(--success)' }}>✓</span> Zero PDF Watermarks
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ color: 'var(--success)' }}>✓</span> Full Overleaf .tex Export
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ color: 'var(--success)' }}>✓</span> Secret Leak Scanner Guard
              </div>
            </div>

          </div>
        </section>

        {/* ── SECTION 1: TEMPLATES SHOWCASE (#templates) ── */}
        <section id="templates" style={{
          padding: '70px 24px',
          maxWidth: 1140,
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={{
              fontSize: 11.5,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--accent)',
              display: 'inline-block',
              marginBottom: 10
            }}>
              Curated Layouts
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 3.8vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: 14
            }}>
              Engineered for readability. Tailored for success.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 640, margin: '0 auto', letterSpacing: '-0.01em' }}>
              Switch seamlessly between five industry-vetted templates at any moment without ever losing your data.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16
          }}>
            {TEMPLATE_PREVIEWS.map(t => {
              const isSelected = selectedTemplate === t.id
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  style={{
                    background: isSelected ? 'rgba(255, 255, 255, 0.07)' : 'var(--bg-card)',
                    border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: 22,
                    cursor: 'pointer',
                    transition: 'all var(--transition)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isSelected ? '0 10px 30px rgba(41, 151, 255, 0.15)' : 'none'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: t.color }} />
                      <span style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        background: 'rgba(255, 255, 255, 0.12)',
                        color: '#ffffff',
                        fontWeight: 600
                      }}>
                        {t.badge}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>
                      {t.name}
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {t.desc}
                    </p>
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartBuilding(t.id)
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', fontSize: 12 }}
                    >
                      Use Template →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── SECTION 2: INTERACTIVE LIVE RESUME SIMULATOR (#simulator) ── */}
        <section id="simulator" style={{
          padding: '70px 24px 90px',
          maxWidth: 1140,
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={{
              fontSize: 11.5,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--accent)',
              display: 'inline-block',
              marginBottom: 10
            }}>
              Live Document Morphing
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 3.8vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: 14
            }}>
              Experience instant real-time synchronization.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 640, margin: '0 auto', letterSpacing: '-0.01em' }}>
              Adjust live fields below and see the synchronized vector canvas update dynamically with verified ATS scoring.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 28,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: 28,
            boxShadow: 'var(--shadow-lg)'
          }}>
            {/* Left Controls Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(48, 209, 88, 0.08)',
                border: '1px solid rgba(48, 209, 88, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                  ATS Recruiter Screening
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>
                  98% Verified Pass
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="sim-name" className="form-label">Full Name</label>
                <input
                  id="sim-name"
                  className="input"
                  value={simName}
                  onChange={e => setSimName(e.target.value)}
                  placeholder="NEJAMUL HAQUE"
                />
              </div>

              <div className="form-group">
                <label htmlFor="sim-role" className="form-label">Target Role / Subheading</label>
                <input
                  id="sim-role"
                  className="input"
                  value={simRole}
                  onChange={e => setSimRole(e.target.value)}
                  placeholder="Computer Science Undergraduate | DevSecOps Aspirant"
                />
              </div>

              <div className="form-group">
                <label htmlFor="sim-bullet" className="form-label">High-Impact Bullet Point</label>
                <textarea
                  id="sim-bullet"
                  className="input"
                  rows={3}
                  value={simBullet}
                  onChange={e => setSimBullet(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Active Template</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  {TEMPLATE_PREVIEWS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      style={{
                        padding: '8px 4px',
                        borderRadius: 'var(--radius-sm)',
                        background: selectedTemplate === t.id ? 'var(--text-primary)' : 'rgba(255, 255, 255, 0.05)',
                        color: selectedTemplate === t.id ? '#000000' : 'var(--text-secondary)',
                        border: '1px solid var(--border)',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        textAlign: 'center'
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
                style={{ width: '100%', marginTop: 8 }}
              >
                Open in Full Editor →
              </button>
            </div>

            {/* Right Live Canvas Box (macOS Window Chrome Frame) */}
            <div style={{
              background: '#070709',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              {/* Window Chrome Header */}
              <div style={{
                height: 38,
                background: 'rgba(255, 255, 255, 0.03)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                gap: 8
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)', marginLeft: 8 }}>
                  live_preview.pdf
                </span>
              </div>

              {/* Responsive Container for Resume Preview */}
              <div style={{
                flex: 1,
                padding: '20px 12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                overflow: 'auto',
                maxHeight: 560
              }}>
                <div style={{
                  display: 'inline-block',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.85)'
                }}>
                  <ResumePreview
                    data={liveMockData}
                    template={selectedTemplate}
                    scale={0.62}
                    accentColor={TEMPLATE_PREVIEWS.find(t => t.id === selectedTemplate)?.color || '#2997ff'}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: OVERLEAF LATEX STUDIO (#latex) ── */}
        <section id="latex" style={{
          padding: '70px 24px',
          maxWidth: 1140,
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-2xl)',
            padding: '48px 36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 40,
            alignItems: 'center'
          }}>
            <div>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(48, 209, 88, 0.1)',
                color: 'var(--success)',
                fontSize: 11.5,
                fontWeight: 600,
                marginBottom: 16
              }}>
                ⌨️ Overleaf LaTeX Studio
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(26px, 3.2vw, 40px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                marginBottom: 16
              }}>
                FAANG-Standard LaTeX code compilation.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
                Write clean, industry-standard LaTeX utilizing Jake's Resume macros (<code style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>\resumeSubheading</code>, <code style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>\resumeItem</code>). Compile in real-time or export raw <code style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>.tex</code> code directly to Overleaf.
              </p>
              <button
                onClick={() => handleStartBuilding('technical')}
                className="btn btn-primary btn-md"
              >
                Launch LaTeX Studio →
              </button>
            </div>

            {/* Apple macOS Code Terminal Card */}
            <div style={{
              background: '#070709',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{
                height: 38,
                background: 'rgba(255, 255, 255, 0.03)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                gap: 8
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)', marginLeft: 8 }}>
                  resume_architect.tex
                </span>
              </div>
              <div style={{
                padding: '20px 22px',
                fontFamily: 'var(--font-mono)',
                fontSize: 12.5,
                lineHeight: 1.65,
                color: '#e6edf3',
                overflowX: 'auto'
              }}>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>% FAANG Overleaf LaTeX Template</p>
                <p style={{ margin: 0 }}><span style={{ color: '#ff7b72' }}>\begin</span>&#123;document&#125;</p>
                <p style={{ margin: 0, paddingLeft: 14 }}><span style={{ color: '#79c0ff' }}>\resumeSubheading</span></p>
                <p style={{ margin: 0, paddingLeft: 28 }}>&#123;NEJAMUL HAQUE&#125;&#123;Bettiah, Bihar, India&#125;</p>
                <p style={{ margin: 0, paddingLeft: 28 }}>&#123;DevSecOps Aspirant&#125;&#123;2023 -- 2027&#125;</p>
                <p style={{ margin: 0, paddingLeft: 14 }}><span style={{ color: '#79c0ff' }}>\resumeItemListStart</span></p>
                <p style={{ margin: 0, paddingLeft: 28 }}><span style={{ color: '#7ee787' }}>\resumeItem</span>&#123;Engineered automated Bash scripts &amp; hardened SSH keys&#125;</p>
                <p style={{ margin: 0, paddingLeft: 14 }}><span style={{ color: '#79c0ff' }}>\resumeItemListEnd</span></p>
                <p style={{ margin: 0 }}><span style={{ color: '#ff7b72' }}>\end</span>&#123;document&#125;</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: IRUS AI INTEGRATION (#irus-ai) ── */}
        <section id="irus-ai" style={{
          padding: '70px 24px',
          maxWidth: 1140,
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-2xl)',
            padding: '48px 36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 40,
            alignItems: 'center'
          }}>
            <div>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(41, 151, 255, 0.1)',
                color: 'var(--accent)',
                fontSize: 11.5,
                fontWeight: 600,
                marginBottom: 16
              }}>
                🤖 IRUS AI Copilot
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(26px, 3.2vw, 40px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                marginBottom: 16
              }}>
                Transform tasks into quantified accomplishments.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
                Powered directly by <a href={IRUS_AI_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 600 }}>irus-ai.onrender.com</a>. Turn basic responsibilities into punchy, metric-driven achievements tailored for tech recruiters.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href={IRUS_AI_URL} target="_blank" rel="noreferrer" className="btn btn-secondary btn-md">
                  Visit IRUS AI Platform ↗
                </a>
                <button onClick={() => handleStartBuilding()} className="btn btn-primary btn-md">
                  Try AI Bullet Generator →
                </button>
              </div>
            </div>

            {/* Before vs After Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{
                background: 'rgba(255, 69, 58, 0.06)',
                border: '1px solid rgba(255, 69, 58, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px'
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  Before: Generic &amp; Passive
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
                  "Worked on Linux scripts and checked firewall ports."
                </div>
              </div>

              <div style={{
                background: 'rgba(48, 209, 88, 0.08)',
                border: '1px solid rgba(48, 209, 88, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px'
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  After: IRUS AI Quantified Achievement
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.55 }}>
                  "Engineered automated Bash security scripts and hardened SSH access, reducing unauthorized port exposure by 100% across test environments."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: FEATURES BENTO GRID (#features) ── */}
        <section id="features" style={{
          padding: '70px 24px',
          maxWidth: 1140,
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{
              fontSize: 11.5,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--accent)',
              display: 'inline-block',
              marginBottom: 10
            }}>
              Core Capabilities
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 3.8vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: 14
            }}>
              Engineered for speed, security &amp; privacy.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 640, margin: '0 auto', letterSpacing: '-0.01em' }}>
              Everything candidates need to beat ATS filters, safeguard personal secrets, and stand out.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 18
          }}>
            {FEATURES.map((feat, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  transition: 'border-color var(--transition)'
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)'
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 6: CONTACT & CREATOR PROFILE (#contact) ── */}
        <section id="contact" style={{
          padding: '70px 24px',
          maxWidth: 1140,
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-2xl)',
            padding: '48px 36px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span style={{
                fontSize: 11.5,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--accent)',
                display: 'inline-block',
                marginBottom: 8
              }}>
                Get In Touch
              </span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(26px, 3.2vw, 40px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                marginBottom: 10
              }}>
                Contact Developer &amp; Creator
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
                Have questions, feature requests, or security feedback? We are here to help.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 36
            }}>
              {/* Creator Info Card */}
              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: '#ffffff',
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      fontWeight: 800
                    }}>
                      NH
                    </div>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
                        NEJAMUL HAQUE
                      </h3>
                      <p style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 500, margin: 0 }}>
                        Computer Science Undergraduate | DevSecOps Aspirant
                      </p>
                    </div>
                  </div>

                  <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                    Specializing in backend architecture, Linux system administration, network security, and infrastructure automation. Creator of ProResume Builder &amp; IRUS AI.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                      <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                      <span style={{ color: 'var(--text-primary)' }}>+91-6299676007 (Bettiah, Bihar, India)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Portfolio:</span>
                      <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                        nejamulhaque.vercel.app ↗
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: 'var(--text-muted)' }}>GitHub:</span>
                      <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>
                        github.com/NejamulHaque ↗
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: 'var(--text-muted)' }}>IRUS AI:</span>
                      <a href={IRUS_AI_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--success)', textDecoration: 'none', fontWeight: 500 }}>
                        irus-ai.onrender.com ↗
                      </a>
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: 24,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(48, 209, 88, 0.08)',
                  border: '1px solid rgba(48, 209, 88, 0.2)',
                  fontSize: 12,
                  color: 'var(--success)',
                  fontWeight: 500
                }}>
                  ⚡ Typical developer response time: &lt; 2 hours
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleContactSubmit} aria-label="Contact Developer Form" style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label required">Your Name</label>
                  <input
                    id="contact-name"
                    className="input"
                    placeholder="John Doe"
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label required">Your Email</label>
                  <input
                    id="contact-email"
                    className="input"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject" className="form-label">Subject</label>
                  <input
                    id="contact-subject"
                    className="input"
                    placeholder="Feature suggestion / security inquiry"
                    value={contactForm.subject}
                    onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label required">Message</label>
                  <textarea
                    id="contact-message"
                    className="input"
                    rows={4}
                    required
                    placeholder="How can we help or collaborate?"
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingContact}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: 6 }}
                >
                  {sendingContact ? 'Sending Message…' : 'Send Message →'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── SECTION 7: FAQ ACCORDION (#faq) ── */}
        <section id="faq" style={{
          padding: '70px 24px 100px',
          maxWidth: 820,
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={{
              fontSize: 11.5,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--accent)',
              display: 'inline-block',
              marginBottom: 10
            }}>
              Answers
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 3.8vw, 42px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: 12
            }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, letterSpacing: '-0.01em' }}>
              Everything you need to know about Overleaf LaTeX, ATS scoring, and cloud privacy.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div
                  key={idx}
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px 24px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: 15.5, letterSpacing: '-0.015em' }}>
                    <span>{faq.q}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>{isOpen ? '−' : '+'}</span>
                  </div>
                  {isOpen && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 14, lineHeight: 1.65, letterSpacing: '-0.01em' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ── FOOTER (Apple Minimal Multi-Column) ── */}
        <footer role="contentinfo" style={{
          padding: '60px 24px 44px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-card)'
        }}>
          <div style={{
            maxWidth: 1140,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 36,
            marginBottom: 44
          }}>
            {/* Column 1: Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: '#ffffff',
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 800
                }}>
                  P
                </div>
                <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>
                  ProResume
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Open-source, privacy-first resume builder and Overleaf LaTeX studio. 100% free under the MIT License.
              </p>
            </div>

            {/* Column 2: Product */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Product
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <a href="#templates" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>5 Resume Templates</a>
                <a href="#simulator" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Live ATS Simulator</a>
                <a href="#latex" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Overleaf LaTeX Studio</a>
                <a href="#irus-ai" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>IRUS AI Integration</a>
              </div>
            </div>

            {/* Column 3: Legal & Privacy */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Legal &amp; Privacy
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <Link to="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link>
                <Link to="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</Link>
                <span style={{ color: 'var(--warning)', fontSize: 12 }}>⏳ 10-Day Ephemeral Retention</span>
              </div>
            </div>

            {/* Column 4: Creator */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Creator
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                  Nejamul Haque Portfolio ↗
                </a>
                <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  GitHub Repository ↗
                </a>
                <a href={IRUS_AI_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--success)', textDecoration: 'none' }}>
                  IRUS AI Platform ↗
                </a>
                <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            borderTop: '1px solid var(--border)',
            paddingTop: 24,
            fontSize: 12.5,
            color: 'var(--text-muted)'
          }}>
            © 2026 ProResume Builder. Open source by{' '}
            <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
              Nejamul Haque
            </a>.
          </div>
        </footer>

      </main>
    </div>
  )
}
