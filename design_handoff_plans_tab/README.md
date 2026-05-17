# Handoff: Plans Tab Redesign

## Overview

A clean, intuitive redesign of the **Plans tab** in the Sessions app. The current Plans tab has two problems we're solving here:

1. **Splits and Programs feel like two separate things** — they're listed in two separate cards, and there's a hidden rule (workouts that belong to a split disappear from Programs). The redesign unifies them into ONE library list where splits are container cards holding their member workouts inline.
2. **Inline icon clusters are cramped and hard to tap** — every workout row currently has 4–5 small icons (share, edit, delete, reorder, add exercise). Same for exercises (edit, delete, reorder). The redesign **deletes all inline icons** and replaces them with **tap-the-row → open detail sheet** — the sheet *is* the editor, and every tap target is ≥44pt.

Naming change carried throughout: **Splits → Workouts → Exercises** (rename current "Programs" to "Workouts" in copy — the codebase already uses `workouts[]` / `workoutId` internally, only the UI copy is out of sync).

## About the Design Files

The files in this bundle are **design references created in HTML** — prototypes showing the intended look and behavior, not production code to copy directly. Your task is to **recreate these designs in the existing React codebase at `src/App.jsx` and `src/components/`**, using the existing patterns:

- `getStyles(colors)` style helpers from `src/styles/theme.js`
- The existing `Modal.jsx` component pattern for the new detail sheets
- The existing `modalReducer.js` dispatch pattern for opening/closing them
- The existing color tokens — **do NOT introduce new colors**

The HTML mocks use plain `<button>` and inline styles; in your codebase these should be standard React components consuming `styles` and `colors` from the existing helpers.

## Fidelity

**High-fidelity.** Colors, spacing, type scale, and radii all match `src/styles/theme.js` tokens exactly. Component shapes match the existing patterns (cards with `borderRadius: 16`, `padding: 16`, etc.). The single source of truth for visual values is the theme file — these mocks were built against it.

## Files in this bundle

| File | Purpose |
|---|---|
| `Plans Tab Landing.html` | Open this first — design canvas with all 3 frames + states + themes |
| `plans-redesign.jsx` | The three frame components (Library, WorkoutDetail, ExerciseEdit) |
| `plans-shared.jsx` | Plans-specific icons (`layers`, `sparkle`, etc.), top bar, sample data |
| `shared.jsx` | Generic primitives (`Icon`, `Chip`, `BottomTabs`, etc.) |
| `themes.jsx` | Theme tokens — **mirrors `src/styles/theme.js` from the real codebase** |
| `design-canvas.jsx`, `ios-frame.jsx`, `android-frame.jsx`, `tweaks-panel.jsx` | Mock infrastructure, not for porting |

Open `Plans Tab Landing.html` in a browser to interact with all three frames side by side, switch themes (Night / Day / Nature) via the Tweaks panel on the right, and see all library states (Empty / Sparse / Full).

---

## Screens / Views

There are **three screens** in this redesign:

### Screen 1 — Plans Library (the main view)

**Purpose:** Single source of truth for everything the user has built. Splits, workouts, and the entry points to create more.

**Layout (top to bottom):**

1. **Top bar** (existing — keep)
   - Title "Plans", small uppercase subtitle showing total workout count e.g. "3 WORKOUTS"
   - Right side: existing icon row (search, more, etc. — match the current top bar)

2. **Create row** — `padding: 8px 16px 4px`, `display: flex`, `gap: 8px`
   - **Primary button**: `[+ New workout]` — `flex: 1`, `height: 44`, `borderRadius: 12`, `background: colors.accent`, `color: colors.appBg`, font 13.5px/700
   - **Secondary button**: `[⊞ New split]` — `flex: 1`, `height: 44`, `borderRadius: 12`, `background: colors.cardBg`, `border: 1px solid colors.border`
   - **Icon button**: `[✨]` — `flex: 0 0 44px` (square), `borderRadius: 12`, `background: colors.accentSoft`, `border: 1px solid colors.accentBorder`, accent-colored sparkle icon
   - These three buttons together are the loudest thing on the page. This is intentional — the tab's job is creation.

3. **Scrollable library feed** — `padding: 8px 16px 16px`, vertical gap 12px between cards

   **For each Split:**
   - Outer card: `borderRadius: 16`, `background: colors.cardBg`, `border: 1px solid colors.border`, `boxShadow: colors.shadow`, `overflow: hidden`
   - **Split header** (tappable, opens existing `SplitEditorModal`):
     - `padding: 14px 14px 12px`
     - 4px-wide accent stripe on the left (`background: colors.accent`, full-height, `borderRadius: 999`)
     - Split name in 15px/700
     - Below name: a chip showing mode (`Continuous` or `Weekly`, using `accentSoft` background) + member count e.g. "3 workouts"
     - Chevron-right on the far right
     - `borderBottom: 1px solid colors.border` separating header from members
   - **Member workout rows** (nested inside the split, on a slightly darker `cardAltBg`):
     - One row per member, full width, `minHeight: 60`, `padding: 12px 14px`
     - For continuous splits: lead with a small label "DAY 1 / DAY 2 / DAY 3" (10px/800 uppercase, `colors.textTertiary`), then workout name in 14.5px/700
     - For weekly splits: lead with day labels e.g. "Mon · Wed" in the same small uppercase style, then workout name
     - Below name: exercise count + category, separated by `·`
     - Chevron-right on the far right
     - `borderBottom: 1px solid colors.border` between rows, none after the last

   **Then a section divider:**
   - Small uppercase label "STANDALONE WORKOUTS" — 11px/700, `letterSpacing: 0.6`, `colors.textTertiary`, `paddingLeft: 4`, `marginTop: 6`
   - Only shown if there are both splits AND standalone workouts

   **For each Standalone Workout:**
   - Single card (no nested rows): `borderRadius: 14`, same card colors + border + shadow as split outer card
   - Inside: same row layout as a member row, but with NO day prefix
   - Add a cadence chip on the right side of the meta line ("3×/wk", "Mon · Wed", etc.) — only shown for standalone workouts, hidden for split members since their position implies cadence
   - Chevron-right on the far right

4. **Bottom tabs** (existing — keep)

**Empty state** (when no splits AND no workouts exist):
- Center the empty hero in the scrollable area
- 56×56 rounded square (`borderRadius: 16`, `accentSoft` background, `accentBorder` outline) containing a dumbbell icon
- Title "Build your first workout" — 19px/700, `letterSpacing: -0.3`
- Subtitle ~13px/regular, `textSecondary`, `maxWidth: 260`, centered
- Primary button "Generate with AI" (with sparkle icon) — full width, 13px/700, `accent` background
- Secondary button "Start from scratch" — full width, transparent, `border: 1px solid colors.border`

### Screen 2 — Workout Detail Sheet

**Purpose:** The single editor for a workout. Replaces all the inline icons on the row. This sheet IS the workout's edit modal — currently you have a separate workout edit modal that only edits name/category/schedule and a separate inline exercise list; this combines them.

**Trigger:** Tap any workout row in the library (split member or standalone).

**Layout:**
- Bottom sheet, `top: 70px` from the screen top (revealing dimmed library backdrop above)
- `background: colors.cardBg`, `borderTopLeftRadius: 22`, `borderTopRightRadius: 22`
- Top: 38×4 rounded handle indicator (`background: colors.borderStrong`, `opacity: 0.5`)
- **Sheet header row** (`padding: 8px 14px 4px`):
  - "Close" button on the left (text-only, `colors.textSecondary`, 14px/600)
  - Spacer
  - "Done" button on the right — `padding: 6px 14px`, `borderRadius: 999`, `background: colors.accent`, `color: colors.appBg`, 13px/700
- **Body** (scrollable, `padding: 6px 18px 18px`):
  - **Workout name** as a 26px/700 heading, `letterSpacing: -0.5` — tap to edit inline (single-line text input, no surrounding box)
  - **Meta chips** row, 12px below name, `gap: 6px`, `flexWrap: wrap`:
    - Each chip is a tappable button: `padding: 8px 12px`, `borderRadius: 12`, `background: colors.subtleBg`, `border: 1px solid colors.border`
    - Inside: small uppercase label ("CATEGORY" / "SCHEDULE" / "CADENCE" — 9.5px/800, `textTertiary`) above the value (12.5px/700, `text`)
    - Three chips: Category, Schedule (e.g. "In split: PPL" or "Standalone"), Cadence (e.g. "Continuous" / "3×/wk" / "Mon · Wed" / "Whenever")
    - Tapping each opens the corresponding existing editor: Category opens autocomplete, Schedule opens split picker, Cadence opens existing `CadenceEditor`
  - **Exercises section header** — 22px below meta chips:
    - Uppercase "EXERCISES · 5" on the left (13px/700, `letterSpacing: 0.5`, `textTertiary`)
    - "Reorder" pill on the right (`padding: 4px 10px`, `border: 1px solid colors.border`, `borderRadius: 999`, 11px/700)
  - **Exercise rows** (`gap: 8px`, `marginTop: 10px`):
    - Each row: `minHeight: 56`, `padding: 12px 14px`, `borderRadius: 14`, `background: colors.cardAltBg`, `border: 1px solid colors.border`
    - 24×24 numbered index square on the left (`borderRadius: 7`, `background: colors.subtleBg`, 11px/800, `textSecondary`)
    - Exercise name (14px/700) above unit description (11.5px/regular, `textSecondary`)
    - Chevron-right on the far right
    - **Tap a row → open Screen 3**
  - **Add exercise button** at the bottom of the exercise list:
    - Full width, `padding: 13px 14px`, `borderRadius: 14`
    - `background: transparent`, `border: 1.5px dashed colors.accentBorder`, `color: colors.accent`, 13px/700
    - Plus icon + "Add exercise"
  - **Action row** at the bottom of the sheet (22px above, separated by `borderTop: 1px solid colors.border`, 16px padding-top):
    - Three buttons in a flex row, `gap: 8px`
    - Each: `flex: 1`, `padding: 12px 8px`, `borderRadius: 12`, `background: colors.subtleBg`, `border: 1px solid colors.border`
    - Each shows icon on top + label below, stacked, 12px/700
    - Buttons: **Share** · **Duplicate** · **Delete** (red — use `colors.dangerText` + `colors.dangerBorder`)

### Screen 3 — Exercise Edit Sheet

**Purpose:** Replaces the inline edit/delete/reorder icons on each exercise row. Combines the existing exercise edit modal (name + unit) with delete affordance.

**Trigger:** Tap any exercise row inside the Workout Detail sheet.

**Layout:**
- Smaller bottom sheet — does NOT push from the top, sits at the bottom of the screen
- `padding: 10px 18px 22px`, `borderTopLeftRadius/Right: 22`, same `cardBg`
- Sheet handle at top (same as Screen 2)
- **Header row** with three columns:
  - "Cancel" button left (`textSecondary`, 14px/600)
  - "Edit exercise" centered title (14px/700)
  - "Save" pill on the right (`accent` background, same shape as Screen 2's Done)
- **Name field** (`marginTop: 16`):
  - Uppercase "NAME" label above (11px/700, `letterSpacing: 0.5`, `textTertiary`, `marginBottom: 6`)
  - Input: `padding: 12px 14px`, `borderRadius: 12`, `background: colors.subtleBg`, `border: 1.5px solid colors.accentBorder` (focused state), 16px/600 value
- **Unit selector** (`marginTop: 16`):
  - Uppercase label "HOW DO YOU TRACK THIS?"
  - 2-column CSS grid (`gridTemplateColumns: '1fr 1fr'`, `gap: 8`)
  - Each option: `padding: 12px`, `borderRadius: 12`
    - Inactive: `background: colors.subtleBg`, `border: 1.5px solid colors.border`
    - Active: `background: colors.accentSoft`, `border: 1.5px solid colors.accentBorder`, `color: colors.accent` for the title
  - Two-line content: title (13px/700) above sub (11px/regular, `textTertiary`)
  - Four options:
    1. "Weight × Reps" / "kg or lbs"
    2. "Reps only" / "bodyweight"
    3. "Duration" / "min : sec"
    4. "Distance" / "km or mi"
- **Delete button** at the bottom (`marginTop: 22`):
  - Full width, `padding: 12px`, `borderRadius: 12`
  - `background: transparent`, `border: 1px solid colors.border`, `color: colors.dangerText`
  - Trash icon + "Delete exercise"

---

## Interactions & Behavior

### Navigation flow
- **Library row tap (workout)** → opens Workout Detail Sheet (Screen 2)
- **Library row tap (split header)** → opens the existing `SplitEditorModal` (don't change this — splits already have a good editor)
- **Workout Detail row tap (exercise)** → opens Exercise Edit Sheet (Screen 3) on top of Screen 2
- **Workout Detail meta chip tap (Category)** → opens existing category autocomplete inline or in a small picker
- **Workout Detail meta chip tap (Schedule)** → opens a small picker: "Standalone" / "Move to split…"
- **Workout Detail meta chip tap (Cadence)** → opens existing `CadenceEditor` component
- **Workout Detail Close/Done** → dismisses the sheet, returns to library
- **Workout Detail Delete** → existing confirm modal, then delete
- **Exercise Edit Cancel** → dismisses sheet, no changes saved
- **Exercise Edit Save** → persists name + unit changes
- **Exercise Edit Delete** → existing confirm modal, then delete

### Modal management
Use the existing `modalReducer.js` pattern. Add new actions:
- `OPEN_WORKOUT_DETAIL` with payload `{ workoutId }`
- `CLOSE_WORKOUT_DETAIL`
- The existing `OPEN_EDIT_EXERCISE` modal can be reused as-is — just trigger it from the workout detail sheet instead of from inline row icons.

### Reorder mode
- Each editor has a "Reorder" pill that toggles a `reorderExercises` boolean (already exists in current code)
- In reorder mode, show up/down arrows on each row (this exists — keep the existing pattern)
- Same for split-level reordering inside the Split editor (no change needed there)

### Animations
- Bottom sheets: slide up from bottom, `300ms cubic-bezier(.2,.8,.3,1)` (matches existing modal pattern in `Modal.jsx`)
- Backdrop fade: `200ms ease-in`
- No other animations beyond what the existing codebase already has

### Tap targets
**Critical:** every interactive element must be **≥44pt tall** (iOS HIG) or **≥48dp** (Material). This is the whole point of the redesign. Specifically:
- All buttons in the Create row: 44px height
- All workout rows: `minHeight: 60`
- All exercise rows: `minHeight: 56`
- All meta chips: ≥36px height
- Top sheet header buttons (Close / Done): hit area ≥44px even if visual padding is smaller (add invisible padding)

---

## State Management

This redesign **does not require schema changes**. All needed data already exists in `state.program.workouts` and `state.program.splits`. The cadence model (`cadence.js`) is already in place.

New UI state needed:
- `state.modals.workoutDetail = { open: false, workoutId: null }` — managed by `modalReducer.js`
- The existing `manageWorkoutId` state can be retired (it was used to expand/collapse inline editors; now the detail sheet replaces that mechanism)

### What to delete from existing code
- The inline icon buttons inside `Programs` card workout rows (share, pencil, trash, reorder, plus) — lines ~5000-5050 in `App.jsx`
- The inline icon buttons on exercise rows (pencil, trash, reorder) — lines ~5100-5150
- The "Programs" card itself — its content moves into a unified "Workouts" feed alongside the "Splits" card
- The "All your workouts are part of a split. Add a new workout to see it here." empty-state copy — no longer applicable

### What to keep
- `SplitsSection.jsx` rendering — but rename the section title from "Splits" to nothing (the splits just appear as cards in the unified feed, no header above them)
- `SplitEditorModal` — open from split card header tap, unchanged
- `EditExerciseModal` — open from exercise row tap inside workout detail sheet
- `CadenceEditor` — open from the Cadence meta chip in workout detail sheet
- All data/state functions (`addWorkout`, `deleteWorkout`, `moveExercise`, etc.) — unchanged

---

## Design Tokens

All tokens come from `src/styles/theme.js`. **Do not introduce new values.** The redesign uses only what's already defined.

### Colors per theme (already in `getColors(theme)`)
- `appBg`, `text`, `textSecondary`, `textTertiary`
- `cardBg`, `cardAltBg`, `subtleBg`, `subtleTrack`
- `border`, `borderStrong`
- `accent`, `accentBg`, `accentSoft`, `accentBorder`
- `primaryBg`, `primaryText`
- `dangerBg`, `dangerBorder`, `dangerText`
- `shadow`

### Spacing
Standard 4/8/12/16/22/24/40 scale — already used throughout `getStyles(colors)`.

### Typography (from `theme.js fontSize`)
- 10 / 11 / 12 / 13 / 14 / 16 / 20 / 28 — use the existing scale, don't add new sizes
- Hero workout name: 26px (slightly above the 20→28 jump in your scale; use 28 if you prefer to stay strict on the scale)
- Heading weight: 700

### Border radius (from `theme.js radius`)
- `sm: 8`, `md: 12`, `lg: 14`, `xl: 16`, `2xl: 18`, `full: 999`
- All new components use these.

### Icon size (from `theme.js icon`)
- `xs: 14`, `sm: 16`, `md: 18`, `lg: 22`, `xl: 40`, `stroke: 2`
- Match existing usage.

---

## Assets

No new assets. All icons are inline SVGs using `stroke: currentColor`. The full set used:
- `plus`, `chevR`, `chevD`, `share`, `copy` (duplicate), `trash`, `pencil`, `sparkle` (AI), `layers` (split), `dumbbell`, `search`, `more`

All already exist in the codebase or in `plans-shared.jsx`.

---

## Things NOT to change

To keep this PR focused:
- Don't redesign `SplitEditorModal` — it already works well
- Don't redesign `CadenceEditor` — it already works well
- Don't redesign the Catalog section (`ExerciseCatalogSection.jsx`) — keep it where it is, but move it OUT of the Plans tab if it's currently top-of-page noise. Recommendation: relocate the Catalog entry point to be a small link inside the workout detail sheet near "+ Add exercise" — "Browse catalog" — and remove the top-level Catalog card from Plans.
- Don't change the Data card — but **move it to Settings**. The Plans tab is for creation, not data management.
- Don't touch `getStyles` or `theme.js`

---

## Implementation order (suggested)

1. Create `<WorkoutDetailSheet>` component using the existing `Modal.jsx` shell — this is the biggest piece
2. Add `OPEN_WORKOUT_DETAIL` / `CLOSE_WORKOUT_DETAIL` to `modalReducer.js`
3. Replace the `Programs` card body in `App.jsx` with a unified feed: render `SplitsSection` results inline, followed by standalone workouts as cards. Strip the inline icon clusters.
4. Wire row taps to dispatch `OPEN_WORKOUT_DETAIL`
5. Add the Create row at the top (New workout / New split / AI)
6. Move the Catalog entry into the workout detail sheet
7. Move the Data card to Settings tab
8. QA all three themes (Night / Day / Nature)

Ship in two PRs if needed: PR 1 = WorkoutDetailSheet + tap-to-open (kills inline icons). PR 2 = unified feed + create row + Catalog/Data relocation.
