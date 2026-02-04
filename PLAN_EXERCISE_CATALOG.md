# Exercise Catalog & Manage Tab Improvements Plan

## Overview

Two related features:
1. **Exercise Catalog** — A static client-side catalog of ~200-400 exercises with muscle groups, default units, curated variations, and search/filter. Replaces the blank text input in "Add Exercise" with a searchable list.
2. **Manage Tab UX** — Fix the unintuitive workout-to-exercise drill-down, improve visual hierarchy, and integrate the catalog into the add-exercise flow.

---

## Part 1: Exercise Catalog

### 1A. Create `src/lib/exerciseCatalog.js`

**Data shape per entry:**
```js
{
  id: "bench_press",
  name: "Bench Press",
  muscles: ["CHEST", "TRICEPS"],
  category: "strength",        // strength | cardio | duration | sport
  defaultUnit: "reps",
  variations: [
    { suffix: "Close Grip", muscles: ["TRICEPS", "CHEST"] },
    { suffix: "Incline", muscles: ["CHEST", "ANTERIOR_DELT"] },
    { suffix: "Decline", muscles: ["CHEST", "TRICEPS"] },
    { suffix: "Paused", muscles: ["CHEST", "TRICEPS"] },
  ]
}
```

- Variations are curated per exercise (not auto-generated)
- Each variation can override the parent's muscle groups
- Exercises with no meaningful variations have an empty array
- Categories match what `coachNormalize.js` already uses

**Muscle groups (same as coachNormalize.js):**
CHEST, BACK, QUADS, HAMSTRINGS, GLUTES, ANTERIOR_DELT, LATERAL_DELT, POSTERIOR_DELT, BICEPS, TRICEPS, ABS, CALVES

**Exercise coverage targets:**
- ~50 compound movements (bench, squat, deadlift, rows, presses, etc.)
- ~80 isolation movements (curls, extensions, raises, flyes, etc.)
- ~30 bodyweight (push ups, pull ups, dips, planks, etc.)
- ~20 cardio (running, cycling, swimming, rowing, etc.)
- ~20 sport/duration (yoga, basketball, soccer, etc.)
- Total: ~200 entries, each with 0-6 curated variations

### 1B. Create `src/lib/catalogSearch.js`

**Exports:**
- `searchCatalog(query, options?)` — Fuzzy-ish search by name, returns sorted results
- `filterByMuscle(muscle)` — Filter catalog by muscle group
- `filterByCategory(category)` — Filter by strength/cardio/etc.
- `getRecentExercises(logsByDate, limit=10)` — Most recently used exercise names
- `getFrequentExercises(logsByDate, limit=10)` — Most frequently logged exercise names
- `getSuggestedForWorkout(workout, catalog)` — Exercises targeting same muscle groups as existing exercises in this workout

### 1C. Update exercise object shape

When user picks from catalog, store catalog reference:
```js
{
  id: "ex_abc123",
  name: "Bench Press",
  unit: "reps",
  catalogId: "bench_press",    // NEW — links back to catalog entry
  muscles: ["CHEST", "TRICEPS"] // NEW — baked in from catalog at creation time
}
```

For custom (non-catalog) exercises, `catalogId` is null and `muscles` is omitted (falls back to keyword matching in coachNormalize).

### 1D. Update `coachNormalize.js`

- `classifyExerciseMuscles(exercise)` — Check `exercise.muscles` first, fall back to keyword matching for legacy/custom exercises
- No breaking changes to existing analysis

### 1E. Create `src/lib/exerciseCatalog.test.js`

- Test search ranking, filter functions, recent/frequent helpers
- Add to `package.json` test script

---

## Part 2: Manage Tab UX Improvements

### 2A. Workout expand/collapse improvements

**Current problem:** Tapping a workout expands exercises below it with no visual feedback. User doesn't notice the expanded content, especially on mobile.

**Fixes:**
- **Auto-scroll into view:** After expanding a workout, scroll the body so the exercise list is visible. Use `element.scrollIntoView({ behavior: "smooth", block: "nearest" })`.
- **Active workout highlight:** When expanded, the workout card gets a distinct left border or background tint (using the primary color) so it's obvious which one is "active".
- **Collapse icon rotation:** The expand/collapse chevron should animate or clearly indicate state.

### 2B. Rework "Add Exercise" modal

**Current:** Blank text input + unit picker. User types freeform.

**New flow:**
1. Modal opens with search bar at top
2. Below search: two rows of filter chips — muscle groups + categories
3. Main area: scrollable list of matching catalog exercises
   - Each row: exercise name, muscle group pills, default unit
   - Tap row to select → shows variation chips if available
   - "Add" button adds to workout
4. Bottom: "Custom Exercise" link → falls back to current freeform input + unit picker
5. "Recent" and "Favorites" sections at top of list when no search query

### 2C. Favorites system

- Store favorites as a Set of catalog IDs in localStorage (`wt_favorites`)
- Star icon on each catalog row in the Add Exercise modal
- Favorites section appears at top of exercise list when no search/filter active

### 2D. Variation chips

When user selects a catalog exercise that has variations:
- Show the base exercise as selected
- Below it, show horizontal scrollable chips: "Close Grip", "Incline", etc.
- Tapping a chip switches the selection to that variation (updates name + muscles)
- User can add the base or any variation

---

## Implementation Order

1. `src/lib/exerciseCatalog.js` — catalog data
2. `src/lib/catalogSearch.js` — search/filter/recent/frequent helpers
3. `src/lib/exerciseCatalog.test.js` + update package.json test script
4. Manage tab UX: auto-scroll, active highlight, chevron state
5. Rework Add Exercise modal with catalog integration
6. Favorites (localStorage Set + star toggle)
7. Variation chips in Add Exercise modal
8. Update `coachNormalize.js` to use `exercise.muscles` when available
9. `npm test && npm run build`

---

## Files to Create
- `src/lib/exerciseCatalog.js`
- `src/lib/catalogSearch.js`
- `src/lib/exerciseCatalog.test.js`

## Files to Modify
- `src/App.jsx` (manage tab UX, Add Exercise modal rework, exercise object shape)
- `src/lib/coachNormalize.js` (use muscles field when available)
- `package.json` (test script)

---

## Out of Scope (for now)
- Auto-suggest based on workout template context (deferred)
- Fuzzy duplicate detection for custom exercises (deferred)
- Supabase-backed catalog (static JSON is sufficient)
- User-submitted exercises to shared catalog
