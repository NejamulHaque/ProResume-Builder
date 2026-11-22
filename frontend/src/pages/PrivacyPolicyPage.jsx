import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo.js'
import { PORTFOLIO_URL, CONTACT_EMAIL, GITHUB_REPO_URL } from '../lib/constants.js'

export default function PrivacyPolicyPage() {
  useSeo({
    title: 'Privacy Policy',
    description: 'ProResume Builder Privacy Policy: Learn how our 10-day ephemeral retention, zero tracking, and open-source architecture protect your career data.',
    canonical: 'https://proresume-six.vercel.app/privacy'
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Apple-style Frosted Header */}
      <header style={{
        height: 60,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
          color: 'var(--text-primary)',
          fontWeight: 600,
          fontSize: 16,
          letterSpacing: '-0.02em'
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: 'var(--text-primary)',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 800
          }}>
            P
          </div>
          <span>ProResume</span>
        </Link>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link to="/" className="btn btn-ghost btn-sm">
            Overview
          </Link>
          <Link to="/auth" className="btn btn-primary btn-sm">
            Start Free
          </Link>
        </div>
      </header>

      {/* Content Container */}
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 100px', lineHeight: 1.75 }}>
        <div style={{ marginBottom: 44, borderBottom: '1px solid var(--border)', paddingBottom: 28 }}>
          <span style={{
            display: 'inline-block',
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--accent)',
            marginBottom: 12
          }}>
            Privacy First Architecture
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 48px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            marginBottom: 12
          }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, letterSpacing: '-0.01em' }}>
            Effective as of 2026 • Created by{' '}
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}
            >
              Nejamul Haque
            </a>.
          </p>
        </div>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 36, fontSize: 15, color: 'var(--text-secondary)' }}>
          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 10 }}>
              1. Our Foundational Principle: Privacy by Default
            </h2>
            <p>
              Your professional journey, personal phone numbers, and career achievements belong exclusively to you. ProResume does not monetize user data, display behavioral advertisements, or sell contact rosters to recruitment brokers.
            </p>
          </div>

          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 10 }}>
              2. 10-Day Ephemeral Cloud Retention
            </h2>
            <p>
              Resumes persisted to our cloud database automatically expire after 10 days. An automated background cleanup worker systematically purges records past their TTL (Time to Live). This ensures zero long-term exposure of your career profile in the event of third-party compromises.
            </p>
          </div>

          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 10 }}>
              3. Data We Process
            </h2>
            <p>
              We process only the exact fields required to generate your CV:
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><strong>Resume Content:</strong> Contact information, employment history, degrees, and skills you explicitly provide.</li>
              <li><strong>Session Identifiers:</strong> Authentication session tokens to authenticate you securely via email or OAuth.</li>
              <li><strong>Device Local Storage:</strong> Draft changes are cached locally on your browser for instant responsiveness and offline durability.</li>
            </ul>
          </div>

          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 10 }}>
              4. IRUS AI &amp; DevSecOps Leak Guard
            </h2>
            <p>
              When using the integrated IRUS AI bullet optimizer, your input text is processed transiently to recommend quantified action verbs. Furthermore, our built-in DevSecOps scanner executes pre-flight checks on your device to alert you if secret keys (such as AWS tokens, SSH keys, or private IP addresses) are inadvertently included in your resume.
            </p>
          </div>

          <div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 10 }}>
              5. Open-Source Transparency &amp; Contact
            </h2>
            <p>
              You can verify all security, auto-delete, and storage logic in our open repository on{' '}
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'none' }}
              >
                GitHub
              </a>.
            </p>
            <p style={{ marginTop: 12 }}>
              For data deletion requests or inquiries, reach out directly:
              <br />
              <strong>Nejamul Haque</strong> —{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
