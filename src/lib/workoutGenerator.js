/**
 * Workout generator — deterministic program and single-workout generation.
 * All exercises come from EXERCISE_CATALOG with catalogId linking.
 */

import { exerciseFitsEquipment } from "./exerciseCatalog.js";

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

export const GOALS = [
  "Build Muscle",
  "Get Stronger",
  "Lose Fat",
  "General Fitness",
  "Sport Performance",
];


const SPLIT_MUSCLES = {
  Push: ["CHEST", "ANTERIOR_DELT", "LATERAL_DELT", "TRICEPS"],
  Pull: ["BACK", "BICEPS", "POSTERIOR_DELT"],
  Legs: ["QUADS", "HAMSTRINGS", "GLUTES", "CALVES"],
  Upper: ["CHEST", "BACK", "ANTERIOR_DELT", "LATERAL_DELT", "TRICEPS", "BICEPS"],
  Lower: ["QUADS", "HAMSTRINGS", "GLUTES", "CALVES"],
  "Full Body": ["CHEST", "BACK", "QUADS", "HAMSTRINGS", "GLUTES", "ANTERIOR_DELT"],
};

const ALL = SPLIT_MUSCLES["Full Body"];

const SPLIT_LAYOUTS = {
  2: [
    { name: "Full Body A", muscles: ALL },
    { name: "Full Body B", muscles: ALL },
  ],
  3: [
    { name: "Push", muscles: SPLIT_MUSCLES.Push },
    { name: "Pull", muscles: SPLIT_MUSCLES.Pull },
    { name: "Legs", muscles: SPLIT_MUSCLES.Legs },
  ],
  4: [
    { name: "Upper A", muscles: SPLIT_MUSCLES.Upper },
    { name: "Lower A", muscles: SPLIT_MUSCLES.Lower },
    { name: "Upper B", muscles: SPLIT_MUSCLES.Upper },
    { name: "Lower B", muscles: SPLIT_MUSCLES.Lower },
  ],
  5: [
    { name: "Push", muscles: SPLIT_MUSCLES.Push },
    { name: "Pull", muscles: SPLIT_MUSCLES.Pull },
    { name: "Legs", muscles: SPLIT_MUSCLES.Legs },
    { name: "Upper", muscles: SPLIT_MUSCLES.Upper },
    { name: "Lower", muscles: SPLIT_MUSCLES.Lower },
  ],
  6: [
    { name: "Push A", muscles: SPLIT_MUSCLES.Push },
    { name: "Pull A", muscles: SPLIT_MUSCLES.Pull },
    { name: "Legs A", muscles: SPLIT_MUSCLES.Legs },
    { name: "Push B", muscles: SPLIT_MUSCLES.Push },
    { name: "Pull B", muscles: SPLIT_MUSCLES.Pull },
    { name: "Legs B", muscles: SPLIT_MUSCLES.Legs },
  ],
};

export const SET_REP_SCHEMES = {
  "Build Muscle":      "4x8-12",
  "Get Stronger":      "4x3-5",
  "Lose Fat":          "3x15-20",
  "General Fitness":   "3x10-12",
  "Sport Performance": "3x6-8",
};

/**
 * Estimate exercise count from workout duration (minutes).
 * Roughly ~6 min per exercise (warm-up sets + working sets + rest).
 */
function exerciseCountFromDuration(duration) {
  const mins = duration || 60;
  const count = Math.round(mins / 7);
  return Math.max(3, Math.min(count, 10));
}

// All muscle keys used across splits
const ALL_MUSCLES = [
  "CHEST", "BACK", "QUADS", "HAMSTRINGS", "GLUTES", "CALVES",
  "ANTERIOR_DELT", "LATERAL_DELT", "POSTERIOR_DELT", "TRICEPS", "BICEPS", "ABS",
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

let _idCounter = 0;
function generateId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${(++_idCounter).toString(36)}`;
}

/** Fisher-Yates shuffle (returns new array) */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick exercises for a workout targeting specific muscle groups.
 */
function pickExercisesForWorkout(muscles, equipment, goal, catalog, duration) {
  const available = catalog.filter((e) => exerciseFitsEquipment(e, equipment));
  const targetCount = exerciseCountFromDuration(duration);

  const picked = [];
  const pickedIds = new Set();

  // Helper: add an exercise if not already picked
  function tryAdd(entry) {
    if (pickedIds.has(entry.id)) return false;
    picked.push(entry);
    pickedIds.add(entry.id);
    return true;
  }

  // Phase 1: Pick one compound per target muscle group
  for (const muscle of muscles) {
    const compounds = shuffle(
      available.filter(
        (e) =>
          e.muscles.primary.includes(muscle) &&
          e.tags.includes("compound") &&
          !pickedIds.has(e.id)
      )
    );
    if (compounds.length > 0) {
      tryAdd(compounds[0]);
    }
  }

  // Phase 2: Fill with isolation exercises for uncovered muscles
  const coveredMuscles = new Set();
  for (const e of picked) {
    for (const m of e.muscles.primary) coveredMuscles.add(m);
  }
  for (const muscle of muscles) {
    if (picked.length >= targetCount) break;
    if (!coveredMuscles.has(muscle)) {
      const isolations = shuffle(
        available.filter(
          (e) =>
            e.muscles.primary.includes(muscle) &&
            !pickedIds.has(e.id)
        )
      );
      if (isolations.length > 0) tryAdd(isolations[0]);
    }
  }

  // Phase 3: Fill remaining slots with shuffled exercises for target muscles
  if (picked.length < targetCount) {
    const remaining = shuffle(
      available.filter(
        (e) =>
          e.muscles.primary.some((m) => muscles.includes(m)) &&
          !pickedIds.has(e.id)
      )
    );
    for (const e of remaining) {
      if (picked.length >= targetCount) break;
      tryAdd(e);
    }
  }

  // Trim if over target
  return picked.slice(0, targetCount);
}

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

/**
 * Get the set/rep scheme string for display.
 */
export function getSetRepScheme(goal) {
  return SET_REP_SCHEMES[goal] || "3x10";
}

/**
 * Parse a scheme string like "3x8-12" or "4x5" into { sets, reps }.
 * `reps` is the first (or only) number after 'x'.
 */
export function parseScheme(scheme) {
  if (!scheme) return null;
  const match = scheme.match(/^(\d+)x(\d+)/);
  if (!match) return null;
  return { sets: Number(match[1]), reps: Number(match[2]) };
}

/**
 * Generate a full weekly program.
 * @returns {{ workouts: Array, scheme: string }}
 */
export function generateProgram({ goal, daysPerWeek, equipment, duration, catalog }) {
  const layout = SPLIT_LAYOUTS[daysPerWeek];
  if (!layout) throw new Error(`Invalid daysPerWeek: ${daysPerWeek}`);

  const scheme = getSetRepScheme(goal);

  const workouts = layout.map((slot) => {
    const exercises = pickExercisesForWorkout(
      slot.muscles,
      equipment,
      goal,
      catalog,
      duration
    );

    return {
      id: generateId("w"),
      name: slot.name,
      category: "Workout",
      scheme,
      exercises: exercises.map((e) => ({
        id: generateId("ex"),
        name: e.name,
        unit: e.defaultUnit,
        catalogId: e.id,
      })),
    };
  });

  return {
    workouts,
    scheme,
  };
}

/**
 * Analyze when each muscle group was last trained, based on logsByDate and catalog.
 * @returns {{ [muscle]: string|null }} — date key or null if never trained
 */
export function analyzeMuscleRecency(state, catalog) {
  const recency = {};
  for (const m of ALL_MUSCLES) recency[m] = null;

  // Build catalogId → entry map
  const catalogById = new Map();
  for (const entry of catalog) catalogById.set(entry.id, entry);

  // Build exerciseId → catalogEntry map from program + daily workouts
  const exerciseMap = new Map();
  for (const w of (state.program?.workouts || [])) {
    for (const ex of (w.exercises || [])) {
      if (ex.catalogId && catalogById.has(ex.catalogId)) {
        exerciseMap.set(ex.id, catalogById.get(ex.catalogId));
      }
    }
  }
  for (const ws of Object.values(state.dailyWorkouts || {})) {
    for (const w of (ws || [])) {
      for (const ex of (w.exercises || [])) {
        if (ex.catalogId && catalogById.has(ex.catalogId)) {
          exerciseMap.set(ex.id, catalogById.get(ex.catalogId));
        }
      }
    }
  }

  // Walk logsByDate (last 14 days)
  const logs = state.logsByDate || {};
  const dateKeys = Object.keys(logs).sort().reverse().slice(0, 14);

  for (const dateKey of dateKeys) {
    const dayLogs = logs[dateKey];
    if (!dayLogs) continue;
    for (const exerciseId of Object.keys(dayLogs)) {
      const entry = exerciseMap.get(exerciseId);
      if (!entry) continue;
      for (const muscle of entry.muscles.primary) {
        if (recency[muscle] === null || dateKey > recency[muscle]) {
          // Actually we want the most recent, and we're iterating newest first,
          // so only set if null (first occurrence = most recent)
          if (recency[muscle] === null) {
            recency[muscle] = dateKey;
          }
        }
      }
    }
  }

  return recency;
}

/**
 * Generate a single workout for today based on muscle recency.
 */
export function generateTodayWorkout({ state, equipment, profile, catalog, todayKey }) {
  const recency = analyzeMuscleRecency(state, catalog);

  // Find muscles not trained in 2+ days (or never trained)
  const stale = [];
  const today = todayKey ? new Date(todayKey + "T00:00:00") : new Date();

  for (const [muscle, lastDate] of Object.entries(recency)) {
    if (!lastDate) {
      stale.push({ muscle, daysAgo: Infinity });
    } else {
      const last = new Date(lastDate + "T00:00:00");
      const daysAgo = Math.floor((today - last) / (1000 * 60 * 60 * 24));
      if (daysAgo >= 2) {
        stale.push({ muscle, daysAgo });
      }
    }
  }

  // Sort by stalest first, pick 2-3 groups
  stale.sort((a, b) => b.daysAgo - a.daysAgo);
  const targetMuscles = stale.slice(0, 3).map((s) => s.muscle);

  // If no stale muscles found, default to full body
  if (targetMuscles.length === 0) {
    targetMuscles.push(...SPLIT_MUSCLES["Full Body"]);
  }

  // Determine a sensible name
  const name = inferWorkoutName(targetMuscles);

  // Pick goal from profile if available, otherwise defaults
  const goal = profile?.goal || "General Fitness";

  const exercises = pickExercisesForWorkout(
    targetMuscles,
    equipment,
    goal,
    catalog,
    60 // default 60 min for today workouts
  );

  // Build a coach note based on why these muscles were chosen
  const muscleLabels = {
    CHEST: "chest", BACK: "back", QUADS: "quads", HAMSTRINGS: "hamstrings",
    GLUTES: "glutes", CALVES: "calves", ANTERIOR_DELT: "shoulders",
    LATERAL_DELT: "shoulders", POSTERIOR_DELT: "rear delts",
    TRICEPS: "triceps", BICEPS: "biceps", ABS: "abs",
  };
  const muscleNames = [...new Set(targetMuscles.map((m) => muscleLabels[m] || m.toLowerCase()))];
  const note = `Targeting ${muscleNames.join(", ")} — these haven't been worked recently.`;

  return {
    id: generateId("w"),
    name,
    category: "Workout",
    scheme: getSetRepScheme(goal),
    targetMuscles,
    note,
    exercises: exercises.map((e) => ({
      id: generateId("ex"),
      name: e.name,
      unit: e.defaultUnit,
      catalogId: e.id,
    })),
  };
}

/**
 * Infer a workout name from target muscle groups.
 */
function inferWorkoutName(muscles) {
  const set = new Set(muscles);

  // Check for common splits
  const isPush = ["CHEST", "ANTERIOR_DELT", "TRICEPS"].every((m) => set.has(m));
  const isPull = ["BACK", "BICEPS"].every((m) => set.has(m));
  const isLegs = ["QUADS", "HAMSTRINGS", "GLUTES"].some((m) => set.has(m)) &&
    !set.has("CHEST") && !set.has("BACK");

  if (isPush && !isPull && !isLegs) return "Push";
  if (isPull && !isPush && !isLegs) return "Pull";
  if (isLegs && !isPush && !isPull) return "Legs";
  if (isPush && isPull) return "Upper Body";
  if (set.size >= 5) return "Full Body";

  // Fallback: list top muscles
  const labels = {
    CHEST: "Chest", BACK: "Back", QUADS: "Quads", HAMSTRINGS: "Hamstrings",
    GLUTES: "Glutes", CALVES: "Calves", ANTERIOR_DELT: "Shoulders",
    LATERAL_DELT: "Shoulders", POSTERIOR_DELT: "Rear Delts",
    TRICEPS: "Triceps", BICEPS: "Biceps", ABS: "Abs",
  };
  const unique = [...new Set(muscles.map((m) => labels[m] || m))];
  return unique.slice(0, 3).join(" & ");
}

// Re-export for tests
export { SPLIT_LAYOUTS };
