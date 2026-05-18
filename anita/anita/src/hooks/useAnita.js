import { useState, useCallback } from 'react'
import { SCENARIOS } from '../data/scenarios'
import { useDecisions } from './useSupabase'

export function useAnita({ updateFootprint, footprint }) {
  const { saveDecision, decisions } = useDecisions()
  const [confirmed,  setConfirmed]  = useState({})
  const [lastChoice, setLastChoice] = useState(null)
  const [toast,      setToast]      = useState(null)

  const baselineTotal = SCENARIOS.travel.baseline + SCENARIOS.food.baseline + SCENARIOS.shopping.baseline
  const currentTotal  = parseFloat(Object.values(footprint).reduce((a, b) => a + b, 0).toFixed(2))
  const totalSaved    = parseFloat((baselineTotal - currentTotal).toFixed(2))
  const ecoScore      = Math.min(100, Math.round(55 + (totalSaved / baselineTotal) * 45 * 100))
  const totalDecisions = decisions.length

  const confirmChoice = useCallback(async (scenario, option) => {
    const saved = parseFloat((SCENARIOS[scenario].baseline - option.co2).toFixed(2))

    setConfirmed(c => ({ ...c, [scenario]: option }))
    setLastChoice({ scenario, option, saved })

    await saveDecision(scenario, option)
    await updateFootprint(scenario, option.co2, ecoScore)

    const msg = saved > 0 ? `Saved ${saved} kg CO₂ — nice one! 🌿` : `Logged your choice for ${SCENARIOS[scenario].label}`
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }, [saveDecision, updateFootprint, ecoScore])

  return { confirmed, lastChoice, totalDecisions, totalSaved, ecoScore, currentTotal, toast, confirmChoice }
}
