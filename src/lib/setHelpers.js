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
 * Calculate current consecutive week streak (weeks with 2+ sessions).
 * Returns the streak that includes the most recent qualifying week,
 * not the all-time best streak. Accounts for gap weeks not in the map.
 * @param {Object} weekMap - { weekStartKey: sessionCount }
 * @returns {number}
 */
export function calculateWeekStreak(weekMap) {
  const weekKeys = Object.keys(weekMap).sort();
  if (weekKeys.length === 0) return 0;

  // Fill in gap weeks between first and last so gaps break the streak
  const first = weekKeys[0];
  const last = weekKeys[weekKeys.length - 1];
  const allWeeks = [];
  let cursor = first;
  while (cursor <= last) {
    allWeeks.push(cursor);
    // Advance by 7 days
    const d = new Date(cursor + "T00:00:00");
    d.setDate(d.getDate() + 7);
    cursor = d.toISOString().slice(0, 10);
  }

  // Walk backwards from most recent week
  let streak = 0;
  for (let i = allWeeks.length - 1; i >= 0; i--) {
    if ((weekMap[allWeeks[i]] || 0) >= 2) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
