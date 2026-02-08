/**
 * Contextual greeting and acknowledgment copy.
 * Pure functions, easy to tune — just edit the arrays.
 */

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
  "Logged.",
  "Workout saved.",
  "Done.",
  "Noted.",
];

const ACK_POSITIVE = [
  "Felt good — nice.",
  "Strong session.",
  "Solid work.",
];

const ACK_TOUGH = [
  "Tough one. Still counts.",
  "Hard days build strength.",
  "Showing up is the win.",
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
  while (true) {
    const key = d.toISOString().slice(0, 10);
    const dayLogs = logsByDate[key];
    if (!dayLogs || Object.keys(dayLogs).length === 0) break;
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
    if (dayLogs && Object.keys(dayLogs).length > 0) {
      const diff = (new Date(dateKey + "T00:00:00") - new Date(k + "T00:00:00")) / (1000 * 60 * 60 * 24);
      return Math.round(diff);
    }
  }
  return null;
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
  const todayLogs = logsByDate[dateKey];
  const hasLoggedToday = todayLogs && Object.keys(todayLogs).length > 0;
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
  let message;

  if (mood != null && mood >= 1) {
    message = pick(ACK_POSITIVE, seed);
  } else if (mood != null && mood <= -1) {
    message = pick(ACK_TOUGH, seed);
  } else {
    message = pick(ACK_NEUTRAL, seed);
  }

  // Coach reinforcement: only on first log of the day (~1 in 3 chance otherwise)
  let coachLine = null;
  const todayLogs = logsByDate?.[dateKey];
  const isFirstLogToday = !todayLogs || Object.keys(todayLogs).length <= 1;

  if (isFirstLogToday || (seed % 5 === 0)) {
    coachLine = pick(COACH_LINES, seed + 7);
  }

  return { message, coachLine };
}
