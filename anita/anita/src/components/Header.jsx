import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Pill } from './UI'

export default function Header({ streak = 7 }) {
  const { profile, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.9rem 2rem',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, background: 'var(--green)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}>🌿</div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.1 }}>anita</div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
            sustainable decision engine
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
        <Pill color="var(--amber)" size="md">🔥 {streak}-day streak</Pill>
        <Pill color="var(--green)"  size="md">🌍 Top 5% globally</Pill>

        <div
          onClick={() => setMenuOpen(o => !o)}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--green)', border: '2px solid var(--green-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#0A0F0A',
            cursor: 'pointer', flexShrink: 0, userSelect: 'none',
          }}
        >
          {profile?.display_name?.[0]?.toUpperCase() || '?'}
        </div>

        {menuOpen && (
          <div style={{
            position: 'absolute', top: 44, right: 0, minWidth: 180,
            background: 'var(--surface-high)', border: '1px solid var(--border-bright)',
            borderRadius: 12, padding: '8px', zIndex: 100,
            boxShadow: '0 8px 32px #00000066', animation: 'fadeIn 0.15s ease',
          }}>
            <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                {profile?.display_name || 'User'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 1 }}>{profile?.email}</div>
            </div>
            <button
              onClick={() => { setMenuOpen(false); signOut() }}
              style={{
                width: '100%', padding: '8px 10px', background: 'transparent',
                border: 'none', borderRadius: 8, color: 'var(--coral)',
                fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
