/**
 * Entitlements — the single source of truth for "what does Pro unlock" and
 * "is this user Pro right now".
 *
 * TODAY (Phase 0): the boolean lives in `state.preferences.isPro`, flipped
 * manually via a DEV-only toggle in Settings (see SettingsTab). This lets us
 * build and test Pro-gated features (Phase 1 charts, Phase 2 AI limits) before
 * any billing exists.
 *
 * PHASE 3 (payments): RevenueCat becomes the source of truth. Its `pro`
 * entitlement will be synced into `state.preferences.isPro`, so every caller
 * here keeps working unchanged. Nothing else in the app should read
 * `preferences.isPro` directly — always go through `isPro(state)` so the swap
 * to RevenueCat is a one-file change.
 *
 * See APP_STORE_ROADMAP.md — Phase 0 (entitlement plumbing) and Phase 3.
 */

// The feature keys that require Pro. Kept in one place so the set of gated
// capabilities is discoverable/greppable as it grows.
export const PRO_FEATURE = {
  // Progress tab: e1RM/volume trend charts, PR history, muscle balance, heatmap.
  ADVANCED_ANALYTICS: "advanced_analytics",
  // AI builders beyond the free monthly allowance + full Coach access.
  UNLIMITED_AI: "unlimited_ai",
};

// Free-tier monthly allowance for AI generations (Generate Today + programs).
// Enforcement lands in Phase 3; the number lives here with the tier logic.
export const FREE_AI_MONTHLY_LIMIT = 3;

/**
 * True if the user currently has the Pro entitlement.
 * @param {object} state - the app state object.
 * @returns {boolean}
 */
export function isPro(state) {
  return state?.preferences?.isPro === true;
}
