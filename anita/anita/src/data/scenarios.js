export const SCENARIOS = {
  travel: {
    label: 'Travel',
    emoji: '🚗',
    title: 'Morning commute',
    context: '8.5 km to office · 8:30 AM',
    baseline: 3.2,
    options: [
      {
        id: 't1', name: 'Solo ride-hail', detail: '~22 min · surge pricing active',
        co2: 3.2, cost: 5.0, time: 22,
        tags: ['High emissions', 'Surge +40%'], level: 'high',
        tip: 'Peak-hour solo rides are among the most carbon-intensive urban travel options.'
      },
      {
        id: 't2', name: 'Shared ride', detail: '~28 min · split with 1–2 riders',
        co2: 1.6, cost: 2.5, time: 28,
        tags: ['50% less CO₂', 'Cost saver'], level: 'mid',
        tip: 'Sharing cuts per-person emissions in half and reduces congestion.'
      },
      {
        id: 't3', name: 'Public transit', detail: '~35 min · bus or metro',
        co2: 0.4, cost: 0.5, time: 35,
        tags: ['Low carbon', 'Best value'], level: 'low',
        tip: 'Transit is 4–6× more efficient per passenger than solo driving.'
      },
      {
        id: 't4', name: 'Bike + transit', detail: '~40 min · active travel',
        co2: 0.05, cost: 0.2, time: 40,
        tags: ['Near-zero', 'Healthiest'], level: 'best',
        tip: 'Cycling for short legs + transit is the lowest-footprint commute possible.'
      },
    ],
  },
  food: {
    label: 'Food',
    emoji: '🥗',
    title: 'Lunch order',
    context: 'Nearby restaurants · 12:30 PM',
    baseline: 5.1,
    options: [
      {
        id: 'f1', name: 'Beef burger delivery', detail: 'Delivered · extra packaging',
        co2: 5.1, cost: 12, time: 30,
        tags: ['High footprint', 'Packaging waste'], level: 'high',
        tip: 'Beef production generates 27 kg CO₂ per kg of meat — the highest of any food.'
      },
      {
        id: 'f2', name: 'Chicken wrap delivery', detail: 'Delivered · ~25 min',
        co2: 2.4, cost: 9, time: 25,
        tags: ['Moderate', 'Lower carbon'], level: 'mid',
        tip: 'Poultry has ~6× lower emissions than beef per gram of protein.'
      },
      {
        id: 'f3', name: 'Plant-based bowl', detail: 'Walk 5 min · local restaurant',
        co2: 0.8, cost: 7, time: 12,
        tags: ['Best choice', '−75% CO₂'], level: 'low',
        tip: 'Plant-based meals produce 10–50× less CO₂ than meat equivalents.'
      },
      {
        id: 'f4', name: 'Home-packed lunch', detail: 'Already prepared · zero delivery',
        co2: 0.3, cost: 0, time: 0,
        tags: ['Zero delivery', 'Free'], level: 'best',
        tip: 'Preparing food at home eliminates packaging, delivery logistics, and food waste.'
      },
    ],
  },
  shopping: {
    label: 'Shopping',
    emoji: '🛍️',
    title: 'Evening essentials',
    context: 'Household items · same-day need',
    baseline: 2.8,
    options: [
      {
        id: 's1', name: 'Express same-day', detail: '2hr delivery · rush logistics',
        co2: 2.8, cost: 8, time: 2,
        tags: ['Rush carbon', 'Excess packaging'], level: 'high',
        tip: 'Express vehicles run at 40% capacity vs 85% for grouped shipments.'
      },
      {
        id: 's2', name: 'Standard 3-day delivery', detail: 'Grouped shipment · eco packaging',
        co2: 1.1, cost: 3, time: 72,
        tags: ['Bundled route', 'Less packaging'], level: 'mid',
        tip: 'Grouped deliveries share vehicle capacity, cutting per-parcel emissions by 60%.'
      },
      {
        id: 's3', name: 'Local store pickup', detail: '0.8 km · walkable',
        co2: 0.2, cost: 0, time: 20,
        tags: ['Near-zero', 'Support local'], level: 'low',
        tip: 'Walking to a local store eliminates all logistics emissions and supports local business.'
      },
      {
        id: 's4', name: 'Eco-certified store', detail: 'Minimal packaging · certified green',
        co2: 0.1, cost: 1, time: 25,
        tags: ['Certified green', 'Best impact'], level: 'best',
        tip: 'Eco-certified stores use renewable energy, minimal packaging, and local supply chains.'
      },
    ],
  },
}

export const WEEKLY_DATA = [
  { day: 'Mon', co2: 4.2, target: 3.5 },
  { day: 'Tue', co2: 3.1, target: 3.5 },
  { day: 'Wed', co2: 2.8, target: 3.5 },
  { day: 'Thu', co2: 3.5, target: 3.5 },
  { day: 'Fri', co2: 2.1, target: 3.5 },
  { day: 'Sat', co2: 1.8, target: 3.5 },
  { day: 'Sun', co2: 2.1, target: 3.5 },
]

export const NUDGES = [
  {
    emoji: '🚌',
    title: 'Switch to transit 3×/week',
    detail: 'Saves 8.4 kg CO₂ and ~$15 weekly',
    color: '#4ECDC4',
    saving: '−8.4 kg/week',
  },
  {
    emoji: '🥦',
    title: '3 plant-based meals/week',
    detail: 'Cuts food footprint by 40% annually',
    color: '#3EE07A',
    saving: '−640 kg/year',
  },
  {
    emoji: '📦',
    title: 'Batch deliveries on Fridays',
    detail: 'Consolidate weekly orders into one',
    color: '#F5C542',
    saving: '−72 kg/year',
  },
  {
    emoji: '🌡️',
    title: 'Lower thermostat by 2°C',
    detail: 'Reduces heating/cooling energy ~10%',
    color: '#4ECDC4',
    saving: '−150 kg/year',
  },
]

export const AI_CONTEXT_MESSAGES = {
  travel: (opt) => {
    const saved = (3.2 - opt.co2).toFixed(1)
    const annual = ((3.2 - opt.co2) * 250).toFixed(0)
    const trees = Math.round((3.2 - opt.co2) * 250 / 21)
    return `Great pick — **${opt.name}** saves **${saved} kg CO₂** today. Doing this every workday adds up to **${annual} kg/year**, equivalent to planting **${trees} trees**. ${opt.tip}`
  },
  food: (opt) => {
    const pct = Math.round((1 - opt.co2 / 5.1) * 100)
    return `**${opt.name}** cuts your meal footprint by **${pct}%**. Food choices account for ~26% of global greenhouse emissions. ${opt.tip}`
  },
  shopping: (opt) => {
    const pct = Math.round((1 - opt.co2 / 2.8) * 100)
    return `**${opt.name}** reduces delivery emissions by **${pct}%**. ${opt.tip} Batching 2 orders/week prevents ~72 kg CO₂ annually.`
  },
}
