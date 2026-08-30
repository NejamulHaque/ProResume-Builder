import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo.js'

export default function PrivacyPolicyPage() {
  useSeo({
    title: 'Privacy Policy',
    description: 'ProResume Builder Privacy Policy: Learn how our 10-day ephemeral retention, zero-tracking, and open-source architecture protect your career data.',
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

      {/* Content Container */}
      <main style={{ maxWidth: 840, margin: '0 auto', padding: '60px 24px 100px', lineHeight: 1.8 }}>
        <div style={{ marginBottom: 36 }}>
          <span className="badge badge-accent" style={{ marginBottom: 12, display: 'inline-block' }}>
            🔒 Privacy First Architecture
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 8 }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Last updated: August 30, 2026 • Created by Nejamul Haque
          </p>
        </div>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 28, fontSize: 14.5, color: 'var(--text-secondary)' }}>
          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              1. Our Core Commitment: Ephemeral 10-Day Retention
            </h2>
            <p>
              At <strong>ProResume Builder</strong>, we believe your career history and personal contact details belong solely to you. Unlike traditional platforms that monetize or permanently store candidate resumes, our database operates on a strict <strong>10-Day Ephemeral Retention Rule</strong>.
            </p>
            <p style={{ background: 'rgba(124,111,255,0.08)', padding: '12px 16px', borderRadius: 8, borderLeft: '3px solid var(--accent)' }}>
              ⏱️ <strong>Automated Database Auto-Purge:</strong> An automated background worker runs every 30 minutes, permanently deleting resumes older than 10 days from our Neon PostgreSQL database. Download your high-DPI PDF or LaTeX source for permanent personal backup.
            </p>
          </div>

          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              2. Information We Collect & How It Is Used
            </h2>
            <p>We collect only the minimal information required to generate and render your resume:</p>
            <ul>
              <li><strong>Resume Content:</strong> Contact information, work experience, education, skills, and projects you choose to enter.</li>
              <li><strong>Authentication Data:</strong> When signing in via email or Google, we store your email address and profile name solely to authenticate your session.</li>
              <li><strong>Local Storage:</strong> In offline or sandboxed mode, your draft data is saved locally on your device's browser (localStorage / IndexedDB) without transmitting across the network.</li>
            </ul>
          </div>

          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              3. AI Processing & IRUS AI Integration
            </h2>
            <p>
              When utilizing our IRUS AI assistant for summary generation or bullet point enhancement, your text is processed in-memory to generate suggestions. We do not use your resume content to train public AI models, nor do we sell your data to third-party advertisers or recruitment brokers.
            </p>
          </div>

          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              4. Cookies & Analytics
            </h2>
            <p>
              We use essential cookies strictly for maintaining user authentication state and UI preferences (such as dark mode and palette selections). We do not deploy intrusive third-party cross-site ad trackers.
            </p>
          </div>

          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              5. Open-Source Transparency & Contact
            </h2>
            <p>
              ProResume Builder is open-source under the MIT license. You can inspect the entire codebase, security rules, and auto-delete worker on our <a href="https://github.com/NejamulHaque/ProResume-Builder" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>GitHub Repository</a>.
            </p>
            <p>
              For privacy inquiries or immediate data deletion requests, contact the developer directly:
              <br />
              <strong>Nejamul Haque</strong> — <a href="mailto:nejamulhaqueruhaan86@gmail.com" style={{ color: 'var(--accent)' }}>nejamulhaqueruhaan86@gmail.com</a>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
