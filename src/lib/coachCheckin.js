// Pre-workout check-in storage and mood pattern analysis

export const CHECKIN_KEY = "wt_coach_checkin";
export const NOTES_KEY = "wt_coach_notes";
export const PAIN_AREAS = [
  "Shoulders", "Lower Back", "Knees", "Neck",
  "Wrists", "Elbows", "Hips", "Ankles",
];

const MOOD_LABELS = { "-2": "Brutal", "-1": "Tough", "0": "Okay", "1": "Good", "2": "Great" };
const MAX_CHECKINS = 30;
const MAX_NOTES = 30;

/**
 * Load all check-ins from localStorage.
 * @returns {Object} dateKey → checkin data
 */
export function loadCheckins() {
  try {
    return JSON.parse(localStorage.getItem(CHECKIN_KEY)) || {};
  } catch {
    return {};
  }
}

/**
 * Save a check-in for the given date, pruning to last 30 days.
 * @param {string} dateKey - YYYY-MM-DD
 * @param {Object} data - { mood, sleep, pain, submittedAt }
 */
export function saveCheckin(dateKey, data) {
  const all = loadCheckins();
  if (data === null) {
    delete all[dateKey];
  } else {
    all[dateKey] = { ...data, submittedAt: data.submittedAt || new Date().toISOString() };
  }

  // Prune to most recent MAX_CHECKINS days
  const keys = Object.keys(all).sort();
  if (keys.length > MAX_CHECKINS) {
    for (const k of keys.slice(0, keys.length - MAX_CHECKINS)) {
      delete all[k];
    }
  }

  try {
    localStorage.setItem(CHECKIN_KEY, JSON.stringify(all));
  } catch { /* ignore */ }
}

/**
 * Get check-in for a specific date.
 * @param {string} dateKey - YYYY-MM-DD
 * @returns {Object|null}
 */
export function getTodayCheckin(dateKey) {
  const all = loadCheckins();
  return all[dateKey] || null;
}

/**
 * Load coach notes from localStorage.
 * @returns {Object} { version, notes }
 */
export function loadCoachNotes() {
  try {
    const stored = JSON.parse(localStorage.getItem(NOTES_KEY));
    if (stored && Array.isArray(stored.notes)) return stored;
    return { version: 1, notes: [] };
  } catch {
    return { version: 1, notes: [] };
  }
}

/**
 * Save coach notes, capping at MAX_NOTES.
 * @param {Object} notesObj - { version, notes }
 */
export function saveCoachNotes(notesObj) {
  const capped = {
    version: notesObj.version || 1,
    notes: (notesObj.notes || []).slice(-MAX_NOTES),
  };
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(capped));
  } catch { /* ignore */ }
}

/**
 * Merge new coach notes into existing, deduplicating by topic (newer wins).
 * @param {Object} existing - { version, notes }
 * @param {Array} newNotes - [{ topic, detail, date }]
 * @returns {Object} merged { version, notes }
 */
export function mergeCoachNotes(existing, newNotes) {
  const byTopic = new Map();

  // Add existing notes
  for (const note of (existing?.notes || [])) {
    byTopic.set(note.topic, note);
  }

  // Overwrite with new notes (newer wins)
  for (const note of (newNotes || [])) {
    if (note.topic && note.detail) {
      byTopic.set(note.topic, note);
    }
  }

  const merged = [...byTopic.values()];
  return {
    version: existing?.version || 1,
    notes: merged.slice(-MAX_NOTES),
  };
}

/**
 * Cross-reference pre-workout check-in mood with post-workout log mood.
 * @param {Object} checkins - dateKey → { mood, ... }
 * @param {Object} logsByDate - dateKey → { exerciseId → { sets, mood, ... } }
 * @returns {string|null} pattern description or null if insufficient data
 */
export function buildMoodPatternAnalysis(checkins, logsByDate) {
  const matched = [];

  for (const [dateKey, checkin] of Object.entries(checkins || {})) {
    if (checkin.mood === undefined || checkin.mood === null) continue;
    const dayLogs = logsByDate?.[dateKey];
    if (!dayLogs || typeof dayLogs !== "object") continue;

    // Find post-workout mood from any logged exercise that day
    let postMood = null;
    for (const log of Object.values(dayLogs)) {
      if (log && typeof log.mood === "number") {
        postMood = log.mood;
        break;
      }
    }
    if (postMood === null) continue;

    matched.push({ date: dateKey, pre: checkin.mood, post: postMood });
  }

  if (matched.length < 3) return null;

  // Only consider last 14 days
  const sorted = matched.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 14);
  const total = sorted.length;

  const improved = sorted.filter((m) => m.post > m.pre).length;
  const worsened = sorted.filter((m) => m.post < m.pre).length;
  const same = total - improved - worsened;

  const parts = [];
  if (improved > 0) {
    parts.push(`${improved}/${total} sessions user reports ${improved === total ? "consistently" : ""} feeling better after training`);
  }
  if (worsened > 0) {
    parts.push(`${worsened}/${total} sessions mood stayed same or worsened`);
  }
  if (same > 0 && improved > 0) {
    parts.push(`${same}/${total} sessions mood unchanged`);
  }

  // Build specific pre→post examples
  const examples = sorted.slice(0, 3).map((m) =>
    `${MOOD_LABELS[String(m.pre)] || "?"} → ${MOOD_LABELS[String(m.post)] || "?"}`
  ).join(", ");

  return `Pre vs post workout mood (last ${total} sessions): ${parts.join(". ")}. Recent examples: ${examples}.`;
}

/**
 * Build the full check-in context payload for the AI.
 * @param {Object|null} todayCheckin - today's check-in or null
 * @param {Object} checkins - all check-ins
 * @param {Object} logsByDate - all logs
 * @returns {Object} { today, history, moodPattern }
 */
export function buildCheckinContext(todayCheckin, checkins, logsByDate) {
  const today = todayCheckin ? {
    mood: todayCheckin.mood,
    moodLabel: MOOD_LABELS[String(todayCheckin.mood)] || "unknown",
    sleep: todayCheckin.sleep,
    pain: todayCheckin.pain || [],
  } : null;

  // Build last 14 days of history (excluding today)
  const allDates = Object.keys(checkins || {}).sort().reverse().slice(0, 14);
  const history = allDates.map((dk) => {
    const c = checkins[dk];
    return {
      date: dk,
      mood: c.mood,
      moodLabel: MOOD_LABELS[String(c.mood)] || "unknown",
      sleep: c.sleep,
      pain: c.pain || [],
    };
  });

  const moodPattern = buildMoodPatternAnalysis(checkins, logsByDate);

  return { today, history, moodPattern };
}
