# 🌿 Anita — Sustainable Decision Engine

A real-time AI-powered sustainability app with **Supabase backend** — full auth, persistent decisions, live carbon tracking, and a real-time global leaderboard.

---

## 🚀 Quick Start (3 steps)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase database
Open your Supabase dashboard → **SQL Editor** → paste and run the contents of `supabase_schema.sql`

This creates:
- `profiles` table (auto-populated on signup)
- `decisions` table (every confirmed choice)
- `daily_footprint` table (live carbon tracker)
- `leaderboard` view (real-time rankings)
- Row Level Security policies

### 3. Run the app
```bash
npm run dev
```
Opens at → http://localhost:3000

> The Supabase URL and anon key are already embedded in `src/lib/supabase.js`

---

## 🏗️ Architecture

```
anita/
├── supabase_schema.sql         ← Run this first in Supabase SQL Editor
├── src/
│   ├── lib/
│   │   └── supabase.js         ← Supabase client (URL + anon key)
│   ├── context/
│   │   └── AuthContext.jsx     ← Auth state: signUp, signIn, signOut, profile
│   ├── hooks/
│   │   ├── useSupabase.js      ← useDecisions, useDailyFootprint, useLeaderboard
│   │   └── useAnita.js         ← Core state wired to Supabase
│   ├── components/
│   │   ├── AuthPage.jsx        ← Login / Signup screen
│   │   ├── Header.jsx          ← Nav with user avatar + sign-out menu
│   │   ├── ScoreRow.jsx        ← Animated eco metrics
│   │   ├── DecisionAdvisor.jsx ← Travel / Food / Shopping advisor
│   │   ├── FootprintCharts.jsx ← Live donut + 7-day trend (from Supabase)
│   │   ├── NudgesPanel.jsx     ← Smart behavioural nudges
│   │   ├── AIChat.jsx          ← Claude-powered AI advisor
│   │   ├── Leaderboard.jsx     ← Real-time global rankings
│   │   └── UI.jsx              ← Shared primitives
│   ├── data/scenarios.js       ← Decision options + AI message templates
│   ├── App.jsx                 ← Root layout
│   └── main.jsx
```

## ✨ Supabase Features Used

| Feature | Usage |
|---|---|
| **Auth** | Email/password signup & login, session persistence |
| **Database** | `decisions`, `daily_footprint`, `profiles` tables |
| **RLS** | Row-level security — users only access their own data |
| **Views** | `leaderboard` view for ranked daily scores |
| **Realtime** | Live leaderboard updates via Postgres changes channel |
| **Triggers** | Auto-create profile on user signup |

## 🔧 Build for production
```bash
npm run build && npm run preview
```
