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

/** Sample resume — used for template previews (Featuring Nejamul Haque) */
export const SAMPLE_RESUME_DATA = {
  personal: {
    fullName:  'Nejamul Haque',
    title:     'Full-Stack Architect & AI Systems Engineer',
    email:     'nejamulhaque.works@gmail.com',
    phone:     '+91 98765 43210',
    location:  'Bettiah, Bihar, India',
    website:   'irus-ai.onrender.com',
    linkedin:  'linkedin.com/in/nejamulhaque',
    github:    'github.com/nejamul05',
    summary:
      'High-impact Full-Stack Architect with deep expertise in cloud-native microservices, PostgreSQL indexing, and generative AI platforms. Creator of IRUS AI and ProResume Builder, scaling high-throughput applications to thousands of active users.',
  },
  experience: [
    {
      id:        'e1',
      company:   'IRUS AI Platform',
      role:      'Lead Architect & Founder',
      location:  'Remote',
      startDate: '2023-01',
      endDate:   '',
      current:   true,
      bullets: [
        'Architected core career intelligence platform handling 100K+ monthly AI requests with 99.99% uptime.',
        'Engineered real-time ATS optimization algorithms boosting interview callback rates by 3.2x.',
        'Deployed automated PostgreSQL indexing pipelines cutting query latency by 44% on Neon cloud.',
      ],
    },
    {
      id:        'e2',
      company:   'Tech Innovations Corp',
      role:      'Senior Full-Stack Engineer',
      location:  'Bengaluru, India',
      startDate: '2021-06',
      endDate:   '2022-12',
      current:   false,
      bullets: [
        'Led migration from monolithic stack to React & Node.js microservices, cutting deployment cycle by 65%.',
        'Integrated multi-tier caching with Redis, reducing database load during traffic spikes by 50%.',
        'Mentored 8 junior software engineers and led rigorous automated CI/CD pipeline development.',
      ],
    },
  ],
  education: [
    {
      id:          'ed1',
      institution: 'Aryabhatta Knowledge University',
      degree:      'Bachelor of Technology in Computer Science',
      location:    'Patna, India',
      startDate:   '2018-08',
      endDate:     '2022-05',
      gpa:         '8.8 / 10.0',
      honors:      'First Class with Distinction',
    },
  ],
  skills: {
    technical: ['React.js', 'Node.js', 'PostgreSQL', 'Neon DB', 'TypeScript', 'Python', 'Docker', 'Redis', 'Tailwind CSS', 'GraphQL', 'REST APIs', 'Supabase'],
    soft:      ['System Architecture', 'Technical Leadership', 'Rapid Prototyping', 'Product Strategy', 'Agile / Scrum'],
    languages: ['English (Professional)', 'Hindi (Native)', 'Urdu (Fluent)'],
  },
  projects: [
    {
      id:          'p1',
      name:        'IRUS AI (irus-ai.onrender.com)',
      description: 'Production generative AI platform for automated career growth, bullet optimization, and intelligence.',
      tech:        ['React', 'Node.js', 'OpenAI API', 'Tailwind CSS'],
      url:         'irus-ai.onrender.com',
    },
    {
      id:          'p2',
      name:        'ProResume Builder',
      description: 'Privacy-first resume builder with 10-day auto-purge database retention and high-DPI vector PDF printing.',
      tech:        ['React', 'Vite', 'PostgreSQL', 'Express'],
      url:         'github.com/nejamul05/proresume-builder',
    },
  ],
  certifications: [
    { id: 'c1', name: 'Cloud Native Architecture & PostgreSQL', issuer: 'Neon / AWS', date: '2024-02' },
    { id: 'c2', name: 'Advanced Full-Stack Engineering',        issuer: 'Meta / Coursera', date: '2023-08' },
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
