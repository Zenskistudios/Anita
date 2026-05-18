import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts'
import { Card, SectionLabel, AnimatedNumber } from './UI'
import { WEEKLY_DATA } from '../data/scenarios'

const PIE_COLORS = {
  travel:   '#4ECDC4',
  food:     '#3EE07A',
  shopping: '#F5C542',
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--surface-high)', border: '1px solid var(--border-bright)',
      borderRadius: 8, padding: '8px 12px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--text-mid)' }}>{payload[0].name}</div>
      <div style={{ fontWeight: 700, color: payload[0].fill || 'var(--green)' }}>
        {payload[0].value} kg CO₂
      </div>
    </div>
  )
}

export function FootprintChart({ footprint }) {
  const total = parseFloat(Object.values(footprint).reduce((a, b) => a + b, 0).toFixed(2))
  const pieData = Object.entries(footprint).map(([key, val]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: val,
    color: PIE_COLORS[key],
  }))

  return (
    <Card>
      <SectionLabel>Today's Footprint</SectionLabel>
      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <div style={{
          fontSize: 38, fontWeight: 800, color: 'var(--green)',
          fontFamily: 'DM Mono, monospace', lineHeight: 1,
        }}>
          <AnimatedNumber value={total} decimals={1} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 2 }}>kg CO₂ today</div>
      </div>

      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie
            data={pieData} cx="50%" cy="50%"
            innerRadius={42} outerRadius={62}
            dataKey="value" strokeWidth={0} paddingAngle={3}
          >
            {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pieData.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-mid)', flex: 1 }}>{d.name}</span>
            <span style={{ fontWeight: 600, fontFamily: 'DM Mono, monospace', color: d.color }}>{d.value} kg</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

const TrendTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--surface-high)', border: '1px solid var(--border-bright)',
      borderRadius: 8, padding: '8px 12px', fontSize: 11,
    }}>
      <div style={{ color: 'var(--text-dim)', marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name === 'co2' ? 'Actual' : 'Target'}: {p.value} kg
        </div>
      ))}
    </div>
  )
}

export function WeeklyTrend({ weekHistory }) {
  return (
    <Card>
      <SectionLabel>7-Day CO₂ Trend</SectionLabel>
      <ResponsiveContainer width="100%" height={110}>
        <AreaChart data={weekHistory && weekHistory.length > 0 ? weekHistory : WEEKLY_DATA} margin={{ top: 5, right: 0, bottom: 0, left: -22 }}>
          <defs>
            <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3EE07A" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3EE07A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gAmber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5C542" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#F5C542" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" tick={{ fill: '#4A6A4A', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#4A6A4A', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<TrendTooltip />} />
          <Area type="monotone" dataKey="target" name="target" stroke="#F5C542" strokeWidth={1}
            strokeDasharray="4 3" fill="url(#gAmber)" dot={false} />
          <Area type="monotone" dataKey="co2" name="co2" stroke="#3EE07A" strokeWidth={2}
            fill="url(#gGreen)" dot={{ r: 3, fill: '#3EE07A', strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-mid)' }}>
          <div style={{ width: 16, height: 2, background: 'var(--green)' }} /> Actual CO₂
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-mid)' }}>
          <div style={{ width: 16, height: 2, background: 'var(--amber)', opacity: 0.7 }} /> Target
        </div>
      </div>
    </Card>
  )
}
