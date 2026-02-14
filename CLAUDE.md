# CLAUDE.md — Workout Tracker

## Project Overview

A **React + Vite PWA** for tracking workouts with AI-powered coaching. Uses Supabase for authentication, cloud sync, and edge functions that call OpenAI (`gpt-4o-mini`) for fitness insights and workout generation. Mobile-first design with offline support.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, JavaScript (ES modules), Vite 7 |
| Backend | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| Edge Functions | Deno v2, TypeScript |
| AI | OpenAI `gpt-4o-mini` via Supabase Edge Functions |
| PWA | `vite-plugin-pwa` with auto-update service worker |

## Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint (flat config, ESLint 9+)
npm run test       # Run all tests (Node-based, no framework)
```

### Running Individual Tests

Tests are plain Node.js scripts with `assert`:

```bash
node src/lib/coachNormalize.test.js
node src/lib/userIdentity.test.js
node src/lib/exerciseCatalogUtils.test.js
node src/lib/workoutGenerator.test.js
```

### Supabase Edge Functions (local)

```bash
npx supabase functions serve    # Serve edge functions locally
```

## Project Structure

```
src/
├── App.jsx                    # Main app component (tabs, state, handlers)
├── main.jsx                   # React entry point
├── components/                # React UI components
│   ├── AuthGate.jsx           # Auth state & session management
│   ├── AuthScreen.jsx         # Login/signup UI
│   ├── OnboardingScreen.jsx   # First-time user setup
│   ├── CatalogBrowseModal.jsx # Exercise catalog browser
│   ├── CategoryAutocomplete.jsx
│   ├── CoachInsights.jsx      # AI coach insights display
│   ├── GenerateWizardModal.jsx # Multi-step workout generator
│   ├── GenerateTodayModal.jsx  # Single-day workout generator
│   ├── ProfileModal.jsx       # User profile editor
│   ├── Modal.jsx              # Generic modal wrapper
│   ├── PillTabs.jsx           # Tab navigation
│   └── ThemeSwitch.jsx        # Dark/light theme toggle
├── hooks/
│   ├── useKeyboardInset.js    # Mobile keyboard detection
│   └── useSwipe.js            # Touch gesture handling
├── lib/                       # Business logic & utilities
│   ├── supabase.js            # Supabase client init
│   ├── supabaseSync.js        # Cloud sync (2s debounce)
│   ├── coachApi.js            # AI coach API wrapper
│   ├── coachNormalize.js      # Exercise/activity classification
│   ├── coachSignature.js      # Cache fingerprinting
│   ├── constants.js           # Unit definitions (reps, miles, etc.)
│   ├── dateUtils.js           # YYYY-MM-DD date helpers
│   ├── exerciseCatalog.js     # 200+ exercise database
│   ├── exerciseCatalogUtils.js # Catalog search/filter
│   ├── greetings.js           # Greeting messages
│   ├── modalReducer.js        # Modal state machine
│   ├── stateUtils.js          # App state load/save/persist
│   ├── userIdentity.js        # Username validation & formatting
│   ├── validation.js          # Form validation helpers
│   ├── workoutGenerator.js    # Deterministic program generation
│   └── workoutGeneratorApi.js # Generation API caller
└── styles/
    └── theme.js               # Theme system (dark/light tokens)

supabase/
├── config.toml                # Supabase local/cloud config
└── functions/
    ├── ai-coach/index.ts      # AI fitness coach edge function
    └── ai-workout-generator/index.ts  # Workout generation edge function
```

## Architecture & Key Patterns

### State Management

- **Local-first**: All state writes to `localStorage` immediately
- **Cloud sync**: Debounced 2-second sync to Supabase `user_state` table (JSONB)
- **Backup**: Previous state stored in `LS_BACKUP_KEY` for recovery
- App works fully offline; cloud sync is best-effort

### Data Structures

**Workouts:**
```js
{
  id: "w_<base36ts>_<base36counter>",
  name: "Push Day",
  category: "Upper Body",
  exercises: [{
    id: "e_<base36ts>_<base36counter>",
    name: "Bench Press",
    unit: "reps",
    catalogId: "barbell_bench_press",  // optional, links to catalog
    muscles: ["CHEST", "TRICEPS"]       // from catalog
  }]
}
```

**Logs** (keyed by YYYY-MM-DD date):
```js
{
  "2026-02-14": {
    "e_abc123": {
      sets: [{ reps: 10, weight: 135 }, { reps: 8, weight: 145 }],
      notes: "Felt strong",
      mood: 1  // -2 to 2
    }
  }
}
```

### ID Format

IDs follow `${prefix}_${timestamp.toString(36)}_${counter.toString(36)}`:
- Workout IDs: `w_...`
- Exercise IDs: `e_...`

### localStorage Key Convention

All keys use `wt_` prefix: `wt_tab`, `wt_theme`, `wt_collapsed_today`, etc.

### Modal System

Modals use a reducer-based state machine (`modalReducer.js`). Open/close modals through dispatched actions, not ad-hoc state toggles.

### Tab Navigation

Three-tab UI (Train, Progress, Plan) with swipe gesture support via `useSwipe` hook.

## Coding Conventions

### General

- **JavaScript** for all frontend code (no TypeScript); **TypeScript** for edge functions only
- **React functional components** with hooks — no class components
- **No external UI library** — all styling is custom CSS
- **ESLint flat config** (ESLint 9+) with React hooks and refresh plugins
- Unused variables are allowed if prefixed with `_` or starting with uppercase

### Naming

- Components: `PascalCase` (files and exports)
- Utilities/hooks: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Date keys: `YYYY-MM-DD` strings (lexicographically sortable)
- Muscle groups: uppercase enum strings (`CHEST`, `BACK`, `QUADS`, etc.)

### Error Handling

- Try/catch around JSON parsing and external calls
- Fallback defaults in utility functions
- **Toast notifications** for all user feedback — no `alert()` or `confirm()`

### Classification Enums

- **Activity types:** `strength | cardio | sport | duration`
- **Units:** `reps`, `miles`, `yards`, `laps`, `steps`, `sec`, `min`, `hrs`, `custom`
- **Equipment tiers:** `home` (bodyweight) | `basic` (dumbbells, bench) | `gym` (full)
- **Muscle groups:** `CHEST`, `BACK`, `QUADS`, `HAMSTRINGS`, `GLUTES`, `ANTERIOR_DELT`, `LATERAL_DELT`, `POSTERIOR_DELT`, `BICEPS`, `TRICEPS`, `ABS`, `CALVES`

### Testing

- Tests are plain Node.js scripts using `assert` (no test framework)
- Test files are co-located with source: `*.test.js` next to the module they test
- Always run `npm run test` after modifying any `src/lib/` utility

## Environment Variables

**Frontend (must be prefixed `VITE_`):**
```
VITE_SUPABASE_URL        # Supabase project URL
VITE_SUPABASE_ANON_KEY   # Supabase anonymous/public key
```

**Edge Functions (set in Supabase dashboard or `.env`):**
```
OPENAI_API_KEY           # OpenAI API key for gpt-4o-mini
```

## Mobile / PWA Considerations

- Safe area insets for notched devices (CSS `env(safe-area-inset-*)`)
- Touch event handling with swipe detection
- Keyboard inset detection for iOS
- Max viewport width: 760px
- `user-scalable=no` for native-like feel
- Dark theme default: `#0b0f14`

## Important Notes

- `App.jsx` is the largest file (~3000 lines) containing the main state, handlers, effects, and render logic — organized in labeled sections (STATE, HANDLERS, EFFECTS, RENDER)
- No CI/CD pipeline exists — build, lint, and test are manual
- No SQL migrations — database schema is managed via Supabase dashboard; app state is stored as a JSONB blob per user
- Coach insights are cached for 15 minutes with fingerprint-based invalidation (`coachSignature.js`)
