import { supabase } from "./supabase";
import { getUnitAbbr, buildNormalizedAnalysis } from "./coachNormalize";
import { buildCatalogMap } from "./exerciseCatalogUtils";
import { recordAiEvent } from "./aiMetrics";

const CACHE_KEY = "wt_coach_cache";
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const LAST_INSIGHTS_KEY = "wt_coach_last_insights";

const MOOD_LABELS = { "-2": "terrible", "-1": "rough", "0": "okay", "1": "good", "2": "great" };

/**
 * Build a fingerprint string from the inputs so we know when to invalidate cache.
 */
function buildFingerprint(dateRange, recentLogs, exerciseCount, profile) {
  const logDates = Object.keys(recentLogs || {}).sort().join(",");
  const logEntryCount = Object.values(recentLogs || {}).reduce(
    (sum, day) => sum + (day ? Object.keys(day).length : 0),
    0
  );
  const profileStr = [
    profile?.goal || "",
    profile?.age || "",
    profile?.weight_lbs || "",
    profile?.height_inches || "",
    profile?.about || "",
    profile?.sports || "",
  ].join("|");
  return `${dateRange.start}|${dateRange.end}|${logDates}|${logEntryCount}|${exerciseCount}|${profileStr}`;
}

/**
 * Check if a set is completed (mirrors setHelpers.isSetCompleted).
 * Inlined here to avoid circular dependency.
 */
function isCompleted(set) {
  if (set.completed !== undefined) return set.completed;
  return Number(set.reps) > 0; // fallback for unmigrated data
}

/**
 * Filter logsByDate to only include entries within the date range,
 * AND only include exercises that have at least one completed set.
 * Non-completed sets (prefilled/empty) are stripped so downstream
 * analysis never counts unperformed work.
 */
function filterLogsToRange(logsByDate, start, end) {
  const filtered = {};
  for (const [dateKey, dayLogs] of Object.entries(logsByDate || {})) {
    if (dateKey < start || dateKey > end) continue;
    if (!dayLogs || typeof dayLogs !== "object") continue;

    const filteredDay = {};
    for (const [exId, log] of Object.entries(dayLogs)) {
      if (!log?.sets || !Array.isArray(log.sets)) continue;
      const completedSets = log.sets.filter(isCompleted);
      if (completedSets.length === 0) continue;
      filteredDay[exId] = { ...log, sets: completedSets };
    }

    if (Object.keys(filteredDay).length > 0) {
      filtered[dateKey] = filteredDay;
    }
  }
  return filtered;
}

// ---------------------------------------------------------------------------
// Rolling insight history (v2) for anti-repetition
// ---------------------------------------------------------------------------

/**
 * djb2 hash for fast string comparison.
 */
function simpleHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return hash;
}

/**
 * Load insight history from localStorage. Auto-migrates v1 → v2.
 */
function loadInsightHistory() {
  try {
    const raw = localStorage.getItem(LAST_INSIGHTS_KEY);
    if (!raw) return { version: 2, history: [], fetchCounter: 0 };
    const parsed = JSON.parse(raw);

    // Already v2
    if (parsed.version === 2 && Array.isArray(parsed.history)) return parsed;

    // Migrate v1: { titles: [...], types: [...] }
    if (Array.isArray(parsed.titles) && parsed.titles.length > 0) {
      const now = new Date().toISOString().slice(0, 10);
      const history = parsed.titles.map((title, i) => ({
        titleHash: simpleHash(title),
        title,
        type: parsed.types?.[i] || "INFO",
        firstShown: now,
        lastShown: now,
        shownCount: 1,
        fetchIndex: 0,
      }));
      return { version: 2, history: history.slice(0, 20), fetchCounter: 1 };
    }

    return { version: 2, history: [], fetchCounter: 0 };
  } catch {
    return { version: 2, history: [], fetchCounter: 0 };
  }
}

/**
 * Save insights to rolling history. Upserts by titleHash, trims to 20 entries.
 */
function saveInsightHistory(insights, historyState) {
  try {
    const fetchIndex = (historyState.fetchCounter || 0) + 1;
    const now = new Date().toISOString().slice(0, 10);
    const history = [...historyState.history];

    for (const insight of insights) {
      const hash = simpleHash(insight.title);
      const existing = history.find((h) => h.titleHash === hash);
      if (existing) {
        existing.lastShown = now;
        existing.shownCount += 1;
        existing.fetchIndex = fetchIndex;
      } else {
        history.push({
          titleHash: hash,
          title: insight.title,
          type: insight.type || "INFO",
          firstShown: now,
          lastShown: now,
          shownCount: 1,
          fetchIndex,
        });
      }
    }

    // Sort by most recent first, trim to 20
    history.sort((a, b) => b.fetchIndex - a.fetchIndex);
    const trimmed = history.slice(0, 20);

    localStorage.setItem(
      LAST_INSIGHTS_KEY,
      JSON.stringify({ version: 2, history: trimmed, fetchCounter: fetchIndex })
    );

    return { version: 2, history: trimmed, fetchCounter: fetchIndex };
  } catch {
    // Ignore storage errors
    return historyState;
  }
}

/**
 * Build the payload sent to the edge function for anti-repetition.
 */
function buildPreviousInsightsPayload(historyState) {
  const { history } = historyState;
  if (!history || history.length === 0) return null;

  return {
    titles: history.map((h) => h.title),
    types: history.map((h) => h.type),
    shownCounts: history.map((h) => h.shownCount),
    dateRanges: history.map((h) => `${h.firstShown} to ${h.lastShown}`),
  };
}

// ---------------------------------------------------------------------------
// Client-side novelty filter
// ---------------------------------------------------------------------------

/**
 * Jaccard word similarity between two strings (strip emoji, lowercase, skip short words).
 */
function wordSimilarity(a, b) {
  const normalize = (s) =>
    s
      .replace(/[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu, "")
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length >= 3);
  const setA = new Set(normalize(a));
  const setB = new Set(normalize(b));
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const w of setA) {
    if (setB.has(w)) intersection++;
  }
  return intersection / (setA.size + setB.size - intersection);
}

/**
 * Filter out repetitive insights by comparing against recent history.
 * Returns filtered insights (always at least 1).
 */
function filterRepetitiveInsights(insights, historyState) {
  if (!insights || insights.length === 0) return insights;

  const { history, fetchCounter } = historyState;
  // Titles from last 3 fetches
  const recentThreshold = (fetchCounter || 0) - 2;
  const recentTitles = (history || [])
    .filter((h) => h.fetchIndex >= recentThreshold)
    .map((h) => h.title);

  if (recentTitles.length === 0) return insights;

  // Score each insight by max similarity to recent titles
  const scored = insights.map((insight) => {
    const maxSim = Math.max(
      0,
      ...recentTitles.map((t) => wordSimilarity(insight.title, t))
    );
    return { insight, maxSim };
  });

  // Filter out >60% overlap
  const kept = scored.filter((s) => s.maxSim <= 0.6).map((s) => s.insight);

  // Always keep at least 1 (the least similar)
  if (kept.length === 0) {
    scored.sort((a, b) => a.maxSim - b.maxSim);
    return [scored[0].insight];
  }

  return kept;
}

/**
 * Build an enriched text summary of recent logs with set-level detail, mood, and notes.
 */
function buildEnrichedLogSummary(recentLogs, allWorkouts) {
  const exerciseMap = {};
  for (const w of allWorkouts || []) {
    for (const ex of w.exercises || []) {
      exerciseMap[ex.id] = {
        name: ex.name,
        unit: ex.unit || "reps",
        unitAbbr: getUnitAbbr(ex.unit, ex.customUnitAbbr),
      };
    }
  }

  const DURATION_FACTORS = { sec: 1 / 60, min: 1, hrs: 60 };
  const DISTANCE_UNITS = new Set(["miles", "yards", "laps", "steps"]);

  const lines = [];
  for (const [dateKey, dayLogs] of Object.entries(recentLogs || {})) {
    if (!dayLogs || typeof dayLogs !== "object") continue;
    for (const [exId, log] of Object.entries(dayLogs)) {
      const exInfo = exerciseMap[exId];
      const exName = exInfo?.name || exId;
      const unit = exInfo?.unit || "reps";
      const unitAbbr = exInfo?.unitAbbr || "reps";
      if (!log?.sets || !Array.isArray(log.sets)) continue;

      let detail;
      if (unit in DURATION_FACTORS) {
        const totalMin = Math.round(
          log.sets.reduce((s, set) => s + (Number(set.reps) || 0), 0) * DURATION_FACTORS[unit]
        );
        detail = `${totalMin} min total (${log.sets.length} session${log.sets.length !== 1 ? "s" : ""})`;
      } else if (DISTANCE_UNITS.has(unit)) {
        const total = log.sets.reduce((s, set) => s + (Number(set.reps) || 0), 0);
        detail = `${total} ${unitAbbr} (${log.sets.length} set${log.sets.length !== 1 ? "s" : ""})`;
      } else {
        // Strength: show set-level detail like [8@185 RPE8, 8@185, 6@185]
        const setParts = log.sets.map((s) => {
          const r = Number(s.reps) || 0;
          const w = Number(s.weight) || 0;
          let part = w > 0 ? `${r}@${w}` : `${r}`;
          if (s.targetRpe) part += ` RPE${s.targetRpe}`;
          if (s.targetIntensity) part += ` INT${s.targetIntensity}`;
          if (s.targetPace) part += ` pace:${s.targetPace}`;
          if (s.targetCustom) part += ` [${s.targetCustom}]`;
          return part;
        });
        detail = `[${setParts.join(", ")}]`;
      }

      let line = `  ${dateKey}: ${exName} — ${detail}`;

      // Append mood if present
      if (log.mood != null && MOOD_LABELS[String(log.mood)]) {
        line += ` (mood: ${MOOD_LABELS[String(log.mood)]})`;
      }

      // Append notes if present
      if (log.notes && typeof log.notes === "string" && log.notes.trim()) {
        const truncated = log.notes.trim().slice(0, 50);
        line += ` [note: "${truncated}"]`;
      }

      lines.push(line);
    }
  }

  return lines.length > 0 ? lines.join("\n") : null;
}

/**
 * Compute progression trends: first vs last max weight for strength exercises with 2+ sessions.
 */
function computeProgressionTrends(recentLogs, allWorkouts, weightLabel = "lb") {
  const exerciseMap = {};
  for (const w of allWorkouts || []) {
    for (const ex of w.exercises || []) {
      exerciseMap[ex.id] = { name: ex.name, unit: ex.unit || "reps" };
    }
  }

  // Collect per-exercise: array of { date, maxWeight }
  const byExercise = {};
  for (const [dateKey, dayLogs] of Object.entries(recentLogs || {})) {
    if (!dayLogs || typeof dayLogs !== "object") continue;
    for (const [exId, log] of Object.entries(dayLogs)) {
      const info = exerciseMap[exId];
      if (!info || info.unit !== "reps") continue; // Only strength exercises
      if (!log?.sets || !Array.isArray(log.sets)) continue;
      const maxWeight = Math.max(...log.sets.map((s) => Number(s.weight) || 0), 0);
      if (maxWeight <= 0) continue;
      if (!byExercise[exId]) byExercise[exId] = { name: info.name, entries: [] };
      byExercise[exId].entries.push({ date: dateKey, maxWeight });
    }
  }

  const trends = [];
  for (const { name, entries } of Object.values(byExercise)) {
    if (entries.length < 2) continue;
    entries.sort((a, b) => a.date.localeCompare(b.date));
    const first = entries[0].maxWeight;
    const last = entries[entries.length - 1].maxWeight;
    if (last > first) {
      trends.push(`${name}: ${first} → ${last} ${weightLabel} (UP)`);
    } else if (last < first) {
      trends.push(`${name}: ${first} → ${last} ${weightLabel} (DOWN)`);
    } else {
      trends.push(`${name}: ${last} ${weightLabel} (FLAT)`);
    }
  }

  return trends.length > 0 ? trends : null;
}

/**
 * Compute adherence stats: sessions in last 30 days and average per week.
 */
function computeAdherenceStats(logsByDate) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoff = thirtyDaysAgo.toISOString().slice(0, 10);

  let sessionsLast30 = 0;
  for (const [dateKey, dayLogs] of Object.entries(logsByDate || {})) {
    if (dateKey < cutoff) continue;
    if (!dayLogs || typeof dayLogs !== "object") continue;
    // Only count days that have at least one completed set
    const hasCompleted = Object.values(dayLogs).some(
      (log) => Array.isArray(log?.sets) && log.sets.some(isCompleted)
    );
    if (hasCompleted) sessionsLast30++;
  }

  return {
    sessionsLast30,
    sessionsPerWeek: Math.round((sessionsLast30 / 30) * 7 * 10) / 10,
  };
}

/**
 * Build a detailed muscle volume breakdown showing which exercises contributed
 * to each muscle group's set count, with dates. e.g.:
 *   "CHEST: 7 sets — Bench Press ×4 (Feb 12), Cable Fly ×3 (Feb 14)"
 */
function buildMuscleVolumeDetail(recentLogs, allWorkouts, dateRange, catalogMap) {
  // Build exercise ID → info map
  const exerciseIdToInfo = {};
  for (const w of allWorkouts || []) {
    for (const ex of w.exercises || []) {
      exerciseIdToInfo[ex.id] = {
        name: ex.name,
        unit: ex.unit || "reps",
        catalogId: ex.catalogId,
      };
    }
  }

  // Accumulate: muscleGroup → [ { name, sets, date } ]
  const muscleExercises = {};
  for (const [dateKey, dayLogs] of Object.entries(recentLogs || {})) {
    if (!dayLogs || typeof dayLogs !== "object") continue;
    if (dateKey < dateRange.start || dateKey > dateRange.end) continue;
    for (const [exId, log] of Object.entries(dayLogs)) {
      const info = exerciseIdToInfo[exId];
      if (!info) continue;
      if (!log?.sets || !Array.isArray(log.sets)) continue;
      // Only strength exercises (reps unit)
      if (info.unit !== "reps") continue;
      const workingSets = log.sets.filter((s) => (Number(s.reps) || 0) > 0).length;
      if (workingSets === 0) continue;

      // Look up primary muscles from catalog
      let primaryGroups = null;
      if (info.catalogId && catalogMap) {
        const entry = catalogMap.get(info.catalogId);
        if (entry?.muscles?.primary?.length > 0) {
          primaryGroups = entry.muscles.primary;
        }
      }
      if (!primaryGroups) continue; // Skip exercises without catalog muscle data

      for (const group of primaryGroups) {
        if (!muscleExercises[group]) muscleExercises[group] = [];
        muscleExercises[group].push({ name: info.name, sets: workingSets, date: dateKey });
      }
    }
  }

  // Format each muscle group
  const lines = [];
  const sortedGroups = Object.entries(muscleExercises).sort(
    ([, a], [, b]) => b.reduce((s, e) => s + e.sets, 0) - a.reduce((s, e) => s + e.sets, 0)
  );
  for (const [group, entries] of sortedGroups) {
    const totalSets = entries.reduce((s, e) => s + e.sets, 0);
    // Merge same-exercise entries across dates
    const byName = {};
    for (const e of entries) {
      if (!byName[e.name]) byName[e.name] = { sets: 0, dates: [] };
      byName[e.name].sets += e.sets;
      const shortDate = e.date.slice(5); // "02-12" from "2026-02-12"
      if (!byName[e.name].dates.includes(shortDate)) byName[e.name].dates.push(shortDate);
    }
    const parts = Object.entries(byName).map(
      ([name, d]) => `${name} ×${d.sets} (${d.dates.join(", ")})`
    );
    lines.push(`  ${group.replace(/_/g, " ").toLowerCase()}: ${totalSets} sets — ${parts.join(", ")}`);
  }

  return lines.length > 0 ? lines.join("\n") : null;
}

/**
 * Compute volume-load trends: sum(reps × weight) per session for strength exercises with 2+ sessions.
 * Compares first vs last session volume-load.
 */
function computeVolumeLoadTrends(recentLogs, allWorkouts, weightLabel = "lb") {
  const exerciseMap = {};
  for (const w of allWorkouts || []) {
    for (const ex of w.exercises || []) {
      exerciseMap[ex.id] = { name: ex.name, unit: ex.unit || "reps" };
    }
  }

  // Collect per-exercise: array of { date, volumeLoad }
  const byExercise = {};
  for (const [dateKey, dayLogs] of Object.entries(recentLogs || {})) {
    if (!dayLogs || typeof dayLogs !== "object") continue;
    for (const [exId, log] of Object.entries(dayLogs)) {
      const info = exerciseMap[exId];
      if (!info || info.unit !== "reps") continue;
      if (!log?.sets || !Array.isArray(log.sets)) continue;
      const volumeLoad = log.sets.reduce(
        (sum, s) => sum + (Number(s.reps) || 0) * (Number(s.weight) || 0),
        0
      );
      if (volumeLoad <= 0) continue;
      if (!byExercise[exId]) byExercise[exId] = { name: info.name, entries: [] };
      byExercise[exId].entries.push({ date: dateKey, volumeLoad });
    }
  }

  const trends = [];
  for (const { name, entries } of Object.values(byExercise)) {
    if (entries.length < 2) continue;
    entries.sort((a, b) => a.date.localeCompare(b.date));
    const first = entries[0].volumeLoad;
    const last = entries[entries.length - 1].volumeLoad;
    const dir = last > first ? "UP" : last < first ? "DOWN" : "FLAT";
    trends.push(`${name}: ${first} → ${last} ${weightLabel}-reps (${dir})`);
  }

  return trends.length > 0 ? trends : null;
}

/**
 * Compute estimated 1RM trends using Epley formula: 1RM = weight × (1 + reps/30).
 * Uses heaviest working set per session (highest weight where reps > 0).
 * Compares first vs last for exercises with 2+ sessions.
 */
function computeEstimated1RMTrends(recentLogs, allWorkouts, weightLabel = "lb") {
  const exerciseMap = {};
  for (const w of allWorkouts || []) {
    for (const ex of w.exercises || []) {
      exerciseMap[ex.id] = { name: ex.name, unit: ex.unit || "reps" };
    }
  }

  // Collect per-exercise: array of { date, e1rm }
  const byExercise = {};
  for (const [dateKey, dayLogs] of Object.entries(recentLogs || {})) {
    if (!dayLogs || typeof dayLogs !== "object") continue;
    for (const [exId, log] of Object.entries(dayLogs)) {
      const info = exerciseMap[exId];
      if (!info || info.unit !== "reps") continue;
      if (!log?.sets || !Array.isArray(log.sets)) continue;

      // Find heaviest working set (highest weight where reps > 0)
      let bestE1rm = 0;
      for (const s of log.sets) {
        const w = Number(s.weight) || 0;
        const r = Number(s.reps) || 0;
        if (w <= 0 || r <= 0) continue;
        const e1rm = Math.round(w * (1 + r / 30));
        if (e1rm > bestE1rm) bestE1rm = e1rm;
      }
      if (bestE1rm <= 0) continue;
      if (!byExercise[exId]) byExercise[exId] = { name: info.name, entries: [] };
      byExercise[exId].entries.push({ date: dateKey, e1rm: bestE1rm });
    }
  }

  const trends = [];
  for (const { name, entries } of Object.values(byExercise)) {
    if (entries.length < 2) continue;
    entries.sort((a, b) => a.date.localeCompare(b.date));
    const first = entries[0].e1rm;
    const last = entries[entries.length - 1].e1rm;
    const dir = last > first ? "UP" : last < first ? "DOWN" : "FLAT";
    trends.push(`${name}: e1RM ${first} → ${last} ${weightLabel} (${dir})`);
  }

  return trends.length > 0 ? trends : null;
}

/**
 * Build fatigue trend from last 7 days of logs: training days, RPE, mood distribution, consecutive days.
 * Flags ELEVATED fatigue if avgRPE >= 8 OR rough moods >= 2 OR consecutive training days >= 4.
 */
function buildFatigueTrend(logsByDate) {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const cutoff = sevenDaysAgo.toISOString().slice(0, 10);

  let trainingDays = 0;
  const rpes = [];
  const moods = { good: 0, neutral: 0, rough: 0 };
  let consecutiveDays = 0;

  // Count training days and collect RPE/mood
  const sortedDates = Object.keys(logsByDate || {})
    .filter((d) => d >= cutoff && /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort();

  const dayHasCompleted = (dayLogs) => {
    if (!dayLogs || typeof dayLogs !== "object") return false;
    return Object.values(dayLogs).some(
      (log) => Array.isArray(log?.sets) && log.sets.some(isCompleted)
    );
  };

  for (const dateKey of sortedDates) {
    const dayLogs = logsByDate[dateKey];
    if (!dayHasCompleted(dayLogs)) continue;
    trainingDays++;
    for (const log of Object.values(dayLogs)) {
      if (log.mood != null) {
        const m = Number(log.mood);
        if (m >= 1) moods.good++;
        else if (m <= -1) moods.rough++;
        else moods.neutral++;
      }
      if (Array.isArray(log.sets)) {
        for (const s of log.sets) {
          if (isCompleted(s) && s.targetRpe && Number(s.targetRpe) > 0) rpes.push(Number(s.targetRpe));
        }
      }
    }
  }

  if (trainingDays === 0) return null;

  // Count consecutive training days backwards from today
  const today = now.toISOString().slice(0, 10);
  const d = new Date(today + "T00:00:00");
  for (let i = 0; i <= 7; i++) {
    const dk = d.toISOString().slice(0, 10);
    if (dayHasCompleted(logsByDate[dk])) {
      consecutiveDays++;
    } else if (i > 0) {
      break; // stop counting on first gap (skip today check)
    }
    d.setDate(d.getDate() - 1);
  }

  const avgRpe = rpes.length > 0
    ? (rpes.reduce((a, b) => a + b, 0) / rpes.length).toFixed(1)
    : null;

  const signals = [];
  if (avgRpe && parseFloat(avgRpe) >= 8) signals.push("high RPE");
  if (moods.rough >= 2) signals.push("multiple rough moods");
  if (consecutiveDays >= 4) signals.push(`${consecutiveDays} consecutive training days`);

  const lines = [`Training days in last 7: ${trainingDays}`];
  if (avgRpe) lines.push(`Avg RPE: ${avgRpe}/10`);
  lines.push(`Mood: ${moods.good} good, ${moods.neutral} neutral, ${moods.rough} rough`);
  if (consecutiveDays > 0) lines.push(`Consecutive training days: ${consecutiveDays}`);
  lines.push(`Fatigue signals: ${signals.length > 0 ? "ELEVATED (" + signals.join(", ") + ")" : "NORMAL"}`);

  return lines.join("\n");
}

/**
 * Fetch AI coach insights. Uses localStorage cache with 15-min TTL.
 *
 * @param {Object} params
 * @param {Object} params.profile - User profile { age, weight_lbs, goal, about, sports }
 * @param {Object} params.state - App state with program.workouts, logsByDate, dailyWorkouts
 * @param {Object} params.dateRange - { start, end, label }
 * @param {Object} [params.options] - { forceRefresh: boolean }
 * @returns {Promise<{ insights: Array, fromCache: boolean }>}
 */
export async function fetchCoachInsights({ profile, state, dateRange, options, catalog, equipment, measurementSystem }) {
  const workouts = state?.program?.workouts || [];
  const recentLogs = filterLogsToRange(state?.logsByDate, dateRange.start, dateRange.end);
  const exerciseCount = workouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);
  const fingerprint = buildFingerprint(dateRange, recentLogs, exerciseCount, profile);

  // Check cache unless force refresh
  if (!options?.forceRefresh) {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (
        cached &&
        cached.fingerprint === fingerprint &&
        Date.now() - cached.timestamp < CACHE_TTL
      ) {
        return { insights: cached.insights, fromCache: true };
      }
    } catch {
      // Ignore cache parse errors
    }
  }

  // Short-circuit when there are zero completed sessions in the date range.
  // Without this, the AI sees the program structure + adherence stats and
  // hallucinates volume claims (e.g. "too much chest") from exercises that
  // were never actually performed in the selected period.
  // Note: recentLogs is already completion-filtered by filterLogsToRange.
  if (Object.keys(recentLogs).length === 0) {
    const noDataInsights = [{
      type: "TIP",
      severity: "INFO",
      title: "📊 No workout data yet",
      message: `No logged sessions between ${dateRange.start} and ${dateRange.end}. Log a workout and check back — the more data I have, the better my advice gets.`,
      suggestions: [],
      confidence: null,
      evidence: "",
      expected_outcome: "",
    }];
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ fingerprint, insights: noDataInsights, timestamp: Date.now() })
      );
    } catch { /* ignore */ }
    return { insights: noDataInsights, fromCache: false };
  }

  // Merge daily workout exercises into the workouts array
  const allWorkouts = workouts.map((w) => ({
    name: w.name,
    scheme: w.scheme || undefined,
    exercises: (w.exercises || []).map((ex) => ({
      id: ex.id,
      name: ex.name,
      unit: ex.unit || "reps",
      unitAbbr: getUnitAbbr(ex.unit, ex.customUnitAbbr),
    })),
  }));

  const dailyExercisesInRange = [];
  for (const [date, ws] of Object.entries(state?.dailyWorkouts || {})) {
    if (date >= dateRange.start && date <= dateRange.end) {
      for (const w of (ws || []))
        dailyExercisesInRange.push(
          ...(w.exercises || []).map((ex) => ({
            id: ex.id,
            name: ex.name,
            unit: ex.unit || "reps",
            unitAbbr: getUnitAbbr(ex.unit, ex.customUnitAbbr),
          }))
        );
    }
  }
  if (dailyExercisesInRange.length > 0) {
    allWorkouts.push({ name: "Daily Workouts", exercises: dailyExercisesInRange });
  }

  // Build compact catalog for the AI (id, name, muscles, tags) excluding user's current exercises
  let catalogEntries = null;
  if (catalog && catalog.length > 0) {
    const userNames = new Set();
    for (const w of allWorkouts) {
      for (const ex of w.exercises || []) {
        userNames.add(ex.name.toLowerCase());
      }
    }
    catalogEntries = catalog
      .filter((e) => !userNames.has(e.name.toLowerCase()))
      .map((e) => ({
        id: e.id,
        name: e.name,
        muscles: [
          ...(e.muscles?.primary || []),
          ...(e.muscles?.secondary || []).map((m) => `(${m})`),
        ].join(", "),
        tags: (e.tags || []).join(", "),
      }));
  }

  // Build enriched data for the AI
  const enrichedLogSummary = buildEnrichedLogSummary(recentLogs, allWorkouts);
  const weightLabel = measurementSystem === "metric" ? "kg" : "lb";
  const progressionTrends = computeProgressionTrends(recentLogs, allWorkouts, weightLabel);
  const volumeLoadTrends = computeVolumeLoadTrends(recentLogs, allWorkouts, weightLabel);
  const estimated1RMTrends = computeEstimated1RMTrends(recentLogs, allWorkouts, weightLabel);
  const fatigueTrend = buildFatigueTrend(state?.logsByDate);
  const adherence = computeAdherenceStats(state?.logsByDate);
  const insightHistory = loadInsightHistory();
  const previousInsights = buildPreviousInsightsPayload(insightHistory);

  // Compute muscle set counts for the AI (primary-only, no secondary inflation)
  let muscleSetsSummary = null;
  let muscleVolumeDetail = null;
  if (catalog?.length > 0) {
    const catalogMap = buildCatalogMap(catalog);
    const analysis = buildNormalizedAnalysis(allWorkouts, recentLogs, { start: dateRange.start, end: dateRange.end }, catalogMap);
    if (analysis.muscleGroupSets && Object.keys(analysis.muscleGroupSets).length > 0) {
      muscleSetsSummary = analysis.muscleGroupSets;
    }
    muscleVolumeDetail = buildMuscleVolumeDetail(recentLogs, allWorkouts, dateRange, catalogMap);
  }

  // Ensure we have a fresh session token before calling the edge function
  await supabase.auth.getSession();

  // Call Edge Function
  const { data, error } = await supabase.functions.invoke("ai-coach", {
    body: {
      profile: {
        age: profile?.age,
        gender: profile?.gender,
        weight_lbs: profile?.weight_lbs,
        height_inches: profile?.height_inches,
        goal: profile?.goal,
        about: profile?.about,
        sports: profile?.sports,
      },
      workouts: allWorkouts,
      recentLogs,
      dateRange: {
        start: dateRange.start,
        end: dateRange.end,
        label: dateRange.label,
      },
      catalogEntries,
      equipment: equipment || ["full_gym"],
      weightUnit: weightLabel,
      enrichedLogSummary,
      progressionTrends,
      volumeLoadTrends,
      estimated1RMTrends,
      fatigueTrend,
      adherence,
      previousInsights,
      muscleSetsSummary,
      muscleVolumeDetail,
    },
  });

  if (error) {
    // Extract useful details from FunctionsHttpError
    let detail = error.message || "Edge function call failed";
    if (error.context && typeof error.context.status === "number") {
      detail += ` (HTTP ${error.context.status})`;
    }
    // Try to read error body for debugging
    if (error.context && typeof error.context.json === "function") {
      try {
        const body = await error.context.json();
        if (body?.error) detail += `: ${body.error}`;
        if (body?.detail) detail += ` — ${body.detail}`;
      } catch {
        // body already consumed or not JSON
      }
    }
    console.error("Coach API error detail:", detail);
    recordAiEvent("ai_parse_fail", "coach", { detail });
    throw new Error(detail);
  }

  recordAiEvent("ai_success", "coach");

  // Normalize each insight so UI never crashes on missing fields
  const insights = (data?.insights || []).map((i) => ({
    ...i,
    type: i.type || "INFO",
    severity: i.severity || "LOW",
    title: i.title || "Insight",
    message: i.message || "",
    suggestions: Array.isArray(i.suggestions) ? i.suggestions : [],
    confidence: typeof i.confidence === "number" ? i.confidence : null,
    evidence: typeof i.evidence === "string" ? i.evidence : "",
    expected_outcome: typeof i.expected_outcome === "string" ? i.expected_outcome : "",
  }));

  // Save unfiltered insights to rolling history, then filter for novelty
  const updatedHistory = saveInsightHistory(insights, insightHistory);
  const filtered = filterRepetitiveInsights(insights, updatedHistory);

  // Update cache with filtered insights
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ fingerprint, insights: filtered, timestamp: Date.now() })
    );
  } catch {
    // Ignore storage errors
  }

  return { insights: filtered, fromCache: false };
}
