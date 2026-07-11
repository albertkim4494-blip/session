# App Store Launch Roadmap — "Session"

**Goal:** Ship to the Apple App Store by **January 1, 2027**.
**Start:** 2026-07-11 · **Runway:** ~24 weeks / 5.5 months · **Team:** solo dev

---

## Framing: two tracks, not one

The deadline is achievable. The risk isn't time — it's shipping something that feels like "a logger with an AI bolted on." So every item below is tagged as one of:

- **[STORE]** — required to be *allowed* in the App Store. Mechanical, bounded, non-negotiable.
- **[PRODUCT]** — required to be *worth launching*. This is where the differentiation lives.

The sequence front-loads PRODUCT work (so the app feels finished early and can be beta-tested), and back-loads STORE packaging (mechanical, lower-risk, done last).

---

## Current state (as of 2026-07-11)

- **Packaging:** Pure PWA (Vite + `vite-plugin-pwa`). No native wrapper. Apple does not accept PWAs.
- **Monetization:** None. Only a cosmetic "Free Plan" stub (`App.jsx:7265-7292`, `SettingsTab.jsx:388-403`). No Stripe/StoreKit/RevenueCat, no `isPro` flag, no gating.
- **Account deletion:** Not implemented (only local "Reset All" — `SettingsTab.jsx:543-556`). **Apple blocker.**
- **Privacy policy / Terms:** None. **Apple blocker.**
- **Progress analytics:** Zero charts. All text badges + one sortable table. But e1RM, volume-load, muscle-set, adherence, and fatigue trends are *already computed* in `coachApi.js` — they're just fed to the AI as text, never visualized.
- **AI:** Coach is well-engineered (memory, follow-up tracking, sophisticated prompt) but advisory, rate-limited (10/day), and cites unvalidated numbers. Builders have the most upside; "Generate Today" is closest to genuinely useful but uses a thinner prompt and doesn't stream.
- **Observability:** localStorage-only AI metrics + a React ErrorBoundary. No remote error tracking, no product analytics.

---

## Phase timeline

| Phase | Dates | Focus | Tag |
|---|---|---|---|
| **0 — Foundation** | Jul 14 – Jul 25 (2 wk) | Account deletion, legal pages, `isPro` plumbing | STORE + prep |
| **1 — Progress charts** | Jul 28 – Aug 29 (5 wk) | Visualize the analytics that already exist | PRODUCT |
| **2 — AI focus** | Sep 1 – Oct 3 (5 wk) | Make "Generate Today" the hero; streaming; validation | PRODUCT |
| **3 — Packaging & payments** | Oct 6 – Oct 31 (4 wk) | Capacitor wrap + StoreKit/RevenueCat + tier gating | STORE |
| **4 — Polish & beta** | Nov 3 – Nov 28 (4 wk) | TestFlight, Sentry, analytics, stub cleanup, bug fixes | STORE + PRODUCT |
| **5 — Submit & launch** | Dec 1 – Dec 31 (4 wk) | App Store submission, review cycles, **buffer** | STORE |

---

## Phase 0 — Foundation (Jul 14 – Jul 25)

Small, unblocks everything downstream. Do first because gating (Phase 3) and legal both depend on it.

- **[STORE] Account deletion.** Supabase edge function using service-role `admin.deleteUser`; delete server rows + local keys; confirmation UI in Settings. Distinct from "Reset All."
- **[STORE] Privacy policy + Terms.** Host pages (can be a simple static site / Notion / GitHub Pages). Add in-app links in Settings. Needed for App Store Connect anyway.
- **[prep] Entitlement plumbing.** Add an `isPro` flag to `state.preferences` (cloud-synced) + a `useEntitlement()` helper. **No gating yet** — just the switch so Phases 1–2 can build behind it cleanly. Source of truth becomes RevenueCat in Phase 3.
- **[prep] Decide the paywall boundary** (see tier table below) and write it down so charts/AI get built on the correct side of the line.

## Phase 1 — Progress charts (Jul 28 – Aug 29)

The paid-tier spine. Highest leverage because **the math is already done** — this is a visualization layer. No charting lib yet; pick a lightweight one (or hand-rolled SVG to stay dependency-light).

- **[PRODUCT] Per-exercise weight / estimated-1RM line chart over time.** Table-stakes for lifters. Data: `computeEstimated1RMTrends` (`coachApi.js:961`).
- **[PRODUCT] Volume trend** — week-over-week bars, not just a single range total. Data: `computeVolumeLoadTrends` (`coachApi.js:917`).
- **[PRODUCT] PR tracking with dates + "new PR!" detection.** Today only max-in-range exists (`summaryStats.bestLift`) — build a real PR history with a celebration moment.
- **[PRODUCT] Muscle-group balance view.** Reuse `react-muscle-highlighter` + `buildMuscleVolumeDetail` (`coachApi.js:830`) for push/pull / body-part balance.
- **[PRODUCT] Calendar consistency heatmap** (GitHub-style month/year).
- **[PRODUCT] Fix bodyweight-exercise invisibility** — BW sets are excluded from volume/lift (`App.jsx:1007`, `1803`), so calisthenics progress shows nothing. Add a rep/volume proxy.
- Build the richer charts **behind `isPro`** (free tier keeps streaks + totals; see table).

## Phase 2 — AI focus (Sep 1 – Oct 3)

Stop spreading AI across three mediocre surfaces. Make one excellent.

- **[PRODUCT] Make "Generate Today" the hero.** Give it the Coach's memory + trait-vector personalization (currently a thinner prompt than the Coach despite better inputs). Refs: `buildTodayPrompt` in `ai-workout-generator`, `generateTodayAI` (`App.jsx:3626`).
- **[PRODUCT] Stream the builders.** Both program + today block on a spinner today; only the Coach streams. Streaming makes them feel fast and alive.
- **[PRODUCT] Validate Coach numeric claims** against the actual payload before display — right now "7 chest sets" is unchecked model prose (hallucination exposure). Add a fact-check pass or constrain to validated numbers.
- **[PRODUCT] Add thumbs up/down + acceptance tracking** on generated workouts (feeds quality signal + justifies Pro AI limits).
- **[PRODUCT] Replace the hardcoded sport blurb** in the generator (`ai-workout-generator:151/300`) with the Coach's data-driven trait-vector approach.
- **[PRODUCT] Fix metric-unit bug** — generator hardcodes `lbs`/`inches` even for metric users (`ai-workout-generator:99-100, 252-253`).
- **[prep] Wire AI usage limits** to `isPro` (free = N generations/month) — enforcement lands in Phase 3.

## Phase 3 — Packaging & payments (Oct 6 – Oct 31)

Mechanical but the biggest single STORE lift. Do after the product feels done so TestFlight builds are real.

- **[STORE] Capacitor wrap.** Add `@capacitor/core` + `@capacitor/ios`, point `webDir` at `dist/`, generate the Xcode project. Apple Developer account + signing + App Store Connect app record.
- **[STORE] StoreKit IAP via RevenueCat.** Subscriptions **must** be Apple IAP, not Stripe (guideline 3.1.1). RevenueCat becomes the source of truth for `isPro`; sync entitlement into `state.preferences`.
- **[STORE] Turn on gating** across charts (Phase 1) and AI limits (Phase 2) behind the real entitlement.
- **[STORE] Paywall UI** — replace the stub billing modal with a real upgrade flow.
- **[STORE] Re-enable zoom** (`index.html:8` sets `user-scalable=no`) — accessibility flag risk.

## Phase 4 — Polish & beta (Nov 3 – Nov 28)

- **[STORE] Remove/finish "coming soon" stubs** — Billing/Pro, Notifications, Refer Friends. Reviewers reject advertised-but-dead features.
- **[PRODUCT] Remote error tracking** (Sentry) — today errors are invisible in production (localStorage-only).
- **[PRODUCT] Product analytics** (PostHog/Amplitude) — no usage visibility today.
- **[STORE] TestFlight beta.** Recruit real users, fix crashes, tighten onboarding.
- **[PRODUCT] Polish pass** — empty states, loading, error affordances (AI fallbacks currently show terse strings with no retry).

## Phase 5 — Submit & launch (Dec 1 – Dec 31)

- **[STORE] App Store Connect metadata** — screenshots, description, keywords, category, privacy nutrition labels.
- **[STORE] Submit by ~Dec 10.** Apple review is days-to-weeks and rejections happen — the back half of December is **buffer for review cycles**, not new work.
- **Launch on or before Jan 1, 2027.**

---

## Free vs. Pro tiers

Rule: **free = your data + the ability to log it; Pro = the intelligence layer.** Never gate logging, history, or export.

| | **Free** | **Pro (~$5–8/mo)** |
|---|---|---|
| Logging, history, data export | ✅ Unlimited | ✅ |
| Manual workout building | ✅ | ✅ |
| Basic progress (streaks, totals, session count) | ✅ | ✅ |
| Charts & analytics (e1RM/volume trends, PR history, muscle balance, heatmap) | — | ✅ |
| AI builders (Generate Today + programs) | Limited (e.g. 3/mo) | ✅ Unlimited |
| AI Coach (full memory + coaching) | Teaser / occasional | ✅ Full |

---

## Risks & assumptions

- **Apple review is the wild card.** Submit by mid-December; treat late-Dec as pure buffer. A rejection in January misses the goal.
- **StoreKit/RevenueCat is the biggest unknown** for a first-timer — if it slips, it can't move (payments are a hard store requirement). Consider a spike in Phase 0 to de-risk.
- **Solo-dev capacity** — the 5-week PRODUCT phases assume focused weeks. If capacity is thin, protect Phase 1 (charts) and Phase 2's "Generate Today" hero; everything else can trim.
- **Scope discipline** — the Coach is tempting to keep polishing; resist. One great AI surface beats three good ones for launch.

## Definition of launch-ready

1. Passes Apple review (wrapper, account deletion, privacy policy, working IAP, no dead advertised features).
2. Progress tab has real charts — a lifter can see their strength trending up.
3. "Generate Today" feels instant (streaming) and personalized (memory).
4. A clear, honest Free→Pro upgrade path.
5. Crashes and usage are observable in production.
