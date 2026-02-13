import { supabase } from "./supabase";
import { getUnitAbbr } from "./coachNormalize";

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
    profile?.about || "",
    profile?.sports || "",
  ].join("|");
  return `${dateRange.start}|${dateRange.end}|${logDates}|${logEntryCount}|${exerciseCount}|${profileStr}`;
}

/**
 * Filter logsByDate to only include entries within the date range.
 */
function filterLogsToRange(logsByDate, start, end) {
  const filtered = {};
  for (const [dateKey, dayLogs] of Object.entries(logsByDate || {})) {
    if (dateKey >= start && dateKey <= end) {
      filtered[dateKey] = dayLogs;
    }
  }
  return filtered;
}

/**
 * Load previous insight titles/types from localStorage so the AI can avoid repeating itself.
 */
function loadPreviousInsights() {
  try {
    const raw = localStorage.getItem(LAST_INSIGHTS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.titles) && parsed.titles.length > 0) return parsed;
    return null;
  } catch {
    return null;
  }
}

/**
 * Save insight titles/types after a successful fetch.
 */
function savePreviousInsights(insights) {
  try {
    localStorage.setItem(
      LAST_INSIGHTS_KEY,
      JSON.stringify({
        titles: insights.map((i) => i.title),
        types: insights.map((i) => i.type),
      })
    );
  } catch {
    // Ignore storage errors
  }
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
    if (dayLogs && typeof dayLogs === "object" && Object.keys(dayLogs).length > 0) {
      sessionsLast30++;
    }
  }

  return {
    sessionsLast30,
    sessionsPerWeek: Math.round((sessionsLast30 / 30) * 7 * 10) / 10,
  };
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

  // Build catalog summary: exercises grouped by muscle, excluding user's current exercises
  let catalogSummary = null;
  if (catalog && catalog.length > 0) {
    const userNames = new Set();
    for (const w of allWorkouts) {
      for (const ex of w.exercises || []) {
        userNames.add(ex.name.toLowerCase());
      }
    }
    const byMuscle = {};
    for (const entry of catalog) {
      if (userNames.has(entry.name.toLowerCase())) continue;
      if (!entry.muscles?.primary?.length) continue;
      for (const muscle of entry.muscles.primary) {
        if (!byMuscle[muscle]) byMuscle[muscle] = [];
        if (!byMuscle[muscle].includes(entry.name)) {
          byMuscle[muscle].push(entry.name);
        }
      }
    }
    catalogSummary = byMuscle;
  }

  // Build enriched data for the AI
  const enrichedLogSummary = buildEnrichedLogSummary(recentLogs, allWorkouts);
  const weightLabel = measurementSystem === "metric" ? "kg" : "lb";
  const progressionTrends = computeProgressionTrends(recentLogs, allWorkouts, weightLabel);
  const adherence = computeAdherenceStats(state?.logsByDate);
  const previousInsights = loadPreviousInsights();

  // Ensure we have a fresh session token before calling the edge function
  await supabase.auth.getSession();

  // Call Edge Function
  const { data, error } = await supabase.functions.invoke("ai-coach", {
    body: {
      profile: {
        age: profile?.age,
        weight_lbs: profile?.weight_lbs,
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
      catalogSummary,
      equipment: equipment || "gym",
      weightUnit: weightLabel,
      enrichedLogSummary,
      progressionTrends,
      adherence,
      previousInsights,
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
    throw new Error(detail);
  }

  // Normalize each insight so UI never crashes on missing fields
  const insights = (data?.insights || []).map((i) => ({
    ...i,
    type: i.type || "INFO",
    severity: i.severity || "LOW",
    title: i.title || "Insight",
    message: i.message || "",
    suggestions: Array.isArray(i.suggestions) ? i.suggestions : [],
  }));

  // Save to cache
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ fingerprint, insights, timestamp: Date.now() })
    );
  } catch {
    // Ignore storage errors
  }

  // Save insight titles/types for anti-repetition
  savePreviousInsights(insights);

  return { insights, fromCache: false };
}
