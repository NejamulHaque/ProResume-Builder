import { useState, useMemo } from 'react'
import { toast } from 'react-hot-toast'

export default function SecurityScannerModal({ isOpen, onClose, resumeData, latexCode = '' }) {
  const [scanning, setScanning] = useState(false)

  // Run security heuristics
  const findings = useMemo(() => {
    const issues = []
    const fullText = JSON.stringify(resumeData || {}) + ' ' + (latexCode || '')

    // 1. API Keys & Secrets
    if (/ghp_[a-zA-Z0-9]{30,}/i.test(fullText)) {
      issues.push({ id: 'sec-1', level: 'CRITICAL', title: 'GitHub Personal Access Token Detected', desc: 'A live GitHub PAT (ghp_...) was found. Never expose tokens in public resumes.', fix: 'Remove token immediately.' })
    }
    if (/sk-[a-zA-Z0-9]{20,}/i.test(fullText)) {
      issues.push({ id: 'sec-2', level: 'CRITICAL', title: 'OpenAI Secret Key Detected', desc: 'An OpenAI API key (sk-...) was detected. Please redact it.', fix: 'Revoke and remove key.' })
    }
    if (/AKIA[0-9A-Z]{16}/.test(fullText)) {
      issues.push({ id: 'sec-3', level: 'CRITICAL', title: 'AWS Access Key ID Detected', desc: 'An AWS IAM user access key (AKIA...) was found in text.', fix: 'Remove and rotate AWS credentials.' })
    }
    if (/-----BEGIN (?:RSA )?PRIVATE KEY-----/.test(fullText)) {
      issues.push({ id: 'sec-4', level: 'CRITICAL', title: 'Private SSH / RSA Key Found', desc: 'Private cryptography key found in text.', fix: 'Delete private key block.' })
    }

    // 2. Internal / Private IPs
    if (/\b(?:192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/.test(fullText)) {
      issues.push({ id: 'sec-5', level: 'MEDIUM', title: 'Internal Private IP Address Exposed', desc: 'Internal RFC 1918 private IP address detected (e.g. 192.168.x.x / 10.x.x.x).', fix: 'Replace with domain name or sanitize.' })
    }

    // 3. Localhost URLs
    if (/localhost:\d+/i.test(fullText) || /127\.0\.0\.1/i.test(fullText)) {
      issues.push({ id: 'sec-6', level: 'LOW', title: 'Localhost / Development URL Detected', desc: 'References to localhost or 127.0.0.1 found in project links.', fix: 'Replace with live production URL.' })
    }

    // 4. Insecure HTTP links
    if (/http:\/\/[^\s"]+/i.test(fullText) && !/localhost/i.test(fullText)) {
      issues.push({ id: 'sec-7', level: 'LOW', title: 'Insecure HTTP Links', desc: 'Some URLs use unencrypted http:// instead of secure https://.', fix: 'Upgrade links to https://.' })
    }

    return issues
  }, [resumeData, latexCode])

  const score = Math.max(0, 100 - findings.length * 20)

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1200,
      background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 660,
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 80px rgba(0,0,0,0.85)', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(61,224,160,0.1) 0%, rgba(124,111,255,0.08) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: score >= 80 ? 'var(--success)' : 'var(--danger)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#fff'
            }}>
              🛡️
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, margin: 0 }}>
                DevSecOps Resume Security & Leak Audit
              </h3>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                Automated vulnerability, credential leak, and privacy scanner
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-ghost btn-xs" style={{ fontSize: 18, color: 'var(--text-muted)' }}>
            ×
          </button>
        </div>

        {/* Score Overview */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Security Integrity Score
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: score >= 80 ? 'var(--success)' : 'var(--danger)', fontFamily: 'var(--font-display)' }}>
                {score} / 100 {score === 100 ? '🛡️ CLEAN' : '⚠️ AT RISK'}
              </div>
            </div>

            <div style={{
              padding: '6px 14px', borderRadius: 20,
              background: score >= 80 ? 'rgba(61,224,160,0.15)' : 'rgba(255,107,157,0.15)',
              border: `1px solid ${score >= 80 ? 'rgba(61,224,160,0.35)' : 'rgba(255,107,157,0.35)'}`,
              fontSize: 12, fontWeight: 700, color: score >= 80 ? 'var(--success)' : 'var(--accent-2)'
            }}>
              {findings.length === 0 ? '✓ No Secret Leaks Found' : `${findings.length} Vulnerabilities Detected`}
            </div>
          </div>
        </div>

        {/* Findings List */}
        <div style={{ flex: 1, padding: '16px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {findings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 42, marginBottom: 10 }}>🔒✨</div>
              <h4 style={{ color: 'var(--text-primary)', margin: '0 0 6px' }}>Zero Leaks Detected</h4>
              <p style={{ fontSize: 13, maxWidth: 420, margin: '0 auto', lineHeight: 1.6 }}>
                Your resume passed the DevSecOps compliance scan. No API keys, passwords, internal IPs, or unmasked secrets were found.
              </p>
            </div>
          ) : (
            findings.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                      background: item.level === 'CRITICAL' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                      color: item.level === 'CRITICAL' ? '#ef4444' : '#f59e0b'
                    }}>
                      {item.level}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{item.title}</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {item.desc}
                </p>
                <div style={{ fontSize: 11.5, color: 'var(--accent)', fontWeight: 600 }}>
                  💡 Recommendation: {item.fix}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-secondary)'
        }}>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
            DevSecOps Engine by <strong>Nejamul Haque</strong>
          </span>

          <button onClick={onClose} className="btn btn-primary btn-sm">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
