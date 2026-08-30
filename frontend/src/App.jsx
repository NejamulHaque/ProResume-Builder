import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/AuthProvider.jsx'
import { useAuth }     from './hooks/useAuth.jsx'

// Lazy load pages
const LandingPage        = lazy(() => import('./pages/LandingPage.jsx'))
const AuthPage           = lazy(() => import('./pages/AuthPage.jsx'))
const DashboardPage      = lazy(() => import('./pages/DashboardPage.jsx'))
const ResumeEditorPage   = lazy(() => import('./pages/ResumeEditorPage.jsx'))
const PublicResumePage   = lazy(() => import('./pages/PublicResumePage.jsx'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage.jsx'))

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  return user ? children : <Navigate to="/auth" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  return !user ? children : <Navigate to="/dashboard" replace />
}

function FullPageSpinner() {
  return (
    <div className="full-page-center">
      <div style={{ textAlign: 'center' }}>
        <div className="spinner lg" style={{ margin: '0 auto 16px' }} />
        <p className="text-muted" style={{ fontSize: 14 }}>Loading ProResume…</p>
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Routes>
        <Route path="/"                  element={<LandingPage />} />
        <Route path="/auth"              element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path="/dashboard"         element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/resume/new"        element={<ProtectedRoute><ResumeEditorPage /></ProtectedRoute>} />
        <Route path="/resume/:id"        element={<ProtectedRoute><ResumeEditorPage /></ProtectedRoute>} />
        <Route path="/resume/view/:id"   element={<PublicResumePage />} />
        <Route path="/admin"             element={<AdminDashboardPage />} />
        <Route path="*"                  element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 3500,
            style: {
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-body)',
              fontSize: '13.5px',
              borderRadius: '10px',
              boxShadow: 'var(--shadow-md)',
            },
            success: { iconTheme: { primary: 'var(--success)', secondary: 'var(--bg-primary)' } },
            error:   { iconTheme: { primary: 'var(--danger)',  secondary: 'var(--bg-primary)' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}