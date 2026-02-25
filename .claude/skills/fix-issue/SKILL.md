---
name: fix-issue
description: Fix a GitHub issue end-to-end — read it, locate code, implement fix, test, commit
disable-model-invocation: true
---

# Fix GitHub Issue

Fix issue: **$ARGUMENTS**

## Workflow

1. **Read the issue** to understand the problem:
   ```
   gh issue view $0
   ```

2. **Reproduce mentally** — trace the code path described in the issue. Identify which files are involved. Start from App.jsx handlers or the relevant component.

3. **Locate the code** — use Grep/Glob to find the relevant handlers, components, or lib functions. Read before modifying.

4. **Implement the fix** — keep changes minimal and focused. Don't refactor surrounding code. Don't add features beyond what the issue asks for.

5. **Test the fix**:
   ```
   npm test && npm run build
   ```

6. **Commit** with a message that references the issue:
   ```
   git commit -m "Fix #$0: <concise description>"
   ```

## Project Context

- Main app logic is in `src/App.jsx` (~5000 lines) — most handlers live here
- State is managed via `updateState()` with structuredClone
- Modal state uses `useReducer` with `modalReducer.js`
- All modal edits are staged — only persisted on Save
- Always use optional chaining for `state.preferences?.x`
- No TypeScript — plain JS/JSX only
