/**
 * Cadence — per-workout scheduling model.
 *
 * Four modes:
 *   - WHENEVER:   no schedule (default for new workouts; current app behavior)
 *   - ANCHOR:     fixed days of the week (e.g. water polo Mon + Wed)
 *   - WEEKLY:     N times per week, with optional soft preferred days
 *   - CONTINUOUS: part of an ordered split sequence; advances by completion, not calendar
 *
 * CONTINUOUS is only valid when the workout belongs to a split with mode "continuous".
 *
 * Day-of-week convention: 0 = Sunday, 1 = Monday, ..., 6 = Saturday (matches JS Date#getDay).
 */

export const CADENCE_MODES = Object.freeze({
  WHENEVER: "whenever",
  ANCHOR: "anchor",
  WEEKLY: "weekly",
  CONTINUOUS: "continuous",
});

export const SPLIT_MODES = Object.freeze({
  WEEKLY: "weekly",
  CONTINUOUS: "continuous",
});

/** Default cadence stamped on new workouts and migrated onto existing ones. */
export function defaultCadence() {
  return { mode: CADENCE_MODES.WHENEVER };
}

/** Coerce an unknown cadence value into a valid shape. Mutation-safe (returns new object). */
export function normalizeCadence(raw) {
  if (!raw || typeof raw !== "object") return defaultCadence();
  const mode = Object.values(CADENCE_MODES).includes(raw.mode) ? raw.mode : CADENCE_MODES.WHENEVER;

  if (mode === CADENCE_MODES.ANCHOR) {
    const days = Array.isArray(raw.days)
      ? [...new Set(raw.days.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort((a, b) => a - b)
      : [];
    return { mode, days };
  }

  if (mode === CADENCE_MODES.WEEKLY) {
    const perWeekRaw = Number(raw.perWeek);
    const perWeek = Number.isFinite(perWeekRaw) && perWeekRaw >= 1 && perWeekRaw <= 7
      ? Math.round(perWeekRaw)
      : 1;
    const preferredDays = Array.isArray(raw.preferredDays)
      ? [...new Set(raw.preferredDays.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort((a, b) => a - b)
      : [];
    const skipIfMissed = raw.skipIfMissed !== false; // default true
    return { mode, perWeek, preferredDays, skipIfMissed };
  }

  if (mode === CADENCE_MODES.CONTINUOUS) {
    return { mode };
  }

  return { mode: CADENCE_MODES.WHENEVER };
}

/** Stamp a cadence on a workout if missing or invalid. Mutates and returns the workout. */
export function ensureCadence(workout) {
  if (!workout || typeof workout !== "object") return workout;
  workout.cadence = normalizeCadence(workout.cadence);
  return workout;
}

/** Day-of-week (0–6) for a YYYY-MM-DD key. */
export function dayOfWeek(dateKey) {
  return new Date(dateKey + "T00:00:00").getDay();
}

/** True when a workout's anchor cadence places it on dateKey. */
export function isAnchorScheduledFor(cadence, dateKey) {
  if (!cadence || cadence.mode !== CADENCE_MODES.ANCHOR) return false;
  if (!Array.isArray(cadence.days) || cadence.days.length === 0) return false;
  return cadence.days.includes(dayOfWeek(dateKey));
}

/** True when a weekly-cadence workout prefers dateKey (soft hint, not a contract). */
export function isWeeklyPreferredFor(cadence, dateKey) {
  if (!cadence || cadence.mode !== CADENCE_MODES.WEEKLY) return false;
  if (!Array.isArray(cadence.preferredDays) || cadence.preferredDays.length === 0) return false;
  return cadence.preferredDays.includes(dayOfWeek(dateKey));
}

/** ISO-week start (Monday) for a YYYY-MM-DD key. Returns YYYY-MM-DD. */
export function weekStartKey(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  const dow = d.getDay();
  // Shift Sunday (0) back to previous Monday
  const daysFromMonday = dow === 0 ? 6 : dow - 1;
  d.setDate(d.getDate() - daysFromMonday);
  return d.toISOString().slice(0, 10);
}

/**
 * Return the subset of `workouts` scheduled to appear on `dateKey` based on cadence.
 * Anchors fire on their declared days. Weekly cadences fire on declared preferred
 * days only (no preferred days = no auto-surface). Continuous mode is skipped here —
 * its surfacing is driven by split queue position, handled separately.
 */
export function getScheduledForDate(workouts, dateKey) {
  if (!Array.isArray(workouts)) return [];
  return workouts.filter((w) => {
    const c = w?.cadence;
    if (!c) return false;
    if (c.mode === CADENCE_MODES.ANCHOR) return isAnchorScheduledFor(c, dateKey);
    if (c.mode === CADENCE_MODES.WEEKLY) return isWeeklyPreferredFor(c, dateKey);
    return false;
  });
}

/** Default split shape. */
export function defaultSplit({ id, name, mode = SPLIT_MODES.WEEKLY }) {
  if (!id || !name) throw new Error("defaultSplit requires id and name");
  return {
    id,
    name,
    mode,
    members: [],
    restPattern: null,
    queuePosition: 0,
    lastAdvancedAt: null,
  };
}

/**
 * Resolve which workout is "next up" in a continuous split based on its queue position.
 * Returns null for non-continuous splits, empty splits, or when the next-up member's
 * workout has been deleted.
 */
export function getContinuousNextUp(split, workouts) {
  if (!split || split.mode !== SPLIT_MODES.CONTINUOUS) return null;
  if (!Array.isArray(split.members) || split.members.length === 0) return null;

  const memberCount = split.members.length;
  const raw = Number.isInteger(split.queuePosition) ? split.queuePosition : 0;
  // Wrap negative or out-of-range positions back into [0, memberCount).
  const idx = ((raw % memberCount) + memberCount) % memberCount;

  const member = split.members[idx];
  if (!member) return null;

  const workout = (workouts || []).find((w) => w.id === member.workoutId);
  if (!workout) return null;

  return {
    splitId: split.id,
    splitName: split.name,
    workout,
    memberIndex: idx,
    totalMembers: memberCount,
  };
}

/** Days between two YYYY-MM-DD keys (later − earlier). Negative if reversed. */
export function daysBetween(earlierKey, laterKey) {
  const a = new Date(earlierKey + "T00:00:00").getTime();
  const b = new Date(laterKey + "T00:00:00").getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

/** Add `n` days (negative ok) to a YYYY-MM-DD key. */
export function addDays(dateKey, n) {
  const d = new Date(dateKey + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * Detect if an anchor cadence is drifting toward a different day-of-week.
 * Triggers when the workout has been logged on the same non-anchor day 3+ times
 * in the last 28 days. Conservative by design — false negatives are fine.
 *
 * Returns null if no drift, otherwise:
 *   { type: "anchor", action: "add" | "replace",
 *     suggestedDay: number, originalDays: number[], occurrences: number }
 *
 * `action`:
 *   - "add"     when the original anchor days still have logs in the last 21 days
 *               (practice now runs both old and new days)
 *   - "replace" when the original anchor days have been cold for 21+ days
 *               (practice moved entirely)
 */
export function detectAnchorDrift(cadence, logDates, dateKey) {
  if (!cadence || cadence.mode !== CADENCE_MODES.ANCHOR) return null;
  if (!Array.isArray(cadence.days) || cadence.days.length === 0) return null;
  if (!Array.isArray(logDates) || logDates.length < 3) return null;

  const anchorDaysSet = new Set(cadence.days);
  const window4w = addDays(dateKey, -28);
  const window3w = addDays(dateKey, -21);

  // Logs strictly between (today - 28d) and today (exclusive of today).
  const recent = logDates.filter((d) => d > window4w && d < dateKey);
  if (recent.length < 3) return null;

  const nonAnchorCounts = {};
  let anchorDayLogsRecent = 0;

  for (const d of recent) {
    const dow = dayOfWeek(d);
    if (anchorDaysSet.has(dow)) {
      if (d > window3w) anchorDayLogsRecent++;
      continue;
    }
    nonAnchorCounts[dow] = (nonAnchorCounts[dow] || 0) + 1;
  }

  let suggestedDay = null;
  let maxCount = 0;
  for (const dowStr of Object.keys(nonAnchorCounts)) {
    const count = nonAnchorCounts[dowStr];
    if (count >= 3 && count > maxCount) {
      suggestedDay = Number(dowStr);
      maxCount = count;
    }
  }

  if (suggestedDay === null) return null;

  return {
    type: "anchor",
    action: anchorDayLogsRecent > 0 ? "add" : "replace",
    suggestedDay,
    originalDays: [...cadence.days].sort((a, b) => a - b),
    occurrences: maxCount,
  };
}

/** Coerce an unknown split value into a valid shape. */
export function normalizeSplit(raw) {
  if (!raw || typeof raw !== "object" || !raw.id || !raw.name) return null;
  const mode = Object.values(SPLIT_MODES).includes(raw.mode) ? raw.mode : SPLIT_MODES.WEEKLY;
  const members = Array.isArray(raw.members)
    ? raw.members
        .filter((m) => m && typeof m === "object" && m.workoutId)
        .map((m, i) => ({
          workoutId: String(m.workoutId),
          order: Number.isInteger(m.order) ? m.order : i,
          days: Array.isArray(m.days)
            ? [...new Set(m.days.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort((a, b) => a - b)
            : [],
        }))
        .sort((a, b) => a.order - b.order)
    : [];
  const queuePositionRaw = Number(raw.queuePosition);
  const queuePosition = Number.isInteger(queuePositionRaw) && queuePositionRaw >= 0 ? queuePositionRaw : 0;
  const lastAdvancedAtRaw = Number(raw.lastAdvancedAt);
  const lastAdvancedAt = Number.isFinite(lastAdvancedAtRaw) && lastAdvancedAtRaw > 0 ? lastAdvancedAtRaw : null;
  return {
    id: String(raw.id),
    name: String(raw.name),
    mode,
    members,
    restPattern: raw.restPattern && typeof raw.restPattern === "object" ? raw.restPattern : null,
    queuePosition,
    lastAdvancedAt,
  };
}
