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
  return {
    id: String(raw.id),
    name: String(raw.name),
    mode,
    members,
    restPattern: raw.restPattern && typeof raw.restPattern === "object" ? raw.restPattern : null,
    queuePosition,
  };
}
