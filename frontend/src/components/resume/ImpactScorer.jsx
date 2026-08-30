import React from 'react'

// Curated Power Verbs & Impact Keywords
export const STRONG_ACTION_VERBS = new Set([
  'architected', 'engineered', 'spearheaded', 'automated', 'orchestrated', 'deployed',
  'optimized', 'refactored', 'benchmarked', 'hardened', 'streamlined', 'implemented',
  'designed', 'accelerated', 'scaled', 'migrated', 'developed', 'configured',
  'integrated', 'containerized', 'provisioned', 'reduced', 'increased', 'eliminated',
  'consolidated', 'modernized', 'debugged', 'monitored', 'secured', 'audited'
])

export const WEAK_PASSIVE_WORDS = new Set([
  'helped', 'worked', 'handled', 'assisted', 'responsible', 'tried', 'did', 'made',
  'participated', 'involved', 'supported', 'learned', 'contributed'
])

export const METRIC_REGEX = /(\d+%(?:\.\d+)?|\$\d+[\d,]*(?:\.\d+)?|\b\d+x\b|\b\d+\s*(?:ms|sec|seconds|minutes|hours|days|k|m|users|requests|req\/s|rps|services|nodes|servers|instances|clusters|vms|endpoints|containers)\b)/i

/**
 * Analyses a bullet string and returns score, badges, and recommendations.
 */
export function analyzeBulletImpact(bulletText = '') {
  if (!bulletText || !bulletText.trim()) return { score: 0, powerVerbs: [], weakWords: [], hasMetrics: false }
  
  const words = bulletText.toLowerCase().match(/[a-z]+/g) || []
  const firstWord = words[0] || ''
  
  const powerVerbs = words.filter(w => STRONG_ACTION_VERBS.has(w))
  const weakWords = words.filter(w => WEAK_PASSIVE_WORDS.has(w))
  const hasMetrics = METRIC_REGEX.test(bulletText)
  const startsWithPowerVerb = STRONG_ACTION_VERBS.has(firstWord)
  
  let score = 50
  if (startsWithPowerVerb) score += 25
  else if (powerVerbs.length > 0) score += 15
  if (hasMetrics) score += 25
  if (weakWords.length > 0) score -= 20
  
  score = Math.max(10, Math.min(100, score))

  return {
    score,
    startsWithPowerVerb,
    powerVerbs: [...new Set(powerVerbs)],
    weakWords: [...new Set(weakWords)],
    hasMetrics,
    firstWord
  }
}

export default function ImpactScorerBadge({ bulletText }) {
  if (!bulletText || bulletText.length < 10) return null
  const { score, startsWithPowerVerb, weakWords, hasMetrics, powerVerbs } = analyzeBulletImpact(bulletText)

  const color = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)'
  const bg = score >= 80 ? 'rgba(61,224,160,0.1)' : score >= 60 ? 'rgba(255,179,71,0.1)' : 'rgba(255,107,157,0.1)'
  const border = score >= 80 ? 'rgba(61,224,160,0.3)' : score >= 60 ? 'rgba(255,179,71,0.3)' : 'rgba(255,107,157,0.3)'

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '2px 8px', borderRadius: 6, background: bg, border: `1px solid ${border}`,
      fontSize: 11, fontWeight: 600, color
    }}>
      <span>{score >= 80 ? '🔥 Strong' : score >= 60 ? '⚡ Good' : '⚠️ Needs Impact'} ({score}/100)</span>
      {hasMetrics && <span title="Contains quantifiable metrics!">📊 Metric</span>}
      {startsWithPowerVerb && <span title="Starts with strong action verb!">🚀 Power Verb</span>}
      {weakWords.length > 0 && <span style={{ color: 'var(--danger)' }} title={`Weak word detected: ${weakWords.join(', ')}`}>⚠️ {weakWords[0]}</span>}
    </div>
  )
}
