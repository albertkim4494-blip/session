/**
 * AI-powered workout generation via Supabase Edge Function.
 * Falls back to deterministic generation on failure.
 */

import { supabase } from "./supabase";
import { exerciseFitsEquipment } from "./exerciseCatalog";
import { buildCatalogMap } from "./exerciseCatalogUtils";
import { analyzeMuscleRecency } from "./workoutGenerator";

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
    .filter((e) => e.tags && !e.tags.includes("sport")) // exclude sport entries from exercise selection
    .map((e) => ({
      id: e.id,
      name: e.name,
      muscles: (e.muscles?.primary || []).join(", "),
      tags: (e.tags || []).join(", "),
      unit: e.defaultUnit || "reps",
    }));
}

/**
 * Build a compact training history summary from logsByDate (last 14 days).
 */
function buildHistorySummary(state, catalog) {
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

      const setCount = log.sets.length;
      const totalReps = log.sets.reduce((s, r) => s + (Number(r.reps) || 0), 0);
      const maxWeight = Math.max(
        ...log.sets.map((s) => Number(s.weight) || 0),
        0
      );

      const weightStr = maxWeight > 0 ? ` @ ${maxWeight} lbs` : "";
      let line = `${dateKey}: ${info.name} — ${setCount} sets, ${totalReps} ${info.unit}${weightStr}`;

      // Include RPE data if present
      const rpes = log.sets.map((s) => Number(s.targetRpe)).filter((v) => v > 0);
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
 */
function transformExercises(aiExercises, catalogMap) {
  if (!Array.isArray(aiExercises)) return [];

  return aiExercises
    .filter((e) => e.catalogId && catalogMap.has(e.catalogId))
    .map((e) => {
      const entry = catalogMap.get(e.catalogId);
      return {
        id: uid("ex"),
        name: entry.name, // use catalog name, not AI's
        unit: entry.defaultUnit,
        catalogId: e.catalogId,
        scheme: e.scheme || null, // per-exercise scheme from AI
      };
    });
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
    if (!dayLogs || typeof dayLogs !== "object") continue;
    for (const log of Object.values(dayLogs)) {
      if (log.mood != null) moods.push({ date: dk, mood: Number(log.mood), label: MOOD_LABELS[String(log.mood)] || "unknown" });
      if (Array.isArray(log.sets)) {
        for (const s of log.sets) {
          if (s.targetRpe && Number(s.targetRpe) > 0) rpes.push(Number(s.targetRpe));
        }
      }
    }
  }

  // Today's already-trained muscles
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

    for (const exId of Object.keys(todayLogs)) {
      const ex = exMap.get(exId);
      if (!ex) continue;
      todayExercises.push(ex.name);
      if (ex.catalogId && catalogMap.has(ex.catalogId)) {
        const entry = catalogMap.get(ex.catalogId);
        for (const m of entry.muscles?.primary || []) todayMuscles.add(m);
      }
    }
  }

  // Compute consecutive training days
  let consecutiveDays = 0;
  const d = new Date(today + "T00:00:00");
  for (let i = 1; i <= 7; i++) {
    d.setDate(d.getDate() - 1);
    const dk = d.toISOString().slice(0, 10);
    if (logs[dk] && Object.keys(logs[dk]).length > 0) {
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
}) {
  try {
    const catalogPayload = buildCatalogPayload(catalog, equipment);
    const history = buildHistorySummary(state, catalog);
    const catalogMap = buildCatalogMap(catalog);

    const { data, error } = await supabase.functions.invoke(
      "ai-workout-generator",
      {
        body: {
          mode: "program",
          profile: profile || {},
          equipment,
          catalog: catalogPayload,
          history,
          daysPerWeek,
          duration,
          goal: goal || profile?.goal || "General Fitness",
          sportName: sportName || "",
          sportDays: sportDays || [],
        },
      }
    );

    if (error) throw new Error(error.message || "Edge function error");
    if (data?.error) throw new Error(data.error);
    if (!Array.isArray(data?.workouts)) throw new Error("Invalid AI response");

    const workouts = data.workouts.map((w) => ({
      id: uid("w"),
      name: w.name || "Workout",
      category: "Workout",
      scheme: w.scheme || "3x10",
      exercises: transformExercises(w.exercises, catalogMap),
    }));

    // Use the first lifting day's scheme as the overall scheme
    const scheme =
      workouts.find((w) => w.scheme !== "sport")?.scheme || "3x10";

    return { success: true, data: { workouts, scheme } };
  } catch (err) {
    console.error("AI program generation failed:", err);
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
}) {
  try {
    const catalogPayload = buildCatalogPayload(catalog, equipment);
    const history = buildHistorySummary(state, catalog);
    const muscleRecency = buildMuscleRecency(state, catalog, todayKey);
    const fatigue = buildFatigueSignals(state, catalog, todayKey);
    const catalogMap = buildCatalogMap(catalog);

    const { data, error } = await supabase.functions.invoke(
      "ai-workout-generator",
      {
        body: {
          mode: "today",
          profile: profile || {},
          equipment,
          duration: duration || 60,
          catalog: catalogPayload,
          history,
          muscleRecency,
          fatigue,
        },
      }
    );

    if (error) throw new Error(error.message || "Edge function error");
    if (data?.error) throw new Error(data.error);
    if (!Array.isArray(data?.exercises)) throw new Error("Invalid AI response");

    const workout = {
      id: uid("w"),
      name: data.name || "Today's Workout",
      category: "Workout",
      scheme: data.scheme || "3x10",
      targetMuscles: Array.isArray(data.targetMuscles)
        ? data.targetMuscles
        : [],
      note: data.note || null,
      exercises: transformExercises(data.exercises, catalogMap),
    };

    return { success: true, data: workout };
  } catch (err) {
    console.error("AI today generation failed:", err);
    return { success: false, error: err.message || "AI generation failed" };
  }
}
