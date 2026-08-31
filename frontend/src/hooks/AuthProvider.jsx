import { useEffect, useState, useCallback, useMemo } from 'react'
import { supabase, getProfile, getSession, signInWithEmail, signUpWithEmail, isLiveSupabase } from '../lib/supabase.js'
import AuthContext from './AuthContext.jsx'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('proresume_local_user')
      if (raw) return JSON.parse(raw)
      const sbKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
      if (sbKey) {
        const parsed = JSON.parse(localStorage.getItem(sbKey))
        return parsed?.user || null
      }
      return null
    } catch {
      return null
    }
  })
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(() => {
    try {
      const hasLocal = localStorage.getItem('proresume_local_user')
      const hasSb = Object.keys(localStorage).some(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
      return !hasLocal && !hasSb
    } catch {
      return true
    }
  })

  /** Fetch profile row and cache it */
  const refreshProfile = useCallback(async (userId) => {
    if (!userId) { setProfile(null); return }
    const { data } = await getProfile(userId)
    if (data) setProfile(data)
  }, [])

  useEffect(() => {
    let mounted = true

    const markLoaded = () => {
      if (mounted) {
        setLoading(false)
      }
    }

    // Safety timeout: dismiss loader after 800ms
    const timer = setTimeout(() => {
      markLoaded()
    }, 800)

    // Hydrate from existing session or local storage
    getSession()
      .then((session) => {
        if (!mounted) return
        const u = session?.user ?? null
        if (u) {
          setUser(u)
          refreshProfile(u.id)
        } else {
          setUser(null)
          setProfile(null)
        }
        markLoaded()
      })
      .catch((err) => {
        console.warn('[Auth] Hydration note:', err)
        setUser(null)
        setProfile(null)
        markLoaded()
      })

    // Subscribe to auth state changes if live Supabase is active
    let subscription = null
    try {
      const res = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return
          const u = session?.user ?? null
          if (u) {
            setUser(u)
            await refreshProfile(u.id)
          } else {
            setUser(null)
            setProfile(null)
          }
        }
      )
      subscription = res?.data?.subscription
    } catch (e) {
      // Offline mode
    }

    return () => {
      mounted = false
      clearTimeout(timer)
      if (subscription?.unsubscribe) subscription.unsubscribe()
    }
  }, [refreshProfile])

  /** Display name: profile full_name → Google meta → email prefix */
  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Guest'

  /** Avatar URL from Google OAuth or profile */
  const avatarUrl =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    null

  /** Two-letter initials */
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  /** Login handler that immediately sets React user state */
  const login = useCallback(async (email, password) => {
    const res = await signInWithEmail(email, password)
    if (res.error) throw res.error
    if (res.data?.user) {
      setUser(res.data.user)
      await refreshProfile(res.data.user.id)
    }
    return res
  }, [refreshProfile])

  /** Signup handler that immediately sets React user state */
  const signup = useCallback(async (email, password, fullName) => {
    const res = await signUpWithEmail(email, password, fullName)
    if (res.error) throw res.error
    if (res.data?.user) {
      setUser(res.data.user)
      await refreshProfile(res.data.user.id)
    }
    return res
  }, [refreshProfile])

  /** Sign out current user */
  const logout = useCallback(async () => {
    try {
      localStorage.removeItem('proresume_local_user')
      sessionStorage.removeItem('proresume_local_user')
      setUser(null)
      setProfile(null)
      await supabase.auth.signOut().catch(() => {})
    } catch (e) {
      console.warn('Logout error', e)
    }
  }, [])

  const value = useMemo(() => ({
    user,
    profile,
    loading,
    displayName,
    avatarUrl,
    initials,
    login,
    signup,
    logout,
    refreshProfile: () => user && refreshProfile(user.id),
  }), [user, profile, loading, displayName, avatarUrl, initials, login, signup, refreshProfile, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
