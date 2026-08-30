import { useState } from 'react'

const COMMON_STOP_WORDS = new Set([
  'and', 'the', 'to', 'of', 'a', 'in', 'for', 'is', 'on', 'that', 'by', 'this',
  'with', 'i', 'you', 'it', 'not', 'or', 'be', 'are', 'from', 'at', 'as', 'your',
  'all', 'have', 'new', 'more', 'an', 'was', 'we', 'will', 'home', 'can', 'us',
  'about', 'if', 'page', 'my', 'has', 'search', 'free', 'but', 'our', 'one',
  'other', 'do', 'no', 'information', 'time', 'they', 'site', 'he', 'up', 'may',
  'what', 'which', 'their', 'news', 'out', 'use', 'any', 'there', 'see', 'only',
  'so', 'his', 'when', 'contact', 'here', 'business', 'who', 'web', 'also',
  'now', 'help', 'get', 'pm', 'view', 'online', 'c', 'e', 'first', 'am', 'been',
  'would', 'how', 'were', 'me', 's', 'services', 'some', 'these', 'click', 'its',
  'like', 'service', 'x', 'than', 'find', 'price', 'date', 'back', 'top', 'people',
  'had', 'list', 'name', 'just', 'over', 'state', 'year', 'day', 'into', 'email',
  'two', 'health', 'n', 'world', 're', 'next', 'used', 'go', 'b', 'work', 'last',
  'most', 'products', 'music', 'buy', 'data', 'make', 'them', 'should', 'product',
  'system', 'post', 'her', 'city', 't', 'add', 'policy', 'number', 'such', 'please',
  'available', 'copyright', 'support', 'message', 'after', 'best', 'software', 'then',
  'jan', 'good', 'video', 'well', 'where', 'info', 'rights', 'public', 'books',
  'high', 'school', 'through', 'm', 'each', 'links', 'she', 'warning', 'review',
  'years', 'order', 'very', 'privacy', 'book', 'items', 'company', 'read', 'group',
  'need', 'many', 'user', 'said', 'de', 'does', 'set', 'under', 'general', 'research',
  'university', 'january', 'mail', 'full', 'map', 'reviews', 'program', 'life', 'know',
  'games', 'way', 'days', 'management', 'part', 'could', 'great', 'united', 'hotel',
  'real', 'item', 'international', 'center', 'ebay', 'must', 'store', 'travel',
  'comments', 'made', 'development', 'report', 'off', 'member', 'details', 'line',
  'terms', 'before', 'hotels', 'did', 'send', 'right', 'type', 'because', 'local',
  'those', 'using', 'results', 'office', 'education', 'national', 'car', 'design',
  'take', 'posted', 'internet', 'address', 'community', 'within', 'states', 'area',
  'want', 'phone', 'dvd', 'shipping', 'reserved', 'subject', 'between', 'forum',
  'family', 'l', 'long', 'based', 'w', 'code', 'show', 'o', 'even', 'black', 'check',
  'special', 'prices', 'website', 'index', 'being', 'women', 'much', 'sign', 'file',
  'link', 'open', 'today', 'technology', 'south', 'case', 'project', 'same', 'pages',
  'version', 'section', 'found', 'sports', 'house', 'related', 'security', 'both',
  'county', 'american', 'photo', 'game', 'members', 'power', 'while', 'care', 'network',
  'down', 'computer', 'systems', 'three', 'total', 'place', 'end', 'following',
  'download', 'h', 'him', 'without', 'per', 'access', 'think', 'north', 'resources',
  'current', 'posts', 'big', 'media', 'law', 'control', 'water', 'history', 'pictures',
  'size', 'art', 'personal', 'since', 'including', 'guide', 'shop', 'directory',
  'board', 'location', 'change', 'white', 'text', 'small', 'rating', 'rate', 'government',
  'children', 'during', 'usa', 'return', 'students', 'v', 'shopping', 'account', 'times',
  'sites', 'level', 'digital', 'profile', 'previous', 'form', 'events', 'love', 'old',
  'john', 'main', 'call', 'hours', 'image', 'department', 'title', 'description', 'non',
  'k', 'y', 'photo', 'photos', 'experience', 'responsibilities', 'qualifications', 'requirements',
  'ability', 'skills', 'role', 'team', 'working', 'candidate', 'position'
])

export default function JobDescriptionMatcher({ resumeData, onAddSkill }) {
  const [jobText, setJobText] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Extract text from current resume
  const resumeSkills = [
    ...(resumeData?.skills?.technical || []),
    ...(resumeData?.skills?.soft || []),
    ...(resumeData?.skills?.languages || [])
  ].map(s => s.toLowerCase().trim())

  const resumeFullText = [
    resumeData?.personal?.summary || '',
    ...(resumeData?.experience || []).map(e => `${e.role} ${e.company} ${(e.bullets || []).join(' ')}`),
    ...(resumeData?.projects || []).map(p => `${p.name} ${p.description} ${(p.tech || []).join(' ')}`),
    ...resumeSkills
  ].join(' ').toLowerCase()

  // Extract potential keywords from Job Description
  const rawWords = (jobText.match(/[a-zA-Z+#.-]{2,20}/g) || [])
    .map(w => w.toLowerCase().replace(/^[.,]+|[.,]+$/g, ''))
    .filter(w => w.length > 2 && !COMMON_STOP_WORDS.has(w) && !/^\d+$/.test(w))

  // Count frequencies
  const freqMap = {}
  rawWords.forEach(w => { freqMap[w] = (freqMap[w] || 0) + 1 })

  // Sort top keywords
  const topKeywords = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => {
      const isMatched = resumeFullText.includes(word)
      return { word, count, isMatched }
    })

  const matchedCount = topKeywords.filter(k => k.isMatched).length
  const totalKeywords = topKeywords.length
  const matchPercentage = totalKeywords > 0 ? Math.round((matchedCount / totalKeywords) * 100) : 0

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 16
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: 0, fontFamily: 'var(--font-body)', color: 'var(--text-primary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontSize: 16 }}>🎯</span>
          <span style={{ fontSize: 13.5, fontWeight: 700 }}>ATS Job Matcher</span>
          {jobText && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
              background: matchPercentage >= 70 ? 'rgba(61,224,160,0.15)' : 'rgba(255,179,71,0.15)',
              color: matchPercentage >= 70 ? 'var(--success)' : 'var(--warning)',
            }}>
              {matchPercentage}% Match
            </span>
          )}
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.2s', color: 'var(--text-muted)' }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {isOpen && (
        <div style={{ marginTop: 14, animation: 'fadeIn 0.2s ease' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.4 }}>
            Paste the job posting description below to check keyword match and ATS score:
          </p>
          <textarea
            className="input"
            rows={3}
            value={jobText}
            onChange={e => setJobText(e.target.value)}
            placeholder="Paste job requirements, responsibilities or job posting here…"
            style={{ fontSize: 12, marginBottom: 12 }}
          />

          {totalKeywords > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Detected ATS Keywords ({matchedCount}/{totalKeywords} found):
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: matchPercentage >= 70 ? 'var(--success)' : 'var(--warning)'
                }}>
                  {matchPercentage}% Match
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {topKeywords.map(({ word, isMatched, count }) => (
                  <span
                    key={word}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: 11.5, padding: '3px 8px', borderRadius: 6,
                      background: isMatched ? 'rgba(61, 224, 160, 0.12)' : 'rgba(255, 107, 157, 0.12)',
                      border: `1px solid ${isMatched ? 'rgba(61, 224, 160, 0.3)' : 'rgba(255, 107, 157, 0.3)'}`,
                      color: isMatched ? 'var(--success)' : 'var(--danger)',
                    }}
                  >
                    <span>{isMatched ? '✓' : '✗'}</span>
                    <strong>{word}</strong>
                    {!isMatched && onAddSkill && (
                      <button
                        onClick={() => onAddSkill(word)}
                        title={`Add "${word}" to skills`}
                        style={{
                          background: 'none', border: 'none', color: 'var(--accent)',
                          cursor: 'pointer', padding: '0 2px', fontWeight: 700, fontSize: 12
                        }}
                      >
                        +
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {matchPercentage < 70 && (
                <div style={{
                  marginTop: 10, padding: '8px 10px', borderRadius: 6,
                  background: 'rgba(255, 179, 71, 0.08)', border: '1px solid rgba(255, 179, 71, 0.2)',
                  fontSize: 11.5, color: 'var(--warning)', lineHeight: 1.4
                }}>
                  💡 Click <strong>+</strong> next to missing keywords to add them to your skills and increase your interview callback chances!
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
