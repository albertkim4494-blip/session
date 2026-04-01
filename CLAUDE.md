# Session — Workout Tracker

## Quick Reference

- **Build:** `npm run build`
- **Test:** `npm test` (runs raw Node.js test scripts, no framework)
- **Dev server:** `npm run dev`
- **Deploy edge function:** `npx supabase functions deploy <name> --no-verify-jwt` (the `--no-verify-jwt` flag is required or requests get 401)

## Tech Stack

- React 19 + Vite 7, plain JavaScript (no TypeScript)
- PWA with localStorage-first architecture + Supabase cloud sync
- Supabase Edge Functions calling OpenAI for AI features
- Styles: inline style objects via `getColors(theme)` / `getStyles(colors)` in `src/styles/theme.js`

## Project Structure

```
src/
  App.jsx            — Main app component (~5000 lines), contains core handlers + inline components
  main.jsx           — Entry point, ErrorBoundary wraps AuthGate
  lib/               — Pure logic: constants, dateUtils, validation, stateUtils, modalReducer,
                       coachApi, coachNormalize, supabaseSync, userIdentity, supabase,
                       exerciseCatalog, exerciseCatalogUtils, setHelpers, greetings,
                       workoutGenerator, workoutGeneratorApi, aiMetrics
  hooks/             — useSwipe, useKeyboardInset
  components/        — Modal, PillTabs, ProfileModal, CoachInsights, AuthGate, AuthScreen,
                       OnboardingScreen, CatalogBrowseModal, ErrorBoundary, ExerciseTimer,
                       CircuitTimer
  components/profile/ — AvatarUpload, ProfileTab, SettingsTab, ChangeUsernameModal, ChangePasswordModal
  styles/theme.js    — Theme definitions, getColors(), getStyles()
supabase/functions/  — Edge functions (ai-coach, ai-workout-generator, ai-exercise-enrichment, exercise-gif)
scripts/             — Utility scripts
```

## Architecture Patterns

- **State:** Single `state` object managed via `updateState()` (structuredClone + persist). `useReducer` for modal state (`modalReducer.js`).
- **Modal data flow:** All edits staged in modal state, only persisted on explicit Save. Back/Cancel discards unsaved changes.
- **Cloud sync:** Debounce + in-flight queue in `supabaseSync.js`. `normalizeState()` runs on both localStorage load AND cloud-pulled data.
- **Set completion:** Explicit `completed: true/false` flag on sets. Use `isSetCompleted()` from `setHelpers.js`.
- **Preferences:** Stored in `state.preferences` (cloud-synced). Always use optional chaining (`state.preferences?.x`) — cloud data may be incomplete.

## Conventions

- No TypeScript — plain `.js` / `.jsx` files
- No test framework — tests are plain Node.js scripts (`node src/lib/foo.test.js`)
- Always add `fontFamily: "inherit"` to form elements (`input`, `select`, `textarea`)
- Use `colors.appBg` for opaque page background (not `colors.bg` which doesn't exist)
- ExerciseRow, WorkoutCard, SummaryBlock are defined at bottom of App.jsx outside the App function to avoid re-creation on render
