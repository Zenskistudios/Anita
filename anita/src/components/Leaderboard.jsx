import { Card, SectionLabel, Pill } from './UI'
import { useLeaderboard } from '../hooks/useSupabase'
import { useAuth } from '../context/AuthContext'

const medals = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { board, loading } = useLeaderboard()
  const { profile } = useAuth()

  return (
    <Card>
      <SectionLabel>Global Leaderboard · Today</SectionLabel>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-dim)', fontSize: 13 }}>
          Loading rankings…
        </div>
      ) : board.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-dim)', fontSize: 13 }}>
          No rankings yet — make your first decision to appear here!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {board.map((entry, i) => {
            const isMe = entry.display_name === profile?.display_name
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 10,
                  background: isMe ? '#3EE07A15' : 'var(--surface-high)',
                  border: `1px solid ${isMe ? '#3EE07A30' : 'var(--border)'}`,
                }}
              >
                <div style={{ fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0 }}>
                  {medals[i] || `${i + 1}`}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isMe ? 'var(--green)' : 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.display_name} {isMe && <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>(you)</span>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{entry.total_co2} kg CO₂ today</div>
                </div>
                <Pill color={entry.eco_score >= 80 ? 'var(--green)' : entry.eco_score >= 65 ? 'var(--amber)' : 'var(--coral)'}>
                  {entry.eco_score}
                </Pill>
              </div>
            )
          })}
        </div>
      )}

      <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-dim)', textAlign: 'center' }}>
        🔄 Updates in real-time via Supabase
      </div>
    </Card>
  )
}
