import { useState } from 'react'
import { SCENARIOS } from '../data/scenarios'
import { Card, SectionLabel, Pill, ImpactBar, Btn } from './UI'

const LEVEL_COLORS = {
  high: 'var(--coral)',
  mid:  'var(--amber)',
  low:  'var(--green)',
  best: 'var(--teal)',
}

function OptionRow({ option, selected, onSelect, baseline }) {
  const color = LEVEL_COLORS[option.level]
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={() => onSelect(option)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
        border: `1px solid ${selected ? 'var(--green-mid)' : hovered ? 'var(--border-bright)' : 'var(--border)'}`,
        background: selected ? '#27C95A18' : hovered ? 'var(--surface-high)' : 'transparent',
        transition: 'all 0.18s',
        marginBottom: 8,
      }}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(option)}
      aria-pressed={selected}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: selected ? 'var(--green)' : 'var(--text)' }}>
            {option.name}
          </span>
          {option.level === 'best' && <Pill color="var(--teal)">Best pick ✓</Pill>}
          {option.level === 'low'  && <Pill color="var(--green)">Recommended</Pill>}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-mid)', marginBottom: 6 }}>{option.detail}</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {option.tags.map(t => <Pill key={t} color={color} size="sm">{t}</Pill>)}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 72 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: 'DM Mono, monospace', lineHeight: 1 }}>
          {option.co2}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 4 }}>kg CO₂</div>
        <ImpactBar value={option.co2} max={baseline} color={color} />
      </div>
    </div>
  )
}

export default function DecisionAdvisor({ confirmed, onConfirm }) {
  const [tab, setTab] = useState('travel')
  const [selected, setSelected] = useState(null)
  const sc = SCENARIOS[tab]

  const handleTabSwitch = (key) => {
    setTab(key)
    setSelected(null)
  }

  const handleConfirm = () => {
    if (!selected) return
    onConfirm(tab, selected)
    setSelected(null)
  }

  const savedKg = selected ? (sc.baseline - selected.co2).toFixed(1) : null

  return (
    <Card>
      <SectionLabel>Decision Advisor</SectionLabel>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {Object.entries(SCENARIOS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => handleTabSwitch(key)}
            style={{
              padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              border: `1px solid ${tab === key ? 'var(--green)' : 'var(--border)'}`,
              background: tab === key ? '#3EE07A20' : 'transparent',
              color: tab === key ? 'var(--green)' : 'var(--text-mid)',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s',
            }}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* Scenario context bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', background: 'var(--surface-high)',
        borderRadius: 10, marginBottom: 14, gap: 10,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{sc.title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-mid)' }}>{sc.context}</div>
        </div>
        {confirmed[tab] ? (
          <Pill color="var(--green)">✓ {confirmed[tab].co2} kg logged</Pill>
        ) : (
          <Pill color="var(--coral)">Baseline: {sc.baseline} kg CO₂</Pill>
        )}
      </div>

      {/* Options */}
      <div>
        {sc.options.map(opt => (
          <OptionRow
            key={opt.id}
            option={opt}
            selected={selected?.id === opt.id}
            onSelect={setSelected}
            baseline={sc.baseline}
          />
        ))}
      </div>

      {/* Insight tip */}
      {selected && (
        <div style={{
          padding: '10px 14px', borderRadius: 10, marginTop: 4, marginBottom: 12,
          background: '#4ECDC415', border: '1px solid #4ECDC430',
          fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.6,
          animation: 'fadeIn 0.2s ease',
        }}>
          💡 {selected.tip}
        </div>
      )}

      {/* CTA */}
      <Btn
        onClick={handleConfirm}
        disabled={!selected}
        size="md"
        style={{ width: '100%', marginTop: 4 }}
      >
        {selected
          ? `✓ Confirm — ${parseFloat(savedKg) > 0 ? `save ${savedKg} kg CO₂` : 'log this choice'}`
          : 'Select an option above'}
      </Btn>
    </Card>
  )
}
