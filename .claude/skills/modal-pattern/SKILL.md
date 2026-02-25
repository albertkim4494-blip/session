---
name: modal-pattern
description: How modals work in this app — reducer actions, staged state, explicit save pattern. Use when adding or modifying modals.
---

# Modal Pattern

## Architecture

All modal state is managed by `useReducer` with `modalReducer.js`. Each modal has:

- `initialModalState.<name>` — default shape (always includes `isOpen: false`)
- `OPEN_<NAME>` action — populates modal state from current app state
- `UPDATE_<NAME>` action — patches modal fields during editing
- `CLOSE_<NAME>` action — resets to `initialModalState.<name>`

## Explicit Save Pattern

**All edits are staged in modal state. Nothing persists until the user presses Save.**

This means:
1. On open: load current data from `state` into modal state
2. User edits: dispatch `UPDATE_*` actions to modal reducer
3. On Save: read modal state, write to persistent `state` via `updateState()`
4. On Cancel/Back: dispatch `CLOSE_*` which resets modal — all unsaved changes are discarded

### Log Modal Example
- Set completions are staged via `COMPLETE_LOG_SET` / `UNCOMPLETE_LOG_SET` in modal reducer
- Reps/weight are staged via `UPDATE_LOG_SETS`
- `saveLogData()` reads all values from `modals.log.sets` and writes to `state.logsByDate`
- Closing without save discards everything

### Profile Modal Example
- Profile fields (name, birthdate, etc.) are staged in modal reducer state
- Preference changes (theme, units, equipment) are staged in local `pendingPrefs` state
- On Save: profile fields save to Supabase, then `pendingPrefs` flush via `onUpdatePreference`
- On Cancel: both are discarded
- Theme preview: `previewColors`/`previewStyles` computed from staged theme for live preview

## Adding a New Modal

1. Add initial state to `initialModalState` in `modalReducer.js`:
   ```js
   myModal: { isOpen: false, field1: "", field2: null },
   ```

2. Add reducer cases:
   ```js
   case "OPEN_MY_MODAL":
     return { ...state, myModal: { isOpen: true, ...action.payload } };
   case "UPDATE_MY_MODAL":
     return { ...state, myModal: { ...state.myModal, ...action.payload } };
   case "CLOSE_MY_MODAL":
     return { ...state, myModal: initialModalState.myModal };
   ```

3. Open from a handler in App.jsx:
   ```js
   dispatchModal({ type: "OPEN_MY_MODAL", payload: { field1: currentValue } });
   ```

4. Save handler reads from `modals.myModal` and writes to `state` via `updateState`.

5. Cancel/close dispatches `CLOSE_MY_MODAL` — discards everything.

## Side Effects During Editing

Some things fire immediately without waiting for Save (good UX):
- Rest timer on set completion
- Haptic feedback on checkmark tap
- Toast messages
- Sound previews in settings

These are ephemeral (not persisted state), so they don't violate the explicit-save pattern.
