import { addDays, weekdayMonday0 } from "./dateUtils.js";
import { dayHasCompletedSets } from "./setHelpers.js";

/**
 * Infer what workout the user typically does on a given day of the week
 * by analyzing their historical logs over the last 8 weeks.
 *
 * @param {Object} logsByDate - state.logsByDate
 * @param {Array}  programWorkouts - state.program?.workouts || []
 * @param {Object} dailyWorkouts - state.dailyWorkouts || {}
 * @param {string} todayKey - "YYYY-MM-DD"
 * @returns {{ workouts: string[], confidence: number, isRestDay: boolean } | null}
 */
export function getUpNextSuggestion(logsByDate, programWorkouts, dailyWorkouts, todayKey) {
  if (!logsByDate) return null;

  // Build exercise-id → workout-name map from program + daily workouts
  const exToWorkout = new Map();
  for (const w of (programWorkouts || [])) {
    for (const ex of (w.exercises || [])) {
      exToWorkout.set(ex.id, w.name);
    }
  }
  for (const [, ws] of Object.entries(dailyWorkouts || {})) {
    for (const w of (ws || [])) {
      for (const ex of (w.exercises || [])) {
        exToWorkout.set(ex.id, w.name);
      }
    }
  }

  const todayDow = weekdayMonday0(todayKey); // 0=Mon, 6=Sun

  // Collect same-day-of-week dates for the last 8 weeks (excluding today)
  const sameDayDates = [];
  for (let w = 1; w <= 8; w++) {
    sameDayDates.push(addDays(todayKey, -7 * w));
  }

  // Count which weeks had any log at all (to compute frequency against logged weeks)
  let weeksWithLogs = 0;
  const workoutCounts = {}; // workoutName → count of weeks it appeared on this day
  let restWeeks = 0;

  for (const dateStr of sameDayDates) {
    const dayLogs = logsByDate[dateStr];

    // Check if the user logged ANYTHING that entire week (not just this day)
    const weekMonday = addDays(dateStr, -weekdayMonday0(dateStr));
    let weekHasAnyLog = false;
    for (let d = 0; d < 7; d++) {
      const wd = addDays(weekMonday, d);
      if (logsByDate[wd] && dayHasCompletedSets(logsByDate[wd])) {
        weekHasAnyLog = true;
        break;
      }
    }
    if (!weekHasAnyLog) continue; // Skip weeks where user didn't log at all
    weeksWithLogs++;

    if (!dayLogs || !dayHasCompletedSets(dayLogs)) {
      restWeeks++;
      continue;
    }

    // Find which workouts were done on this day
    const dayWorkouts = new Set();
    for (const exId of Object.keys(dayLogs)) {
      const wName = exToWorkout.get(exId);
      if (wName) dayWorkouts.add(wName);
    }
    for (const name of dayWorkouts) {
      workoutCounts[name] = (workoutCounts[name] || 0) + 1;
    }
  }

  // Not enough data — fall back to staleness-based
  if (weeksWithLogs < 3) {
    return fallbackStaleness(logsByDate, programWorkouts, todayKey);
  }

  // Rest day pattern: user rests on this day 60%+ of logged weeks
  if (restWeeks / weeksWithLogs >= 0.6) {
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return { workouts: [], confidence: restWeeks / weeksWithLogs, isRestDay: true, dayName: dayNames[todayDow] };
  }

  // Find workouts appearing >= 50% of logged weeks
  const activeWeeks = weeksWithLogs - restWeeks;
  const threshold = activeWeeks > 0 ? activeWeeks * 0.5 : 1;
  const suggested = Object.entries(workoutCounts)
    .filter(([, count]) => count >= threshold)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  if (suggested.length === 0) {
    // No clear pattern — fall back to staleness
    return fallbackStaleness(logsByDate, programWorkouts, todayKey);
  }

  const topConfidence = Math.max(...suggested.map(n => workoutCounts[n] / activeWeeks));
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return {
    workouts: suggested,
    confidence: topConfidence,
    isRestDay: false,
    dayName: dayNames[todayDow],
  };
}

/**
 * Fallback: suggest the program workout not done in the longest time this week.
 */
function fallbackStaleness(logsByDate, programWorkouts, todayKey) {
  if (!programWorkouts || programWorkouts.length === 0) return null;

  // Build exercise-id → workout-name map
  const workoutExIds = new Map(); // workoutName → Set<exerciseId>
  for (const w of programWorkouts) {
    const ids = new Set();
    for (const ex of (w.exercises || [])) ids.add(ex.id);
    workoutExIds.set(w.name, ids);
  }

  // Find which workouts were done this week
  const weekMonday = addDays(todayKey, -weekdayMonday0(todayKey));
  const doneThisWeek = new Set();
  for (let d = 0; d < 7; d++) {
    const dateStr = addDays(weekMonday, d);
    const dayLogs = logsByDate[dateStr];
    if (!dayLogs) continue;
    for (const exId of Object.keys(dayLogs)) {
      for (const [wName, ids] of workoutExIds) {
        if (ids.has(exId)) doneThisWeek.add(wName);
      }
    }
  }

  // All done this week
  if (doneThisWeek.size >= programWorkouts.length) {
    return { workouts: [], confidence: 0, isRestDay: false, allDone: true };
  }

  // Find the not-yet-done workout
  const notDone = programWorkouts
    .map(w => w.name)
    .filter(n => !doneThisWeek.has(n));

  if (notDone.length > 0) {
    return { workouts: [notDone[0]], confidence: 0, isRestDay: false };
  }

  return null;
}
