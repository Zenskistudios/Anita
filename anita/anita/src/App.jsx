import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useDailyFootprint } from './hooks/useSupabase'
import { useAnita } from './hooks/useAnita'
import { AI_CONTEXT_MESSAGES } from './data/scenarios'
import Header from './components/Header'
import AuthPage from './components/AuthPage'
import ScoreRow from './components/ScoreRow'
import DecisionAdvisor from './components/DecisionAdvisor'
import { FootprintChart, WeeklyTrend } from './components/FootprintCharts'
import NudgesPanel from './components/NudgesPanel'
import AIChat from './components/AIChat'
import Leaderboard from './components/Leaderboard'
import { Toast } from './components/UI'

function AppInner() {
  const { user, loading: authLoading } = useAuth()
  const { footprint, weekHistory, updateFootprint } = useDailyFootprint()
  const {
    confirmed, lastChoice, totalDecisions,
    totalSaved, ecoScore, currentTotal, toast, confirmChoice,
  } = useAnita({ footprint, updateFootprint })

  const [aiContextMsg, setAIContextMsg] = useState(null)

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0A0F0A',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#3EE07A', fontSize: 40,
      }}>🌿</div>
    )
  }

  if (!user) return <AuthPage />

  const handleConfirm = async (scenario, option) => {
    await confirmChoice(scenario, option)
    setAIContextMsg(AI_CONTEXT_MESSAGES[scenario](option))
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header />
      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>
        <ScoreRow ecoScore={ecoScore} totalSaved={totalSaved} currentTotal={currentTotal} totalDecisions={totalDecisions} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <DecisionAdvisor confirmed={confirmed} onConfirm={handleConfirm} />
            <AIChat contextMessage={aiContextMsg} onContextConsumed={() => setAIContextMsg(null)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FootprintChart footprint={footprint} />
            <WeeklyTrend weekHistory={weekHistory} />
            <NudgesPanel lastChoice={lastChoice} />
            <Leaderboard />
          </div>
        </div>
      </main>
      <Toast message={toast} />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
