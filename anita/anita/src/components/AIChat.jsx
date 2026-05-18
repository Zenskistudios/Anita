import { useState, useEffect, useRef } from 'react'
import { Card, SectionLabel, Spinner, MarkdownText } from './UI'

const SYSTEM_PROMPT = `You are Anita, a warm and knowledgeable AI sustainability advisor embedded in a sustainable decision engine.

Your role:
- Help users make eco-friendly choices for travel, food, shopping, energy, and lifestyle
- Provide concise, specific insights with real carbon data when relevant
- Celebrate good choices without being preachy
- Always give actionable next steps
- Reference specific kg CO₂ figures, percentages, or equivalents (trees, flights, etc.) to make impact tangible

Tone: encouraging, direct, never judgmental. Keep responses to 2–4 sentences unless the user asks for detail.
Format: use **bold** for key stats or takeaways. No bullet points unless listing 3+ items.`

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 10,
      animation: 'fadeIn 0.25s ease',
    }}>
      {!isUser && (
        <div style={{
          width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
          background: 'var(--green)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 13, marginRight: 8, marginTop: 2,
        }}>
          🌿
        </div>
      )}
      <div style={{
        maxWidth: '82%',
        padding: '10px 13px',
        borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        background: isUser ? 'var(--green-dim)' : 'var(--surface-high)',
        border: `1px solid ${isUser ? '#3EE07A40' : 'var(--border)'}`,
        fontSize: 13, lineHeight: 1.65, color: 'var(--text)',
      }}>
        {isUser ? msg.text : <MarkdownText text={msg.text} />}
      </div>
    </div>
  )
}

const QUICK_ASKS = [
  'How can I reduce my commute emissions?',
  'What\'s the carbon cost of flying?',
  'Best plant-based swaps for meat?',
  'How do I offset my footprint?',
]

export default function AIChat({ contextMessage, onContextConsumed }) {
  const [history, setHistory] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm **Anita** — your sustainable decision guide. I analyze your daily choices and help you live with a lighter footprint, without sacrificing convenience. Ask me anything, or try one of the quick questions below."
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  useEffect(() => {
    if (contextMessage) {
      setHistory(h => [...h, { role: 'assistant', text: contextMessage }])
      onContextConsumed?.()
    }
  }, [contextMessage])

  const callAPI = async (messages) => {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages.map(m => ({ role: m.role, content: m.text })),
      }),
    })
    if (!res.ok) throw new Error(`API error ${res.status}`)
    const data = await res.json()
    return data.content?.map(b => b.text || '').join('') || 'Sorry, I couldn\'t process that.'
  }

  const send = async (text) => {
    const q = (text || input).trim()
    if (!q || loading) return
    setInput('')

    const newMsg = { role: 'user', text: q }
    const newHistory = [...history, newMsg]
    setHistory(newHistory)
    setLoading(true)

    try {
      const reply = await callAPI(newHistory)
      setHistory(h => [...h, { role: 'assistant', text: reply }])
    } catch (err) {
      setHistory(h => [...h, {
        role: 'assistant',
        text: `Hmm, I ran into a connection issue. Make sure you\'ve set your **ANTHROPIC_API_KEY** in the .env file, then try again.`
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', height: 440 }}>
      <SectionLabel>Ask Anita AI</SectionLabel>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', paddingRight: 4, marginBottom: 10,
        display: 'flex', flexDirection: 'column',
      }}>
        {history.map((m, i) => <Message key={i} msg={m} />)}
        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 12px' }}>
            <Spinner />
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Anita is thinking…</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick asks */}
      {history.length <= 2 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {QUICK_ASKS.map(q => (
            <button
              key={q}
              onClick={() => send(q)}
              disabled={loading}
              style={{
                padding: '5px 10px', borderRadius: 14, fontSize: 11,
                border: '1px solid var(--border-bright)', background: 'transparent',
                color: 'var(--text-mid)', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask about any eco decision…"
          disabled={loading}
          style={{
            flex: 1, padding: '10px 13px',
            background: 'var(--surface-high)',
            border: '1px solid var(--border-bright)',
            borderRadius: 10, color: 'var(--text)',
            fontSize: 13, fontFamily: 'inherit', outline: 'none',
            transition: 'border-color 0.18s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--green-dim)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-bright)'}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 18px', background: loading || !input.trim() ? 'var(--green-dim)' : 'var(--green)',
            color: loading || !input.trim() ? 'var(--text-dim)' : '#0A0F0A',
            border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14,
            fontFamily: 'inherit', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.18s', flexShrink: 0,
          }}
        >
          {loading ? <Spinner /> : '↗'}
        </button>
      </div>
    </Card>
  )
}
