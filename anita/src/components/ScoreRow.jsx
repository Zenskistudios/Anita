import { AnimatedNumber } from './UI'

function StatCard({ label, value, unit, color, decimals = 0, animate = true }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem 1.2rem',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color, fontFamily: 'DM Mono, monospace', lineHeight: 1 }}>
        {animate
          ? <AnimatedNumber value={value} decimals={decimals} />
          : value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-mid)' }}>{unit}</div>
    </div>
  )
}

export default function ScoreRow({ ecoScore, totalSaved, currentTotal, totalDecisions }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
      marginBottom: 20,
    }}>
      <StatCard label="Eco Score"      value={ecoScore}        unit="out of 100"        color="var(--green)"  decimals={0} />
      <StatCard label="CO₂ Saved"      value={Math.max(0, totalSaved)} unit="kg vs baseline"  color="var(--teal)"   decimals={1} />
      <StatCard label="Today's Total"  value={currentTotal}    unit="kg CO₂ today"      color="var(--amber)"  decimals={1} />
      <StatCard label="Decisions"      value={totalDecisions}  unit="analyzed today"    color="var(--green)"  decimals={0} />
    </div>
  )
}
