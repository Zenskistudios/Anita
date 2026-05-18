import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { SCENARIOS } from '../data/scenarios'

const today = () => new Date().toISOString().split('T')[0]

// ── useDecisions ────────────────────────────────────────────────
// Saves confirmed decisions + loads today's history
export function useDecisions() {
  const { user } = useAuth()
  const [decisions, setDecisions] = useState([])
  const [loading,   setLoading]   = useState(false)

  const loadTodayDecisions = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('decisions')
      .select('*')
      .eq('user_id', user.id)
      .gte('decided_at', today() + 'T00:00:00')
      .order('decided_at', { ascending: false })
    if (data) setDecisions(data)
  }, [user])

  useEffect(() => { loadTodayDecisions() }, [loadTodayDecisions])

  const saveDecision = useCallback(async (scenario, option) => {
    if (!user) return
    setLoading(true)
    const baseline = SCENARIOS[scenario].baseline
    const { error } = await supabase.from('decisions').insert({
      user_id:      user.id,
      scenario,
      option_id:    option.id,
      option_name:  option.name,
      co2_chosen:   option.co2,
      co2_baseline: baseline,
    })
    if (!error) await loadTodayDecisions()
    setLoading(false)
    return !error
  }, [user, loadTodayDecisions])

  return { decisions, loading, saveDecision, reload: loadTodayDecisions }
}

// ── useDailyFootprint ───────────────────────────────────────────
// Upserts today's footprint row and reads history for charts
export function useDailyFootprint() {
  const { user } = useAuth()
  const [footprint, setFootprint] = useState({
    travel:   SCENARIOS.travel.baseline,
    food:     SCENARIOS.food.baseline,
    shopping: SCENARIOS.shopping.baseline,
  })
  const [weekHistory, setWeekHistory] = useState([])

  // Load today's row (or keep defaults)
  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data } = await supabase
        .from('daily_footprint')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today())
        .single()
      if (data) {
        setFootprint({
          travel:   data.travel_co2,
          food:     data.food_co2,
          shopping: data.shopping_co2,
        })
      }
    }
    load()
  }, [user])

  // Load last 7 days for the trend chart
  useEffect(() => {
    if (!user) return
    const load = async () => {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
      const { data } = await supabase
        .from('daily_footprint')
        .select('date, total_co2, eco_score')
        .eq('user_id', user.id)
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true })
      if (data) {
        const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
        setWeekHistory(data.map(row => ({
          day:    days[new Date(row.date).getDay()],
          co2:    parseFloat(row.total_co2),
          target: 3.5,
        })))
      }
    }
    load()
  }, [user])

  const updateFootprint = useCallback(async (scenario, co2Value, ecoScore) => {
    if (!user) return
    const col = `${scenario}_co2`
    const newFootprint = { ...footprint, [scenario]: co2Value }
    setFootprint(newFootprint)

    await supabase.from('daily_footprint').upsert({
      user_id:      user.id,
      date:         today(),
      travel_co2:   newFootprint.travel,
      food_co2:     newFootprint.food,
      shopping_co2: newFootprint.shopping,
      eco_score:    ecoScore,
      updated_at:   new Date().toISOString(),
    }, { onConflict: 'user_id,date' })
  }, [user, footprint])

  return { footprint, weekHistory, updateFootprint }
}

// ── useLeaderboard ───────────────────────────────────────────────
export function useLeaderboard() {
  const [board,   setBoard]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(10)
      if (data) setBoard(data)
      setLoading(false)
    }
    load()

    // Real-time updates via Supabase channel
    const channel = supabase
      .channel('leaderboard-changes')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'daily_footprint'
      }, load)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return { board, loading }
}
