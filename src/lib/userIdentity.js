/**
 * User Identity Utilities
 *
 * Pure functions for username / display-name validation, sanitization,
 * cooldown logic, and formatting.  No side-effects, no imports.
 */

// ── Constants ────────────────────────────────────────────────────────────────

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 16;
export const USERNAME_REGEX = /^[a-z0-9_]+$/;
export const USERNAME_COOLDOWN_DAYS = 30;
export const DISPLAY_NAME_MAX = 30;

// ── Helpers ──────────────────────────────────────────────────────────────────

export function generateUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback (v4-ish)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ── Username ─────────────────────────────────────────────────────────────────

/** Lowercase + strip every char that isn't a-z 0-9 _ */
export function sanitizeUsername(input) {
  if (!input || typeof input !== "string") return "";
  return input.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

/** Quick boolean: does the string satisfy the regex + length rules? */
export function isUsernameValid(username) {
  if (!username || typeof username !== "string") return false;
  return (
    username.length >= USERNAME_MIN &&
    username.length <= USERNAME_MAX &&
    USERNAME_REGEX.test(username)
  );
}

/** Returns an error string or null (suitable for form validation). */
export function validateUsernameStrict(s) {
  if (!s || typeof s !== "string" || !s.trim()) return "Username is required";
  const trimmed = s.trim();
  if (trimmed.length < USERNAME_MIN)
    return `Username must be at least ${USERNAME_MIN} characters`;
  if (trimmed.length > USERNAME_MAX)
    return `Username must be at most ${USERNAME_MAX} characters`;
  if (!USERNAME_REGEX.test(trimmed))
    return "Only lowercase letters, numbers, and underscores";
  return null;
}

/**
 * If `desired` collides with any entry in `existingUsernames`, append _2, _3 …
 * `excludeId` lets you skip the caller's own row when checking.
 * `existingUsernames` is a Set or array of lowercase strings.
 */
export function ensureUniqueUsername(desired, existingUsernames, excludeId) {
  const taken = existingUsernames instanceof Set
    ? existingUsernames
    : new Set(existingUsernames);

  if (excludeId) taken.delete(excludeId);

  let candidate = desired;
  let n = 2;
  while (taken.has(candidate)) {
    candidate = `${desired}_${n}`;
    n++;
  }
  return candidate;
}

// ── Display Name ─────────────────────────────────────────────────────────────

/** Returns an error string or null. */
export function validateDisplayName(s) {
  if (s == null) return null; // optional field
  if (typeof s !== "string") return "Invalid display name";
  if (s.trim().length > DISPLAY_NAME_MAX)
    return `Display name must be at most ${DISPLAY_NAME_MAX} characters`;
  return null;
}

// ── Cooldown ─────────────────────────────────────────────────────────────────

const COOLDOWN_MS = USERNAME_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

/** Can the user change their username right now? */
export function canChangeUsername(lastChangedAt) {
  if (!lastChangedAt) return true;
  const ts = typeof lastChangedAt === "string" ? new Date(lastChangedAt).getTime() : lastChangedAt;
  return Date.now() - ts >= COOLDOWN_MS;
}

/** Milliseconds remaining until the cooldown expires (0 if already expired). */
export function usernameChangeCooldownMs(lastChangedAt) {
  if (!lastChangedAt) return 0;
  const ts = typeof lastChangedAt === "string" ? new Date(lastChangedAt).getTime() : lastChangedAt;
  const remaining = COOLDOWN_MS - (Date.now() - ts);
  return remaining > 0 ? remaining : 0;
}

/** Boolean wrapper reading from a profile object. */
export function isInUsernameCooldown(profile) {
  return !canChangeUsername(profile?.username_last_changed_at);
}

/** Returns the Date when the cooldown expires, or null if no cooldown. */
export function getNextUsernameChangeDate(profile) {
  const last = profile?.username_last_changed_at;
  if (!last) return null;
  const ts = typeof last === "string" ? new Date(last).getTime() : last;
  const next = ts + COOLDOWN_MS;
  return next > Date.now() ? new Date(next) : null;
}

// ── Formatting ───────────────────────────────────────────────────────────────

/** Human-readable cooldown string. */
export function formatCooldown(ms) {
  if (ms <= 0) return "now";
  const hours = ms / (1000 * 60 * 60);
  if (hours < 1) return "< 1 hour";
  const days = Math.ceil(hours / 24);
  if (days >= 2) return `${days} days`;
  if (hours >= 24) return "1 day";
  return `${Math.ceil(hours)} hour${Math.ceil(hours) === 1 ? "" : "s"}`;
}

/** Single uppercase character for an avatar circle. */
export function avatarInitial(displayName, username) {
  const dn = displayName?.trim();
  if (dn) return dn[0].toUpperCase();
  const un = username?.trim();
  if (un) return un[0].toUpperCase();
  return "?";
}

/** Best display string: displayName → username → "User". */
export function displayLabel(displayName, username) {
  const dn = displayName?.trim();
  if (dn) return dn;
  const un = username?.trim();
  if (un) return un;
  return "User";
}
