---
name: cloud-sync
description: Architecture and patterns for localStorage-first cloud sync with Supabase. Use when working on state persistence, sync issues, or data migration.
---

# Cloud Sync Architecture

## Overview

The app uses **localStorage-first** architecture: all state lives in localStorage and syncs to Supabase in the background. This means the app works offline and syncs when connectivity returns.

## Key Files

- `src/lib/supabaseSync.js` — Debounce + in-flight queue for push/pull
- `src/lib/stateUtils.js` — `loadState()`, `normalizeState()`, `updateState()`
- `src/lib/supabase.js` — Supabase client initialization

## Critical Pattern: normalizeState()

`normalizeState()` in `stateUtils.js` is the **single source of truth** for state shape. It:
- Adds missing fields with defaults
- Migrates old localStorage keys into `state.preferences`
- Runs `migrateCompletedFlag()` to stamp explicit `completed` on sets

**It MUST run on both paths:**
1. `loadState()` — reading from localStorage on app mount
2. `fetchCloudState()` → `setState()` — when cloud data replaces local state

If you add a new state field, add its default to `normalizeState()`. Otherwise cloud-pulled data will be missing the field and cause crashes.

## State Update Flow

```
User action → updateState(fn) → structuredClone(state) → fn(clone) → setState → persist to localStorage → debounced sync to Supabase
```

- `structuredClone` is the main perf bottleneck — future optimization target
- The updater function receives a mutable clone and returns it
- Never mutate `state` directly — always go through `updateState`

## Cloud Data Can Be Incomplete

Always use optional chaining for state sub-objects:
```js
state.preferences?.theme        // correct
state.preferences.theme         // will crash if preferences is undefined
```

Cloud data may be from an older app version missing new fields. `normalizeState()` handles this, but code should still be defensive.

## Sync Conflict Strategy

Last-write-wins. The most recent `updateState` call pushes to cloud, overwriting whatever was there. No merge logic.
