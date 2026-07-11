# App Store Launch Roadmap — "Session"

**Goal:** Ship to **Android first (Google Play + Samsung Galaxy Store)** by **January 1, 2027**. **iOS as a fast-follow** once the Android build is live.
**Start:** 2026-07-11 · **Runway:** ~24 weeks / 5.5 months · **Team:** solo dev (Windows-only — no Mac/iPhone)

> **Why Android-first:** iOS requires Xcode on a Mac, which we don't have — it was a hardware blocker, not a priority call. Android tooling runs on Windows, and unlike Apple, Google Play + Galaxy Store both accept wrapped web apps. iOS is reachable later via cloud-Mac CI (Codemagic / GitHub Actions macOS runners) with no hardware purchase — see Phase 6.
>
> **Store strategy:** Google Play reaches all Android devices; Galaxy Store only reaches Samsung. The *same Capacitor build* ships to both, so publish to both — **Google Play primary, Galaxy secondary.** The only real difference is billing (Google Play Billing vs Samsung IAP).

---

## Framing: two tracks, not one

The deadline is achievable. The risk isn't time — it's shipping something that feels like "a logger with an AI bolted on." So every item below is tagged as one of:

- **[STORE]** — required to be *allowed* into Google Play / Galaxy Store. Mechanical, bounded, non-negotiable.
- **[PRODUCT]** — required to be *worth launching*. This is where the differentiation lives.

Note: most STORE-compliance items (account deletion, privacy policy) are required by **both** Google and Apple, so this work carries straight over to the iOS fast-follow.

The sequence front-loads PRODUCT work (so the app feels finished early and can be beta-tested), and back-loads STORE packaging (mechanical, lower-risk, done last).

---

## Current state (as of 2026-07-11)

- **Packaging:** Pure PWA (Vite + `vite-plugin-pwa`). No native wrapper. Google Play + Galaxy Store accept wrapped PWAs (Capacitor or TWA); Apple does not (iOS deferred).
- **Dev environment:** Windows 11 only. Android builds work locally (Android Studio); iOS needs a Mac or cloud-Mac CI.
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
| **3 — Android packaging & payments** | Oct 6 – Oct 31 (4 wk) | Capacitor wrap + Google Play Billing (RevenueCat) + tier gating | STORE |
| **4 — Polish & beta** | Nov 3 – Nov 28 (4 wk) | Play internal testing, Sentry, analytics, stub cleanup, bug fixes | STORE + PRODUCT |
| **5 — Submit & launch (Android)** | Dec 1 – Dec 31 (4 wk) | Google Play + Galaxy Store submission, review, **buffer** | STORE |
| **6 — iOS fast-follow** | 2027 Q1 (post-launch) | Cloud-Mac CI build + StoreKit; no hardware purchase | STORE |

---

## Phase 0 — Foundation (Jul 14 – Jul 25)

Small, unblocks everything downstream. Do first because gating (Phase 3) and legal both depend on it.

- **[STORE] Account deletion.** Required by Google Play (and Apple). Supabase edge function using service-role `admin.deleteUser`; delete server rows + local keys; confirmation UI in Settings. Distinct from "Reset All."
- **[STORE] Privacy policy + Terms.** Required by both stores (Google's Data Safety form links to it). Host pages (simple static site / GitHub Pages). Add in-app links in Settings.
- **[prep] Entitlement plumbing.** Add an `isPro` flag to `state.preferences` (cloud-synced) + a `useEntitlement()` helper. **No gating yet** — just the switch so Phases 1–2 can build behind it cleanly. Source of truth becomes RevenueCat in Phase 3.
- **[prep] Decide the paywall boundary** (see tier table below) and write it down so charts/AI get built on the correct side of the line.
- **[prep] Decide Galaxy Store billing stance** — launch Galaxy build without IAP (Pro sold on Play only) vs. integrate Samsung IAP later. Affects Phase 3 scope.
- **[prep] Spike RevenueCat + Google Play Billing** early to de-risk the biggest unknown before it's on the critical path.

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

## Phase 3 — Android packaging & payments (Oct 6 – Oct 31)

Mechanical but the biggest single STORE lift. Do after the product feels done so test-track builds are real. All doable on Windows.

- **[STORE] Capacitor wrap.** Add `@capacitor/core` + `@capacitor/android`, point `webDir` at `dist/`, generate the Android Studio project. Build/sign the AAB locally on Windows. (Capacitor over bare TWA because it gives billing-plugin access and reuses cleanly for the iOS fast-follow.)
- **[STORE] Google Developer account** (one-time $25) + Play Console app record. **Galaxy Store** developer account (free) — same AAB uploads to both.
- **[STORE] In-app billing via RevenueCat.** Digital subscriptions **must** use Google Play Billing on Play (not Stripe) — same rule as Apple. RevenueCat wraps Play Billing and becomes the source of truth for `isPro`; sync entitlement into `state.preferences`.
  - *Galaxy Store nuance:* Samsung requires **Samsung IAP**, which RevenueCat does **not** cover first-class. Options: (a) launch Galaxy build without in-app purchase (Pro sold only on Play at first), or (b) integrate Samsung IAP separately later. Decide in Phase 0.
- **[STORE] Turn on gating** across charts (Phase 1) and AI limits (Phase 2) behind the real entitlement.
- **[STORE] Paywall UI** — replace the stub billing modal (`App.jsx:7265-7292`) with a real upgrade flow.
- **[STORE] Re-enable zoom** (`index.html:8` sets `user-scalable=no`) — accessibility flag risk on both stores.

## Phase 4 — Polish & beta (Nov 3 – Nov 28)

- **[STORE] Remove/finish "coming soon" stubs** — Billing/Pro, Notifications, Refer Friends. Both stores reject advertised-but-dead features.
- **[PRODUCT] Remote error tracking** (Sentry) — today errors are invisible in production (localStorage-only).
- **[PRODUCT] Product analytics** (PostHog/Amplitude) — no usage visibility today.
- **[STORE] Play internal/closed testing track.** Recruit real users, fix crashes, tighten onboarding. (Google requires a closed-test cohort before production for new personal developer accounts — start this early.)
- **[PRODUCT] Polish pass** — empty states, loading, error affordances (AI fallbacks currently show terse strings with no retry).

## Phase 5 — Submit & launch, Android (Dec 1 – Dec 31)

- **[STORE] Play Console + Galaxy Store listings** — screenshots, description, feature graphic, category, **Data Safety form** (Google's privacy disclosure).
- **[STORE] Submit by ~Dec 10.** Google review is usually faster than Apple (hours-to-days) but new accounts can face longer holds — the back half of December is **buffer**, not new work.
- **Launch on Google Play (+ Galaxy Store) on or before Jan 1, 2027.**

## Phase 6 — iOS fast-follow (2027 Q1, post-launch)

Deferred, not abandoned — reachable from the same Capacitor codebase without buying a Mac.

- **[STORE] Add the iOS platform** (`@capacitor/ios`) and build/sign via **cloud-Mac CI** (Codemagic, Ionic Appflow, or GitHub Actions macOS runners). Apple Developer account ($99/yr).
- **[STORE] Swap billing to StoreKit** (RevenueCat abstracts most of this — the entitlement plumbing from Phase 3 is reused).
- **[STORE] Apple-specific gates** already handled by carryover work: account deletion + privacy policy (Phase 0), no dead stubs (Phase 4). Remaining: App Store Connect metadata + privacy nutrition labels.
- A borrowed/cloud iOS device or the CI's simulator covers testing.

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

- **New-account testing requirement.** Google now requires new personal developer accounts to run a **closed test with real testers** before production access. Start the test track in Phase 4, not December, or launch slips.
- **Play review is usually fast (hours-to-days)**, but new accounts can face longer manual holds. Submit by mid-December; treat late-Dec as pure buffer.
- **RevenueCat + Google Play Billing is the biggest unknown** for a first-timer — if it slips, it can't move (payments are a hard store requirement). Spike it in Phase 0 to de-risk.
- **Samsung IAP is not first-class in RevenueCat** — the pragmatic launch is Pro-on-Play, Galaxy as a free/no-IAP listing, with Samsung IAP as a later add.
- **Solo-dev capacity** — the 5-week PRODUCT phases assume focused weeks. If capacity is thin, protect Phase 1 (charts) and Phase 2's "Generate Today" hero; everything else can trim.
- **Scope discipline** — the Coach is tempting to keep polishing; resist. One great AI surface beats three good ones for launch.

## Definition of launch-ready (Android)

1. Passes Google Play review (Capacitor AAB, account deletion, privacy policy + Data Safety form, working Play Billing, no dead advertised features).
2. Progress tab has real charts — a lifter can see their strength trending up.
3. "Generate Today" feels instant (streaming) and personalized (memory).
4. A clear, honest Free→Pro upgrade path.
5. Crashes and usage are observable in production.
6. (Bonus) Same AAB published to Galaxy Store.
