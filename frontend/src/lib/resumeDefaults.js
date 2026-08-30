/** Blank resume data — used when creating a new resume */
export const DEFAULT_RESUME_DATA = {
  personal: {
    fullName:  '',
    title:     '',
    email:     '',
    phone:     '',
    location:  '',
    website:   '',
    linkedin:  '',
    github:    '',
    summary:   '',
  },
  experience:     [],
  education:      [],
  skills: {
    technical: [],
    soft:      [],
    languages: [],
  },
  projects:       [],
  certifications: [],
  achievements:   [],
}

/** Sample resume — Official Resume Data for Nejamul Haque */
export const SAMPLE_RESUME_DATA = {
  personal: {
    fullName:  'NEJAMUL HAQUE',
    title:     'Computer Science Undergraduate | DevSecOps Aspirant',
    email:     'nejamulhaque.works@gmail.com',
    phone:     '+91-620-123-4567',
    location:  'Bettiah, Bihar, India',
    website:   'https://nejamulhaque.vercel.app/',
    linkedin:  'https://www.linkedin.com/in/nejamulhaque/',
    github:    'https://github.com/NejamulHaque',
    summary:
      'Motivated Computer Science undergraduate specializing in backend architecture, system administration, and infrastructure automation. Possesses strong foundational knowledge in Linux environments, network protocols, and version control workflows. Eager to leverage this technical core during the Amroha Police Cybersecurity Internship to analyze system vulnerabilities, investigate digital threats, and transition toward DevSecOps engineering.',
  },
  experience: [
    {
      id:        'e1',
      company:   'Independent Technical Training & Development',
      role:      'Self-Directed Systems & Infrastructure Learning',
      location:  'Self-Paced',
      startDate: '2026-03',
      endDate:   '',
      current:   true,
      bullets: [
        'Built a local sandbox to master Linux system administration, permissions, and CLI operations.',
        'Conducted deep dives into networking protocols (TCP/IP, DNS, SSH, Firewalls) and data routing.',
        'Managed personal project repositories independently using structured Git workflows.',
      ],
    },
  ],
  education: [
    {
      id:          'ed1',
      institution: 'Teerthanker Mahaveer University',
      degree:      'B.Tech in Computer Science (Honors)',
      location:    'Moradabad, Uttar Pradesh',
      startDate:   '2023-08',
      endDate:     '2027-05',
      gpa:         '',
      honors:      'Capstone: AI-powered document classifier using Python & NLP deployed as REST API into React',
    },
    {
      id:          'ed2',
      institution: 'Bihar State Education Board',
      degree:      'Higher Secondary Education (12th Grade)',
      location:    'Patna, Bihar',
      startDate:   '2021-04',
      endDate:     '2023-03',
      gpa:         '',
      honors:      'Academic Excellence Award for top performance in Science and Mathematics',
    },
  ],
  skills: {
    technical: [
      'Linux (Ubuntu)',
      'Bash Scripting',
      'System Permissions',
      'Process Management',
      'TCP/IP Stack',
      'DNS',
      'HTTP/HTTPS',
      'SSH Key Management',
      'Ports & Firewalls',
      'OSI Model',
      'JavaScript',
      'Node.js',
      'Express.js',
      'MongoDB (MERN Basics)',
      'API Integration',
      'Generative AI Integration',
      'Prompt Engineering',
      'AI API Consumption',
    ],
    soft: [
      'Git & GitHub Workflows',
      'Branching & Merging',
      'Vulnerability Analysis',
      'System Security Awareness',
      'Infrastructure Automation',
    ],
    languages: ['English', 'Hindi', 'Urdu'],
  },
  projects: [
    {
      id:          'p1',
      name:        'Linux System Administration & Automation Lab',
      description: 'Configured a local Linux environment to practice file system security, user privilege management, and process monitoring. Developed custom Bash automation scripts to manage local files, check system uptime, and monitor authentication logs for security awareness.',
      tech:        ['Linux (Ubuntu)', 'Bash Scripting', 'Privilege Management', 'Log Monitoring'],
      url:         'https://github.com/NejamulHaque',
    },
    {
      id:          'p2',
      name:        'Network Security & Connectivity Lab',
      description: 'Built local networking scenarios to test port configurations, firewall rules, and secure communication lines. Configured and hardened secure remote access via SSH key pairs, eliminating password vulnerabilities on local test environments.',
      tech:        ['TCP/IP', 'DNS', 'SSH Key Pairs', 'Firewalls', 'Port Hardening'],
      url:         'https://github.com/NejamulHaque',
    },
    {
      id:          'p3',
      name:        'AI-Powered Document Classifier (Capstone Project)',
      description: 'Built an AI-powered document classifier using Python and a pre-trained NLP model, deployed as a REST API integrated into a React frontend.',
      tech:        ['Python', 'NLP Model', 'REST API', 'React.js'],
      url:         'https://nejamulhaque.vercel.app/',
    },
  ],
  certifications: [
    { id: 'c1', name: 'MongoDB Associate Developer', issuer: 'MongoDB University', date: '2025' },
    { id: 'c2', name: 'GitHub Actions', issuer: 'GitHub', date: '2026' },
    { id: 'c3', name: 'Introduction to Generative AI', issuer: 'Google Cloud', date: '2024' },
    { id: 'c4', name: 'Anthropic Claude Developer', issuer: 'Anthropic', date: '2026' },
  ],
  achievements: [],
}

/** Unique ID generator */
export const genId = () => Math.random().toString(36).slice(2, 10)

/** Template accent colours */
export const TEMPLATE_COLORS = {
  modern:    '#7c6fff',
  minimal:   '#3de0a0',
  executive: '#c0a040',
  creative:  '#ff6b9d',
  technical: '#00d4aa',
}

/** All available template definitions */
export const TEMPLATES = [
  { id: 'modern',    name: 'Modern',    desc: 'Clean lines with bold accent colors',        tag: 'Popular'   },
  { id: 'minimal',   name: 'Minimal',   desc: 'Typography-focused, ultra-clean serif layout', tag: 'Clean'     },
  { id: 'executive', name: 'Executive', desc: 'Polished dark header for senior roles',        tag: 'Corporate' },
  { id: 'technical', name: 'Technical', desc: 'Dark terminal aesthetic for engineers',         tag: 'Dev'       },
  { id: 'creative',  name: 'Creative',  desc: 'Sidebar layout that makes you stand out',      tag: 'Unique'    },
]
