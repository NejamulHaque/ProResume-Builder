import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth.jsx'

export default function RegisterForm({ onSwitch }) {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})
  const [done,    setDone]    = useState(false)

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim())           errs.name     = 'Full name is required'
    if (!form.email.trim())          errs.email    = 'Email is required'
    if (form.password.length < 6)    errs.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const emailClean = form.email.trim().toLowerCase()
      const res = await signup(emailClean, form.password, form.name.trim())
      if (res?.data?.user && !res?.data?.session) {
        setDone(true)
      } else {
        toast.success('Account created! Welcome to ProResume 🎉')
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>📧</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 8 }}>
          Check your inbox
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 20 }}>
          We sent a confirmation link to <strong style={{ color: 'var(--text-primary)' }}>{form.email}</strong>.
          Click it to activate your account.
        </p>
        <button
          onClick={onSwitch}
          className="btn btn-secondary btn-full"
        >
          Back to Sign In
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Name */}
      <div className="form-group">
        <label className="form-label required">Full Name</label>
        <input
          name="name"
          type="text"
          className={`input ${errors.name ? 'input-error' : ''}`}
          placeholder="e.g. Alex Rivera"
          value={form.name}
          onChange={onChange}
          autoComplete="name"
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

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

      {/* Password */}
      <div className="form-group">
        <label className="form-label required">Password</label>
        <input
          name="password"
          type="password"
          className={`input ${errors.password ? 'input-error' : ''}`}
          placeholder="Min. 6 characters"
          value={form.password}
          onChange={onChange}
          autoComplete="new-password"
        />
        {errors.password && <span className="form-error">{errors.password}</span>}
      </div>

      {/* Confirm */}
      <div className="form-group">
        <label className="form-label required">Confirm Password</label>
        <input
          name="confirm"
          type="password"
          className={`input ${errors.confirm ? 'input-error' : ''}`}
          placeholder="••••••••"
          value={form.confirm}
          onChange={onChange}
          autoComplete="new-password"
        />
        {errors.confirm && <span className="form-error">{errors.confirm}</span>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary btn-lg btn-full"
        style={{ marginTop: 4 }}
      >
        {loading ? <><div className="spinner sm" /> Creating account…</> : 'Create Free Account 🚀'}
      </button>

      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
        >
          Sign in
        </button>
      </p>
    </form>
  )
}
