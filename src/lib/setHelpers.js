/**
 * Shared helpers for set completion checks.
 * Used by App.jsx, greetings.js, and anywhere else that needs to
 * determine if a set or day has been genuinely completed.
 */

/** Check if a set is completed. After migration, all sets have explicit `completed` flag. */
export function isSetCompleted(set) {
  if (set.completed !== undefined) return set.completed;
  // Fallback for any edge case where migration hasn't run yet
  return Number(set.reps) > 0;
}

/** Check if a day's logs contain at least one completed set. */
export function dayHasCompletedSets(dayLogs) {
  if (!dayLogs || typeof dayLogs !== "object") return false;
  for (const exId of Object.keys(dayLogs)) {
    const exLog = dayLogs[exId];
    if (exLog?.sets && Array.isArray(exLog.sets) && exLog.sets.some(isSetCompleted)) return true;
  }
  return false;
}

/**
 * Calculate consecutive week streak (weeks with 2+ sessions).
 * @param {Object} weekMap - { weekStartKey: sessionCount }
 * @returns {number}
 */
export function calculateWeekStreak(weekMap) {
  const weekKeys = Object.keys(weekMap).sort();
  let best = 0, current = 0;
  for (const wk of weekKeys) {
    if (weekMap[wk] >= 2) {
      current++;
      if (current > best) best = current;
    } else {
      current = 0;
    }
  }
  return best;
}
