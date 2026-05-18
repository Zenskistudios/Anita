import { useEffect, useRef, useState } from 'react'

export function Card({ children, style = {}, onClick, hoverable = false }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => hoverable && setHovered(false)}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hovered ? 'var(--border-bright)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        transition: 'border-color 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function SectionLabel({ children, style = {} }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '1.5px',
      color: 'var(--text-dim)', textTransform: 'uppercase',
      marginBottom: 12, ...style,
    }}>
      {children}
    </div>
  )
}

export function Pill({ children, color = 'var(--green)', size = 'sm' }) {
  const pad = size === 'sm' ? '2px 8px' : '4px 12px'
  const fs  = size === 'sm' ? 10 : 12
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: fs, fontWeight: 600, padding: pad, borderRadius: 20,
      background: color + '22', color: color,
      border: `1px solid ${color}44`,
      letterSpacing: '0.3px', whiteSpace: 'nowrap',
      lineHeight: 1.4,
    }}>
      {children}
    </span>
  )
}

export function Btn({ children, onClick, disabled, variant = 'primary', size = 'md', style = {} }) {
  const [pressed, setPressed] = useState(false)
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'inherit',
    fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.18s', transform: pressed ? 'scale(0.97)' : 'scale(1)',
    ...style,
  }
  const sizes = { sm: { fontSize: 12, padding: '7px 14px' }, md: { fontSize: 14, padding: '11px 20px' }, lg: { fontSize: 15, padding: '13px 28px' } }
  const variants = {
    primary:  { background: disabled ? 'var(--green-dim)' : 'var(--green)', color: disabled ? 'var(--text-dim)' : '#0A0F0A' },
    outline:  { background: 'transparent', color: 'var(--text-mid)', border: '1px solid var(--border-bright)' },
    ghost:    { background: 'transparent', color: 'var(--text-mid)' },
    danger:   { background: 'var(--coral-dim)', color: 'var(--coral)' },
  }
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{ ...base, ...sizes[size], ...variants[variant] }}
    >
      {children}
    </button>
  )
}

export function ImpactBar({ value, max, color, animated = true }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${pct}%`, background: color,
        borderRadius: 2, transition: animated ? 'width 0.5s cubic-bezier(.4,0,.2,1)' : 'none',
      }} />
    </div>
  )
}

export function AnimatedNumber({ value, decimals = 1, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)
  useEffect(() => {
    const start = prevRef.current
    const end   = value
    const dur   = 700
    const t0    = Date.now()
    const tick  = () => {
      const p    = Math.min((Date.now() - t0) / dur, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setDisplay(parseFloat((start + (end - start) * ease).toFixed(decimals)))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    prevRef.current = value
  }, [value, decimals])
  return <>{prefix}{display}{suffix}</>
}

export function Toast({ message }) {
  if (!message) return null
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--green)', color: '#0A0F0A', padding: '12px 24px',
      borderRadius: 30, fontSize: 13, fontWeight: 700,
      boxShadow: '0 8px 32px #3EE07A44',
      zIndex: 1000, animation: 'fadeIn 0.3s ease',
      whiteSpace: 'nowrap',
    }}>
      {message}
    </div>
  )
}

export function Spinner() {
  return (
    <div style={{
      width: 14, height: 14, border: '2px solid #3EE07A44',
      borderTopColor: 'var(--green)', borderRadius: '50%',
      animation: 'spin 0.7s linear infinite', display: 'inline-block',
    }} />
  )
}

export function MarkdownText({ text, style = {} }) {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, `<strong style="color:var(--text)">$1</strong>`)
    .replace(/\*(.*?)\*/g, `<em>$1</em>`)
  return (
    <span
      style={{ ...style }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
