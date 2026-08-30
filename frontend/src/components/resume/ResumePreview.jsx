import { memo } from 'react'
import { format } from 'date-fns'
import ResumeQRCode from './ResumeQRCode.jsx'

// ─── Date helpers ──────────────────────────────────────────────────────────
const fmtDate = (str) => {
  if (!str) return ''
  try { return format(new Date(str + '-01'), 'MMM yyyy') }
  catch { return str }
}
const fmtRange = (start, end, current) => {
  const s = fmtDate(start)
  const e = current ? 'Present' : fmtDate(end)
  if (!s && !e) return ''
  if (!s) return e
  if (!e) return s
  return `${s} – ${e}`
}

// ─── Shared section title bar ──────────────────────────────────────────────
function SecTitle({ title, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}>
      <h2 style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#222', whiteSpace: 'nowrap' }}>
        {title}
      </h2>
      <div style={{ flex: 1, height: 1.5, background: `linear-gradient(90deg, ${accent}70, transparent)` }} />
    </div>
  )
}

// ══════════════════════════════════════════════════════
// 1. MODERN
// ══════════════════════════════════════════════════════
const ModernTemplate = memo(({ data, accentColor, customFont, showQrCode }) => {
  const p   = data.personal
  const acc = accentColor || '#7c6fff'
  const contacts = [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean)
  const font = customFont || '"Segoe UI",system-ui,sans-serif'
  const qrUrl = p.website || (p.github ? (p.github.startsWith('http') ? p.github : `https://${p.github}`) : '')

  return (
    <div style={{ fontFamily: font, background: '#fff', color: '#1a1a2e', width: 800, minHeight: 1050, boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)', padding: '34px 40px', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position:'absolute',top:-30,right:-30,width:180,height:180,borderRadius:'50%',background:`${acc}22` }} />
        <div style={{ position:'absolute',bottom:-50,left:'42%',width:150,height:150,borderRadius:'50%',background:`${acc}11` }} />
        
        <div style={{ position:'relative',zIndex:1,flex:1 }}>
          <h1 style={{ fontSize:30,fontWeight:800,color:'#fff',letterSpacing:-0.8 }}>{p.fullName || 'Your Name'}</h1>
          {p.title && <p style={{ fontSize:14,color:acc,fontWeight:600,margin:'5px 0 14px' }}>{p.title}</p>}
          <div style={{ display:'flex',flexWrap:'wrap',gap:'4px 18px' }}>
            {contacts.map((c,i) => <span key={i} style={{ fontSize:11.5,color:'rgba(255,255,255,.65)' }}>{c}</span>)}
          </div>
        </div>

        {showQrCode && qrUrl && (
          <div style={{ position: 'relative', zIndex: 2, marginLeft: 16 }}>
            <ResumeQRCode url={qrUrl} size={58} />
          </div>
        )}
      </div>

      {/* Body: two columns */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 255px',gap:28,padding:'28px 40px' }}>
        {/* LEFT */}
        <div>
          {p.summary && (
            <div style={{ marginBottom:22 }}>
              <SecTitle title="Summary" accent={acc} />
              <p style={{ fontSize:12.5,lineHeight:1.72,color:'#444' }}>{p.summary}</p>
            </div>
          )}
          {data.experience?.length > 0 && (
            <div style={{ marginBottom:22 }}>
              <SecTitle title="Experience" accent={acc} />
              {data.experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom:18 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:2 }}>
                    <div>
                      <div style={{ fontWeight:700,fontSize:13.5 }}>{exp.role}</div>
                      <div style={{ fontSize:12.5,color:acc,fontWeight:600 }}>{exp.company}</div>
                    </div>
                    <div style={{ textAlign:'right',flexShrink:0 }}>
                      <div style={{ fontSize:11,color:'#888',fontWeight:500 }}>{fmtRange(exp.startDate,exp.endDate,exp.current)}</div>
                      {exp.location && <div style={{ fontSize:10.5,color:'#aaa' }}>{exp.location}</div>}
                    </div>
                  </div>
                  <ul style={{ paddingLeft:15,margin:'5px 0 0' }}>
                    {(exp.bullets||[]).filter(Boolean).map((b,i) => (
                      <li key={i} style={{ fontSize:12.5,color:'#555',lineHeight:1.6,marginBottom:2 }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {data.projects?.length > 0 && (
            <div>
              <SecTitle title="Projects" accent={acc} />
              {data.projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:2 }}>
                    <span style={{ fontWeight:700,fontSize:13 }}>{proj.name}</span>
                    {proj.url && <span style={{ fontSize:10.5,color:acc }}>{proj.url}</span>}
                  </div>
                  {proj.description && <p style={{ fontSize:12,color:'#555',lineHeight:1.5 }}>{proj.description}</p>}
                  {proj.tech?.length > 0 && (
                    <div style={{ display:'flex',flexWrap:'wrap',gap:4,marginTop:4 }}>
                      {proj.tech.map((t) => <span key={t} style={{ fontSize:10.5,padding:'2px 7px',borderRadius:4,background:`${acc}14`,color:acc,fontWeight:500 }}>{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div>
          {data.education?.length > 0 && (
            <div style={{ marginBottom:22 }}>
              <SecTitle title="Education" accent={acc} />
              {data.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom:14 }}>
                  <div style={{ fontWeight:700,fontSize:12.5 }}>{edu.degree}</div>
                  <div style={{ fontSize:12,color:acc,fontWeight:600 }}>{edu.institution}</div>
                  <div style={{ fontSize:11,color:'#888',marginTop:2 }}>{fmtRange(edu.startDate,edu.endDate)}{edu.location && ` · ${edu.location}`}</div>
                  {edu.gpa && <div style={{ fontSize:11,color:'#666',marginTop:1 }}>GPA: {edu.gpa}{edu.honors && ` · ${edu.honors}`}</div>}
                </div>
              ))}
            </div>
          )}
          {(data.skills?.technical?.length > 0 || data.skills?.soft?.length > 0) && (
            <div style={{ marginBottom:22 }}>
              <SecTitle title="Skills" accent={acc} />
              {data.skills.technical?.length > 0 && (
                <div style={{ marginBottom:10 }}>
                  <div style={{ fontSize:10.5,fontWeight:700,color:'#888',textTransform:'uppercase',letterSpacing:'0.7px',marginBottom:5 }}>Technical</div>
                  <div style={{ display:'flex',flexWrap:'wrap',gap:4 }}>
                    {data.skills.technical.map((s) => <span key={s} style={{ fontSize:11,padding:'3px 8px',borderRadius:4,background:`${acc}12`,color:acc,border:`1px solid ${acc}25` }}>{s}</span>)}
                  </div>
                </div>
              )}
              {data.skills.soft?.length > 0 && (
                <div style={{ marginBottom:10 }}>
                  <div style={{ fontSize:10.5,fontWeight:700,color:'#888',textTransform:'uppercase',letterSpacing:'0.7px',marginBottom:5 }}>Soft Skills</div>
                  <div style={{ display:'flex',flexWrap:'wrap',gap:4 }}>
                    {data.skills.soft.map((s) => <span key={s} style={{ fontSize:11,padding:'3px 8px',borderRadius:4,background:'#f5f5f8',color:'#555' }}>{s}</span>)}
                  </div>
                </div>
              )}
              {data.skills.languages?.length > 0 && (
                <div>
                  <div style={{ fontSize:10.5,fontWeight:700,color:'#888',textTransform:'uppercase',letterSpacing:'0.7px',marginBottom:5 }}>Languages</div>
                  {data.skills.languages.map((l) => <div key={l} style={{ fontSize:11.5,color:'#555',marginBottom:3 }}>• {l}</div>)}
                </div>
              )}
            </div>
          )}
          {data.certifications?.length > 0 && (
            <div>
              <SecTitle title="Certifications" accent={acc} />
              {data.certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom:9 }}>
                  <div style={{ fontWeight:600,fontSize:12 }}>{cert.name}</div>
                  <div style={{ fontSize:11,color:'#888' }}>{cert.issuer}{cert.date && ` · ${fmtDate(cert.date)}`}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

// ══════════════════════════════════════════════════════
// 2. MINIMAL
// ══════════════════════════════════════════════════════
const MinimalTemplate = memo(({ data, accentColor, customFont }) => {
  const p = data.personal
  const acc = accentColor || '#2c2c2c'
  const font = customFont || 'Georgia,"Times New Roman",serif'
  const contacts = [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean)
  return (
    <div style={{ fontFamily: font, background:'#fff',color:'#2c2c2c',width:800,minHeight:1050,boxSizing:'border-box',padding:'46px 52px' }}>
      <div style={{ textAlign:'center',paddingBottom:22,marginBottom:22,borderBottom:`2px solid ${acc}` }}>
        <h1 style={{ fontSize:32,fontWeight:400,letterSpacing:'3.5px',textTransform:'uppercase',color:acc }}>{p.fullName||'YOUR NAME'}</h1>
        {p.title && <p style={{ fontSize:12,letterSpacing:'2px',textTransform:'uppercase',color:'#666',margin:'7px 0 10px' }}>{p.title}</p>}
        <div style={{ display:'flex',justifyContent:'center',flexWrap:'wrap',gap:'4px 14px',fontSize:11.5,color:'#777' }}>
          {contacts.map((c,i) => <span key={i}>{c}</span>)}
        </div>
      </div>
      {p.summary && <div style={{ marginBottom:24,borderLeft:`3px solid ${acc}`,paddingLeft:14 }}><p style={{ fontSize:13,lineHeight:1.8,color:'#555',fontStyle:'italic' }}>{p.summary}</p></div>}
      
      {data.experience?.length > 0 && (
        <div style={{ marginBottom:22 }}>
          <h2 style={{ fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',borderBottom:'1px solid #ddd',paddingBottom:5,marginBottom:13,color:acc }}>Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom:17 }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:2 }}>
                <span><strong>{exp.role}</strong>{exp.company&&`, ${exp.company}`}{exp.location&&`, ${exp.location}`}</span>
                <span style={{ fontSize:11.5,color:'#888',flexShrink:0,marginLeft:12 }}>{fmtRange(exp.startDate,exp.endDate,exp.current)}</span>
              </div>
              <ul style={{ paddingLeft:20,margin:'4px 0 0' }}>
                {(exp.bullets||[]).filter(Boolean).map((b,i) => <li key={i} style={{ fontSize:12.5,color:'#555',lineHeight:1.65,marginBottom:2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data.projects?.length > 0 && (
        <div style={{ marginBottom:22 }}>
          <h2 style={{ fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',borderBottom:'1px solid #ddd',paddingBottom:5,marginBottom:13,color:acc }}>Projects</h2>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom:14 }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:2 }}>
                <span style={{ fontWeight:700,fontSize:13 }}>{proj.name}</span>
                {proj.url && <span style={{ fontSize:11,color:acc }}>{proj.url}</span>}
              </div>
              {proj.description && <p style={{ fontSize:12.5,color:'#555',lineHeight:1.6,marginBottom:4 }}>{proj.description}</p>}
              {proj.tech?.length > 0 && <p style={{ fontSize:11.5,color:'#777',fontStyle:'italic' }}>Tech: {proj.tech.join(', ')}</p>}
            </div>
          ))}
        </div>
      )}

      {data.education?.length > 0 && (
        <div style={{ marginBottom:22 }}>
          <h2 style={{ fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',borderBottom:'1px solid #ddd',paddingBottom:5,marginBottom:13,color:acc }}>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom:12 }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:2 }}>
                <span><strong>{edu.degree}</strong>{edu.institution&&`, ${edu.institution}`}{edu.location&&`, ${edu.location}`}</span>
                <span style={{ fontSize:11.5,color:'#888',flexShrink:0,marginLeft:12 }}>{fmtRange(edu.startDate,edu.endDate)}</span>
              </div>
              {(edu.gpa || edu.honors) && (
                <div style={{ fontSize:12,color:'#666' }}>{edu.gpa && `GPA: ${edu.gpa}`}{edu.honors && ` · ${edu.honors}`}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {[...(data.skills?.technical||[]),...(data.skills?.soft||[]),...(data.skills?.languages||[])].length > 0 && (
        <div style={{ marginBottom:22 }}>
          <h2 style={{ fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',borderBottom:'1px solid #ddd',paddingBottom:5,marginBottom:13,color:acc }}>Skills & Languages</h2>
          <p style={{ fontSize:12.5,color:'#555',lineHeight:1.8 }}>
            {[...(data.skills.technical||[]),...(data.skills.soft||[]),...(data.skills.languages||[])].join(' · ')}
          </p>
        </div>
      )}

      {data.certifications?.length > 0 && (
        <div>
          <h2 style={{ fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',borderBottom:'1px solid #ddd',paddingBottom:5,marginBottom:13,color:acc }}>Certifications</h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} style={{ display:'flex',justifyContent:'space-between',marginBottom:7 }}>
              <span><strong>{cert.name}</strong>{cert.issuer&&` · ${cert.issuer}`}</span>
              <span style={{ fontSize:11.5,color:'#888' }}>{cert.date && fmtDate(cert.date)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

// ══════════════════════════════════════════════════════
// 3. EXECUTIVE
// ══════════════════════════════════════════════════════
const ExecutiveTemplate = memo(({ data, accentColor, customFont }) => {
  const p   = data.personal
  const acc = accentColor || '#b8860b'
  const font = customFont || '"Palatino Linotype",Palatino,serif'
  const contacts = [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean)
  return (
    <div style={{ fontFamily: font, background:'#fff',color:'#1c1c1c',width:800,minHeight:1050,boxSizing:'border-box',overflow:'hidden' }}>
      <div style={{ background:'#1c1c1c',padding:'30px 40px',display:'flex',justifyContent:'space-between',alignItems:'flex-end' }}>
        <div>
          <h1 style={{ fontSize:30,color:'#fff',fontWeight:400,letterSpacing:2 }}>{p.fullName||'Your Name'}</h1>
          {p.title && <p style={{ fontSize:13,color:acc,letterSpacing:'1.5px',textTransform:'uppercase',fontStyle:'italic',marginTop:5 }}>{p.title}</p>}
        </div>
        <div style={{ textAlign:'right' }}>
          {contacts.map((c,i) => <div key={i} style={{ fontSize:11.5,color:'rgba(255,255,255,.62)',marginBottom:3 }}>{c}</div>)}
        </div>
      </div>
      <div style={{ height:4,background:`linear-gradient(90deg,${acc},#daa520,${acc})` }} />
      <div style={{ padding:'30px 40px' }}>
        {p.summary && <div style={{ marginBottom:22,borderLeft:`3px solid ${acc}`,paddingLeft:14 }}><p style={{ fontSize:13.5,lineHeight:1.85,color:'#444',fontStyle:'italic' }}>{p.summary}</p></div>}
        
        {data.experience?.length > 0 && (
          <div style={{ marginBottom:22 }}>
            <h2 style={{ fontSize:11.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',color:acc,marginBottom:13,display:'flex',alignItems:'center',gap:8 }}>
              <span style={{ display:'inline-block',width:18,height:1.5,background:acc }} />Professional Experience
              <span style={{ flex:1,height:1.5,background:`${acc}40` }} />
            </h2>
            {data.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom:18 }}>
                <div style={{ display:'flex',justifyContent:'space-between',borderBottom:`1px solid ${acc}30`,paddingBottom:4,marginBottom:7 }}>
                  <div>
                    <strong style={{ fontSize:13.5 }}>{exp.role}</strong>
                    {exp.company && <span style={{ fontSize:13,color:acc }}> · {exp.company}</span>}
                    {exp.location && <div style={{ fontSize:11.5,color:'#888',fontWeight:400 }}>{exp.location}</div>}
                  </div>
                  <span style={{ fontSize:11.5,color:'#888' }}>{fmtRange(exp.startDate,exp.endDate,exp.current)}</span>
                </div>
                <ul style={{ paddingLeft:18 }}>
                  {(exp.bullets||[]).filter(Boolean).map((b,i) => <li key={i} style={{ fontSize:12.5,color:'#555',lineHeight:1.7,marginBottom:3 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}

        {data.projects?.length > 0 && (
          <div style={{ marginBottom:22 }}>
            <h2 style={{ fontSize:11.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',color:acc,marginBottom:13,display:'flex',alignItems:'center',gap:8 }}>
              <span style={{ display:'inline-block',width:18,height:1.5,background:acc }} />Projects
              <span style={{ flex:1,height:1.5,background:`${acc}40` }} />
            </h2>
            {data.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom:15 }}>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:3 }}>
                  <strong style={{ fontSize:13.5 }}>{proj.name}</strong>
                  {proj.url && <span style={{ fontSize:12,color:acc }}>{proj.url}</span>}
                </div>
                <p style={{ fontSize:12.5,color:'#555',lineHeight:1.7 }}>{proj.description}</p>
                {proj.tech?.length > 0 && <div style={{ fontSize:11.5,color:acc,marginTop:3 }}>Tech: {proj.tech.join(', ')}</div>}
              </div>
            ))}
          </div>
        )}

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:24 }}>
          {data.education?.length > 0 && (
            <div>
              <h2 style={{ fontSize:11.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',color:acc,marginBottom:12 }}>Education</h2>
              {data.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom:11 }}>
                  <strong style={{ fontSize:12.5 }}>{edu.degree}</strong>
                  <div style={{ fontSize:12,color:acc }}>{edu.institution}</div>
                  <div style={{ fontSize:11,color:'#888' }}>{fmtRange(edu.startDate,edu.endDate)}{edu.location && ` · ${edu.location}`}</div>
                  {edu.gpa && <div style={{ fontSize:11,color:'#777' }}>GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          )}
          {[...(data.skills?.technical||[]),...(data.skills?.soft||[]),...(data.skills?.languages||[])].length > 0 && (
            <div>
              <h2 style={{ fontSize:11.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',color:acc,marginBottom:12 }}>Core Competencies</h2>
              {[...(data.skills.technical||[]),...(data.skills.soft||[]),...(data.skills.languages||[])].map((s) => (
                <div key={s} style={{ fontSize:12,color:'#555',padding:'2px 0',borderBottom:'1px dotted #eee' }}>▸ {s}</div>
              ))}
            </div>
          )}
        </div>

        {data.certifications?.length > 0 && (
          <div style={{ marginTop:22 }}>
            <h2 style={{ fontSize:11.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',color:acc,marginBottom:12 }}>Certifications</h2>
            {data.certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom:9,display:'flex',justifyContent:'space-between' }}>
                <div>
                  <strong style={{ fontSize:12.5 }}>{cert.name}</strong>
                  <div style={{ fontSize:11.5,color:acc }}>{cert.issuer}</div>
                </div>
                <span style={{ fontSize:11,color:'#888' }}>{cert.date && fmtDate(cert.date)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

// ══════════════════════════════════════════════════════
// 4. TECHNICAL
// ══════════════════════════════════════════════════════
const TechnicalTemplate = memo(({ data, accentColor, customFont }) => {
  const p   = data.personal
  const acc = accentColor || '#00d4aa'
  const font = customFont || '"JetBrains Mono","Fira Code",monospace'
  const contacts = [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean)
  return (
    <div style={{ fontFamily: font, background:'#0d1117',color:'#e6edf3',width:800,minHeight:1050,boxSizing:'border-box',overflow:'hidden' }}>
      {/* Terminal bar */}
      <div style={{ background:'#161b22',borderBottom:'1px solid #30363d',padding:'10px 20px',display:'flex',alignItems:'center',gap:7 }}>
        {['#ff5f57','#febc2e','#28c840'].map((c) => <span key={c} style={{ width:10,height:10,borderRadius:'50%',background:c,display:'inline-block' }} />)}
        <span style={{ fontSize:11,color:'#484f58',marginLeft:8 }}>{p.fullName||'developer'} — resume.json</span>
      </div>
      <div style={{ padding:'26px 34px' }}>
        {/* Header block */}
        <div style={{ background:'#161b22',border:'1px solid #30363d',borderRadius:8,padding:'14px 18px',marginBottom:20 }}>
          <div style={{ fontSize:22,fontWeight:700,color:'#f0f6fc',marginBottom:3 }}>{p.fullName||'Your Name'}</div>
          {p.title && <div style={{ fontSize:12.5,color:acc,marginBottom:9 }}>// {p.title}</div>}
          <div style={{ display:'flex',flexWrap:'wrap',gap:'3px 16px' }}>
            {contacts.map((c,i) => <span key={i} style={{ fontSize:11,color:'#8b949e' }}>{c}</span>)}
          </div>
        </div>
        
        {p.summary && <div style={{ marginBottom:18,padding:'10px 14px',borderLeft:`3px solid ${acc}` }}><span style={{ fontSize:11.5,color:'#8b949e' }}>/** {p.summary} */</span></div>}
        
        {data.experience?.length > 0 && (
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:11,color:'#484f58',marginBottom:7 }}><span style={{ color:acc }}>function </span><span style={{ color:'#d2a8ff' }}>experience</span><span style={{ color:'#e6edf3' }}>()</span> <span style={{ color:'#e6edf3' }}>{'{'}</span></div>
            <div style={{ paddingLeft:16,marginBottom:5 }}>
              {data.experience.map((exp) => (
                <div key={exp.id} style={{ paddingLeft:12,borderLeft:'1px solid #30363d',marginBottom:14 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:3 }}>
                    <span>
                      <span style={{ color:'#79c0ff',fontSize:12.5,fontWeight:500 }}>{exp.role}</span> 
                      <span style={{ color:'#8b949e',fontSize:11.5 }}> @ {exp.company}</span>
                      {exp.location && <span style={{ color:'#484f58',fontSize:10.5 }}> [{exp.location}]</span>}
                    </span>
                    <span style={{ fontSize:11,color:'#484f58' }}>{fmtRange(exp.startDate,exp.endDate,exp.current)}</span>
                  </div>
                  {(exp.bullets||[]).filter(Boolean).map((b,i) => <div key={i} style={{ fontSize:11.5,color:'#8b949e',marginTop:2 }}>→ {b}</div>)}
                </div>
              ))}
            </div>
            <div style={{ fontSize:11,color:'#e6edf3' }}>{'}'}</div>
          </div>
        )}

        {data.projects?.length > 0 && (
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:11,color:'#484f58',marginBottom:7 }}><span style={{ color:acc }}>function </span><span style={{ color:'#d2a8ff' }}>projects</span><span style={{ color:'#e6edf3' }}>()</span> <span style={{ color:'#e6edf3' }}>{'{'}</span></div>
            <div style={{ paddingLeft:16,marginBottom:5 }}>
              {data.projects.map((proj) => (
                <div key={proj.id} style={{ paddingLeft:12,borderLeft:'1px solid #30363d',marginBottom:14 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:3 }}>
                    <span style={{ color:'#79c0ff',fontSize:12.5,fontWeight:500 }}>{proj.name}</span>
                    {proj.url && <span style={{ fontSize:11,color:acc }}>{proj.url}</span>}
                  </div>
                  {proj.description && <div style={{ fontSize:11.5,color:'#8b949e' }}>// {proj.description}</div>}
                  {proj.tech?.length > 0 && <div style={{ fontSize:11,color:'#484f58',marginTop:4 }}>Stack: {proj.tech.join(', ')}</div>}
                </div>
              ))}
            </div>
            <div style={{ fontSize:11,color:'#e6edf3' }}>{'}'}</div>
          </div>
        )}

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:18 }}>
          <div>
            <div style={{ fontSize:11,color:'#484f58',marginBottom:8 }}><span style={{ color:acc }}>const </span><span style={{ color:'#d2a8ff' }}>skills</span><span style={{ color:'#e6edf3' }}> = [</span></div>
            <div style={{ paddingLeft:14,display:'flex',flexWrap:'wrap',gap:5 }}>
              {[...(data.skills?.technical||[]),...(data.skills?.soft||[]),...(data.skills?.languages||[])].map((s) => (
                <span key={s} style={{ fontSize:11,padding:'2px 8px',borderRadius:4,background:`${acc}18`,color:acc,border:`1px solid ${acc}30` }}>{s}</span>
              ))}
            </div>
            <div style={{ fontSize:11,color:'#e6edf3',marginTop:6 }}>]</div>
          </div>
          {data.education?.length > 0 && (
            <div>
              <div style={{ fontSize:11,color:'#484f58',marginBottom:8 }}><span style={{ color:acc }}>const </span><span style={{ color:'#d2a8ff' }}>education</span><span style={{ color:'#e6edf3' }}> = {'{'}</span></div>
              <div style={{ paddingLeft:14 }}>
                {data.education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom:12 }}>
                    <div style={{ fontSize:12.5,color:'#f0f6fc',fontWeight:600 }}>{edu.degree}</div>
                    <div style={{ fontSize:11.5,color:acc }}>{edu.institution}</div>
                    <div style={{ fontSize:11,color:'#484f58' }}>{fmtRange(edu.startDate,edu.endDate)}{edu.location && ` | ${edu.location}`}</div>
                    {edu.gpa && <div style={{ fontSize:11,color:'#8b949e' }}>gpa: "{edu.gpa}"</div>}
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11,color:'#e6edf3' }}>{'}'}</div>
            </div>
          )}
        </div>

        {data.certifications?.length > 0 && (
          <div style={{ marginTop:18 }}>
            <div style={{ fontSize:11,color:'#484f58',marginBottom:8 }}><span style={{ color:acc }}>const </span><span style={{ color:'#d2a8ff' }}>certs</span><span style={{ color:'#e6edf3' }}> = [</span></div>
            <div style={{ paddingLeft:14 }}>
              {data.certifications.map((cert) => (
                <div key={cert.id} style={{ fontSize:11.5,marginBottom:4 }}>
                  <span style={{ color:'#f0f6fc' }}>"{cert.name}"</span> <span style={{ color:'#484f58' }}>by</span> <span style={{ color:acc }}>{cert.issuer}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize:11,color:'#e6edf3' }}>]</div>
          </div>
        )}
      </div>
    </div>
  )
})

// ══════════════════════════════════════════════════════
// 5. CREATIVE
// ══════════════════════════════════════════════════════
const CreativeTemplate = memo(({ data, accentColor, customFont }) => {
  const p   = data.personal
  const acc = accentColor || '#ff6b9d'
  const font = customFont || '"Trebuchet MS",Helvetica,sans-serif'
  const initials = (p.fullName || 'Y').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0,2)
  const contacts = [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean)
  return (
    <div style={{ fontFamily: font, background:'#fff',color:'#2d2d2d',width:800,minHeight:1050,boxSizing:'border-box',display:'grid',gridTemplateColumns:'250px 1fr',overflow:'hidden' }}>
      {/* Sidebar */}
      <div style={{ background: `linear-gradient(180deg, ${acc} 0%, #1a1a2e 100%)`, padding:'34px 22px',color:'#fff' }}>
        <div style={{ width:72,height:72,borderRadius:'50%',background:'rgba(255,255,255,.2)',border:'3px solid rgba(255,255,255,.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,fontWeight:700,margin:'0 auto 18px' }}>
          {initials}
        </div>
        <h2 style={{ fontSize:20,fontWeight:800,textAlign:'center',marginBottom:4 }}>{p.fullName||'Your Name'}</h2>
        {p.title && <p style={{ fontSize:11.5,textAlign:'center',opacity:.85,marginBottom:22 }}>{p.title}</p>}
        <div style={{ borderTop:'1px solid rgba(255,255,255,.3)',paddingTop:18,marginBottom:18 }}>
          {contacts.map((c,i) => <div key={i} style={{ fontSize:11,opacity:.82,marginBottom:6,wordBreak:'break-all' }}>↗ {c}</div>)}
        </div>
        {[...(data.skills?.technical||[]),...(data.skills?.soft||[]),...(data.skills?.languages||[])].length > 0 && (
          <div>
            <div style={{ fontSize:10.5,fontWeight:700,textTransform:'uppercase',letterSpacing:'1.5px',opacity:.65,marginBottom:9 }}>Expertise</div>
            {[...(data.skills.technical||[]),...(data.skills.soft||[]),...(data.skills.languages||[])].map((s) => (
              <div key={s} style={{ marginBottom:7 }}>
                <span style={{ fontSize:11.5 }}>{s}</span>
                <div style={{ height:3.5,background:'rgba(255,255,255,.18)',borderRadius:2,marginTop:3 }}>
                  <div style={{ height:'100%',width:`${60+Math.random()*36}%`,background:'rgba(255,255,255,.58)',borderRadius:2 }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Column */}
      <div style={{ padding:'32px 28px' }}>
        {p.summary && <p style={{ fontSize:13,lineHeight:1.8,color:'#555',marginBottom:22,borderLeft:`4px solid ${acc}`,paddingLeft:13 }}>{p.summary}</p>}
        {data.experience?.length > 0 && (
          <div style={{ marginBottom:22 }}>
            <h2 style={{ fontSize:13,fontWeight:800,textTransform:'uppercase',letterSpacing:'2px',color:acc,marginBottom:13 }}>Experience</h2>
            {data.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom:15,paddingLeft:12,borderLeft:`2px solid ${acc}40` }}>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:2 }}>
                  <strong style={{ fontSize:13 }}>{exp.role}</strong>
                  <span style={{ fontSize:11,color:'#999' }}>{fmtRange(exp.startDate,exp.endDate,exp.current)}</span>
                </div>
                <div style={{ fontSize:12,color:acc,marginBottom:3 }}>{exp.company} {exp.location && `· ${exp.location}`}</div>
                <ul style={{ paddingLeft:16 }}>
                  {(exp.bullets||[]).filter(Boolean).map((b,i) => <li key={i} style={{ fontSize:12,color:'#666',lineHeight:1.6 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}

        {data.projects?.length > 0 && (
          <div style={{ marginBottom:22 }}>
            <h2 style={{ fontSize:13,fontWeight:800,textTransform:'uppercase',letterSpacing:'2px',color:acc,marginBottom:13 }}>Projects</h2>
            {data.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom:12,paddingLeft:12,borderLeft:`2px solid ${acc}40` }}>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:2 }}>
                  <strong style={{ fontSize:13 }}>{proj.name}</strong>
                  {proj.url && <span style={{ fontSize:11,color:acc }}>{proj.url}</span>}
                </div>
                {proj.description && <p style={{ fontSize:12,color:'#666',lineHeight:1.6 }}>{proj.description}</p>}
                {proj.tech?.length > 0 && <div style={{ fontSize:11,color:acc,marginTop:4 }}>Stack: {proj.tech.join(', ')}</div>}
              </div>
            ))}
          </div>
        )}

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:24 }}>
          {data.education?.length > 0 && (
            <div>
              <h2 style={{ fontSize:13,fontWeight:800,textTransform:'uppercase',letterSpacing:'2px',color:acc,marginBottom:13 }}>Education</h2>
              {data.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom:10 }}>
                  <strong style={{ fontSize:13 }}>{edu.degree}</strong>
                  <div style={{ fontSize:12,color:'#555',marginTop:2 }}>{edu.institution}</div>
                  <div style={{ fontSize:11,color:'#888',marginTop:1 }}>{fmtRange(edu.startDate,edu.endDate)}{edu.location && ` · ${edu.location}`}</div>
                  {(edu.gpa || edu.honors) && (
                    <div style={{ fontSize:11,color:acc,marginTop:1 }}>{edu.gpa && `GPA: ${edu.gpa}`}{edu.honors && ` · ${edu.honors}`}</div>
                  )}
                </div>
              ))}
            </div>
          )}
          {data.certifications?.length > 0 && (
            <div>
              <h2 style={{ fontSize:13,fontWeight:800,textTransform:'uppercase',letterSpacing:'2px',color:acc,marginBottom:13 }}>Certifications</h2>
              {data.certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom:8 }}>
                  <strong style={{ fontSize:12.5 }}>{cert.name}</strong>
                  <div style={{ fontSize:11.5,color:'#888' }}>{cert.issuer}{cert.date && ` · ${fmtDate(cert.date)}`}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

// ─── Template map ──────────────────────────────────────────────────────────
const TEMPLATE_MAP = {
  modern:    ModernTemplate,
  minimal:   MinimalTemplate,
  executive: ExecutiveTemplate,
  technical: TechnicalTemplate,
  creative:  CreativeTemplate,
}

// ─── Main export ───────────────────────────────────────────────────────────
export default function ResumePreview({ data, template = 'modern', scale = 0.82, accentColor, customFont, showQrCode = false, style = {} }) {
  const Template = TEMPLATE_MAP[template] || ModernTemplate
  const safeScale = scale || 0.82

  return (
    <div
      style={{
        transform:       `scale(${safeScale})`,
        transformOrigin: 'top center',
        marginBottom:    safeScale < 1 ? `calc((${safeScale} - 1) * 1100px)` : 0,
        boxShadow:       '0 20px 60px rgba(0,0,0,0.5)',
        display:         'inline-block',
        borderRadius:    '6px',
        overflow:        'hidden',
        ...style,
      }}
    >
      <Template data={data} accentColor={accentColor} customFont={customFont} showQrCode={showQrCode} />
    </div>
  )
}

/** 
 * Separate component for the PDF capture target.
 * We render this ONLY ONCE in the ResumeEditorPage to avoid duplicate ID issues.
 */
export function ResumePrintTarget({ data, template = 'modern', accentColor, customFont, showQrCode = false }) {
  const Template = TEMPLATE_MAP[template] || ModernTemplate
  return (
    <div
      id="resume-print-target"
      style={{
        position:      'absolute',
        top:           0,
        left:          '-9999px',
        opacity:       0,
        pointerEvents: 'none',
      }}
    >
      <Template data={data} accentColor={accentColor} customFont={customFont} showQrCode={showQrCode} />
    </div>
  )
}