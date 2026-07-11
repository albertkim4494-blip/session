// Tests for entitlements.js — plain Node.js test script

const { isPro, PRO_FEATURE, FREE_AI_MONTHLY_LIMIT } = await import("./entitlements.js");
const { normalizeState, makeDefaultState } = await import("./stateUtils.js");

let passed = 0;
let failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; }
  else { failed++; console.error("FAIL:", msg); }
}

// --- isPro ---
assert(isPro({ preferences: { isPro: true } }) === true, "isPro: true when flag true");
assert(isPro({ preferences: { isPro: false } }) === false, "isPro: false when flag false");
assert(isPro({ preferences: {} }) === false, "isPro: false when flag missing");
assert(isPro({ preferences: { isPro: "yes" } }) === false, "isPro: strict — truthy non-true is false");
assert(isPro({ preferences: { isPro: 1 } }) === false, "isPro: strict — 1 is not true");
assert(isPro({}) === false, "isPro: false when preferences missing");
assert(isPro(null) === false, "isPro: false for null state");
assert(isPro(undefined) === false, "isPro: false for undefined state");

// --- constants ---
assert(PRO_FEATURE.ADVANCED_ANALYTICS === "advanced_analytics", "PRO_FEATURE.ADVANCED_ANALYTICS defined");
assert(PRO_FEATURE.UNLIMITED_AI === "unlimited_ai", "PRO_FEATURE.UNLIMITED_AI defined");
assert(typeof FREE_AI_MONTHLY_LIMIT === "number" && FREE_AI_MONTHLY_LIMIT > 0, "FREE_AI_MONTHLY_LIMIT is a positive number");

// --- integration with normalizeState ---
assert(makeDefaultState().preferences.isPro === false, "default state: isPro is false");
assert(isPro(normalizeState({})) === false, "normalizeState({}): isPro false");
assert(isPro(normalizeState({ preferences: { isPro: true } })) === true, "normalizeState preserves isPro true");
assert(isPro(normalizeState({ preferences: { isPro: "true" } })) === false, "normalizeState coerces non-boolean to false");
assert(normalizeState({ preferences: { isPro: 1 } }).preferences.isPro === false, "normalizeState: 1 → false (strict boolean)");

// --- Done ---
console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
