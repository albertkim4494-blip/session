/**
 * Contextual greeting and acknowledgment copy.
 * Pure functions, easy to tune — just edit the arrays.
 */

import { isSetCompleted, dayHasCompletedSets } from "./setHelpers";

// ---------------------------------------------------------------------------
// Greeting copy pools
// ---------------------------------------------------------------------------

const GREETINGS_FIRST_TODAY = [
  "Ready when you are.",
  "Good day to train.",
  "Let's get it.",
  "Time to move.",
];

const GREETINGS_RETURNING = [
  "Back again — nice.",
  "Welcome back.",
  "Good to see you.",
  "Let's pick up where you left off.",
];

const GREETINGS_STREAK = [
  "Consistency pays off.",
  "Building the habit.",
  "Another day, another session.",
  "On a roll.",
];

const GREETINGS_GAP = [
  "Good to have you back.",
  "No worries — let's start fresh.",
  "Rest was part of the plan.",
  "Ready to go again.",
];

// ---------------------------------------------------------------------------
// Acknowledgment copy pools
// ---------------------------------------------------------------------------

const ACK_NEUTRAL = [
  { message: "Crushed it!", emoji: "\uD83D\uDCAA" },
  { message: "Set logged!", emoji: "\u2705" },
  { message: "Nice work!", emoji: "\uD83D\uDD25" },
  { message: "Keep it going!", emoji: "\uD83D\uDE80" },
];

const ACK_POSITIVE = [
  { message: "Feeling strong!", emoji: "\uD83D\uDCAA\uD83D\uDD25" },
  { message: "Beast mode!", emoji: "\uD83D\uDC05" },
  { message: "On fire!", emoji: "\uD83D\uDD25\uD83D\uDD25" },
];

const ACK_TOUGH = [
  { message: "Tough but you showed up!", emoji: "\uD83D\uDCAF" },
  { message: "Hard days build champions.", emoji: "\uD83C\uDFC6" },
  { message: "That takes grit. Respect.", emoji: "\uD83D\uDCAA" },
];

// ---------------------------------------------------------------------------
// Coach reinforcement lines (used sparingly)
// ---------------------------------------------------------------------------

const COACH_LINES = [
  "Consistency > perfection.",
  "Showing up matters.",
  "Progress isn't always linear.",
  "Trust the process.",
  "Small gains compound.",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Pick a stable-ish item from an array based on a seed (avoids re-rolling every render). */
function pick(arr, seed) {
  if (!arr.length) return "";
  return arr[Math.abs(seed) % arr.length];
}

/** Pick from an array, preferring items whose `message` is not in `recent`. Falls back to full pool when everything has been shown. */
function pickAvoiding(arr, seed, recent) {
  if (!arr.length) return null;
  const recentList = Array.isArray(recent) ? recent : [];
  const filtered = arr.filter((item) => {
    const msg = typeof item === "string" ? item : item.message;
    return !recentList.includes(msg);
  });
  const pool = filtered.length ? filtered : arr;
  return pool[Math.abs(seed) % pool.length];
}

/** Simple numeric hash from a date string like "2026-02-07". */
function dateSeed(dateKey) {
  let h = 0;
  for (let i = 0; i < dateKey.length; i++) {
    h = (h * 31 + dateKey.charCodeAt(i)) | 0;
  }
  return h;
}

/**
 * Count consecutive days with logs ending on `dateKey`.
 * Returns 0 if dateKey itself has no logs.
 */
function getStreak(logsByDate, dateKey) {
  let streak = 0;
  const d = new Date(dateKey + "T00:00:00");
  while (streak < 365) {
    const key = d.toISOString().slice(0, 10);
    const dayLogs = logsByDate[key];
    if (!dayHasCompletedSets(dayLogs)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/** Days since last log before `dateKey`. Returns null if no prior logs. */
function daysSinceLastLog(logsByDate, dateKey) {
  const keys = Object.keys(logsByDate)
    .filter((k) => k < dateKey && /^\d{4}-\d{2}-\d{2}$/.test(k))
    .sort()
    .reverse();

  for (const k of keys) {
    const dayLogs = logsByDate[k];
    if (dayHasCompletedSets(dayLogs)) {
      const diff = (new Date(dateKey + "T00:00:00") - new Date(k + "T00:00:00")) / (1000 * 60 * 60 * 24);
      return Math.round(diff);
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Set completion copy pools
// ---------------------------------------------------------------------------

const SET_DONE = [
  { message: "Set logged!", emoji: "\u2705" },
  { message: "Nice rep!", emoji: "\uD83D\uDCAA" },
  { message: "Locked in.", emoji: "\uD83D\uDD12" },
  { message: "Keep pushing.", emoji: "\uD83D\uDE80" },
];

const WORKOUT_COMPLETE = [
  { message: "Workout complete!", emoji: "\uD83C\uDFC6" },
  { message: "All exercises done!", emoji: "\uD83D\uDD25" },
  { message: "Crushed it!", emoji: "\uD83D\uDCAA\uD83D\uDD25" },
];

const PR_HIT = [
  { message: "New personal best!", emoji: "\uD83C\uDFC6\uD83D\uDD25" },
  { message: "PR! You're getting stronger.", emoji: "\uD83D\uDCAA\u2B06\uFE0F" },
  { message: "New record!", emoji: "\uD83E\uDD47" },
];

const FIRST_EVER = { message: "First time logging this!", emoji: "\uD83C\uDF1F" };

const STREAK_MILESTONES = [
  { message: "3-day streak!", emoji: "\uD83D\uDD25" },
  { message: "5-day streak! Consistency.", emoji: "\uD83D\uDD25\uD83D\uDD25" },
  { message: "7-day streak! Full week!", emoji: "\uD83C\uDFC6" },
  { message: "14-day streak! Beast mode.", emoji: "\uD83D\uDC05" },
  { message: "30-day streak! Unstoppable.", emoji: "\uD83D\uDE80" },
];

// ---------------------------------------------------------------------------
// Time-based greeting (hero / compact)
// ---------------------------------------------------------------------------

export function getTimeGreeting() {
  const h = new Date().getHours();
  return h >= 5 && h < 12 ? "Good morning."
    : h >= 12 && h < 17 ? "Good afternoon."
    : h >= 17 && h < 22 ? "Good evening."
    : "Still going.";
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

/**
 * Select a contextual greeting for the Train tab.
 * @param {Object} logsByDate - The full logs object
 * @param {string} dateKey    - Today's date key (YYYY-MM-DD)
 * @returns {string}
 */
export function selectGreeting(logsByDate, dateKey) {
  const seed = dateSeed(dateKey);
  const hasLoggedToday = dayHasCompletedSets(logsByDate[dateKey]);
  const streak = getStreak(logsByDate, dateKey);
  const gap = daysSinceLastLog(logsByDate, dateKey);

  // Already logged today — they're coming back to the same session
  if (hasLoggedToday) return pick(GREETINGS_RETURNING, seed);

  // Haven't logged in 3+ days
  if (gap !== null && gap >= 3) return pick(GREETINGS_GAP, seed);

  // On a streak (2+ consecutive days including yesterday)
  if (streak >= 2 || (gap === 1)) return pick(GREETINGS_STREAK, seed);

  // Default: first visit today
  return pick(GREETINGS_FIRST_TODAY, seed);
}

/**
 * Select acknowledgment text after saving a log.
 * @param {number|null} mood - The mood scalar (-2..+2) or null
 * @returns {{ message: string, coachLine: string|null }}
 */
export function selectAcknowledgment(mood, dateKey, logsByDate) {
  const seed = dateSeed(dateKey) + Date.now();
  let ack;

  if (mood != null && mood >= 1) {
    ack = pick(ACK_POSITIVE, seed);
  } else if (mood != null && mood <= -1) {
    ack = pick(ACK_TOUGH, seed);
  } else {
    ack = pick(ACK_NEUTRAL, seed);
  }

  // Coach reinforcement: only on first log of the day (~1 in 3 chance otherwise)
  let coachLine = null;
  const todayLogs = logsByDate?.[dateKey];
  const isFirstLogToday = !todayLogs || Object.keys(todayLogs).length <= 1;

  if (isFirstLogToday || (seed % 5 === 0)) {
    coachLine = pick(COACH_LINES, seed + 7);
  }

  return { message: ack.message, emoji: ack.emoji, coachLine };
}

/**
 * Detect if the current set beats all prior sets in `priorSets`.
 * Compares weight when present, otherwise reps. Returns false when no prior sets.
 */
function detectPRFromPriorSets(setData, priorSets) {
  const weight = parseFloat(setData.weight);
  const reps = Number(setData.reps) || 0;
  if (!weight && reps <= 0) return false;
  if (!Array.isArray(priorSets) || priorSets.length === 0) return false;

  let hasPrior = false;
  for (const s of priorSets) {
    const priorReps = Number(s.reps) || 0;
    if (priorReps <= 0) continue;
    hasPrior = true;
    const priorWeight = parseFloat(s.weight);
    if (weight > 0 && priorWeight > 0 && priorWeight >= weight) return false;
    if (!weight && priorReps >= reps) return false;
  }
  return hasPrior;
}

/**
 * Select a smart toast for set completion (checkmark tap).
 * Returns null for routine sets (silent — visual checkmark is enough feedback).
 * Fires only on meaningful moments: PR, workout complete, first-ever, streak milestone,
 * first set of an exercise, last set of an exercise.
 *
 * @param {Object} params
 * @param {string} params.exerciseId
 * @param {Object} params.setData       - { reps, weight } of the completed set
 * @param {number} params.setIndex      - 0-based set index
 * @param {number} params.totalSets
 * @param {Object} params.logsByDate
 * @param {string} params.dateKey
 * @param {boolean} params.isWorkoutComplete
 * @param {number} params.exercisesDoneToday
 * @param {Array<{reps:number,weight:any}>} [params.priorSets] - All prior completed sets across instance ids that share this exercise's catalogId/name. Empty array means truly first-ever.
 * @param {string[]} [params.recentMessages] - Recently-shown toast messages to avoid repeating.
 * @returns {{ message: string, emoji: string, coachLine: string|null } | null}
 */
export function selectSetCompletionToast({
  exerciseId,
  setData,
  setIndex,
  totalSets,
  logsByDate,
  dateKey,
  isWorkoutComplete,
  exercisesDoneToday,
  priorSets = [],
  recentMessages = [],
}) {
  const seed = dateSeed(dateKey) + Date.now();

  const todayExLog = logsByDate?.[dateKey]?.[exerciseId];
  const completedTodayForEx = (todayExLog?.sets || []).filter(isSetCompleted).length;
  const isFirstSetOfExercise = completedTodayForEx === 0;
  const isLastSet = totalSets > 0 && setIndex === totalSets - 1;

  const todayLogs = logsByDate?.[dateKey] || {};
  let totalCompletedToday = 0;
  for (const log of Object.values(todayLogs)) {
    totalCompletedToday += (log?.sets || []).filter(isSetCompleted).length;
  }
  const isFirstSetOfDay = totalCompletedToday === 0;

  // 1. PR
  if (detectPRFromPriorSets(setData, priorSets)) {
    const ack = pickAvoiding(PR_HIT, seed, recentMessages);
    return { message: ack.message, emoji: ack.emoji, coachLine: null };
  }

  // 2. Workout complete
  if (isWorkoutComplete) {
    const ack = pickAvoiding(WORKOUT_COMPLETE, seed, recentMessages);
    const volumeLine = exercisesDoneToday > 1
      ? `${exercisesDoneToday} exercises logged today`
      : null;
    return { message: ack.message, emoji: ack.emoji, coachLine: volumeLine };
  }

  // 3. First-ever log of this exercise (only on the very first set today)
  if (isFirstSetOfExercise && priorSets.length === 0) {
    return { message: FIRST_EVER.message, emoji: FIRST_EVER.emoji, coachLine: null };
  }

  // 4. Streak milestone (only on the day's first set, otherwise it'd fire repeatedly)
  if (isFirstSetOfDay) {
    const streak = getStreak(logsByDate, dateKey) + 1;
    const milestone = [30, 14, 7, 5, 3].find((n) => streak === n);
    if (milestone) {
      const idx = { 3: 0, 5: 1, 7: 2, 14: 3, 30: 4 }[milestone];
      const ack = STREAK_MILESTONES[idx];
      return { message: ack.message, emoji: ack.emoji, coachLine: pick(COACH_LINES, seed + 3) };
    }
  }

  // 5. First set of an exercise — encouraging start
  if (isFirstSetOfExercise) {
    const ack = pickAvoiding(SET_DONE, seed, recentMessages);
    const setProgress = totalSets > 0 ? `Set ${setIndex + 1}/${totalSets}` : `Set ${setIndex + 1}`;
    return { message: ack.message, emoji: ack.emoji, coachLine: setProgress };
  }

  // 6. Last set of an exercise — completion
  if (isLastSet) {
    const ack = pickAvoiding(SET_DONE, seed, recentMessages);
    return { message: ack.message, emoji: ack.emoji, coachLine: "Exercise complete" };
  }

  // 7. Routine middle set — stay silent. The checkmark animation is feedback.
  return null;
}
