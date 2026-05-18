import { Card, SectionLabel, Pill } from './UI'
import { NUDGES, SCENARIOS } from '../data/scenarios'

export default function NudgesPanel({ lastChoice }) {
  return (
    <Card>
      <SectionLabel>Smart Nudges</SectionLabel>

      {lastChoice && (
        <div style={{
          padding: '10px 12px', borderRadius: 10, marginBottom: 14,
          background: '#3EE07A18', border: '1px solid #3EE07A30',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', marginBottom: 3 }}>
            ✓ Latest choice
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.5 }}>
            {SCENARIOS[lastChoice.scenario].emoji}{' '}
            <strong style={{ color: 'var(--text)' }}>{lastChoice.option.name}</strong>
            {lastChoice.saved > 0
              ? <> saved <strong style={{ color: 'var(--green)' }}>{lastChoice.saved.toFixed(1)} kg CO₂</strong></>
              : <> was logged</>}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {NUDGES.map((n, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: n.color + '20', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 16,
            }}>
              {n.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
                {n.title}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-mid)', lineHeight: 1.5, marginBottom: 4 }}>
                {n.detail}
              </div>
              <Pill color={n.color} size="sm">{n.saving}</Pill>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
