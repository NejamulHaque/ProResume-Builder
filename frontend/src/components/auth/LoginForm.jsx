import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth.jsx'

export default function LoginForm({ onSwitch }) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.email.trim())    errs.email    = 'Email is required'
    if (!form.password)        errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const emailClean = form.email.trim().toLowerCase()
      await login(emailClean, form.password)

      if (emailClean === 'nejamulhaque.works@gmail.com') {
        toast.success('Welcome back, Super Admin! 🛡️')
      } else {
        toast.success('Welcome back!')
      }
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      
      {/* Email */}
      <div className="form-group">
        <label className="form-label required">Email Address</label>
        <input
          name="email"
          type="email"
          className={`input ${errors.email ? 'input-error' : ''}`}
          placeholder="you@example.com"
          value={form.email}
          onChange={onChange}
          autoComplete="email"
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      {/* Password with toggle */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <label className="form-label required" style={{ margin: 0 }}>Password</label>
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 11.5, cursor: 'pointer' }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div style={{ position: 'relative' }}>
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            className={`input ${errors.password ? 'input-error' : ''}`}
            placeholder="••••••••"
            value={form.password}
            onChange={onChange}
            autoComplete="current-password"
          />
        </div>
        {errors.password && <span className="form-error">{errors.password}</span>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary btn-lg btn-full"
        style={{ marginTop: 6 }}
      >
        {loading ? <><div className="spinner sm" /> Signing in…</> : 'Sign In to ProResume 🚀'}
      </button>

      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
        >
          Sign up free
        </button>
      </p>
    </form>
  )
}
