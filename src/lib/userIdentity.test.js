/**
 * Self-contained test script for userIdentity.js
 * Run with: node src/lib/userIdentity.test.js
 */

import {
  validateUsernameStrict,
  sanitizeUsername,
  isUsernameValid,
  ensureUniqueUsername,
  validateDisplayName,
  canChangeUsername,
  usernameChangeCooldownMs,
  isInUsernameCooldown,
  getNextUsernameChangeDate,
  formatCooldown,
  avatarInitial,
  displayLabel,
  USERNAME_COOLDOWN_DAYS,
} from "./userIdentity.js";

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${label}`);
  }
}

function assertEqual(actual, expected, label) {
  if (actual === expected) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${label} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// --- validateUsernameStrict ---
console.log("\nvalidateUsernameStrict:");
assertEqual(validateUsernameStrict(null), "Username is required", "null → required");
assertEqual(validateUsernameStrict(""), "Username is required", "empty → required");
assertEqual(validateUsernameStrict("  "), "Username is required", "spaces → required");
assertEqual(validateUsernameStrict("ab"), "Username must be at least 3 characters", "too short");
assertEqual(validateUsernameStrict("a".repeat(17)), "Username must be at most 16 characters", "too long");
assertEqual(validateUsernameStrict("UPPER"), "Only lowercase letters, numbers, and underscores", "uppercase rejected");
assertEqual(validateUsernameStrict("has space"), "Only lowercase letters, numbers, and underscores", "space rejected");
assertEqual(validateUsernameStrict("no-dash"), "Only lowercase letters, numbers, and underscores", "dash rejected");
assertEqual(validateUsernameStrict("abc"), null, "3 chars valid");
assertEqual(validateUsernameStrict("user_123"), null, "mixed valid");
assertEqual(validateUsernameStrict("a".repeat(16)), null, "16 chars valid");

// --- sanitizeUsername ---
console.log("\nsanitizeUsername:");
assertEqual(sanitizeUsername("Hello World!"), "helloworld", "strips invalid chars + lowercase");
assertEqual(sanitizeUsername("User_123"), "user_123", "preserves underscores + lowercase");
assertEqual(sanitizeUsername("  @foo-bar! "), "foobar", "strips all special chars");
assertEqual(sanitizeUsername(null), "", "null → empty");
assertEqual(sanitizeUsername(""), "", "empty → empty");
assertEqual(sanitizeUsername("already_valid"), "already_valid", "already valid unchanged");

// --- isUsernameValid ---
console.log("\nisUsernameValid:");
assert(isUsernameValid("abc"), "3 chars valid");
assert(isUsernameValid("a".repeat(16)), "16 chars valid");
assert(!isUsernameValid("ab"), "2 chars invalid");
assert(!isUsernameValid("a".repeat(17)), "17 chars invalid");
assert(!isUsernameValid("ABC"), "uppercase invalid");
assert(!isUsernameValid("a b"), "space invalid");
assert(!isUsernameValid(null), "null invalid");
assert(!isUsernameValid(""), "empty invalid");

// --- ensureUniqueUsername ---
console.log("\nensureUniqueUsername:");
assertEqual(ensureUniqueUsername("alice", ["bob", "charlie"]), "alice", "no collision → same");
assertEqual(ensureUniqueUsername("alice", ["alice", "bob"]), "alice_2", "collision → _2");
assertEqual(ensureUniqueUsername("alice", ["alice", "alice_2"]), "alice_3", "double collision → _3");
assertEqual(ensureUniqueUsername("alice", new Set(["alice", "alice_2", "alice_3"])), "alice_4", "triple collision (Set) → _4");
assertEqual(ensureUniqueUsername("alice", ["alice"], "alice"), "alice", "excludeId removes self");

// --- validateDisplayName ---
console.log("\nvalidateDisplayName:");
assertEqual(validateDisplayName(null), null, "null → ok (optional)");
assertEqual(validateDisplayName(""), null, "empty → ok");
assertEqual(validateDisplayName("John"), null, "short name → ok");
assertEqual(validateDisplayName("a".repeat(30)), null, "30 chars → ok");
assert(validateDisplayName("a".repeat(31)) !== null, "31 chars → error");

// --- Cooldown functions ---
console.log("\nCooldown functions:");

const now = Date.now();
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const thirtyOneDaysAgo = new Date(now - 31 * MS_PER_DAY).toISOString();
const twoDaysAgo = new Date(now - 2 * MS_PER_DAY).toISOString();

assert(canChangeUsername(null), "null → can change");
assert(canChangeUsername(thirtyOneDaysAgo), "31 days ago → can change");
assert(!canChangeUsername(twoDaysAgo), "2 days ago → cannot change");

assert(usernameChangeCooldownMs(null) === 0, "null → 0 ms");
assert(usernameChangeCooldownMs(thirtyOneDaysAgo) === 0, "31 days ago → 0 ms");
assert(usernameChangeCooldownMs(twoDaysAgo) > 0, "2 days ago → positive ms");

assert(!isInUsernameCooldown({ username_last_changed_at: null }), "profile null → not in cooldown");
assert(!isInUsernameCooldown({ username_last_changed_at: thirtyOneDaysAgo }), "profile 31d → not in cooldown");
assert(isInUsernameCooldown({ username_last_changed_at: twoDaysAgo }), "profile 2d → in cooldown");

assertEqual(getNextUsernameChangeDate({ username_last_changed_at: null }), null, "null → no next date");
assert(getNextUsernameChangeDate({ username_last_changed_at: thirtyOneDaysAgo }) === null, "31d ago → null (expired)");
assert(getNextUsernameChangeDate({ username_last_changed_at: twoDaysAgo }) instanceof Date, "2d ago → Date object");

// --- formatCooldown ---
console.log("\nformatCooldown:");
assertEqual(formatCooldown(0), "now", "0 → now");
assertEqual(formatCooldown(-100), "now", "negative → now");
assertEqual(formatCooldown(30 * 60 * 1000), "< 1 hour", "30 min → < 1 hour");
assertEqual(formatCooldown(2 * 60 * 60 * 1000), "2 hours", "2 hours → 2 hours");
assertEqual(formatCooldown(1 * 60 * 60 * 1000), "1 hour", "1 hour → 1 hour");
assertEqual(formatCooldown(25 * 60 * 60 * 1000), "2 days", "25 hours → 2 days");
assertEqual(formatCooldown(48 * 60 * 60 * 1000), "2 days", "48 hours → 2 days");
assertEqual(formatCooldown(29 * 24 * 60 * 60 * 1000), "29 days", "29 days → 29 days");

// --- avatarInitial ---
console.log("\navatarInitial:");
assertEqual(avatarInitial("John", "john_doe"), "J", "displayName first char");
assertEqual(avatarInitial("", "john_doe"), "J", "fallback to username");
assertEqual(avatarInitial(null, "john_doe"), "J", "null displayName → username");
assertEqual(avatarInitial(null, null), "?", "both null → ?");
assertEqual(avatarInitial("  ", "x_user"), "X", "whitespace displayName → username");

// --- displayLabel ---
console.log("\ndisplayLabel:");
assertEqual(displayLabel("John Doe", "john_doe"), "John Doe", "displayName preferred");
assertEqual(displayLabel("", "john_doe"), "john_doe", "empty displayName → username");
assertEqual(displayLabel(null, "john_doe"), "john_doe", "null displayName → username");
assertEqual(displayLabel(null, null), "User", "both null → User");
assertEqual(displayLabel("  ", "  "), "User", "whitespace both → User");

// --- Summary ---
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
