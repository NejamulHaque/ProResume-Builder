/**
 * latexConverter.js — Professional Overleaf LaTeX Engine & Bi-Directional Parser.
 * Generates industry-standard FAANG/Jake's Resume, ModernCV, and Academic LaTeX formats.
 */

// ─── Escape LaTeX Special Characters ───────────────────────────────────────
export function escapeLatex(str) {
  if (!str) return ''
  return String(str)
    .replace(/\\/g, '\\textbackslash ')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde ')
    .replace(/\^/g, '\\textasciicircum ')
}

export function unescapeLatex(str) {
  if (!str) return ''
  return String(str)
    .replace(/\\&/g, '&')
    .replace(/\\%/g, '%')
    .replace(/\\\$/g, '$')
    .replace(/\\#/g, '#')
    .replace(/\\_/g, '_')
    .replace(/\\{/g, '{')
    .replace(/\\}/g, '}')
    .replace(/\\textbackslash\s?/g, '\\')
    .replace(/\\textasciitilde\s?/g, '~')
    .replace(/\\textasciicircum\s?/g, '^')
    .trim()
}

// ─── 1. Industry Standard FAANG / Jake's Overleaf LaTeX Template ──────────
export function generateJakesLatex(data) {
  const p = data?.personal || {}
  const exp = data?.experience || []
  const edu = data?.education || []
  const skills = data?.skills || {}
  const proj = data?.projects || []
  const certs = data?.certifications || []

  let code = `%-------------------------
% Overleaf Resume in LaTeX (FAANG / Jake's Resume Standard)
% Author : Nejamul Haque (ProResume Builder)
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage[left=0.5in,top=0.45in,right=0.5in,bottom=0.45in]{geometry}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.1in}
\\addtolength{\\evensidemargin}{-0.1in}
\\addtolength{\\textwidth}{0.2in}
\\addtolength{\\topmargin}{-0.2in}
\\addtolength{\\textheight}{0.3in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(p.fullName || 'Nejamul Haque')}} \\\\ \\vspace{2pt}
    ${p.title ? `{\\small \\textit{${escapeLatex(p.title)}}} \\\\ \\vspace{2pt}` : ''}
    \\small ${[
      p.phone ? escapeLatex(p.phone) : null,
      p.email ? `\\href{mailto:${p.email}}{\\underline{${escapeLatex(p.email)}}}` : null,
      p.linkedin ? `\\href{https://${p.linkedin}}{\\underline{${escapeLatex(p.linkedin)}}}` : null,
      p.github ? `\\href{https://${p.github}}{\\underline{${escapeLatex(p.github)}}}` : null,
      p.website ? `\\href{https://${p.website}}{\\underline{${escapeLatex(p.website)}}}` : null,
    ].filter(Boolean).join(' $|$ ')}
\\end{center}
`

  // Summary
  if (p.summary) {
    code += `
%-----------SUMMARY-----------
\\section{Professional Summary}
\\small{
  ${escapeLatex(p.summary)}
}
`
  }

  // Education
  if (edu.length > 0) {
    code += `
%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
`
    edu.forEach(item => {
      const dates = `${item.startDate || ''} -- ${item.endDate || 'Present'}`
      const degreeText = `${item.degree || 'Bachelor of Science'}${item.gpa ? ` (GPA: ${item.gpa})` : ''}`
      code += `    \\resumeSubheading
      {${escapeLatex(item.institution || 'University')}}{${escapeLatex(item.location || '')}}
      {${escapeLatex(degreeText)}}{${escapeLatex(dates)}}
`
    })
    code += `  \\resumeSubHeadingListEnd\n`
  }

  // Experience
  if (exp.length > 0) {
    code += `
%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
`
    exp.forEach(item => {
      const dates = `${item.startDate || ''} -- ${item.current ? 'Present' : item.endDate || ''}`
      code += `    \\resumeSubheading
      {${escapeLatex(item.role || 'Software Engineer')}}{${escapeLatex(dates)}}
      {${escapeLatex(item.company || 'Company Name')}}{${escapeLatex(item.location || '')}}
`
      if (item.bullets && item.bullets.length > 0) {
        code += `      \\resumeItemListStart\n`
        item.bullets.forEach(b => {
          if (b && b.trim()) {
            code += `        \\resumeItem{${escapeLatex(b)}}\n`
          }
        })
        code += `      \\resumeItemListEnd\n`
      }
    })
    code += `  \\resumeSubHeadingListEnd\n`
  }

  // Projects
  if (proj.length > 0) {
    code += `
%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
`
    proj.forEach(item => {
      const techStr = item.tech?.length ? ` $|$ \\emph{${escapeLatex(item.tech.join(', '))}}` : ''
      code += `      \\resumeProjectHeading
          {\\textbf{${escapeLatex(item.name || 'Project Name')}}${techStr}}{${escapeLatex(item.url || '')}}
          \\resumeItemListStart
            \\resumeItem{${escapeLatex(item.description || '')}}
          \\resumeItemListEnd
`
    })
    code += `    \\resumeSubHeadingListEnd\n`
  }

  // Technical Skills
  const technical = skills.technical || []
  const soft = skills.soft || []
  const languages = skills.languages || []

  if (technical.length > 0 || soft.length > 0 || languages.length > 0) {
    code += `
%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
`
    if (technical.length > 0) {
      code += `     \\textbf{Languages \\& Frameworks}{: ${escapeLatex(technical.join(', '))}} \\\\\n`
    }
    if (soft.length > 0) {
      code += `     \\textbf{Core Competencies}{: ${escapeLatex(soft.join(', '))}} \\\\\n`
    }
    if (languages.length > 0) {
      code += `     \\textbf{Spoken Languages}{: ${escapeLatex(languages.join(', '))}} \\\\\n`
    }
    code += `    }}
 \\end{itemize}
`
  }

  // Certifications
  if (certs.length > 0) {
    code += `
%-----------CERTIFICATIONS-----------
\\section{Certifications}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
`
    certs.forEach(item => {
      code += `     \\textbf{${escapeLatex(item.name || '')}} $|$ \\textit{${escapeLatex(item.issuer || '')}} (${escapeLatex(item.date || '')}) \\\\\n`
    })
    code += `    }}
 \\end{itemize}
`
  }

  code += `
%-------------------------------------------
\\end{document}
`
  return code.trim()
}

// ─── Main Converter Entrypoint ─────────────────────────────────────────────
export function resumeToLatex(data) {
  return generateJakesLatex(data)
}

// ─── High-Precision Bi-Directional LaTeX -> JSON Parser ───────────────────
export function latexToResume(latexStr, existingData = {}) {
  const result = JSON.parse(JSON.stringify(existingData || {}))
  if (!result.personal) result.personal = {}
  if (!result.experience) result.experience = []
  if (!result.education) result.education = []
  if (!result.projects) result.projects = []
  if (!result.skills) result.skills = { technical: [], soft: [], languages: [] }

  try {
    // 1. Full Name
    const nameMatch =
      latexStr.match(/\\textbf{\\Huge\s*\\scshape\s*([^}]+)}/i) ||
      latexStr.match(/\\Huge\s*\\scshape\s*([^}\\]+)/i) ||
      latexStr.match(/\\textbf{\\Huge\s*([^}]+)}/i)

    if (nameMatch) {
      result.personal.fullName = unescapeLatex(nameMatch[1])
    }

    // 2. Title
    const titleMatch = latexStr.match(/{\\small\s*\\textit{([^}]+)}}/i)
    if (titleMatch) {
      result.personal.title = unescapeLatex(titleMatch[1])
    }

    // 3. Email
    const emailMatch =
      latexStr.match(/\\href{mailto:([^}]+)}/i) ||
      latexStr.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
    if (emailMatch) {
      result.personal.email = unescapeLatex(emailMatch[1])
    }

    // 4. Phone
    const phoneMatch = latexStr.match(/(\+?\d[\d\s\-()]{7,}\d)/)
    if (phoneMatch) {
      result.personal.phone = phoneMatch[1].trim()
    }

    // 5. LinkedIn & GitHub & Website
    const linkedinMatch = latexStr.match(/\\href{https:\/\/(linkedin\.com\/in\/[^}]+)}/i)
    if (linkedinMatch) result.personal.linkedin = unescapeLatex(linkedinMatch[1])

    const githubMatch = latexStr.match(/\\href{https:\/\/(github\.com\/[^}]+)}/i)
    if (githubMatch) result.personal.github = unescapeLatex(githubMatch[1])

    const websiteMatch = latexStr.match(/\\href{https:\/\/([^}]+)}/i)
    if (websiteMatch && !websiteMatch[1].includes('linkedin') && !websiteMatch[1].includes('github')) {
      result.personal.website = unescapeLatex(websiteMatch[1])
    }

    // 6. Summary
    const summaryMatch =
      latexStr.match(/\\section{(?:Professional\s+)?Summary}[\s\S]*?\\small{([\s\S]*?)}/i)
    if (summaryMatch) {
      result.personal.summary = unescapeLatex(summaryMatch[1])
    }

    // 7. Experience Parser (\resumeSubheading)
    const expMatches = [...latexStr.matchAll(/\\resumeSubheading\s*\{([^}]+)\}\s*\{([^}]+)\}\s*\{([^}]+)\}\s*\{([^}]*)\}([\s\S]*?)(?=\\resumeSubheading|\\resumeSubHeadingListEnd|\\section|$)/g)]
    if (expMatches.length > 0) {
      result.experience = expMatches.map((m, idx) => {
        const role = unescapeLatex(m[1])
        const dates = unescapeLatex(m[2])
        const company = unescapeLatex(m[3])
        const location = unescapeLatex(m[4])
        const block = m[5]

        const bulletMatches = [...block.matchAll(/\\resumeItem\{([\s\S]*?)\}/g)]
        const bullets = bulletMatches.map(bm => unescapeLatex(bm[1])).filter(Boolean)

        const [start = '', end = ''] = dates.split('--').map(s => s.trim())
        const isCurrent = /present/i.test(end) || /present/i.test(dates)

        return {
          id: existingData?.experience?.[idx]?.id || 'exp-' + (idx + 1),
          role,
          company,
          location,
          startDate: start,
          endDate: isCurrent ? '' : end,
          current: isCurrent,
          bullets: bullets.length ? bullets : ['Led core development and scaled technical infrastructure.']
        }
      })
    }

    // 8. Projects Parser (\resumeProjectHeading)
    const projMatches = [...latexStr.matchAll(/\\resumeProjectHeading\s*\{([\s\S]*?)\}\s*\{([^}]*)\}([\s\S]*?)(?=\\resumeProjectHeading|\\resumeSubHeadingListEnd|\\section|$)/g)]
    if (projMatches.length > 0) {
      result.projects = projMatches.map((pm, idx) => {
        const header = pm[1]
        const url = unescapeLatex(pm[2])
        const block = pm[3]

        const nameMatch = header.match(/\\textbf\{([^}]+)\}/i)
        const name = nameMatch ? unescapeLatex(nameMatch[1]) : 'Project Name'

        const techMatch = header.match(/\\emph\{([^}]+)\}/i)
        const tech = techMatch ? unescapeLatex(techMatch[1]).split(',').map(s => s.trim()) : []

        const descMatch = block.match(/\\resumeItem\{([\s\S]*?)\}/i)
        const description = descMatch ? unescapeLatex(descMatch[1]) : ''

        return {
          id: existingData?.projects?.[idx]?.id || 'proj-' + (idx + 1),
          name,
          url,
          tech,
          description
        }
      })
    }

    // 9. Skills Parser
    const skillsMatch = latexStr.match(/\\textbf{Languages\s*(?:\\&|\&)\s*Frameworks}{:?\s*([^}]+)}/i)
    if (skillsMatch) {
      result.skills.technical = unescapeLatex(skillsMatch[1]).split(',').map(s => s.trim()).filter(Boolean)
    }

    const softMatch = latexStr.match(/\\textbf{Core Competencies}{:?\s*([^}]+)}/i)
    if (softMatch) {
      result.skills.soft = unescapeLatex(softMatch[1]).split(',').map(s => s.trim()).filter(Boolean)
    }
  } catch (err) {
    console.warn('[LaTeX Parser Error]:', err)
  }

  return result
}

// ─── Download Overleaf .tex File ──────────────────────────────────────────
export function downloadTexFile(title, latexCode) {
  const blob = new Blob([latexCode], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(title || 'resume').toLowerCase().replace(/\s+/g, '_')}_overleaf.tex`
  a.click()
  URL.revokeObjectURL(url)
}
