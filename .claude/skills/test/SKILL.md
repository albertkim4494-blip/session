---
name: test
description: Run all project tests and build verification
---

# Test & Verify

Run the full test suite and build:

```
npm test && npm run build
```

## What This Runs

**Tests** (`npm test`):
- `src/lib/coachNormalize.test.js` — classifyActivity, normalizeToMinutes, buildNormalizedAnalysis, detectImbalances
- `src/lib/userIdentity.test.js` — username validation, sanitization, cooldown, avatar/display helpers
- `src/lib/exerciseCatalogUtils.test.js` — catalog search, filtering, muscle groups, recent/frequent
- `src/lib/workoutGenerator.test.js` — program generation, splits, equipment filtering, deduplication
- `src/lib/muscleGroups.test.js` — muscle-to-UI-group mapping

**Build** (`npm run build`):
- Vite production build
- PWA service worker generation via workbox
- Chunk splitting (three.js and react-three are separate lazy chunks)

## If Tests Fail

- Tests are plain Node.js scripts — no framework, no mocks
- Each test file is self-contained with inline assertions
- Read the failing test to understand what's expected
- Fix the source code, not the test (unless the test is wrong)

## Adding New Tests

1. Create `src/lib/featureName.test.js`
2. Use plain `assert` or manual checks with `process.exit(1)` on failure
3. Add to the `test` script in `package.json` with `&& node src/lib/featureName.test.js`
