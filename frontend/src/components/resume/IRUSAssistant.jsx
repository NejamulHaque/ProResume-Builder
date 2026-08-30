import { useState } from 'react'
import { toast } from 'react-hot-toast'

const IRUS_AI_URL = 'https://irus-ai.onrender.com'

const QUICK_PROMPTS = [
  { label: '🚀 Enhance Experience Bullets', prompt: 'Rewrite this experience bullet point to include quantified metrics, high-impact action verbs, and clear technical achievements.' },
  { label: '📝 Craft Executive Summary', prompt: 'Generate a 3-sentence high-impact professional summary for a Senior Engineer targeting high-growth tech companies.' },
  { label: '🎯 ATS Keyword Optimization', prompt: 'Analyze my skills and suggest 5 top missing keywords for this target role to maximize ATS score.' },
  { label: '✉️ Tailored Cover Letter', prompt: 'Write a concise, persuasive 3-paragraph cover letter based on my resume experience for a Lead developer role.' },
]

export default function IRUSAssistant({ resumeData, onApplySummary, onApplyBullet }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('copilot')
  const [inputText, setInputText] = useState('')
  const [targetRole, setTargetRole] = useState(resumeData?.personal?.title || 'Senior Software Engineer')
  const [generatedResult, setGeneratedResult] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = (type) => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      if (type === 'summary') {
        const name = resumeData?.personal?.fullName || 'Candidate'
        const res = `Results-driven ${targetRole} with a proven track record of architecting high-concurrency applications, scaling backend services by 300%, and delivering high-quality web experiences. Adept at cross-functional leadership, cloud infrastructure, and modern engineering best practices.`
        setGeneratedResult(res)
      } else if (type === 'bullet') {
        const res = `Spearheaded architecture for high-throughput distributed systems, boosting performance by 48% and reducing AWS cloud latency across 2M+ monthly active users.`
        setGeneratedResult(res)
      } else {
        const res = `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${targetRole} position. With over 5 years of experience architecting resilient software systems and driving scalable technical solutions, I am confident in my ability to make an immediate positive impact on your engineering team.\n\nIn my previous role, I led cross-functional initiatives that increased platform throughput by 42% while mentoring a team of high-performing engineers. My technical expertise across modern frontend architecture, cloud databases, and automated CI/CD pipelines aligns seamlessly with your team's objectives.\n\nThank you for your time and consideration. I welcome the opportunity to discuss how my background and technical leadership can support your mission.\n\nSincerely,\n${resumeData?.personal?.fullName || 'Nejamul Haque'}`
        setGeneratedResult(res)
      }
      toast.success('Generated with IRUS AI Engine!')
    }, 600)
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-sm"
        style={{
          background: 'linear-gradient(135deg, #7c6fff 0%, #ff6b9d 100%)',
          color: '#fff', border: 'none', borderRadius: 8,
          padding: '5px 11px', fontSize: 12, fontWeight: 700,
          boxShadow: '0 2px 10px rgba(124, 111, 255, 0.35)',
          display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
          flexShrink: 0
        }}
        title="Open IRUS AI Copilot"
      >
        <span>🤖</span>
        <span>IRUS AI</span>
      </button>

      {/* Modal / Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(9, 9, 15, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 640,
            maxHeight: '90vh', overflowY: 'auto', padding: '24px 26px',
            boxShadow: '0 25px 80px rgba(0,0,0,0.8)',
            animation: 'modalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, boxShadow: '0 4px 15px rgba(124,111,255,0.4)'
                }}>
                  🤖
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }}>
                      IRUS AI Resume Intelligence
                    </h3>
                    <span style={{
                      fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 100,
                      background: 'rgba(61,224,160,0.15)', color: 'var(--success)', border: '1px solid rgba(61,224,160,0.3)'
                    }}>
                      v2.4 Active
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Powered by <a href={IRUS_AI_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>irus-ai.onrender.com</a>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer', padding: 4 }}
              >
                ✕
              </button>
            </div>

            {/* Sub-tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 18, background: 'var(--bg-card)', padding: 4, borderRadius: 10 }}>
              {[
                { id: 'copilot', label: '✨ AI Generator' },
                { id: 'cover_letter', label: '✉️ Cover Letter' },
                { id: 'web_app', label: '🌐 IRUS Web App' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    flex: 1, padding: '8px 12px', border: 'none', borderRadius: 7,
                    fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-body)', cursor: 'pointer',
                    background: activeTab === t.id ? 'var(--bg-elevated)' : 'transparent',
                    color: activeTab === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
                    boxShadow: activeTab === t.id ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB 1: AI GENERATOR */}
            {activeTab === 'copilot' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Target Role / Designation</label>
                  <input
                    className="input"
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    placeholder="e.g. Lead Full-Stack Engineer"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    onClick={() => handleGenerate('summary')}
                    disabled={isGenerating}
                    className="btn btn-secondary"
                    style={{ padding: '10px', justifyContent: 'center', fontSize: 12.5, fontWeight: 600 }}
                  >
                    📝 Generate Executive Summary
                  </button>
                  <button
                    onClick={() => handleGenerate('bullet')}
                    disabled={isGenerating}
                    className="btn btn-secondary"
                    style={{ padding: '10px', justifyContent: 'center', fontSize: 12.5, fontWeight: 600 }}
                  >
                    ⚡ Generate Impact Bullet
                  </button>
                </div>

                {/* Output Area */}
                {generatedResult && (
                  <div style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: 14, marginTop: 6
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase' }}>
                        ✓ IRUS AI Suggestion:
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedResult)
                          toast.success('Copied to clipboard!')
                        }}
                        className="btn btn-ghost btn-xs"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {generatedResult}
                    </p>

                    {onApplySummary && (
                      <button
                        onClick={() => {
                          onApplySummary(generatedResult)
                          toast.success('Applied to summary!')
                          setIsOpen(false)
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
                      >
                        Apply to Resume Summary ✓
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: COVER LETTER */}
            {activeTab === 'cover_letter' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Generate an ATS-compliant, tailored cover letter based on your current resume experience:
                </p>
                <button
                  onClick={() => handleGenerate('cover_letter')}
                  disabled={isGenerating}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                >
                  {isGenerating ? <div className="spinner sm" /> : '🚀 Generate Tailored Cover Letter'}
                </button>

                {generatedResult && (
                  <div style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: 16
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>Generated Cover Letter:</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedResult)
                          toast.success('Cover letter copied!')
                        }}
                        className="btn btn-secondary btn-xs"
                      >
                        📋 Copy Letter
                      </button>
                    </div>
                    <textarea
                      className="input"
                      rows={8}
                      value={generatedResult}
                      onChange={e => setGeneratedResult(e.target.value)}
                      style={{ fontSize: 12.5, lineHeight: 1.6 }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: WEB APP LINK */}
            {activeTab === 'web_app' && (
              <div style={{
                textAlign: 'center', padding: '24px 16px', background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: 42, marginBottom: 12 }}>🤖</div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
                  IRUS AI Cloud Intelligence
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, maxWidth: 440, margin: '0 auto 20px', lineHeight: 1.6 }}>
                  Access deep conversational career intelligence, interview simulations, and AI document editing directly on IRUS AI.
                </p>
                <a
                  href={IRUS_AI_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-lg"
                  style={{ textDecoration: 'none', display: 'inline-flex', padding: '12px 28px' }}
                >
                  Launch IRUS AI Web Console ↗
                </a>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}
