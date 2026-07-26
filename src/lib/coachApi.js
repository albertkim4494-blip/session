import { supabase } from "./supabase";
import { getUnitAbbr, buildNormalizedAnalysis } from "./coachNormalize";
import { buildCatalogMap } from "./exerciseCatalogUtils";
import { recordAiEvent } from "./aiMetrics";
// Pure training-signal builders shared with the workout generator. Previously
// defined inline here; extracted to lib/trainingSignals.js so both surfaces use
// the identical math (Phase 2 — see phase2-generate-today).
import {
  mergeSportTraits,
  loadInsightHistory,
  saveInsightHistory,
  buildFollowUpContext,
  buildCoachingHistoryPayload,
  computeProgressionTrends,
  computeVolumeLoadTrends,
  computeEstimated1RMTrends,
  buildMuscleVolumeDetail,
  computeComplexityScore,
} from "./trainingSignals";

const CACHE_KEY = "wt_coach_cache";
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

const MOOD_LABELS = { "-2": "brutal", "-1": "tough", "0": "okay", "1": "good", "2": "great" };

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
        const truncated = log.notes.trim().slice(0, 200);
        line += ` [note: "${truncated}"]`;
      }

      lines.push(line);
    }
  }

  return lines.length > 0 ? lines.join("\n") : null;
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
 * Keywords in notes that indicate injury/pain — these survive time-decay
 * into the recent history tier. Casual mood notes ("felt tired") do not.
 */
const NOTABLE_NOTE_KEYWORDS = /\b(pain|hurt|injury|injured|sore|soreness|tight|tightness|strain|strained|pull|pulled|tweak|tweaked|snap|popped|swollen|inflamed|numb|tingling|doctor|physio|PT|rehab|surgery|tear|torn)\b/i;

/**
 * Build tiered historical summaries with time-decay.
 *
 * Tier 1 — RECENT HISTORY (4 weeks before currentRange.start):
 *   Per-exercise: sessions, weight range (best/avg), avg RPE
 *   Muscle groups trained (sets per group)
 *   Mood distribution, frequency
 *   Injury/pain notes (full text, up to 100 chars each)
 *
 * Tier 2 — OLDER HISTORY (everything before recent history):
 *   Training tenure, total sessions, avg frequency
 *   Top exercises with all-time progression (first → best weight)
 *   Overall mood trend (one-liner)
 *   Chronic/injury notes only
 *
 * @returns {{ recentHistory: string|null, olderHistory: string|null }}
 */
function buildTieredHistory(logsByDate, allWorkouts, currentRange, catalogMap, weightLabel = "lb") {
  const DURATION_FACTORS = { sec: 1 / 60, min: 1, hrs: 60 };

  // Date boundaries
  const recentStart = (() => {
    const d = new Date(currentRange.start + "T00:00:00");
    d.setDate(d.getDate() - 28); // 4 weeks before current range
    return d.toISOString().slice(0, 10);
  })();
  const recentEnd = (() => {
    // Day before current range start
    const d = new Date(currentRange.start + "T00:00:00");
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  })();

  const exerciseMap = {};
  for (const w of allWorkouts || []) {
    for (const ex of w.exercises || []) {
      exerciseMap[ex.id] = { name: ex.name, unit: ex.unit || "reps" };
    }
  }

  // Accumulators for each tier
  const tiers = {
    recent: { sessions: 0, exercises: {}, moods: { great: 0, good: 0, okay: 0, tough: 0, brutal: 0 }, notableNotes: [], muscleSets: {} },
    older:  { sessions: 0, exercises: {}, moods: { great: 0, good: 0, okay: 0, tough: 0, brutal: 0 }, notableNotes: [], firstDate: null, lastDate: null },
  };

  for (const [dateKey, dayLogs] of Object.entries(logsByDate || {})) {
    if (!dayLogs || typeof dayLogs !== "object") continue;
    // Skip dates in the current range — those are already sent as detailed logs
    if (dateKey >= currentRange.start && dateKey <= currentRange.end) continue;

    const hasCompleted = Object.values(dayLogs).some(
      (log) => Array.isArray(log?.sets) && log.sets.some(isCompleted)
    );
    if (!hasCompleted) continue;

    // Determine which tier
    const tier = (dateKey >= recentStart && dateKey <= recentEnd) ? tiers.recent : tiers.older;
    if (dateKey < recentStart) {
      if (!tier.firstDate || dateKey < tier.firstDate) tiers.older.firstDate = dateKey;
      if (!tier.lastDate || dateKey > tier.lastDate) tiers.older.lastDate = dateKey;
    }
    tier.sessions++;

    for (const [exId, log] of Object.entries(dayLogs)) {
      if (!log?.sets || !Array.isArray(log.sets)) continue;
      const completedSets = log.sets.filter(isCompleted);
      if (completedSets.length === 0) continue;

      const info = exerciseMap[exId];
      const name = info?.name || exId;
      const unit = info?.unit || "reps";

      if (!tier.exercises[exId]) {
        tier.exercises[exId] = { name, unit, sessionCount: 0, weights: [], rpes: [], totalSets: 0, totalValue: 0 };
      }
      const exAcc = tier.exercises[exId];
      exAcc.sessionCount++;
      exAcc.totalSets += completedSets.length;

      if (unit === "reps") {
        const maxW = Math.max(...completedSets.map((s) => Number(s.weight) || 0), 0);
        if (maxW > 0) exAcc.weights.push({ date: dateKey, weight: maxW });
        exAcc.totalValue += completedSets.reduce((sum, s) => sum + (Number(s.reps) || 0), 0);
      } else if (unit in DURATION_FACTORS) {
        const totalMin = completedSets.reduce((sum, s) => sum + (Number(s.reps) || 0), 0) * DURATION_FACTORS[unit];
        exAcc.totalValue += Math.round(totalMin);
      } else {
        exAcc.totalValue += completedSets.reduce((sum, s) => sum + (Number(s.reps) || 0), 0);
      }

      // RPE
      for (const s of completedSets) {
        const rpe = Number(s.targetRpe);
        if (rpe > 0) exAcc.rpes.push(rpe);
      }

      // Muscle groups (recent tier only — for muscle balance context)
      if (tier === tiers.recent && catalogMap) {
        const catEntry = catalogMap.get(log.catalogId) || catalogMap.get(exId);
        if (catEntry?.muscles?.primary) {
          for (const m of catEntry.muscles.primary) {
            tier.muscleSets[m] = (tier.muscleSets[m] || 0) + completedSets.length;
          }
        }
      }

      // Mood
      if (log.mood != null && MOOD_LABELS[String(log.mood)]) {
        tier.moods[MOOD_LABELS[String(log.mood)]]++;
      }

      // Notable notes (injury/pain keywords only)
      if (log.notes && typeof log.notes === "string" && NOTABLE_NOTE_KEYWORDS.test(log.notes)) {
        tier.notableNotes.push({ date: dateKey, exercise: name, note: log.notes.trim().slice(0, 100) });
      }
    }
  }

  // --- Format RECENT HISTORY ---
  let recentHistory = null;
  if (tiers.recent.sessions > 0) {
    const r = tiers.recent;
    const weeks = Math.max(1, Math.round((new Date(recentEnd) - new Date(recentStart)) / 86400000 / 7));
    const lines = [];
    lines.push(`${r.sessions} sessions over ~${weeks} weeks (${recentStart} to ${recentEnd}), ${(r.sessions / weeks).toFixed(1)} sessions/week`);

    // Per-exercise summaries (top 10 by session count)
    const exSorted = Object.values(r.exercises)
      .sort((a, b) => b.sessionCount - a.sessionCount)
      .slice(0, 10);
    if (exSorted.length > 0) {
      lines.push("Exercises:");
      for (const ex of exSorted) {
        let detail = `${ex.sessionCount} sessions, ${ex.totalSets} sets`;
        if (ex.unit === "reps" && ex.weights.length > 0) {
          const ws = ex.weights.map((w) => w.weight);
          const best = Math.max(...ws);
          const avg = Math.round(ws.reduce((a, b) => a + b, 0) / ws.length);
          detail += `, best: ${best} ${weightLabel}, avg: ${avg} ${weightLabel}`;
        } else if (ex.unit !== "reps") {
          detail += `, total: ${ex.totalValue} ${ex.unit === "min" || ex.unit === "hrs" || ex.unit === "sec" ? "min" : ex.unit}`;
        }
        if (ex.rpes.length > 0) {
          const avgRpe = (ex.rpes.reduce((a, b) => a + b, 0) / ex.rpes.length).toFixed(1);
          detail += `, avg RPE: ${avgRpe}`;
        }
        lines.push(`  ${ex.name}: ${detail}`);
      }
    }

    // Muscle group sets
    const muscleEntries = Object.entries(r.muscleSets).filter(([, v]) => v > 0).sort(([, a], [, b]) => b - a);
    if (muscleEntries.length > 0) {
      lines.push("Muscle groups: " + muscleEntries.map(([g, v]) => `${g.replace(/_/g, " ").toLowerCase()}: ${v} sets`).join(", "));
    }

    // Mood
    const totalMoods = Object.values(r.moods).reduce((a, b) => a + b, 0);
    if (totalMoods > 0) {
      const parts = Object.entries(r.moods).filter(([, v]) => v > 0).map(([k, v]) => `${k}: ${v}`);
      lines.push(`Mood: ${parts.join(", ")}`);
    }

    // Notable notes
    if (r.notableNotes.length > 0) {
      lines.push("Flagged notes:");
      for (const n of r.notableNotes.slice(0, 5)) {
        lines.push(`  ${n.date} (${n.exercise}): "${n.note}"`);
      }
    }

    recentHistory = lines.join("\n");
  }

  // --- Format OLDER HISTORY ---
  let olderHistory = null;
  if (tiers.older.sessions > 0) {
    const o = tiers.older;
    const first = o.firstDate || recentStart;
    const last = o.lastDate || recentStart;
    const totalDays = Math.max(1, Math.round((new Date(last) - new Date(first)) / 86400000) + 1);
    const totalWeeks = Math.max(1, Math.round(totalDays / 7));
    const lines = [];
    lines.push(`${o.sessions} sessions over ~${totalWeeks} weeks (${first} to ${last}), ${(o.sessions / totalWeeks).toFixed(1)} sessions/week`);

    // Top exercises — first → best weight (PRs and all-time progression)
    const exSorted = Object.values(o.exercises)
      .filter((e) => e.sessionCount >= 2)
      .sort((a, b) => b.sessionCount - a.sessionCount)
      .slice(0, 8);
    if (exSorted.length > 0) {
      lines.push("Key exercises:");
      for (const ex of exSorted) {
        if (ex.unit === "reps" && ex.weights.length >= 2) {
          ex.weights.sort((a, b) => a.date.localeCompare(b.date));
          const firstW = ex.weights[0].weight;
          const bestW = Math.max(...ex.weights.map((w) => w.weight));
          const arrow = bestW > firstW ? "↑" : bestW < firstW ? "↓" : "→";
          lines.push(`  ${ex.name}: ${ex.sessionCount} sessions, ${firstW}→${bestW} ${weightLabel} ${arrow}`);
        } else {
          lines.push(`  ${ex.name}: ${ex.sessionCount} sessions`);
        }
      }
    }

    // Mood — just a one-liner trend
    const totalMoods = Object.values(o.moods).reduce((a, b) => a + b, 0);
    if (totalMoods > 0) {
      const positive = o.moods.great + o.moods.good;
      const negative = o.moods.tough + o.moods.brutal;
      const ratio = positive / totalMoods;
      const trend = ratio >= 0.7 ? "mostly positive" : ratio >= 0.4 ? "mixed" : "mostly rough";
      lines.push(`Overall mood: ${trend} (${totalMoods} entries)`);
    }

    // Chronic/injury notes only
    if (o.notableNotes.length > 0) {
      lines.push("Historical injury/pain notes:");
      for (const n of o.notableNotes.slice(-3)) { // most recent 3
        lines.push(`  ${n.date} (${n.exercise}): "${n.note}"`);
      }
    }

    olderHistory = lines.join("\n");
  }

  return { recentHistory, olderHistory };
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
export async function fetchCoachInsights({ profile, state, dateRange, options, catalog, equipment, measurementSystem, checkinContext, coachNotesFromStorage, onInsight }) {
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
      catalogId: ex.catalogId,
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
            catalogId: ex.catalogId,
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
      .slice(0, 30) // Cap catalog size to reduce payload
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

  // Build active exercise names for follow-up context
  const activeExerciseNames = [];
  for (const w of allWorkouts) {
    for (const ex of w.exercises || []) activeExerciseNames.push(ex.name);
  }

  // Compute muscle set counts for the AI (effective: primary + 0.5× secondary)
  let muscleSetsSummary = null;
  let muscleVolumeDetail = null;
  let sportTraitsPayload = null;
  let coachSignals = null;
  let tieredHistory = { recentHistory: null, olderHistory: null };
  const catalogMap = catalog?.length > 0 ? buildCatalogMap(catalog) : null;
  if (catalogMap) {
    const analysis = buildNormalizedAnalysis(allWorkouts, recentLogs, { start: dateRange.start, end: dateRange.end }, catalogMap);
    if (analysis.muscleGroupSetsEffective && Object.keys(analysis.muscleGroupSetsEffective).length > 0) {
      muscleSetsSummary = analysis.muscleGroupSetsEffective;
    }
    coachSignals = analysis.coachSignals || null;
    muscleVolumeDetail = buildMuscleVolumeDetail(recentLogs, allWorkouts, dateRange, catalogMap);
    // Merge logged sport traits with profile-declared sports (logged takes precedence)
    sportTraitsPayload = mergeSportTraits(analysis.sportTraits, profile?.sports);
  } else {
    // No catalog — still infer sport traits from profile text
    sportTraitsPayload = mergeSportTraits(null, profile?.sports);
  }
  tieredHistory = buildTieredHistory(state?.logsByDate, allWorkouts, dateRange, catalogMap, weightLabel);

  // Build coaching history with follow-up context
  const followUpContext = buildFollowUpContext(insightHistory, {
    muscleSetsSummary,
    progressionTrends,
    activeExerciseNames,
  });
  const coachingHistory = buildCoachingHistoryPayload(insightHistory, followUpContext);

  // Compute complexity score for model routing
  const loggedDays = Object.keys(recentLogs).length;
  const allExerciseIds = new Set();
  for (const dayLogs of Object.values(recentLogs)) {
    if (dayLogs && typeof dayLogs === "object") {
      for (const exId of Object.keys(dayLogs)) allExerciseIds.add(exId);
    }
  }
  const trendCount = (progressionTrends?.length || 0) + (volumeLoadTrends?.length || 0);
  const muscleGroupCount = muscleSetsSummary ? Object.keys(muscleSetsSummary).length : 0;

  const complexityScore = computeComplexityScore({
    loggedDays,
    exerciseCount: allExerciseIds.size,
    trendCount,
    muscleGroupCount,
    hasSports: !!(profile?.sports || sportTraitsPayload?.totalSportSessions > 0),
    hasHistory: !!(tieredHistory.recentHistory || tieredHistory.olderHistory),
    previousInsightCount: coachingHistory?.entries?.length || 0,
  });
  const modelHint = complexityScore >= 4 ? "gpt-4o" : "gpt-4o-mini";

  // Ensure we have a fresh session token before calling the edge function
  const { data: { session: authSession } } = await supabase.auth.getSession();

  const requestBody = {
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
      label: dateRange.label || "today",
    },
    catalogEntries,
    equipment: equipment || ["full_gym"],
    weightUnit: weightLabel,
    enrichedLogSummary: enrichedLogSummary?.slice(0, 3000) || null,
    progressionTrends,
    volumeLoadTrends,
    estimated1RMTrends,
    fatigueTrend,
    adherence,
    coachingHistory,
    sportTraits: sportTraitsPayload?.aggregated || null,
    muscleSetsSummary,
    coachSignals,
    muscleVolumeDetail: muscleVolumeDetail?.slice(0, 1600) || null,
    recentHistory: tieredHistory.recentHistory?.slice(0, 1500) || null,
    olderHistory: tieredHistory.olderHistory?.slice(0, 800) || null,
    modelHint,
    checkin: checkinContext?.today || null,
    checkinHistory: (checkinContext?.history || []).slice(0, 7),
    moodPattern: checkinContext?.moodPattern || null,
    coachNotes: coachNotesFromStorage || null,
  };

  // Helper: normalize a single insight so UI never crashes on missing fields
  function normalizeInsightFields(i) {
    return {
      ...i,
      type: i.type || "INFO",
      severity: i.severity || "LOW",
      title: i.title || "Insight",
      message: i.message || "",
      suggestions: Array.isArray(i.suggestions) ? i.suggestions : [],
      confidence: typeof i.confidence === "number" ? i.confidence : null,
      evidence: typeof i.evidence === "string" ? i.evidence : "",
      expected_outcome: typeof i.expected_outcome === "string" ? i.expected_outcome : "",
      showAsHero: !!i.showAsHero,
      salience: typeof i.salience === "number" ? i.salience : null,
    };
  }

  function buildHeroSummaryInsight(insights, summaryData) {
    const primaryFocus = summaryData?.primaryFocus?.trim();
    const todayAction = summaryData?.todayAction?.trim();
    if (!primaryFocus && !todayAction) return insights;

    const [firstInsight, ...restInsights] = Array.isArray(insights) ? insights : [];
    const baseInsight = firstInsight ? normalizeInsightFields(firstInsight) : normalizeInsightFields({
      type: "TIP",
      severity: "INFO",
      title: "Today's focus",
      message: "",
      suggestions: [],
    });

    const combinedParts = [];
    if (todayAction) combinedParts.push(todayAction);
    if (baseInsight.message) combinedParts.push(baseInsight.message);

    const heroInsight = normalizeInsightFields({
      ...baseInsight,
      title: primaryFocus || baseInsight.title,
      message: combinedParts.join(" "),
      showAsHero: true,
      salience: 100,
    });

    return [heroInsight, ...restInsights];
  }

  function softenCoachVoice(text) {
    if (typeof text !== "string" || !text.trim()) return text || "";

    return text
      .replace(/\s*\(\d{1,3}%\)/g, "")
      .replace(/\be1RM\b/gi, "estimated max")
      .replace(/\bestimated 1RM\b/gi, "estimated max")
      .replace(/\b(remains low|is low|was low) at (\d+(?:\.\d+)?) sets\b/gi, "has been light at $2 sets")
      .replace(/\b(\d+(?:\.\d+)?) sets? \((?:\d{1,3})%\)/gi, "$1 sets")
      .replace(/\bNo direct ([a-z ]+) sets logged this period\b/gi, "You have not logged direct $1 work lately")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function splitSentences(text) {
    return softenCoachVoice(text)
      .split(/(?<=[.!?])\s+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function trimInsightMessage(text, maxSentences = 2) {
    const sentences = splitSentences(text);
    if (sentences.length === 0) return "";
    return sentences.slice(0, maxSentences).join(" ");
  }

  function shortenHeadline(text) {
    const cleaned = softenCoachVoice(text)
      .replace(/\b(today|right now|for today)\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (!cleaned) return "Today's focus";
    const capped = cleaned[0].toUpperCase() + cleaned.slice(1);
    return capped.length > 48 ? `${capped.slice(0, 45).trim()}...` : capped;
  }

  function toCoachLine(text, prefix) {
    const line = trimInsightMessage(text, 1);
    if (!line) return "";
    const normalized = line.replace(/[.!?]+$/, "");
    return prefix ? `${prefix}: ${normalized}` : normalized;
  }

  function humanizeInsight(insight) {
    return {
      ...insight,
      title: shortenHeadline(insight?.title || "Insight"),
      message: trimInsightMessage(insight?.message || "", 2),
      evidence: toCoachLine(insight?.evidence || "", ""),
      expected_outcome: toCoachLine(insight?.expected_outcome || "", ""),
    };
  }

  function formatStructuredInsights(insights) {
    if (!Array.isArray(insights) || insights.length === 0) return [];
    const [hero, ...rest] = insights;
    const heroSentences = splitSentences(hero?.message || "");
    const formattedHero = hero ? {
      ...hero,
      message: heroSentences[0] ? toCoachLine(heroSentences[0], "Next") : "",
      evidence: hero.evidence || heroSentences[1] || "",
      expected_outcome: hero.expected_outcome || "",
    } : null;

    const formattedRest = rest.map((insight) => ({
      ...insight,
      message: trimInsightMessage(insight.message, 1),
      evidence: toCoachLine(insight.evidence || "", ""),
      expected_outcome: toCoachLine(insight.expected_outcome || "", ""),
    }));

    return formattedHero ? [formattedHero, ...formattedRest] : formattedRest;
  }

  // Helper: post-process insights (save history, filter, cache)
  function postProcess(insights, coachNotesData, summaryData) {
    const enhancedInsights = formatStructuredInsights(
      buildHeroSummaryInsight(insights, summaryData).map(humanizeInsight)
    );
    const updatedHistory = saveInsightHistory(enhancedInsights, insightHistory, {
      muscleSetsSummary,
      progressionTrends,
      adherence,
    });
    const filtered = filterRepetitiveInsights(enhancedInsights, updatedHistory);
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ fingerprint, insights: filtered, timestamp: Date.now() })
      );
    } catch { /* ignore */ }
    const validNotes = (Array.isArray(coachNotesData) ? coachNotesData : [])
      .filter((n) => n && typeof n.topic === "string" && typeof n.detail === "string");
    return { insights: filtered, fromCache: false, coachNotes: validNotes };
  }

  // ---------------------------------------------------------------------------
  // STREAMING PATH: use raw fetch + SSE parsing with onInsight callback
  // ---------------------------------------------------------------------------
  const useStreaming = typeof onInsight === "function";

  if (useStreaming) {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const edgeUrl = `${supabaseUrl}/functions/v1/ai-coach`;

      const response = await fetch(edgeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authSession?.access_token || ""}`,
          "apikey": supabaseKey,
        },
        body: JSON.stringify({ ...requestBody, stream: true }),
      });

      if (!response.ok) {
        throw new Error(`Edge function HTTP ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";

      // If the response is JSON (not SSE), fall through to blocking path
      if (contentType.includes("application/json")) {
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        recordAiEvent("ai_success", "coach", { model: modelHint, complexityScore });
        const insights = (data.insights || []).map(normalizeInsightFields);
        for (const ins of insights) onInsight(ins);
        return postProcess(insights, data.coachNotes, {
          trendStatus: data?.trendStatus,
          primaryFocus: data?.primaryFocus,
          todayAction: data?.todayAction,
        });
      }

      // SSE stream with timeout — abort if no data for 30s
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let sseBuffer = "";
      const allInsights = [];
      let doneData = null;
      const STREAM_TIMEOUT = 30000;

      while (true) {
        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error("Stream timeout")), STREAM_TIMEOUT);
        });
        const { done, value } = await Promise.race([reader.read(), timeoutPromise]).finally(() => clearTimeout(timeoutId));
        if (done) break;
        sseBuffer += decoder.decode(value, { stream: true });

        const lines = sseBuffer.split("\n");
        sseBuffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (!payload) continue;

          try {
            const event = JSON.parse(payload);
            if (event.type === "insight") {
              const normalized = normalizeInsightFields(event.data);
              allInsights.push(normalized);
              onInsight(normalized);
            } else if (event.type === "done") {
              doneData = event;
            } else if (event.type === "error") {
              throw new Error(event.message || "Stream error");
            }
          } catch (e) {
            if (e.message === "Stream error" || e.message?.startsWith("Stream")) throw e;
            // skip malformed SSE events
          }
        }
      }

      recordAiEvent("ai_success", "coach", { model: modelHint, complexityScore, streamed: true });
      return postProcess(allInsights, doneData?.coachNotes || [], {
        trendStatus: doneData?.trendStatus,
        primaryFocus: doneData?.primaryFocus,
        todayAction: doneData?.todayAction,
      });
    } catch (streamErr) {
      console.warn("Streaming failed, falling back to blocking:", streamErr.message);
      // Fall through to blocking path below
    }
  }

  // ---------------------------------------------------------------------------
  // BLOCKING PATH (original behavior, also used as streaming fallback)
  // ---------------------------------------------------------------------------
  const { data, error } = await supabase.functions.invoke("ai-coach", {
    body: requestBody,
  });

  if (error) {
    let detail = error.message || "Edge function call failed";
    if (error.context && typeof error.context.status === "number") {
      detail += ` (HTTP ${error.context.status})`;
    }
    if (error.context && typeof error.context.json === "function") {
      try {
        const body = await error.context.json();
        if (body?.error) detail += `: ${body.error}`;
        if (body?.detail) detail += ` — ${body.detail}`;
      } catch { /* body already consumed */ }
    }
    console.error("Coach API error detail:", detail);
    recordAiEvent("ai_parse_fail", "coach", { detail });
    throw new Error(detail);
  }

  recordAiEvent("ai_success", "coach", { model: modelHint, complexityScore });

  const insights = (data?.insights || []).map(normalizeInsightFields);
  // If onInsight was provided but streaming failed, deliver all at once
  if (typeof onInsight === "function") {
    for (const ins of insights) onInsight(ins);
  }
  return postProcess(insights, data?.coachNotes, {
    trendStatus: data?.trendStatus,
    primaryFocus: data?.primaryFocus,
    todayAction: data?.todayAction,
  });
}
