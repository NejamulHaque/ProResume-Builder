import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import {
  getResumes,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
} from '../lib/supabase.js'

/**
 * useResumes — manages the list of resumes for the authenticated user.
 * Falls back to localStorage when Supabase is unavailable (demo mode).
 */
export function useResumes(userId) {
  const [resumes,  setResumes]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const STORAGE_KEY = `resumes_${userId}`

  // ─── Load from localStorage fallback ──────────────────────────────────
  const loadFromStorage = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  }, [STORAGE_KEY])

  const saveToStorage = useCallback((data) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
  }, [STORAGE_KEY])

  // ─── Fetch ─────────────────────────────────────────────────────────────
  const fetchResumes = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await getResumes(userId)
      if (err) throw err
      const list = data || []
      setResumes(list)
      saveToStorage(list)
    } catch (e) {
      setError(e.message)
      // Use cached data on error
      const cached = loadFromStorage()
      if (cached.length) setResumes(cached)
    } finally {
      setLoading(false)
    }
  }, [userId, loadFromStorage, saveToStorage])

  useEffect(() => { fetchResumes() }, [fetchResumes])

  // ─── Create ─────────────────────────────────────────────────────────────
  const create = useCallback(async (title, template, data) => {
    try {
      const { data: created, error: err } = await createResume(userId, title, template, data)
      if (err) throw err
      setResumes((prev) => {
        const next = [created, ...prev]
        saveToStorage(next)
        return next
      })
      return created
    } catch (e) {
      toast.error('Failed to create resume: ' + e.message)
      return null
    }
  }, [userId, saveToStorage])

  // ─── Update ─────────────────────────────────────────────────────────────
  const update = useCallback(async (id, updates) => {
    try {
      const { data: updated, error: err } = await updateResume(id, updates)
      if (err) throw err
      setResumes((prev) => {
        const next = prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
        saveToStorage(next)
        return next
      })
      return updated
    } catch (e) {
      toast.error('Failed to save: ' + e.message)
      return null
    }
  }, [saveToStorage])

  // ─── Delete ─────────────────────────────────────────────────────────────
  const remove = useCallback(async (id) => {
    try {
      const { error: err } = await deleteResume(id)
      if (err) throw err
      setResumes((prev) => {
        const next = prev.filter((r) => r.id !== id)
        saveToStorage(next)
        return next
      })
      toast.success('Resume deleted')
    } catch (e) {
      toast.error('Failed to delete: ' + e.message)
    }
  }, [saveToStorage])

  // ─── Duplicate ───────────────────────────────────────────────────────────
  const duplicate = useCallback(async (id) => {
    try {
      const { data: copy, error: err } = await duplicateResume(id, userId)
      if (err) throw err
      setResumes((prev) => {
        const next = [copy, ...prev]
        saveToStorage(next)
        return next
      })
      toast.success('Resume duplicated')
      return copy
    } catch (e) {
      toast.error('Failed to duplicate: ' + e.message)
      return null
    }
  }, [userId, saveToStorage])

  return { resumes, loading, error, fetchResumes, create, update, remove, duplicate }
}
