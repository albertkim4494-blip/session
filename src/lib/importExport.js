/**
 * Import/Export utilities for workout data.
 * Pure functions — no React, no side effects.
 */

import { parseCSV, toCSV } from "./csvUtils.js";
import { catalogSearch, normalizeQuery } from "./exerciseCatalogUtils.js";

/** Generate a unique ID (inlined to avoid transitive Node.js ESM issues with stateUtils) */
function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

// ============================================================================
// EXPORT
// ============================================================================

/**
 * Convert app state to Strong-compatible CSV.
 * Columns: Date, Workout Name, Exercise Name, Set Order, Weight, Reps, RPE, Notes
 *
 * @param {object} state - full app state
 * @returns {string} CSV text
 */
export function stateToCSV(state) {
  const headers = ["Date", "Workout Name", "Exercise Name", "Set Order", "Weight", "Reps", "Distance", "Seconds", "RPE", "Notes"];

  // Build exerciseId → { name, workoutName, unit } lookup from all workout sources
  const exLookup = new Map();

  for (const wk of (state.program?.workouts || [])) {
    for (const ex of (wk.exercises || [])) {
      exLookup.set(ex.id, { name: ex.name, workoutName: wk.name, unit: ex.unit || "reps" });
    }
  }
  for (const [, dayWorkouts] of Object.entries(state.dailyWorkouts || {})) {
    for (const wk of (Array.isArray(dayWorkouts) ? dayWorkouts : [])) {
      for (const ex of (wk.exercises || [])) {
        exLookup.set(ex.id, { name: ex.name, workoutName: wk.name, unit: ex.unit || "reps" });
      }
    }
  }
  // Also check sessionAdditions
  for (const [, dateAdds] of Object.entries(state.sessionAdditions || {})) {
    for (const [workoutId, exArr] of Object.entries(dateAdds || {})) {
      const wkName = exLookup.get(workoutId)?.workoutName || "Workout";
      for (const ex of (Array.isArray(exArr) ? exArr : [])) {
        exLookup.set(ex.id, { name: ex.name, workoutName: wkName, unit: ex.unit || "reps" });
      }
    }
  }
  // Also check sessionOverrides
  for (const [, overrides] of Object.entries(state.sessionOverrides || {})) {
    for (const [, ex] of Object.entries(overrides || {})) {
      if (ex && ex.id && ex.name) {
        exLookup.set(ex.id, { name: ex.name, workoutName: exLookup.get(ex.id)?.workoutName || "Workout", unit: ex.unit || exLookup.get(ex.id)?.unit || "reps" });
      }
    }
  }

  // Also check customExercises
  for (const ex of (state.customExercises || [])) {
    if (ex.id && !exLookup.has(ex.id)) {
      exLookup.set(ex.id, { name: ex.name, workoutName: "Workout", unit: ex.unit || ex.defaultUnit || "reps" });
    }
  }

  const TIME_UNITS = new Set(["sec", "min", "hrs"]);
  const DISTANCE_UNITS = new Set(["miles", "yards", "laps", "steps", "km", "meters"]);

  const rows = [];
  const dates = Object.keys(state.logsByDate || {})
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse();

  for (const date of dates) {
    const dayLogs = state.logsByDate[date];
    if (!dayLogs || typeof dayLogs !== "object") continue;

    for (const [exerciseId, exLog] of Object.entries(dayLogs)) {
      if (!exLog?.sets || !Array.isArray(exLog.sets)) continue;

      const info = exLookup.get(exerciseId) || { name: exerciseId, workoutName: "Workout", unit: "reps" };
      const notes = exLog.notes || "";
      const isTime = TIME_UNITS.has(info.unit);
      const isDistance = DISTANCE_UNITS.has(info.unit);

      for (let i = 0; i < exLog.sets.length; i++) {
        const s = exLog.sets[i];
        const rawVal = s.reps != null ? String(s.reps) : "";

        // Route the reps field to the correct CSV column based on exercise unit
        let repsVal = "", distVal = "", secVal = "";
        if (isTime) {
          // Convert to seconds for CSV: min→*60, hrs→*3600, sec stays
          if (info.unit === "min" && s.reps != null) secVal = String(s.reps * 60);
          else if (info.unit === "hrs" && s.reps != null) secVal = String(s.reps * 3600);
          else secVal = rawVal;
        } else if (isDistance) {
          distVal = rawVal;
        } else {
          repsVal = rawVal;
        }

        rows.push([
          date,
          info.workoutName,
          info.name,
          String(i + 1),
          s.weight != null ? String(s.weight) : "",
          repsVal,
          distVal,
          secVal,
          s.rpe != null ? String(s.rpe) : "",
          i === 0 ? notes : "", // notes only on first set
        ]);
      }
    }
  }

  return toCSV(headers, rows);
}

// ============================================================================
// IMPORT PARSING
// ============================================================================

/**
 * Auto-detect CSV format from headers.
 * @param {string} csvText
 * @returns {"strong"|"hevy"|"unknown"}
 */
export function detectCSVFormat(csvText) {
  const firstLine = csvText.split(/\r?\n/)[0] || "";
  const lower = firstLine.toLowerCase();

  if (lower.includes("workout name") && lower.includes("exercise name")) return "strong";
  if (lower.includes("exercise_title") && lower.includes("set_index")) return "hevy";
  return "unknown";
}

/**
 * Parse Strong CSV format.
 * Strong headers: Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE
 *
 * @param {string} csvText
 * @returns {{ sessions: Array, errors: string[] }}
 */
export function parseStrongCSV(csvText) {
  const { headers, rows } = parseCSV(csvText);
  const errors = [];

  // Map header names to indices (case-insensitive)
  const idx = {};
  const headerLower = headers.map((h) => h.trim().toLowerCase());
  idx.date = headerLower.indexOf("date");
  idx.workoutName = headerLower.indexOf("workout name");
  idx.exerciseName = headerLower.indexOf("exercise name");
  idx.setOrder = headerLower.indexOf("set order");
  idx.weight = headerLower.indexOf("weight");
  idx.reps = headerLower.indexOf("reps");
  idx.rpe = headerLower.indexOf("rpe");
  idx.notes = headerLower.indexOf("notes");
  idx.workoutNotes = headerLower.indexOf("workout notes");
  idx.duration = headerLower.indexOf("duration");
  idx.distance = headerLower.indexOf("distance");
  idx.seconds = headerLower.indexOf("seconds");

  if (idx.date === -1 || idx.exerciseName === -1) {
    errors.push("Missing required columns: Date and Exercise Name");
    return { sessions: [], errors };
  }

  const get = (row, key) => {
    const i = idx[key];
    if (i === -1 || i >= row.length) return null;
    const v = row[i]?.trim();
    return v === "" ? null : v;
  };

  const toNum = (val) => {
    if (val == null) return null;
    const n = Number(val);
    return isNaN(n) ? null : n;
  };

  // Group by date + workout name → session
  const sessionMap = new Map();

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const rawDate = get(row, "date");
    const exerciseName = get(row, "exerciseName");

    if (!rawDate || !exerciseName) {
      errors.push(`Row ${r + 2}: missing date or exercise name`);
      continue;
    }

    // Parse date — Strong uses various formats, try ISO first
    const date = parseFlexibleDate(rawDate);
    if (!date) {
      errors.push(`Row ${r + 2}: unparseable date "${rawDate}"`);
      continue;
    }

    const workoutName = get(row, "workoutName") || "Workout";
    const sessionKey = `${date}|${workoutName}`;

    if (!sessionMap.has(sessionKey)) {
      sessionMap.set(sessionKey, {
        date,
        workoutName,
        exercises: new Map(),
      });
    }

    const session = sessionMap.get(sessionKey);
    if (!session.exercises.has(exerciseName)) {
      session.exercises.set(exerciseName, { name: exerciseName, sets: [] });
    }

    session.exercises.get(exerciseName).sets.push({
      reps: toNum(get(row, "reps")),
      weight: get(row, "weight"),
      rpe: toNum(get(row, "rpe")),
      notes: get(row, "notes") || "",
      seconds: toNum(get(row, "seconds")),
      distance: toNum(get(row, "distance")),
    });
  }

  // Convert maps to arrays
  const sessions = [];
  for (const s of sessionMap.values()) {
    sessions.push({
      date: s.date,
      workoutName: s.workoutName,
      exercises: Array.from(s.exercises.values()),
    });
  }

  // Sort sessions by date desc
  sessions.sort((a, b) => b.date.localeCompare(a.date));

  return { sessions, errors };
}

/**
 * Parse Hevy CSV format.
 * Hevy headers: title,start_time,end_time,description,exercise_title,superset_id,exercise_notes,set_index,set_type,weight_lbs,reps,distance_miles,duration_sec,rpe
 *
 * @param {string} csvText
 * @returns {{ sessions: Array, errors: string[] }}
 */
export function parseHevyCSV(csvText) {
  const { headers, rows } = parseCSV(csvText);
  const errors = [];

  const idx = {};
  const headerLower = headers.map((h) => h.trim().toLowerCase());
  idx.title = headerLower.indexOf("title");
  idx.startTime = headerLower.indexOf("start_time");
  idx.exerciseTitle = headerLower.indexOf("exercise_title");
  idx.setIndex = headerLower.indexOf("set_index");
  idx.weightLbs = headerLower.indexOf("weight_lbs");
  idx.weightKg = headerLower.indexOf("weight_kg");
  idx.reps = headerLower.indexOf("reps");
  idx.rpe = headerLower.indexOf("rpe");
  idx.exerciseNotes = headerLower.indexOf("exercise_notes");
  idx.setType = headerLower.indexOf("set_type");
  idx.distanceMiles = headerLower.indexOf("distance_miles");
  idx.durationSec = headerLower.findIndex((h) => h === "duration_sec" || h === "duration_seconds");

  if (idx.exerciseTitle === -1) {
    errors.push("Missing required column: exercise_title");
    return { sessions: [], errors };
  }

  const get = (row, key) => {
    const i = idx[key];
    if (i === -1 || i >= row.length) return null;
    const v = row[i]?.trim();
    return v === "" ? null : v;
  };

  const toNum = (val) => {
    if (val == null) return null;
    const n = Number(val);
    return isNaN(n) ? null : n;
  };

  const sessionMap = new Map();

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const exerciseName = get(row, "exerciseTitle");
    if (!exerciseName) {
      errors.push(`Row ${r + 2}: missing exercise_title`);
      continue;
    }

    // Get date from start_time
    const startTime = get(row, "startTime");
    let date;
    if (startTime) {
      date = parseFlexibleDate(startTime);
    }
    if (!date) {
      errors.push(`Row ${r + 2}: missing or unparseable start_time`);
      continue;
    }

    const workoutName = get(row, "title") || "Workout";
    const sessionKey = `${date}|${workoutName}`;

    if (!sessionMap.has(sessionKey)) {
      sessionMap.set(sessionKey, {
        date,
        workoutName,
        exercises: new Map(),
      });
    }

    const session = sessionMap.get(sessionKey);
    if (!session.exercises.has(exerciseName)) {
      session.exercises.set(exerciseName, { name: exerciseName, sets: [] });
    }

    // Hevy uses weight_lbs or weight_kg
    const weight = get(row, "weightLbs") ?? get(row, "weightKg");

    // Hevy distance is in miles, duration in seconds
    const durationSec = toNum(get(row, "durationSec"));
    const distanceMiles = toNum(get(row, "distanceMiles"));

    session.exercises.get(exerciseName).sets.push({
      reps: toNum(get(row, "reps")),
      weight,
      rpe: toNum(get(row, "rpe")),
      notes: get(row, "exerciseNotes") || "",
      seconds: durationSec,
      distance: distanceMiles,
    });
  }

  const sessions = [];
  for (const s of sessionMap.values()) {
    sessions.push({
      date: s.date,
      workoutName: s.workoutName,
      exercises: Array.from(s.exercises.values()),
    });
  }

  sessions.sort((a, b) => b.date.localeCompare(a.date));

  return { sessions, errors };
}

// ============================================================================
// BUILD STATE FROM PARSED SESSIONS
// ============================================================================

/**
 * Convert parsed sessions into app state fragments.
 * Fuzzy-matches exercise names against the catalog for metadata.
 *
 * @param {Array} sessions - from parseStrongCSV or parseHevyCSV
 * @param {Array} catalog - EXERCISE_CATALOG array
 * @returns {{ workouts: Array, logsByDate: object, stats: object }}
 */
export function buildImportState(sessions, catalog) {
  // Build exercise name → catalog entry match cache
  const matchCache = new Map();

  function matchExercise(name) {
    const key = normalizeQuery(name);
    if (matchCache.has(key)) return matchCache.get(key);

    // Try catalog search for best match
    const results = catalog ? catalogSearch(catalog, name, { limit: 1 }) : [];
    let match = null;

    if (results.length > 0) {
      // Verify it's a reasonable match (name contains query words or vice versa)
      const resultNorm = normalizeQuery(results[0].name);
      const queryNorm = normalizeQuery(name);
      const queryWords = queryNorm.split(/\s+/);
      const resultWords = resultNorm.split(/\s+/);

      // Accept if >50% of query words appear in result or vice versa
      const queryInResult = queryWords.filter((w) => resultNorm.includes(w)).length;
      const resultInQuery = resultWords.filter((w) => queryNorm.includes(w)).length;

      if (queryInResult / queryWords.length >= 0.5 || resultInQuery / resultWords.length >= 0.5) {
        match = results[0];
      }
    }

    matchCache.set(key, match);
    return match;
  }

  // Track unique workout names → workout definitions
  const workoutMap = new Map();
  const logsByDate = {};

  for (const session of sessions) {
    const { date, workoutName, exercises } = session;

    // Build or update workout definition
    if (!workoutMap.has(workoutName)) {
      workoutMap.set(workoutName, {
        id: uid("w"),
        name: workoutName,
        category: "Workout",
        exercises: [],
        _exerciseNames: new Set(),
      });
    }
    const workout = workoutMap.get(workoutName);

    // Initialize date logs
    if (!logsByDate[date]) logsByDate[date] = {};

    for (const ex of exercises) {
      const catalogMatch = matchExercise(ex.name);

      // Generate stable exercise ID per workout+name combo
      const exKey = `${workoutName}|${ex.name}`;
      let exerciseId;

      // Infer exercise unit from parsed data
      // If any set has seconds → time-based; if any set has distance → distance-based
      const hasSeconds = ex.sets.some((s) => s.seconds != null && s.seconds > 0);
      const hasDistance = ex.sets.some((s) => s.distance != null && s.distance > 0);
      const hasReps = ex.sets.some((s) => s.reps != null && s.reps > 0);

      let inferredUnit = "reps";
      if (hasSeconds && !hasReps) inferredUnit = "sec";
      else if (hasDistance && !hasReps) inferredUnit = "miles";
      else if (catalogMatch?.defaultUnit === "sec" || catalogMatch?.defaultUnit === "min") inferredUnit = catalogMatch.defaultUnit;

      // Find existing exercise in workout definition
      const existing = workout.exercises.find((e) => e.name === ex.name);
      if (existing) {
        exerciseId = existing.id;
      } else {
        exerciseId = uid("ex");
        const exDef = {
          id: exerciseId,
          name: ex.name,
          unit: inferredUnit,
        };
        if (catalogMatch) {
          exDef.catalogId = catalogMatch.id;
          if (catalogMatch.muscles) exDef.muscles = catalogMatch.muscles;
          if (catalogMatch.equipment) exDef.equipment = catalogMatch.equipment;
          if (catalogMatch.tags) exDef.tags = catalogMatch.tags;
          if (catalogMatch.movement) exDef.movement = catalogMatch.movement;
        }
        workout.exercises.push(exDef);
        workout._exerciseNames.add(ex.name);
      }

      // Build log entry — route seconds/distance into the reps field (how the app stores all units)
      const sets = ex.sets.map((s) => {
        let repsVal = s.reps != null ? s.reps : 0;
        if (inferredUnit === "sec" && s.seconds != null) repsVal = s.seconds;
        else if (inferredUnit === "miles" && s.distance != null) repsVal = s.distance;

        return {
          reps: repsVal,
          weight: s.weight != null ? String(s.weight) : "",
          completed: true, // imported data = completed history
          ...(s.rpe != null ? { rpe: s.rpe } : {}),
        };
      });

      const logEntry = { sets };
      // Collect notes from first set that has them
      const firstNote = ex.sets.find((s) => s.notes)?.notes;
      if (firstNote) logEntry.notes = firstNote;

      logsByDate[date][exerciseId] = logEntry;
    }
  }

  // Clean up internal tracking fields
  const workouts = [];
  for (const w of workoutMap.values()) {
    delete w._exerciseNames;
    workouts.push(w);
  }

  // Compute stats
  const allDates = Object.keys(logsByDate).sort();
  const exerciseNames = new Set();
  for (const w of workouts) {
    for (const ex of w.exercises) exerciseNames.add(ex.name);
  }

  const stats = {
    sessionCount: sessions.length,
    exerciseCount: exerciseNames.size,
    dateRange: allDates.length > 0
      ? { from: allDates[0], to: allDates[allDates.length - 1] }
      : null,
  };

  return { workouts, logsByDate, stats };
}

// ============================================================================
// MERGE
// ============================================================================

/**
 * Non-destructive merge of imported data into current state.
 * - Appends workouts (skips if identical name exists)
 * - Merges logsByDate (imported fills gaps, doesn't overwrite existing)
 *
 * @param {object} currentState
 * @param {{ workouts: Array, logsByDate: object }} importedData
 * @returns {object} merged state (new object, doesn't mutate input)
 */
export function mergeImportedData(currentState, importedData) {
  const next = {
    ...currentState,
    program: {
      ...currentState.program,
      workouts: [...(currentState.program?.workouts || [])],
    },
    logsByDate: { ...(currentState.logsByDate || {}) },
    meta: { ...(currentState.meta ?? {}), updatedAt: Date.now() },
  };

  // Append workouts that don't exist by name
  const existingNames = new Set(next.program.workouts.map((w) => w.name));
  for (const w of importedData.workouts) {
    if (!existingNames.has(w.name)) {
      next.program.workouts.push(w);
      existingNames.add(w.name);
    }
  }

  // Merge logsByDate — imported data fills gaps
  for (const [date, dayLogs] of Object.entries(importedData.logsByDate)) {
    if (!next.logsByDate[date]) {
      next.logsByDate[date] = dayLogs;
    } else {
      // Merge exercise entries — don't overwrite existing
      for (const [exId, exLog] of Object.entries(dayLogs)) {
        if (!next.logsByDate[date][exId]) {
          next.logsByDate[date][exId] = exLog;
        }
      }
    }
  }

  return next;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Parse a date string in various formats to YYYY-MM-DD.
 * Supports: ISO 8601, "YYYY-MM-DD", "MM/DD/YYYY", "DD/MM/YYYY" (heuristic),
 * and datetime strings like "2024-01-15 10:30:00".
 */
function parseFlexibleDate(str) {
  if (!str) return null;

  // Strip time portion if present (keep date part)
  // Handle ISO datetime like "2024-01-15T10:30:00Z" or "2024-01-15 10:30:00"
  const dateOnly = str.split(/[T ]/)[0];

  // Try YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    return dateOnly;
  }

  // Try MM/DD/YYYY or DD/MM/YYYY
  const slashMatch = dateOnly.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (slashMatch) {
    const [, a, b, year] = slashMatch;
    // Heuristic: if a > 12, it's DD/MM/YYYY; otherwise assume MM/DD/YYYY
    let month, day;
    if (Number(a) > 12) {
      day = a;
      month = b;
    } else {
      month = a;
      day = b;
    }
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // Try YYYY/MM/DD
  const ymdSlash = dateOnly.match(/^(\d{4})[/.-](\d{1,2})[/.-](\d{1,2})$/);
  if (ymdSlash) {
    const [, year, month, day] = ymdSlash;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return null;
}
