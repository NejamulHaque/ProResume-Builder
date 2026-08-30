import { useContext } from 'react'
import AuthContext from './AuthContext.jsx'

/**
 * useAuth hook — provides access to the shared auth state and profile data.
 * Must be used within an <AuthProvider> component.
 *
 * @returns {AuthContextValue}
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
