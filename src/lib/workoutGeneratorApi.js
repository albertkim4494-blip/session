/**
 * AI-powered workout generation via Supabase Edge Function.
 * Falls back to deterministic generation on failure.
 */

import { supabase } from "./supabase";
import { exerciseFitsEquipment } from "./exerciseCatalog";
import { buildCatalogMap } from "./exerciseCatalogUtils";
import { analyzeMuscleRecency, exerciseCountFromDuration } from "./workoutGenerator";
import { isSetCompleted, dayHasCompletedSets } from "./setHelpers";
import { recordAiEvent } from "./aiMetrics";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let _idCounter = 0;
function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${(++_idCounter).toString(36)}`;
}

/**
 * Build a compact catalog payload filtered by equipment.
 * Strips unnecessary fields to minimise token usage.
 */
function buildCatalogPayload(catalog, equipment) {
  return catalog
    .filter((e) => exerciseFitsEquipment(e, equipment))
    .filter((e) => e.tags && !e.tags.includes("sport") && e.movement !== "stretch") // exclude sport/stretch entries from exercise selection
    .map((e) => ({
      id: e.id,
      name: e.name,
      muscles: (e.muscles?.primary || []).join(", "),
      tags: (e.tags || []).join(", "),
      unit: e.defaultUnit || "reps",
    }));
}

function calculateAge(birthdate) {
  if (!birthdate) return null;
  const born = new Date(`${birthdate}T00:00:00`);
  if (Number.isNaN(born.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - born.getFullYear();
  const m = today.getMonth() - born.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < born.getDate())) age--;
  return age > 0 && age < 120 ? age : null;
}

function buildProfilePayload(profile = {}) {
  const age = profile.age || calculateAge(profile.birthdate);
  return {
    age,
    birthdate: profile.birthdate,
    gender: profile.gender,
    weight_lbs: profile.weight_lbs,
    height_inches: profile.height_inches,
    goal: profile.goal,
    sports: profile.sports,
    about: profile.about,
  };
}

function buildCurrentPlanSummary(state) {
  const workouts = state.program?.workouts || [];
  if (!Array.isArray(workouts) || workouts.length === 0) return "";

  return workouts
    .slice(0, 8)
    .map((w) => {
      const names = (w.exercises || []).map((ex) => ex.name).filter(Boolean).slice(0, 8);
      return `${w.name || "Workout"}: ${names.join(", ") || "no exercises"}`;
    })
    .join("\n");
}

function buildTrainingPatternSummary(state, todayKey) {
  const logs = state.logsByDate || {};
  const today = todayKey ? new Date(`${todayKey}T00:00:00`) : new Date();
  const dates = Object.keys(logs)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse();

  const last28 = [];
  const last7 = [];
  for (const dk of dates) {
    const date = new Date(`${dk}T00:00:00`);
    const daysAgo = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    if (daysAgo >= 0 && daysAgo <= 27 && dayHasCompletedSets(logs[dk])) last28.push(dk);
    if (daysAgo >= 0 && daysAgo <= 6 && dayHasCompletedSets(logs[dk])) last7.push(dk);
  }

  const plannedCount = Array.isArray(state.program?.workouts) ? state.program.workouts.length : 0;
  const dailyCount = Object.values(state.dailyWorkouts || {})
    .reduce((sum, ws) => sum + (Array.isArray(ws) ? ws.length : 0), 0);

  return [
    `Training days last 7 days: ${last7.length}`,
    `Training days last 28 days: ${last28.length}`,
    `Current program workouts: ${plannedCount}`,
    `Generated/ad hoc workouts saved: ${dailyCount}`,
    last7.length >= 5 ? "Recent pattern: high frequency; bias recovery and avoid redundant loading." : "",
    last28.length <= 3 ? "Recent pattern: low consistency; bias approachable sessions and simple wins." : "",
  ].filter(Boolean).join("\n");
}

/**
 * Build a compact training history summary from logsByDate (last 14 days).
 */
function buildHistorySummary(state, catalog, weightLabel = "lb") {
  const catalogMap = buildCatalogMap(catalog);

  // Build exerciseId → name map from program + daily workouts
  const exMap = new Map();
  for (const w of state.program?.workouts || []) {
    for (const ex of w.exercises || []) {
      exMap.set(ex.id, {
        name: ex.name,
        catalogId: ex.catalogId,
        unit: ex.unit || "reps",
      });
    }
  }
  for (const ws of Object.values(state.dailyWorkouts || {})) {
    for (const w of (ws || [])) {
      for (const ex of w.exercises || []) {
        if (!exMap.has(ex.id)) {
          exMap.set(ex.id, {
            name: ex.name,
            catalogId: ex.catalogId,
            unit: ex.unit || "reps",
          });
        }
      }
    }
  }

  const logs = state.logsByDate || {};
  const dateKeys = Object.keys(logs)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse()
    .slice(0, 14);

  const lines = [];
  for (const dateKey of dateKeys) {
    const dayLogs = logs[dateKey];
    if (!dayLogs || typeof dayLogs !== "object") continue;
    for (const [exId, log] of Object.entries(dayLogs)) {
      const info = exMap.get(exId);
      if (!info || !log?.sets || !Array.isArray(log.sets)) continue;

      // Only include completed sets in history summary
      const completedSets = log.sets.filter(isSetCompleted);
      if (completedSets.length === 0) continue;

      const setCount = completedSets.length;
      const totalReps = completedSets.reduce((s, r) => s + (Number(r.reps) || 0), 0);
      const maxWeight = Math.max(
        ...completedSets.map((s) => Number(s.weight) || 0),
        0
      );

      const isSport = info.unit === "min" || info.unit === "hrs";
      const weightStr = maxWeight > 0 ? ` @ ${maxWeight} ${weightLabel}` : "";
      let line = isSport
        ? `${dateKey}: [SPORT] ${info.name} — ${totalReps} ${info.unit}`
        : `${dateKey}: ${info.name} — ${setCount} sets, ${totalReps} ${info.unit}${weightStr}`;

      // Include RPE data if present (from completed sets only)
      const rpes = completedSets.map((s) => Number(s.targetRpe)).filter((v) => v > 0);
      if (rpes.length > 0) {
        const avgRpe = (rpes.reduce((a, b) => a + b, 0) / rpes.length).toFixed(1);
        line += ` (avg RPE ${avgRpe})`;
      }

      // Include mood if present
      const MOOD_LABELS = { "-2": "terrible", "-1": "rough", "0": "okay", "1": "good", "2": "great" };
      if (log.mood != null && MOOD_LABELS[String(log.mood)]) {
        line += ` [mood: ${MOOD_LABELS[String(log.mood)]}]`;
      }

      // Include notes if present
      if (log.notes && typeof log.notes === "string" && log.notes.trim()) {
        line += ` [note: "${log.notes.trim().slice(0, 50)}"]`;
      }

      lines.push(line);
    }
  }

  return lines.join("\n");
}

/**
 * Build muscle recency data: { CHEST: 3, BACK: null, ... }
 * Values are days since last trained, or null if never.
 */
function buildMuscleRecency(state, catalog, todayKey) {
  const recency = analyzeMuscleRecency(state, catalog);
  const today = todayKey ? new Date(todayKey + "T00:00:00") : new Date();
  const result = {};

  for (const [muscle, lastDate] of Object.entries(recency)) {
    if (!lastDate) {
      result[muscle] = null;
    } else {
      const last = new Date(lastDate + "T00:00:00");
      result[muscle] = Math.floor((today - last) / (1000 * 60 * 60 * 24));
    }
  }

  return result;
}

/**
 * Transform AI response exercises into app workout structure.
 * Uses catalog names (not AI names) to prevent typos.
 * Returns { exercises, diagnostics } with drop reasons for observability.
 */
function transformExercises(aiExercises, catalogMap) {
  const diagnostics = { dropped: 0, reasons: [] };
  if (!Array.isArray(aiExercises)) return { exercises: [], diagnostics };

  // Build name→entry lookup for fallback matching
  const nameMap = new Map();
  for (const [, entry] of catalogMap) {
    nameMap.set(entry.name.toLowerCase(), entry);
  }

  const exercises = [];
  const usedIds = new Set();
  for (const e of aiExercises) {
    let entry = null;

    // Try catalogId first
    if (e.catalogId && catalogMap.has(e.catalogId)) {
      entry = catalogMap.get(e.catalogId);
    }

    // Fallback: match by name if catalogId missing or invalid
    if (!entry && e.name) {
      const byName = nameMap.get(e.name.toLowerCase());
      if (byName) {
        diagnostics.reasons.push(`Recovered ${e.name}: bad catalogId "${e.catalogId}", matched by name`);
        entry = byName;
      }
    }

    if (!entry) {
      diagnostics.dropped++;
      diagnostics.reasons.push(`Dropped ${e.name || e.catalogId || "unknown"}: not found in catalog`);
      continue;
    }

    // Skip duplicates
    if (usedIds.has(entry.id)) continue;
    usedIds.add(entry.id);

    exercises.push({
      id: uid("ex"),
      name: entry.name,
      unit: entry.defaultUnit,
      catalogId: entry.id,
      scheme: e.scheme || null,
    });
  }

  return { exercises, diagnostics };
}

/**
 * Build fatigue signals from recent logs: mood trend, RPE averages, today's trained muscles.
 */
function buildFatigueSignals(state, catalog, todayKey) {
  const MOOD_LABELS = { "-2": "terrible", "-1": "rough", "0": "okay", "1": "good", "2": "great" };
  const catalogMap = buildCatalogMap(catalog);
  const logs = state.logsByDate || {};
  const today = todayKey || new Date().toISOString().slice(0, 10);


  // Recent moods (last 7 days)
  const recentDates = Object.keys(logs)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse()
    .slice(0, 7);

  const moods = [];
  const rpes = [];
  for (const dk of recentDates) {
    const dayLogs = logs[dk];
    if (!dayHasCompletedSets(dayLogs)) continue;
    for (const log of Object.values(dayLogs)) {
      if (log.mood != null) moods.push({ date: dk, mood: Number(log.mood), label: MOOD_LABELS[String(log.mood)] || "unknown" });
      if (Array.isArray(log.sets)) {
        for (const s of log.sets) {
          if (isSetCompleted(s) && s.targetRpe && Number(s.targetRpe) > 0) rpes.push(Number(s.targetRpe));
        }
      }
    }
  }

  // Today's already-trained muscles (only exercises with completed sets)
  const todayMuscles = new Set();
  const todayExercises = [];
  const todayLogs = logs[today];
  if (todayLogs && typeof todayLogs === "object") {
    // Build exercise ID map from all workouts
    const exMap = new Map();
    for (const w of state.program?.workouts || []) {
      for (const ex of w.exercises || []) exMap.set(ex.id, ex);
    }
    for (const ws of Object.values(state.dailyWorkouts || {})) {
      for (const w of (ws || [])) {
        for (const ex of w.exercises || []) exMap.set(ex.id, ex);
      }
    }

    for (const [exId, log] of Object.entries(todayLogs)) {
      if (!Array.isArray(log?.sets) || !log.sets.some(isSetCompleted)) continue;
      const ex = exMap.get(exId);
      if (!ex) continue;
      todayExercises.push(ex.name);
      if (ex.catalogId && catalogMap.has(ex.catalogId)) {
        const entry = catalogMap.get(ex.catalogId);
        for (const m of entry.muscles?.primary || []) todayMuscles.add(m);
      }
    }
  }

  // Compute consecutive training days (only days with completed sets)
  let consecutiveDays = 0;
  const d = new Date(today + "T00:00:00");
  for (let i = 1; i <= 7; i++) {
    d.setDate(d.getDate() - 1);
    const dk = d.toISOString().slice(0, 10);
    if (dayHasCompletedSets(logs[dk])) {
      consecutiveDays++;
    } else {
      break;
    }
  }

  return {
    recentMoods: moods.slice(0, 10),
    avgRpe: rpes.length > 0 ? (rpes.reduce((a, b) => a + b, 0) / rpes.length).toFixed(1) : null,
    consecutiveTrainingDays: consecutiveDays,
    todayMusclesAlreadyTrained: [...todayMuscles],
    todayExercisesAlreadyDone: todayExercises,
  };
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

/**
 * Generate a full weekly program using AI.
 * @returns {{ success: true, data: { workouts, scheme } } | { success: false, error: string }}
 */
export async function generateProgramAI({
  goal,
  daysPerWeek,
  equipment,
  duration,
  profile,
  state,
  catalog,
  sportName,
  sportDays,
  measurementSystem,
  checkinContext,
  todayKey,
}) {
  try {
    const appState = state || {};
    const wLabel = measurementSystem === "metric" ? "kg" : "lb";
    const catalogPayload = buildCatalogPayload(catalog, equipment);
    const history = buildHistorySummary(appState, catalog, wLabel);
    const currentPlan = buildCurrentPlanSummary(appState);
    const trainingPattern = buildTrainingPatternSummary(appState, todayKey);
    const catalogMap = buildCatalogMap(catalog);

    const { data, error } = await supabase.functions.invoke(
      "ai-workout-generator",
      {
        body: {
          mode: "program",
          profile: buildProfilePayload(profile),
          equipment,
          catalog: catalogPayload,
          history,
          currentPlan,
          trainingPattern,
          checkinContext: checkinContext || null,
          daysPerWeek,
          duration,
          exerciseCount: exerciseCountFromDuration(duration),
          goal: goal || profile?.goal || "General Fitness",
          sportName: sportName || "",
          sportDays: sportDays || [],
        },
      }
    );

    if (error) throw new Error(error.message || "Edge function error");
    if (data?.error) throw new Error(data.reason ? `${data.error}: ${data.reason}` : data.error);
    if (!Array.isArray(data?.workouts)) throw new Error("Invalid AI response");

    let hasSparseWorkout = false;
    const workouts = data.workouts.map((w) => {
      const { exercises, diagnostics } = transformExercises(w.exercises, catalogMap);
      if (diagnostics.dropped > 0) {
        console.warn(`[AI program] ${w.name}: dropped ${diagnostics.dropped} exercises`, diagnostics.reasons);
      }
      if (exercises.length < 2) hasSparseWorkout = true;
      return {
        id: uid("w"),
        name: w.name || "Workout",
        category: "Workout",
        scheme: w.scheme || "3x10",
        exercises,
      };
    });

    if (hasSparseWorkout) {
      recordAiEvent("ai_empty_workout", "program");
      return { success: false, error: "AI output too sparse after catalog validation" };
    }

    recordAiEvent("ai_success", "program");

    // Use the first lifting day's scheme as the overall scheme
    const scheme =
      workouts.find((w) => w.scheme !== "sport")?.scheme || "3x10";

    return { success: true, data: { workouts, scheme } };
  } catch (err) {
    console.error("AI program generation failed:", err);
    recordAiEvent("ai_fallback_used", "program", { error: err.message });
    return { success: false, error: err.message || "AI generation failed" };
  }
}

/**
 * Generate a single workout for today using AI.
 * @returns {{ success: true, data: workout } | { success: false, error: string }}
 */
export async function generateTodayAI({
  equipment,
  duration,
  profile,
  state,
  catalog,
  todayKey,
  measurementSystem,
  checkinContext,
}) {
  try {
    const appState = state || {};
    const wLabel = measurementSystem === "metric" ? "kg" : "lb";
    const catalogPayload = buildCatalogPayload(catalog, equipment);
    const history = buildHistorySummary(appState, catalog, wLabel);
    const muscleRecency = buildMuscleRecency(appState, catalog, todayKey);
    const fatigue = buildFatigueSignals(appState, catalog, todayKey);
    const currentPlan = buildCurrentPlanSummary(appState);
    const trainingPattern = buildTrainingPatternSummary(appState, todayKey);
    const catalogMap = buildCatalogMap(catalog);

    const { data, error } = await supabase.functions.invoke(
      "ai-workout-generator",
      {
        body: {
          mode: "today",
          profile: buildProfilePayload(profile),
          equipment,
          duration: duration || 60,
          exerciseCount: exerciseCountFromDuration(duration),
          catalog: catalogPayload,
          history,
          currentPlan,
          trainingPattern,
          checkinContext: checkinContext || null,
          muscleRecency,
          fatigue,
        },
      }
    );

    if (error) throw new Error(error.message || "Edge function error");
    if (data?.error) throw new Error(data.reason ? `${data.error}: ${data.reason}` : data.error);
    if (!Array.isArray(data?.exercises)) throw new Error("Invalid AI response");

    const { exercises, diagnostics } = transformExercises(data.exercises, catalogMap);
    if (diagnostics.dropped > 0) {
      console.warn(`[AI today] dropped ${diagnostics.dropped} exercises`, diagnostics.reasons);
    }

    const minRequired = (duration || 60) <= 15 ? 1 : 2;
    if (exercises.length < minRequired) {
      recordAiEvent("ai_empty_workout", "today");
      return { success: false, error: "AI output too sparse after catalog validation" };
    }

    recordAiEvent("ai_success", "today");

    const workout = {
      id: uid("w"),
      name: data.name || "Today's Workout",
      category: "Workout",
      scheme: data.scheme || "3x10",
      targetMuscles: Array.isArray(data.targetMuscles)
        ? data.targetMuscles
        : [],
      note: data.note || null,
      exercises,
    };

    return { success: true, data: workout };
  } catch (err) {
    console.error("AI today generation failed:", err);
    recordAiEvent("ai_fallback_used", "today", { error: err.message });
    return { success: false, error: err.message || "AI generation failed" };
  }
}
