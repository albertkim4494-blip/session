/**
 * Mapping layer between granular internal muscle enums and coarse UI-facing
 * muscle group filters.
 *
 * Internal muscles (14): ABS, ANTERIOR_DELT, BACK, BICEPS, CALVES, CHEST,
 *   FOREARMS, GLUTES, HAMSTRINGS, LATERAL_DELT, OBLIQUES, POSTERIOR_DELT,
 *   QUADS, TRICEPS
 *
 * UI groups (6): CORE, SHOULDERS, ARMS, LEGS, CHEST, BACK
 *
 * Usage for filtering:
 *   Import `getUiGroupsForExercise` to tag each catalog entry with its UI
 *   groups, then filter the catalog by checking if the desired UI group is
 *   included. Use `getMusclesForUiGroup` to expand a UI group back to
 *   internal muscles for diagram highlighting.
 */

/** @typedef {"CORE"|"SHOULDERS"|"ARMS"|"LEGS"|"CHEST"|"BACK"} UiMuscleGroup */
/** @typedef {"ABS"|"ANTERIOR_DELT"|"BACK"|"BICEPS"|"CALVES"|"CHEST"|"FOREARMS"|"GLUTES"|"HAMSTRINGS"|"LATERAL_DELT"|"OBLIQUES"|"POSTERIOR_DELT"|"QUADS"|"TRICEPS"} MuscleEnum */

/** @type {UiMuscleGroup[]} */
export const UI_MUSCLE_GROUPS = ["CORE", "SHOULDERS", "ARMS", "LEGS", "CHEST", "BACK"];

/** Granular individual muscles in display order */
export const INDIVIDUAL_MUSCLES = [
  "CHEST", "BACK",
  "ANTERIOR_DELT", "LATERAL_DELT", "POSTERIOR_DELT",
  "BICEPS", "TRICEPS", "FOREARMS",
  "QUADS", "HAMSTRINGS", "GLUTES", "CALVES",
  "ABS", "OBLIQUES",
];

/** Display labels for individual muscles */
export const MUSCLE_LABELS = {
  CHEST: "Chest",
  BACK: "Back",
  ANTERIOR_DELT: "Front Delts",
  LATERAL_DELT: "Side Delts",
  POSTERIOR_DELT: "Rear Delts",
  BICEPS: "Biceps",
  TRICEPS: "Triceps",
  FOREARMS: "Forearms",
  QUADS: "Quads",
  HAMSTRINGS: "Hamstrings",
  GLUTES: "Glutes",
  CALVES: "Calves",
  ABS: "Abs",
  OBLIQUES: "Obliques",
};

/** @type {Record<UiMuscleGroup, { label: string, muscles: MuscleEnum[] }>} */
export const UI_GROUP_CONFIG = {
  CORE:      { label: "Core",      muscles: ["ABS", "OBLIQUES"] },
  SHOULDERS: { label: "Shoulders", muscles: ["ANTERIOR_DELT", "LATERAL_DELT", "POSTERIOR_DELT"] },
  ARMS:      { label: "Arms",      muscles: ["BICEPS", "TRICEPS", "FOREARMS"] },
  LEGS:      { label: "Legs",      muscles: ["QUADS", "HAMSTRINGS", "GLUTES", "CALVES"] },
  CHEST:     { label: "Chest",     muscles: ["CHEST"] },
  BACK:      { label: "Back",      muscles: ["BACK"] },
};

/** @type {Record<MuscleEnum, UiMuscleGroup>} */
const muscleToUiGroup = {};
for (const [group, { muscles }] of Object.entries(UI_GROUP_CONFIG)) {
  for (const muscle of muscles) {
    muscleToUiGroup[muscle] = group;
  }
}
export { muscleToUiGroup };

/**
 * Get the UI group for a single internal muscle enum.
 * @param {MuscleEnum} muscle
 * @returns {UiMuscleGroup|null}
 */
export function getUiGroupForMuscle(muscle) {
  return muscleToUiGroup[muscle] || null;
}

/**
 * Get all internal muscle enums for a UI group.
 * @param {UiMuscleGroup} group
 * @returns {MuscleEnum[]}
 */
export function getMusclesForUiGroup(group) {
  return UI_GROUP_CONFIG[group]?.muscles || [];
}

/**
 * Get unique UI groups for an exercise, in stable display order.
 * @param {MuscleEnum[]} primaryMuscles
 * @param {MuscleEnum[]} [secondaryMuscles]
 * @returns {UiMuscleGroup[]}
 */
export function getUiGroupsForExercise(primaryMuscles, secondaryMuscles) {
  const seen = new Set();
  const result = [];
  for (const m of [...(primaryMuscles || []), ...(secondaryMuscles || [])]) {
    const group = muscleToUiGroup[m];
    if (group && !seen.has(group)) {
      seen.add(group);
      result.push(group);
    }
  }
  // Sort by canonical display order
  result.sort((a, b) => UI_MUSCLE_GROUPS.indexOf(a) - UI_MUSCLE_GROUPS.indexOf(b));
  return result;
}
