# Implementation Plan

## Advanced Exercise Catalog & Custom Exercise Enhancements

### Overview
Enrich custom exercises with AI-generated metadata and provide a richer exercise creation UI — bringing custom exercises to parity with catalog entries.

### Features

#### 1. AI-Enriched Custom Exercises
When a user creates a custom exercise, use AI (edge function) to auto-generate:
- **Muscle tags** (primary/secondary) — same format as catalog entries
- **Equipment classification** — bodyweight, dumbbell, barbell, etc.
- **Movement category** — push, pull, hinge, squat, carry, isolation
- **Exercise type** detection — strength, sport, stretch, cardio
- **Tags** — compound, unilateral, plyometric, etc.

The AI analyzes the exercise name (and optional user description) to infer metadata. User can review/override before saving.

#### 2. Sport Detection & Formatting
- Auto-detect if a custom exercise is a sport (e.g. "Basketball", "Ultimate Frisbee")
- When detected as sport: auto-set unit to duration (min/hrs), add sport icon
- Format sports consistently with catalog sports — icon badge, duration-based tracking
- Sport-specific fields: frequency (e.g. "3x/week"), season, team/individual

#### 3. Body Diagram Selector
- Visual body diagram (front/back) for selecting target muscles
- Tappable muscle regions that map to the existing muscle group constants
- Used in both custom exercise creation and exercise detail views
- Could use SVG with clickable regions or a simple grid-based selector
- Shows primary (filled) vs secondary (outlined) muscle involvement

#### 4. Rich Exercise Creation UI
Interactive form for adding custom exercises with:
- **Name** input (required)
- **Body parts** — body diagram or multi-select chips (CHEST, BACK, LEGS, etc.)
- **Equipment** — multi-select chips matching the new equipment categories
- **Exercise type** — strength / sport / stretch / cardio toggle
- **Movement pattern** — push / pull / hinge / squat / carry / isolation
- **Tags** — auto-suggested by AI, editable chip list
- **Notes/description** — optional free text
- "Auto-fill with AI" button that populates all fields from just the name

#### 5. Custom Exercise Persistence
- Custom exercises stored in a user-specific catalog (Supabase `custom_exercises` table or within state)
- Merged with built-in catalog for search, filtering, and coach analysis
- Custom exercises get a `custom: true` flag to distinguish from built-in
- Editable after creation (unlike built-in catalog entries)

### Technical Considerations
- New edge function: `ai-exercise-enrichment` — takes exercise name, returns metadata
- Body diagram: SVG component with clickable paths, or simplified chip-based muscle selector
- Custom exercises need `catalogId` format that won't collide with built-in IDs (e.g. `custom_<uuid>`)
- AI coach and workout generator should treat custom exercises identically to catalog entries
- Migration: existing custom exercises (no catalogId) could be retroactively enriched

### Priority
Medium — enhances the exercise creation experience but the app works well without it. Consider implementing after core features stabilize.

---

## Manage Tab Improvements

### Overview
Improvements to the workout management experience.

### Features
- Reorder workouts via drag-and-drop
- Reorder exercises within a workout
- Duplicate workout functionality
- Bulk exercise operations (move, copy between workouts)

### Priority
Medium — quality-of-life improvements for power users.
