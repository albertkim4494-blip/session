import { supabase } from "./supabase";
import { getUnitAbbr, buildNormalizedAnalysis, classifyExerciseMuscles } from "./coachNormalize";
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
        const truncated = log.notes.trim().slice(0, 200);
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
  const MOOD_LABELS = { "2": "great", "1": "good", "0": "okay", "-1": "rough", "-2": "terrible" };
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
    recent: { sessions: 0, exercises: {}, moods: { great: 0, good: 0, okay: 0, rough: 0, terrible: 0 }, notableNotes: [], muscleSets: {} },
    older:  { sessions: 0, exercises: {}, moods: { great: 0, good: 0, okay: 0, rough: 0, terrible: 0 }, notableNotes: [], firstDate: null, lastDate: null },
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
      const negative = o.moods.rough + o.moods.terrible;
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

      // Look up primary muscles from catalog, fall back to keyword classification
      let primaryGroups = null;
      if (info.catalogId && catalogMap) {
        const entry = catalogMap.get(info.catalogId);
        if (entry?.muscles?.primary?.length > 0) {
          primaryGroups = entry.muscles.primary;
        }
      }
      if (!primaryGroups) {
        const keywordGroups = classifyExerciseMuscles(info.name);
        if (keywordGroups.length > 0 && keywordGroups[0] !== "UNCLASSIFIED") {
          primaryGroups = keywordGroups;
        }
      }
      if (!primaryGroups) continue; // Skip truly unclassifiable exercises

      for (const group of primaryGroups) {
        if (!muscleExercises[group]) muscleExercises[group] = [];
        muscleExercises[group].push({ name: info.name, sets: workingSets, date: dateKey });
      }
    }
  }

  // Format each muscle group with percentages
  const lines = [];
  const sortedGroups = Object.entries(muscleExercises).sort(
    ([, a], [, b]) => b.reduce((s, e) => s + e.sets, 0) - a.reduce((s, e) => s + e.sets, 0)
  );
  const grandTotalSets = sortedGroups.reduce(
    (sum, [, entries]) => sum + entries.reduce((s, e) => s + e.sets, 0), 0
  );
  for (const [group, entries] of sortedGroups) {
    const totalSets = entries.reduce((s, e) => s + e.sets, 0);
    const pct = grandTotalSets > 0 ? Math.round((totalSets / grandTotalSets) * 100) : 0;
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
    lines.push(`  ${group.replace(/_/g, " ").toLowerCase()}: ${totalSets} sets (${pct}%) — ${parts.join(", ")}`);
  }

  return lines.length > 0 ? `Total: ${grandTotalSets} working sets\n${lines.join("\n")}` : null;
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
 * Compute a complexity score (0-7) to decide model routing.
 * Score >= 4 → gpt-4o (complex analysis), else → gpt-4o-mini (cheaper).
 *
 * Scoring factors:
 *   +1 if logged days in range >= 5
 *   +1 if unique exercises >= 8
 *   +1 if progression trends >= 4
 *   +1 if muscle groups >= 5
 *   +1 if user has sports
 *   +1 if tiered history present (recentHistory or olderHistory)
 *   +1 if previous insights >= 5 (anti-repetition harder → needs smarter model)
 */
export function computeComplexityScore({
  loggedDays = 0,
  exerciseCount = 0,
  trendCount = 0,
  muscleGroupCount = 0,
  hasSports = false,
  hasHistory = false,
  previousInsightCount = 0,
}) {
  let score = 0;
  if (loggedDays >= 5) score++;
  if (exerciseCount >= 8) score++;
  if (trendCount >= 4) score++;
  if (muscleGroupCount >= 5) score++;
  if (hasSports) score++;
  if (hasHistory) score++;
  if (previousInsightCount >= 5) score++;
  return score;
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
  let tieredHistory = { recentHistory: null, olderHistory: null };
  const catalogMap = catalog?.length > 0 ? buildCatalogMap(catalog) : null;
  if (catalogMap) {
    const analysis = buildNormalizedAnalysis(allWorkouts, recentLogs, { start: dateRange.start, end: dateRange.end }, catalogMap);
    if (analysis.muscleGroupSets && Object.keys(analysis.muscleGroupSets).length > 0) {
      muscleSetsSummary = analysis.muscleGroupSets;
    }
    muscleVolumeDetail = buildMuscleVolumeDetail(recentLogs, allWorkouts, dateRange, catalogMap);
  }
  tieredHistory = buildTieredHistory(state?.logsByDate, allWorkouts, dateRange, catalogMap, weightLabel);

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
    hasSports: !!profile?.sports,
    hasHistory: !!(tieredHistory.recentHistory || tieredHistory.olderHistory),
    previousInsightCount: previousInsights?.titles?.length || 0,
  });
  const modelHint = complexityScore >= 4 ? "gpt-4o" : "gpt-4o-mini";

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
      recentHistory: tieredHistory.recentHistory,
      olderHistory: tieredHistory.olderHistory,
      modelHint,
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

  recordAiEvent("ai_success", "coach", { model: modelHint, complexityScore });

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
