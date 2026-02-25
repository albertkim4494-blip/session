---
name: new-feature
description: Scaffold and implement a new feature following project patterns
disable-model-invocation: true
---

# New Feature

Implement: **$ARGUMENTS**

## Checklist

### 1. Plan Before Coding
- Identify which files need changes
- Determine if new modal state is needed
- Check if existing patterns already handle part of this

### 2. State Changes (if needed)

**Adding to `state` (persistent):**
- Add default value in `normalizeState()` in `src/lib/stateUtils.js`
- This ensures cloud-synced data and old localStorage both get the field
- Use optional chaining everywhere: `state.newField?.x`

**Adding a modal:**
- Add initial state to `initialModalState` in `src/lib/modalReducer.js`
- Add `OPEN_*`, `UPDATE_*`, `CLOSE_*` actions to the reducer
- Stage all edits in modal state — only persist on explicit Save
- Back/Cancel must discard unsaved changes

**Adding a preference:**
- Store in `state.preferences` (auto cloud-synced)
- Access via `state.preferences?.newPref` with fallback
- Update via `updatePreference(key, value)` in App.jsx
- In profile modal, preferences are staged via `stagePreference` and flushed on Save

### 3. Component Patterns

- Inline styles using `colors` and `styles` from `getColors()`/`getStyles()`
- `fontFamily: "inherit"` on all form elements
- `WebkitTapHighlightColor: "transparent"` on all buttons
- `className="btn-press"` for press feedback on buttons
- Use `colors.appBg` for opaque backgrounds (not `colors.bg`)

### 4. If Adding to App.jsx

- Handlers go in the main function body as `useCallback`
- Static/presentational components go at the bottom of the file, outside the App function
- Add to dependency arrays carefully — useMemo ordering matters (temporal dead zone)

### 5. Test & Build

```
npm test && npm run build
```

No test framework — if the feature has testable pure logic, add a `src/lib/featureName.test.js` that runs with `node` and add it to the `test` script in `package.json`.
