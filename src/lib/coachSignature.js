import { isValidDateKey } from "./dateUtils";
import { classifyActivity } from "./coachNormalize";

export const COACH_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes between auto-refreshes
export const COACH_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hour cache TTL
export const COACH_CHANGE_THRESHOLD = 0.15; // 15% change in reps to trigger refetch

/**
 * Compute a stable signature for the AI Coach that only changes when
 * workout data actually changes meaningfully within the given date range.
 * Returns { signature, totalSets, totalReps, loggedDays } for threshold comparison.
 */
export function computeCoachSignature(state, summaryRange) {
  const workouts = state?.program?.workouts || [];
  const logsByDate = state?.logsByDate || {};
  let totalSets = 0;
  let totalReps = 0; // only strength reps for threshold comparison
  let loggedDays = 0;
  const exerciseNames = [];

  // Build exercise ID -> info map for activity classification
  const exerciseIdToInfo = new Map();
  for (const w of workouts) {
    for (const ex of w.exercises || []) {
      exerciseNames.push(ex.name);
      exerciseIdToInfo.set(ex.id, { name: ex.name, unit: ex.unit || "reps" });
    }
  }

  for (const dateKey of Object.keys(logsByDate)) {
    if (!isValidDateKey(dateKey)) continue;
    if (dateKey < summaryRange.start || dateKey > summaryRange.end) continue;
    const dayLogs = logsByDate[dateKey];
    if (!dayLogs || typeof dayLogs !== "object") continue;
    let dayHasData = false;
    for (const [exId, log] of Object.entries(dayLogs)) {
      if (log && Array.isArray(log.sets)) {
        totalSets += log.sets.length;
        const reps = log.sets.reduce((s, set) => s + (Number(set.reps) || 0), 0);
        // Only count strength reps for the threshold value
        const info = exerciseIdToInfo.get(exId);
        if (info && classifyActivity(info.name, info.unit) === "strength") {
          totalReps += reps;
        }
        dayHasData = true;
      }
    }
    if (dayHasData) loggedDays++;
  }

  // Still include totalSets in signature for change detection (covers all activity types)
  const signature = `${summaryRange.start}|${summaryRange.end}|${loggedDays}|${totalSets}|${totalReps}|${exerciseNames.length}`;
  return { signature, totalSets, totalReps, loggedDays };
}
