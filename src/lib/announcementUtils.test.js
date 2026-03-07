import {
  REACTION_EMOJIS,
  getReactionCounts,
  hasUserReacted,
  formatAmount,
  parseDollarsToCents,
  getDuesPaymentSummary,
  formatTimeAgo,
} from "./announcementUtils.js";
import assert from "node:assert";

// ============================================================================
// formatTimeAgo
// ============================================================================
assert.strictEqual(formatTimeAgo(null), "");
assert.strictEqual(formatTimeAgo(""), "");
assert.strictEqual(formatTimeAgo(new Date().toISOString()), "just now");
assert.strictEqual(formatTimeAgo(new Date(Date.now() - 5 * 60000).toISOString()), "5m ago");
assert.strictEqual(formatTimeAgo(new Date(Date.now() - 3 * 3600000).toISOString()), "3h ago");
assert.strictEqual(formatTimeAgo(new Date(Date.now() - 2 * 86400000).toISOString()), "2d ago");
assert.strictEqual(formatTimeAgo(new Date(Date.now() - 14 * 86400000).toISOString()), "2w ago");

// ============================================================================
// REACTION_EMOJIS
// ============================================================================
assert.strictEqual(Object.keys(REACTION_EMOJIS).length, 5, "5 reaction emojis");
assert.strictEqual(REACTION_EMOJIS.thumbsup, "\u{1F44D}");
assert.strictEqual(REACTION_EMOJIS["100"], "\u{1F4AF}");

// ============================================================================
// getReactionCounts
// ============================================================================
{
  const reactions = [
    { emoji: "thumbsup", user_id: "a" },
    { emoji: "thumbsup", user_id: "b" },
    { emoji: "fire", user_id: "a" },
  ];
  const counts = getReactionCounts(reactions);
  assert.deepStrictEqual(counts, { thumbsup: 2, fire: 1 });
}

{
  const counts = getReactionCounts([]);
  assert.deepStrictEqual(counts, {});
}

{
  const counts = getReactionCounts(null);
  assert.deepStrictEqual(counts, {});
}

// ============================================================================
// hasUserReacted
// ============================================================================
{
  const reactions = [
    { emoji: "thumbsup", user_id: "a" },
    { emoji: "fire", user_id: "b" },
  ];
  assert.strictEqual(hasUserReacted(reactions, "a", "thumbsup"), true);
  assert.strictEqual(hasUserReacted(reactions, "a", "fire"), false);
  assert.strictEqual(hasUserReacted(reactions, "b", "fire"), true);
  assert.strictEqual(hasUserReacted(reactions, "c", "thumbsup"), false);
  assert.strictEqual(hasUserReacted(null, "a", "thumbsup"), false);
}

// ============================================================================
// formatAmount
// ============================================================================
assert.strictEqual(formatAmount(1500), "$15.00");
assert.strictEqual(formatAmount(99), "$0.99");
assert.strictEqual(formatAmount(0), "$0.00");
assert.strictEqual(formatAmount(100000), "$1000.00");
assert.strictEqual(formatAmount(null), "$0.00");
assert.strictEqual(formatAmount(undefined), "$0.00");
assert.strictEqual(formatAmount(1), "$0.01");

// ============================================================================
// parseDollarsToCents
// ============================================================================
assert.strictEqual(parseDollarsToCents("15.50"), 1550);
assert.strictEqual(parseDollarsToCents("15"), 1500);
assert.strictEqual(parseDollarsToCents("$15.50"), 1550);
assert.strictEqual(parseDollarsToCents("0.99"), 99);
assert.strictEqual(parseDollarsToCents("0"), 0);
assert.strictEqual(parseDollarsToCents(""), null);
assert.strictEqual(parseDollarsToCents("abc"), null);
assert.strictEqual(parseDollarsToCents(null), null);
assert.strictEqual(parseDollarsToCents(undefined), null);
assert.strictEqual(parseDollarsToCents("-5"), null);

// ============================================================================
// getDuesPaymentSummary
// ============================================================================
{
  const payments = [
    { user_id: "a", paid_at: "2026-01-01" },
    { user_id: "b", paid_at: "2026-01-02" },
  ];
  const summary = getDuesPaymentSummary(payments, 5, 1500);
  assert.deepStrictEqual(summary, { paid: 2, unpaid: 3, total: 5, collectedCents: 3000 });
}

{
  const summary = getDuesPaymentSummary([], 10, 2000);
  assert.deepStrictEqual(summary, { paid: 0, unpaid: 10, total: 10, collectedCents: 0 });
}

{
  const summary = getDuesPaymentSummary(null, 0, 0);
  assert.deepStrictEqual(summary, { paid: 0, unpaid: 0, total: 0, collectedCents: 0 });
}

console.log("announcementUtils tests passed");
