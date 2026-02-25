---
name: animation-system
description: 3D exercise animation system — procedural mannequin, keyframe format, 4-tier cache, AI generation. Use when working on exercise animations or the 3D viewer.
---

# 3D Exercise Animation System

## Architecture

```
ExerciseDetailModal → ExerciseViewer3D (shell) → ExerciseScene3D (R3F scene)
                                                    ↓
                                              Procedural Mannequin
                                              (Mixamo bone names)
                                                    ↓
                                              Keyframe Animation
                                              (from animationData)
```

## Key Files

- `src/components/ExerciseViewer3D.jsx` — Outer shell: lazy Canvas, playback controls, progress bar, DPR detection, WebGL check
- `src/components/ExerciseScene3D.jsx` — R3F inner scene: procedural mannequin, bone animation, OrbitControls (lazy-loaded, code-split)
- `src/lib/animationData.js` — `BONE_NAMES`, hardcoded `ANIMATIONS` (bench press, squat, curl), keyframe format, in-memory cache
- `src/lib/exerciseAnimationApi.js` — 4-tier cache lookup + AI generation trigger
- `supabase/functions/ai-exercise-animation/index.ts` — Edge function: GPT-4o-mini generates keyframes, validates bone names/rotations, stores in Supabase Storage
- `scripts/generate-animations.js` — Batch pre-generation for all catalog exercises

## 4-Tier Cache

Animation data is resolved in this order:
1. **Memory cache** — in-process Map, instant
2. **localStorage** — persisted across sessions
3. **Supabase Storage** — CDN-cached, shared across users
4. **AI edge function** — generates new keyframes via GPT-4o-mini, stores result in Supabase Storage for future lookups

## Keyframe Format

Each animation is an array of keyframes. Each keyframe specifies:
- `time` — normalized 0-1 position in the animation cycle
- Bone rotations keyed by Mixamo bone name (e.g., `mixamorigLeftForeArm`)
- Rotations are `[x, y, z]` in radians

See `BONE_NAMES` in `animationData.js` for the full list of valid bone names.

## Performance

- `frameloop="demand"` + `invalidate()` — GPU only renders when animation state changes
- `three` (~718KB) and `react-three` (~369KB) are split into separate lazy chunks via Vite `manualChunks`
- DPR capped based on device capability
- WebGL availability checked before attempting render

## Adding Animations for New Exercises

1. Add the exercise to `exerciseCatalog.js` with a `catalogId`
2. Run `node scripts/generate-animations.js` to batch-generate via AI
3. Or let the 4-tier cache generate on-demand when a user opens the exercise detail

## Swapping to GLB Model (Future)

The procedural mannequin uses Mixamo bone names. The architecture supports swapping to a GLB model later — just replace the mannequin mesh while keeping the same bone-name-based animation system.
