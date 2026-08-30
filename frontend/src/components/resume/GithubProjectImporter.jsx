import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { genId } from '../../lib/resumeDefaults.js'

export default function GithubProjectImporter({ onImportProjects, currentUsername = 'NejamulHaque' }) {
  const [username, setUsername] = useState(currentUsername)
  const [loading, setLoading] = useState(false)
  const [repos, setRepos] = useState([])
  const [open, setOpen] = useState(false)

  const handleFetchRepos = async (e) => {
    if (e) e.preventDefault()
    const user = (username || '').trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '')
    if (!user) {
      toast.error('Please enter a GitHub username')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=pushed&per_page=15`)
      if (!res.ok) {
        if (res.status === 404) throw new Error(`GitHub user "${user}" not found`)
        if (res.status === 403) throw new Error('GitHub API rate limit reached, try again shortly')
        throw new Error('Failed to fetch repositories')
      }
      const data = await res.json()
      // Filter out forks if preferred or show all with star/language badges
      const sorted = (Array.isArray(data) ? data : []).sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      setRepos(sorted)
      if (sorted.length === 0) {
        toast('No public repositories found for this user', { icon: 'ℹ️' })
      } else {
        toast.success(`Found ${sorted.length} repositories for ${user}! 🐙`)
      }
    } catch (err) {
      toast.error(err.message || 'Error fetching repositories')
    } finally {
      setLoading(false)
    }
  }

  const handleImportOne = (repo) => {
    const newProj = {
      id: genId(),
      name: repo.name || 'Repository',
      description: repo.description || `Open-source ${repo.language || 'software'} project with active CI/CD deployment and modular architecture.`,
      url: repo.html_url || `https://github.com/${username}/${repo.name}`,
      tech: [repo.language, ...(repo.topics || []).slice(0, 4)].filter(Boolean)
    }
    onImportProjects([newProj])
    toast.success(`Imported "${repo.name}" to projects! 🚀`)
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <button
        type="button"
        onClick={() => {
          setOpen(!open)
          if (!open && repos.length === 0) handleFetchRepos()
        }}
        className="btn btn-sm"
        style={{
          background: 'rgba(36, 41, 46, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#fff', fontWeight: 600, borderRadius: 8,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 12px'
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
        <span>{open ? 'Hide GitHub Importer' : '🐙 Import from GitHub'}</span>
      </button>

      {open && (
        <div style={{
          marginTop: 10, padding: 14, background: 'var(--bg-secondary)',
          border: '1px solid var(--border)', borderRadius: 10,
          animation: 'fadeIn 0.2s ease'
        }}>
          <form onSubmit={handleFetchRepos} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              className="input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. NejamulHaque"
              style={{ fontSize: 13 }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{ flexShrink: 0 }}
            >
              {loading ? <div className="spinner sm" /> : 'Fetch Repos'}
            </button>
          </form>

          {/* Repo list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
            {repos.map(r => (
              <div
                key={r.id}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '10px 12px', display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between', gap: 12
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--accent)' }}>
                      {r.name}
                    </span>
                    {r.language && (
                      <span style={{ fontSize: 10.5, padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                        {r.language}
                      </span>
                    )}
                    {r.stargazers_count > 0 && (
                      <span style={{ fontSize: 10.5, color: '#f59e0b' }}>
                        ⭐ {r.stargazers_count}
                      </span>
                    )}
                  </div>
                  {r.description && (
                    <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '4px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleImportOne(r)}
                  className="btn btn-primary btn-xs"
                  style={{ flexShrink: 0, fontWeight: 700 }}
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
