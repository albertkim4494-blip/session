import { supabase } from "./supabase";
import { getUnitAbbr } from "./coachNormalize";

const CACHE_KEY = "wt_coach_cache";
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

/**
 * Build a fingerprint string from the inputs so we know when to invalidate cache.
 */
function buildFingerprint(dateRange, recentLogs, exerciseCount, goal) {
  const logDates = Object.keys(recentLogs || {}).sort().join(",");
  const logEntryCount = Object.values(recentLogs || {}).reduce(
    (sum, day) => sum + (day ? Object.keys(day).length : 0),
    0
  );
  return `${dateRange.start}|${dateRange.end}|${logDates}|${logEntryCount}|${exerciseCount}|${goal || ""}`;
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
 * Fetch AI coach insights. Uses localStorage cache with 15-min TTL.
 *
 * @param {Object} params
 * @param {Object} params.profile - User profile { age, weight_lbs, goal, about, sports }
 * @param {Object} params.state - App state with program.workouts and logsByDate
 * @param {Object} params.dateRange - { start, end, label }
 * @param {Object} [params.options] - { forceRefresh: boolean }
 * @returns {Promise<{ insights: Array, fromCache: boolean }>}
 */
export async function fetchCoachInsights({ profile, state, dateRange, options, catalog, equipment }) {
  const workouts = state?.program?.workouts || [];
  const recentLogs = filterLogsToRange(state?.logsByDate, dateRange.start, dateRange.end);
  const exerciseCount = workouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);
  const fingerprint = buildFingerprint(dateRange, recentLogs, exerciseCount, profile?.goal);

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

  // Build catalog summary: exercises grouped by muscle, excluding user's current exercises
  let catalogSummary = null;
  if (catalog && catalog.length > 0) {
    const userNames = new Set();
    for (const w of workouts) {
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
      workouts: workouts.map((w) => ({
        name: w.name,
        exercises: (w.exercises || []).map((ex) => ({
          id: ex.id,
          name: ex.name,
          unit: ex.unit || "reps",
          unitAbbr: getUnitAbbr(ex.unit, ex.customUnitAbbr),
        })),
      })),
      recentLogs,
      dateRange: {
        start: dateRange.start,
        end: dateRange.end,
        label: dateRange.label,
      },
      catalogSummary,
      equipment: equipment || "gym",
    },
  });

  if (error) {
    throw new Error(error.message || "Edge function call failed");
  }

  // Normalize each insight so UI never crashes on missing fields
  const insights = (data?.insights || []).map((i) => ({
    type: i.type || "INFO",
    severity: i.severity || "LOW",
    title: i.title || "Insight",
    message: i.message || "",
    suggestions: Array.isArray(i.suggestions) ? i.suggestions : [],
    ...i,
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

  return { insights, fromCache: false };
}
