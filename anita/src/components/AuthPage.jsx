import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [mode,    setMode]    = useState('login')   // 'login' | 'signup'
  const [email,   setEmail]   = useState('')
  const [password,setPassword]= useState('')
  const [name,    setName]    = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password, name)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inp = {
    width: '100%', padding: '11px 14px',
    background: '#172017', border: '1px solid #2A422A',
    borderRadius: 10, color: '#E8F5E8', fontSize: 14,
    fontFamily: 'inherit', outline: 'none',
    transition: 'border-color 0.18s', boxSizing: 'border-box',
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0F0A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Outfit', sans-serif", padding: '1rem',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: '#3EE07A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 12px',
          }}>🌿</div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', color: '#E8F5E8' }}>anita</div>
          <div style={{ fontSize: 12, color: '#4A6A4A', letterSpacing: '1.2px', textTransform: 'uppercase', marginTop: 3 }}>
            sustainable decision engine
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: '#111811', border: '1px solid #1E2E1E',
          borderRadius: 20, padding: '2rem',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#E8F5E8', marginBottom: 6 }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p style={{ fontSize: 13, color: '#8FAF8F', marginBottom: 24 }}>
            {mode === 'login'
              ? 'Sign in to track your eco decisions'
              : 'Start making sustainable choices today'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: 12, color: '#8FAF8F', display: 'block', marginBottom: 5 }}>Display name</label>
                <input
                  type="text" placeholder="Riya" required value={name}
                  onChange={e => setName(e.target.value)} style={inp}
                  onFocus={e => e.target.style.borderColor = '#3EE07A'}
                  onBlur={e => e.target.style.borderColor = '#2A422A'}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: 12, color: '#8FAF8F', display: 'block', marginBottom: 5 }}>Email</label>
              <input
                type="email" placeholder="you@example.com" required value={email}
                onChange={e => setEmail(e.target.value)} style={inp}
                onFocus={e => e.target.style.borderColor = '#3EE07A'}
                onBlur={e => e.target.style.borderColor = '#2A422A'}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#8FAF8F', display: 'block', marginBottom: 5 }}>Password</label>
              <input
                type="password" placeholder="········" required value={password}
                onChange={e => setPassword(e.target.value)} style={inp}
                onFocus={e => e.target.style.borderColor = '#3EE07A'}
                onBlur={e => e.target.style.borderColor = '#2A422A'}
              />
            </div>

            {error && (
              <div style={{
                background: '#7A202018', border: '1px solid #FF6B6B44',
                borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#FF6B6B',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                padding: '12px', background: loading ? '#1E6636' : '#3EE07A',
                color: loading ? '#8FAF8F' : '#0A0F0A',
                border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
                fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 4, transition: 'all 0.18s',
              }}
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8FAF8F' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              style={{
                background: 'none', border: 'none', color: '#3EE07A',
                fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
              }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#4A6A4A', marginTop: 20 }}>
          Your data is private and secured by Supabase
        </p>
      </div>
    </div>
  )
}
