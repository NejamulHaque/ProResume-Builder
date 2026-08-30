import { useState } from 'react'

const ROLE_PRESETS = [
  {
    id: 'devsecops',
    name: 'DevSecOps & CS Undergraduate (Nejamul Haque)',
    icon: '🛡️',
    data: {
      personal: {
        fullName: 'NEJAMUL HAQUE',
        title: 'Computer Science Undergraduate | DevSecOps Aspirant',
        email: 'nejamulhaqueruhaan86@gmail.com',
        phone: '+91-6299676007',
        location: 'Bettiah, Bihar, India',
        website: 'https://nejamulhaque.vercel.app/',
        linkedin: 'https://www.linkedin.com/in/nejamulhaque/',
        github: 'https://github.com/NejamulHaque',
        summary: 'Motivated Computer Science undergraduate specializing in backend architecture, system administration, and infrastructure automation. Possesses strong foundational knowledge in Linux environments, network protocols, and version control workflows. Eager to leverage this technical core during the Amroha Police Cybersecurity Internship to analyze system vulnerabilities, investigate digital threats, and transition toward DevSecOps engineering.'
      },
      experience: [
        {
          id: 'exp-1',
          company: 'Independent Technical Training & Development',
          role: 'Self-Directed Systems & Infrastructure Learning',
          location: 'Self-Paced',
          startDate: '2026-03',
          endDate: '',
          current: true,
          bullets: [
            'Built a local sandbox to master Linux system administration, permissions, and CLI operations.',
            'Conducted deep dives into networking protocols (TCP/IP, DNS, SSH, Firewalls) and data routing.',
            'Managed personal project repositories independently using structured Git workflows.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'Teerthanker Mahaveer University',
          degree: 'B.Tech in Computer Science (Honors)',
          location: 'Moradabad, Uttar Pradesh',
          startDate: '2023-08',
          endDate: '2027-05',
          gpa: '',
          honors: 'Capstone: AI-powered document classifier using Python & NLP'
        }
      ],
      skills: {
        technical: ['Linux (Ubuntu)', 'Bash Scripting', 'System Permissions', 'Process Management', 'TCP/IP Stack', 'DNS', 'HTTP/HTTPS', 'SSH Key Management', 'Ports & Firewalls', 'OSI Model', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Generative AI Integration'],
        soft: ['Git & GitHub Workflows', 'Branching & Merging', 'Vulnerability Analysis', 'System Security'],
        languages: ['English', 'Hindi', 'Urdu']
      },
      projects: [
        {
          id: 'proj-1',
          name: 'Linux System Administration & Automation Lab',
          url: 'https://github.com/NejamulHaque',
          tech: ['Linux (Ubuntu)', 'Bash Scripting', 'Security'],
          description: 'Configured a local Linux environment to practice file system security, user privilege management, and process monitoring.'
        }
      ],
      certifications: [
        { id: 'cert-1', name: 'MongoDB Associate Developer', issuer: 'MongoDB University', date: '2025' },
        { id: 'cert-2', name: 'GitHub Actions', issuer: 'GitHub', date: '2026' }
      ]
    }
  },
  {
    id: 'pm',
    name: 'Senior Product Manager',
    icon: '📊',
    data: {
      personal: {
        fullName: 'Alex Reynolds',
        title: 'Senior Product Manager',
        email: 'alex.reynolds@example.com',
        phone: '+1 (555) 349-2910',
        location: 'San Francisco, CA',
        website: 'alexproduct.co',
        linkedin: 'linkedin.com/in/alexreynolds-pm',
        github: '',
        summary: 'Data-driven Senior Product Manager with 6+ years driving product strategy, roadmaps, and 0-to-1 launches that generated over $14M in ARR across B2B SaaS and consumer tech.'
      },
      experience: [
        {
          id: 'exp-1',
          company: 'Vanguard SaaS Solutions',
          role: 'Senior Product Manager',
          location: 'San Francisco, CA',
          startDate: '2022-01',
          endDate: '',
          current: true,
          bullets: [
            'Spearheaded the enterprise onboarding redesign, boosting 30-day user retention by 34% and ARR by $4.2M.',
            'Conducted 60+ customer discovery interviews to launch an AI automation module used by 85,000+ weekly active users.',
            'Managed cross-functional team of 12 engineers, 2 designers, and product analysts across bi-weekly agile sprints.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'University of California, Berkeley',
          degree: 'B.S. in Business Administration & Information Systems',
          location: 'Berkeley, CA',
          startDate: '2015-09',
          endDate: '2019-05',
          gpa: '3.85',
          honors: 'Dean’s Honor List'
        }
      ],
      skills: {
        technical: ['Product Roadmap', 'SQL & Amplitude', 'A/B Testing', 'User Research', 'Figma', 'Jira / Confluence'],
        soft: ['Stakeholder Management', 'Go-To-Market Strategy', 'Data Analytics', 'Cross-Functional Leadership'],
        languages: ['English (Native)', 'Spanish (Conversational)']
      },
      projects: [
        {
          id: 'proj-1',
          name: 'Growth Funnel Optimization',
          url: 'vanguard.com/case-study',
          description: 'Redesigned user checkout flow, increasing conversion rate from 2.4% to 4.1%.',
          tech: ['Mixpanel', 'Optimizely', 'SQL']
        }
      ],
      certifications: [
        { id: 'cert-1', name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', date: '2022-04' }
      ]
    }
  },
  {
    id: 'designer',
    name: 'Lead UI/UX Product Designer',
    icon: '🎨',
    data: {
      personal: {
        fullName: 'Maya Lin',
        title: 'Lead UI/UX & Product Designer',
        email: 'maya.design@example.com',
        phone: '+1 (555) 892-3104',
        location: 'New York, NY',
        website: 'mayadesign.portfolio',
        linkedin: 'linkedin.com/in/mayalin-ux',
        github: 'dribbble.com/mayalin',
        summary: 'Passionate Lead Product Designer specializing in building accessible design systems, intuitive user workflows, and high-conversion mobile/desktop digital products for fintech and consumer apps.'
      },
      experience: [
        {
          id: 'exp-1',
          company: 'Fintech Studio Labs',
          role: 'Lead UI/UX Designer',
          location: 'New York, NY',
          startDate: '2021-06',
          endDate: '',
          current: true,
          bullets: [
            'Created comprehensive multi-brand Design System adopted by 40+ engineering teams, decreasing design QA debt by 50%.',
            'Led complete visual redesign of flagship mobile banking app, boosting App Store rating from 3.8 to 4.9 stars.',
            'Delivered interactive prototypes with Figma, conducting 40+ usability tests that unlocked a 28% increase in activation.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'Rhode Island School of Design (RISD)',
          degree: 'B.F.A. in Graphic & Interactive Design',
          location: 'Providence, RI',
          startDate: '2016-09',
          endDate: '2020-05',
          gpa: '3.9',
          honors: 'Summa Cum Laude'
        }
      ],
      skills: {
        technical: ['Figma', 'Design Systems', 'Prototyping', 'User Research', 'HTML/CSS/Tailwind', 'Motion UI'],
        soft: ['Visual Storytelling', 'Design Sprint Facilitation', 'Accessibility (WCAG 2.1)', 'Empathy-Driven UX'],
        languages: ['English (Fluent)', 'Mandarin (Native)']
      },
      projects: [
        {
          id: 'proj-1',
          name: 'Nova Design Tokens',
          url: 'figma.com/@novatokens',
          description: 'Open-source design token architecture synced directly to React Tailwind code.',
          tech: ['Figma', 'Tokens Studio', 'React']
        }
      ],
      certifications: [
        { id: 'cert-1', name: 'Nielsen Norman Group UX Master Certified', issuer: 'NN/g', date: '2023-01' }
      ]
    }
  }
]

export default function SampleDataPicker({ onSelectPreset }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-sm"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
          borderRadius: 8,
          padding: '5px 10px',
          fontSize: 12,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flexShrink: 0,
        }}
        title="Fill with professional example data"
      >
        <span>✨</span> Presets
      </button>

      {isOpen && (
        <>
          <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 6,
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: 8, minWidth: 260,
            boxShadow: 'var(--shadow-xl)', zIndex: 100, animation: 'fadeIn 0.15s ease'
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '4px 8px 8px' }}>
              Load Role Sample Preset
            </div>
            {ROLE_PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  if (window.confirm(`Load ${p.name} sample data? This will update your current draft.`)) {
                    onSelectPreset(p.data)
                    setIsOpen(false)
                  }
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  width: '100%', padding: '8px 10px', borderRadius: 8,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-primary)', fontSize: 12.5, fontFamily: 'var(--font-body)',
                  textAlign: 'left', transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <span style={{ fontSize: 16 }}>{p.icon}</span>
                <span style={{ fontWeight: 500 }}>{p.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
