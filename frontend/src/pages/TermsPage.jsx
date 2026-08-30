import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo.js'

export default function TermsPage() {
  useSeo({
    title: 'Terms of Service',
    description: 'ProResume Builder Terms of Service: Open-source MIT usage guidelines, acceptable use, and user responsibilities.',
    canonical: 'https://github.com/NejamulHaque/ProResume-Builder'
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header style={{
        height: 64, borderBottom: '1px solid var(--border)', background: 'rgba(15,15,24,0.92)',
        backdropFilter: 'blur(16px)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 800, fontSize: 18 }}>
          <span>📄</span> Pro<span className="gradient-text">Resume</span>
        </Link>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/" className="btn btn-ghost btn-sm">← Back to Home</Link>
          <Link to="/auth" className="btn btn-primary btn-sm">Start Building Free 🚀</Link>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 840, margin: '0 auto', padding: '60px 24px 100px', lineHeight: 1.8 }}>
        <div style={{ marginBottom: 36 }}>
          <span className="badge badge-accent" style={{ marginBottom: 12, display: 'inline-block' }}>
            📜 User Agreement & MIT License
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 8 }}>
            Terms of Service
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Last updated: August 30, 2026 • ProResume Builder
          </p>
        </div>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 28, fontSize: 14.5, color: 'var(--text-secondary)' }}>
          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using <strong>ProResume Builder</strong>, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please discontinue using the service immediately.
            </p>
          </div>

          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              2. Open-Source MIT License
            </h2>
            <p>
              ProResume Builder is open-source software distributed under the <strong>MIT License</strong>. You are free to use, modify, and distribute the software for personal, academic, or commercial purposes in accordance with the license.
            </p>
          </div>

          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              3. User-Generated Content & Accuracy
            </h2>
            <p>
              You retain all intellectual property rights to the resume content, personal information, and documents you generate. You are solely responsible for ensuring the factual accuracy and authenticity of your resume details before submitting them to prospective employers.
            </p>
          </div>

          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              4. Ephemeral Data Deletion Notice
            </h2>
            <p>
              As part of our privacy architecture, all resumes stored on cloud databases are automatically purged after 10 days. Users are advised to export their finalized resumes as PDF, Overleaf LaTeX (`.tex`), or JSON backup files for long-term retention.
            </p>
          </div>

          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              5. Disclaimer of Warranties & Limitation of Liability
            </h2>
            <p>
              The platform, including AI suggestions, ATS match scores, and LaTeX compilers, is provided "AS IS" without warranties of any kind. ProResume Builder and its developers shall not be liable for any damages arising out of the use or inability to use the service.
            </p>
          </div>

          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              6. Contact Information
            </h2>
            <p>
              For legal inquiries or questions regarding these terms:
              <br />
              <strong>Nejamul Haque</strong> — <a href="mailto:nejamulhaqueruhaan86@gmail.com" style={{ color: 'var(--accent)' }}>nejamulhaqueruhaan86@gmail.com</a>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
