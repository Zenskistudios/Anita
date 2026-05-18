import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const PROVIDERS = [
  {
    id: 'google',
    label: 'Continue with Google',
    bg: '#fff',
    color: '#1a1a1a',
    border: '#ddd',
    logo: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  {
    id: 'twitter',
    label: 'Continue with X',
    bg: '#000',
    color: '#fff',
    border: '#333',
    logo: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: 'discord',
    label: 'Continue with Discord',
    bg: '#5865F2',
    color: '#fff',
    border: '#4752C4',
    logo: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.102 18.08.114 18.1.132 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Continue with Facebook',
    bg: '#1877F2',
    color: '#fff',
    border: '#1567d3',
    logo: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
]

export default function AuthPage() {
  const { signIn, signUp, signInWithProvider } = useAuth()
  const [mode,     setMode]     = useState('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [socialLoading, setSocialLoading] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') await signIn(email, password)
      else await signUp(email, password, name)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleSocial = async (providerId) => {
    setError('')
    setSocialLoading(providerId)
    try {
      await signInWithProvider(providerId)
    } catch (err) {
      setError(err.message || `${providerId} sign-in failed`)
      setSocialLoading(null)
    }
  }

  const inp = {
    width: '100%', padding: '11px 14px',
    background: '#172017', border: '1px solid #2A422A',
    borderRadius: 10, color: '#E8F5E8', fontSize: 14,
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.18s',
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0F0A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Outfit', sans-serif", padding: '1rem',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: '#3EE07A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 12px',
          }}>🌿</div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', color: '#E8F5E8' }}>anita</div>
          <div style={{ fontSize: 11, color: '#4A6A4A', letterSpacing: '1.2px', textTransform: 'uppercase', marginTop: 3 }}>
            sustainable decision engine
          </div>
        </div>

        <div style={{ background: '#111811', border: '1px solid #1E2E1E', borderRadius: 20, padding: '2rem' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#E8F5E8', marginBottom: 4 }}>
            {mode === 'login' ? 'Welcome back' : 'Join Anita'}
          </h2>
          <p style={{ fontSize: 13, color: '#8FAF8F', marginBottom: 22 }}>
            {mode === 'login' ? 'Sign in to track your eco journey' : 'Start making sustainable choices today'}
          </p>

          {/* Social buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {PROVIDERS.map(p => (
              <button
                key={p.id}
                onClick={() => handleSocial(p.id)}
                disabled={!!socialLoading}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '11px 16px', borderRadius: 10, border: `1px solid ${p.border}`,
                  background: socialLoading === p.id ? p.bg + 'cc' : p.bg,
                  color: p.color, fontSize: 14, fontWeight: 600,
                  fontFamily: 'inherit', cursor: socialLoading ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.18s', opacity: socialLoading && socialLoading !== p.id ? 0.5 : 1,
                  width: '100%',
                }}
              >
                {p.logo}
                {socialLoading === p.id ? 'Redirecting…' : p.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: '#1E2E1E' }} />
            <span style={{ fontSize: 12, color: '#4A6A4A' }}>or with email</span>
            <div style={{ flex: 1, height: 1, background: '#1E2E1E' }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: 12, color: '#8FAF8F', display: 'block', marginBottom: 5 }}>Display name</label>
                <input type="text" placeholder="Your name" required value={name}
                  onChange={e => setName(e.target.value)} style={inp}
                  onFocus={e => e.target.style.borderColor = '#3EE07A'}
                  onBlur={e => e.target.style.borderColor = '#2A422A'}
                />
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, color: '#8FAF8F', display: 'block', marginBottom: 5 }}>Email</label>
              <input type="email" placeholder="you@example.com" required value={email}
                onChange={e => setEmail(e.target.value)} style={inp}
                onFocus={e => e.target.style.borderColor = '#3EE07A'}
                onBlur={e => e.target.style.borderColor = '#2A422A'}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#8FAF8F', display: 'block', marginBottom: 5 }}>Password</label>
              <input type="password" placeholder="Min. 8 characters" required value={password}
                onChange={e => setPassword(e.target.value)} style={inp}
                onFocus={e => e.target.style.borderColor = '#3EE07A'}
                onBlur={e => e.target.style.borderColor = '#2A422A'}
              />
            </div>

            {error && (
              <div style={{
                background: '#7A202018', border: '1px solid #FF6B6B44',
                borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#FF6B6B',
              }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              padding: '12px', background: loading ? '#1E6636' : '#3EE07A',
              color: loading ? '#8FAF8F' : '#0A0F0A',
              border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
              fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 2, transition: 'all 0.18s',
            }}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: '#8FAF8F' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              style={{ background: 'none', border: 'none', color: '#3EE07A', fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#4A6A4A', marginTop: 16 }}>
          🔒 Secured by Supabase · Your data stays private
        </p>
      </div>
    </div>
  )
}
