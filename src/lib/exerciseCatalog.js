/**
 * Exercise catalog — curated list of common exercises with metadata.
 * Each entry has a unique `id`, display name, default unit, muscle targets,
 * equipment, aliases (for search), and optional tags.
 *
 * `defaultUnit` values use the app's existing unit keys from constants.js:
 *   reps, miles, yards, laps, steps, sec, min, hrs
 *
 * `muscles.primary` values use the MUSCLE_GROUPS keys from coachNormalize.js:
 *   ANTERIOR_DELT, LATERAL_DELT, POSTERIOR_DELT, CHEST, TRICEPS,
 *   BACK, BICEPS, FOREARMS, QUADS, HAMSTRINGS, GLUTES, CALVES, ABS, OBLIQUES
 */

export const EQUIPMENT_TIERS = {
  home: new Set(["bodyweight"]),
  basic: new Set(["bodyweight", "dumbbell", "kettlebell", "pull-up bar", "dip bar", "bench", "ab wheel", "jump rope", "foam roller"]),
  gym: null, // no filter — all equipment available
};

export const EQUIPMENT_LABELS = {
  home: "Home (no equipment)",
  basic: "Basic (dumbbells, bench, etc.)",
  gym: "Full Gym",
};

/**
 * Check if an exercise is available for a given equipment tier.
 * An exercise matches if ANY of its equipment is in the tier's set,
 * OR if the exercise has no equipment listed (e.g. cardio/sport).
 */
export function exerciseFitsEquipment(entry, tier) {
  const allowed = EQUIPMENT_TIERS[tier];
  if (!allowed) return true; // gym = no filter
  if (!entry.equipment || entry.equipment.length === 0) return true;
  return entry.equipment.some((e) => allowed.has(e));
}

export const EXERCISE_CATALOG = [
  // ===========================================================================
  // PUSH — Chest
  // ===========================================================================
  { id: "c-bench-flat-bb", name: "Barbell Bench Press", defaultUnit: "reps", muscles: { primary: ["CHEST", "TRICEPS", "ANTERIOR_DELT"] }, equipment: ["barbell", "bench"], aliases: ["flat bench", "bench press"], tags: ["compound", "push"], movement: "push" },
  { id: "c-bench-flat-db", name: "Dumbbell Bench Press", defaultUnit: "reps", muscles: { primary: ["CHEST", "TRICEPS", "ANTERIOR_DELT"] }, equipment: ["dumbbell", "bench"], aliases: ["db bench"], tags: ["compound", "push"], movement: "push" },
  { id: "c-bench-incline-bb", name: "Incline Barbell Bench Press", defaultUnit: "reps", muscles: { primary: ["CHEST", "ANTERIOR_DELT", "TRICEPS"] }, equipment: ["barbell", "bench"], aliases: ["incline bench", "incline press"], tags: ["compound", "push"], movement: "push" },
  { id: "c-bench-incline-db", name: "Incline Dumbbell Bench Press", defaultUnit: "reps", muscles: { primary: ["CHEST", "ANTERIOR_DELT", "TRICEPS"] }, equipment: ["dumbbell", "bench"], aliases: ["incline db bench"], tags: ["compound", "push"], movement: "push" },
  { id: "c-bench-decline-bb", name: "Decline Barbell Bench Press", defaultUnit: "reps", muscles: { primary: ["CHEST", "TRICEPS"] }, equipment: ["barbell", "bench"], aliases: ["decline bench"], tags: ["compound", "push"], movement: "push" },
  { id: "c-bench-decline-db", name: "Decline Dumbbell Bench Press", defaultUnit: "reps", muscles: { primary: ["CHEST", "TRICEPS"] }, equipment: ["dumbbell", "bench"], aliases: ["decline db bench"], tags: ["compound", "push"], movement: "push" },
  { id: "c-fly-flat-db", name: "Dumbbell Fly", defaultUnit: "reps", muscles: { primary: ["CHEST"] }, equipment: ["dumbbell", "bench"], aliases: ["chest fly", "db fly", "dumbbell flye"], tags: ["isolation", "push"], movement: "push" },
  { id: "c-fly-incline-db", name: "Incline Dumbbell Fly", defaultUnit: "reps", muscles: { primary: ["CHEST", "ANTERIOR_DELT"] }, equipment: ["dumbbell", "bench"], aliases: ["incline fly", "incline chest fly"], tags: ["isolation", "push"], movement: "push" },
  { id: "c-fly-cable", name: "Cable Fly", defaultUnit: "reps", muscles: { primary: ["CHEST"] }, equipment: ["cable"], aliases: ["cable crossover", "cable chest fly"], tags: ["isolation", "push"], movement: "push" },
  { id: "c-pushup", name: "Push Ups", defaultUnit: "reps", muscles: { primary: ["CHEST", "TRICEPS", "ANTERIOR_DELT"] }, equipment: ["bodyweight"], aliases: ["pushup", "push-up"], tags: ["compound", "push", "bodyweight"], movement: "push" },
  { id: "c-pushup-diamond", name: "Diamond Push Ups", defaultUnit: "reps", muscles: { primary: ["TRICEPS", "CHEST"] }, equipment: ["bodyweight"], aliases: ["diamond pushup", "close grip push up"], tags: ["compound", "push", "bodyweight"], movement: "push" },
  { id: "c-pushup-incline", name: "Incline Push Ups", defaultUnit: "reps", muscles: { primary: ["CHEST", "TRICEPS"] }, equipment: ["bodyweight"], aliases: ["elevated push up"], tags: ["compound", "push", "bodyweight"], movement: "push" },
  { id: "c-pushup-decline", name: "Decline Push Ups", defaultUnit: "reps", muscles: { primary: ["CHEST", "ANTERIOR_DELT", "TRICEPS"] }, equipment: ["bodyweight"], aliases: ["feet elevated push up"], tags: ["compound", "push", "bodyweight"], movement: "push" },
  { id: "c-pushup-pike", name: "Pike Push Ups", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT", "TRICEPS"] }, equipment: ["bodyweight"], aliases: ["pike pushup"], tags: ["compound", "push", "bodyweight"], movement: "push" },
  { id: "c-dip-chest", name: "Chest Dips", defaultUnit: "reps", muscles: { primary: ["CHEST", "TRICEPS", "ANTERIOR_DELT"] }, equipment: ["bodyweight", "dip bar"], aliases: ["dip", "dips"], tags: ["compound", "push", "bodyweight"], movement: "push" },
  { id: "c-machine-press", name: "Machine Chest Press", defaultUnit: "reps", muscles: { primary: ["CHEST", "TRICEPS"] }, equipment: ["machine"], aliases: ["chest press machine"], tags: ["compound", "push"], movement: "push" },
  { id: "c-pec-deck", name: "Pec Deck", defaultUnit: "reps", muscles: { primary: ["CHEST"] }, equipment: ["machine"], aliases: ["pec fly machine", "machine fly"], tags: ["isolation", "push"], movement: "push" },
  { id: "c-landmine-press", name: "Landmine Press", defaultUnit: "reps", muscles: { primary: ["CHEST", "ANTERIOR_DELT"] }, equipment: ["barbell", "landmine"], aliases: ["landmine chest press"], tags: ["compound", "push"], movement: "push" },
  { id: "c-svend-press", name: "Svend Press", defaultUnit: "reps", muscles: { primary: ["CHEST"] }, equipment: ["dumbbell"], aliases: ["plate squeeze press"], tags: ["isolation", "push"], movement: "push" },
  { id: "c-pullover-db", name: "Dumbbell Pullover", defaultUnit: "reps", muscles: { primary: ["CHEST", "BACK"] }, equipment: ["dumbbell", "bench"], aliases: ["db pullover", "chest pullover"], tags: ["isolation", "push"], movement: "push" },

  // ===========================================================================
  // PULL — Back
  // ===========================================================================
  { id: "b-pullup", name: "Pull Ups", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["bodyweight", "pull-up bar"], aliases: ["pullup", "pull-up"], tags: ["compound", "pull", "bodyweight"], movement: "pull" },
  { id: "b-chinup", name: "Chin Ups", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["bodyweight", "pull-up bar"], aliases: ["chinup", "chin-up"], tags: ["compound", "pull", "bodyweight"], movement: "pull" },
  { id: "b-pullup-wide", name: "Wide Grip Pull Ups", defaultUnit: "reps", muscles: { primary: ["BACK"] }, equipment: ["bodyweight", "pull-up bar"], aliases: ["wide pull up"], tags: ["compound", "pull", "bodyweight"], movement: "pull" },
  { id: "b-pullup-neutral", name: "Neutral Grip Pull Ups", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["bodyweight", "pull-up bar"], aliases: ["hammer grip pull up"], tags: ["compound", "pull", "bodyweight"], movement: "pull" },
  { id: "b-muscle-up", name: "Muscle Up", defaultUnit: "reps", muscles: { primary: ["BACK", "CHEST", "TRICEPS"] }, equipment: ["bodyweight", "pull-up bar"], aliases: ["bar muscle up", "muscle ups"], tags: ["compound", "pull", "bodyweight"], movement: "pull" },
  { id: "b-row-bb", name: "Barbell Row", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["barbell"], aliases: ["bent over row", "bb row", "barbell rows"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-row-pendlay", name: "Pendlay Row", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["barbell"], aliases: ["pendlay rows", "strict row"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-row-db", name: "Dumbbell Row", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["dumbbell"], aliases: ["db row", "one arm row", "single arm row"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-row-cable", name: "Seated Cable Row", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["cable"], aliases: ["cable row", "seated row"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-lat-pulldown", name: "Lat Pulldown", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["cable"], aliases: ["pulldown", "lat pull down", "lat pulldowns"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-lat-pulldown-close", name: "Close Grip Lat Pulldown", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["cable"], aliases: ["close grip pulldown", "v-bar pulldown"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-straight-arm-pulldown", name: "Straight Arm Pulldown", defaultUnit: "reps", muscles: { primary: ["BACK"] }, equipment: ["cable"], aliases: ["straight arm pushdown", "lat pushdown"], tags: ["isolation", "pull"], movement: "pull" },
  { id: "b-deadlift-conv", name: "Deadlift", defaultUnit: "reps", muscles: { primary: ["BACK", "HAMSTRINGS", "GLUTES"] }, equipment: ["barbell"], aliases: ["conventional deadlift", "dead lift"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-deadlift-sumo", name: "Sumo Deadlift", defaultUnit: "reps", muscles: { primary: ["BACK", "QUADS", "GLUTES"] }, equipment: ["barbell"], aliases: ["sumo dead lift"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-deadlift-trap", name: "Trap Bar Deadlift", defaultUnit: "reps", muscles: { primary: ["BACK", "QUADS", "GLUTES"] }, equipment: ["barbell"], aliases: ["hex bar deadlift"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-tbar-row", name: "T-Bar Row", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["barbell", "landmine"], aliases: ["t bar row", "landmine row"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-face-pull", name: "Face Pulls", defaultUnit: "reps", muscles: { primary: ["POSTERIOR_DELT", "BACK"] }, equipment: ["cable"], aliases: ["face pull", "cable face pull"], tags: ["isolation", "pull"], movement: "pull" },
  { id: "b-reverse-fly-db", name: "Reverse Dumbbell Fly", defaultUnit: "reps", muscles: { primary: ["POSTERIOR_DELT"] }, equipment: ["dumbbell"], aliases: ["reverse flye", "rear delt fly"], tags: ["isolation", "pull"], movement: "pull" },
  { id: "b-reverse-fly-cable", name: "Reverse Cable Fly", defaultUnit: "reps", muscles: { primary: ["POSTERIOR_DELT"] }, equipment: ["cable"], aliases: ["cable rear delt fly", "reverse cable flye"], tags: ["isolation", "pull"], movement: "pull" },
  { id: "b-machine-row", name: "Machine Row", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["machine"], aliases: ["chest supported row"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-hyperextension", name: "Hyperextension", defaultUnit: "reps", muscles: { primary: ["BACK", "GLUTES", "HAMSTRINGS"] }, equipment: ["bodyweight"], aliases: ["back extension", "roman chair"], tags: ["isolation", "pull", "bodyweight"], movement: "pull" },
  { id: "b-superman", name: "Superman", defaultUnit: "reps", muscles: { primary: ["BACK", "GLUTES", "HAMSTRINGS"] }, equipment: ["bodyweight"], aliases: ["back raise", "superman hold"], tags: ["isolation", "pull", "bodyweight"], movement: "pull" },
  { id: "b-rack-pull", name: "Rack Pull", defaultUnit: "reps", muscles: { primary: ["BACK", "GLUTES"] }, equipment: ["barbell", "squat rack"], aliases: ["rack pulls", "block pull"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-meadows-row", name: "Meadows Row", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["barbell", "landmine"], aliases: ["landmine meadows row"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-single-arm-pulldown", name: "Single Arm Lat Pulldown", defaultUnit: "reps", muscles: { primary: ["BACK"] }, equipment: ["cable"], aliases: ["one arm pulldown"], tags: ["isolation", "pull"], movement: "pull" },
  { id: "b-band-pull-apart", name: "Band Pull Apart", defaultUnit: "reps", muscles: { primary: ["POSTERIOR_DELT", "BACK"] }, equipment: ["bodyweight"], aliases: ["resistance band pull apart"], tags: ["isolation", "pull", "bodyweight"], movement: "pull" },
  { id: "b-inverted-row", name: "Inverted Row", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["bodyweight"], aliases: ["body row", "australian pull up"], tags: ["compound", "pull", "bodyweight"], movement: "pull" },
  { id: "b-rope-climb", name: "Rope Climb", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS", "FOREARMS"] }, equipment: ["bodyweight"], aliases: ["climbing rope"], tags: ["compound", "pull", "bodyweight"], movement: "pull" },

  // ===========================================================================
  // LEGS — Quads
  // ===========================================================================
  { id: "l-squat-bb", name: "Barbell Squat", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["barbell", "squat rack"], aliases: ["back squat", "squat", "barbell back squat"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-squat-front", name: "Front Squat", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES", "ABS"] }, equipment: ["barbell", "squat rack"], aliases: ["front squat"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-squat-goblet", name: "Goblet Squat", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["dumbbell", "kettlebell"], aliases: ["goblet squat"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-squat-overhead", name: "Overhead Squat", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES", "ANTERIOR_DELT", "ABS"] }, equipment: ["barbell"], aliases: ["oh squat"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-squat-zercher", name: "Zercher Squat", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES", "ABS"] }, equipment: ["barbell"], aliases: ["zercher"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-squat-bodyweight", name: "Bodyweight Squat", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["bodyweight"], aliases: ["air squat", "bw squat"], tags: ["compound", "legs", "bodyweight"], movement: "legs" },
  { id: "l-squat-pistol", name: "Pistol Squat", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["bodyweight"], aliases: ["single leg squat"], tags: ["compound", "legs", "bodyweight"], movement: "legs" },
  { id: "l-squat-sissy", name: "Sissy Squat", defaultUnit: "reps", muscles: { primary: ["QUADS"] }, equipment: ["bodyweight"], aliases: ["sissy squat"], tags: ["isolation", "legs", "bodyweight"], movement: "legs" },
  { id: "l-leg-press", name: "Leg Press", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["machine"], aliases: ["machine leg press"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-lunge-db", name: "Dumbbell Lunges", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["dumbbell"], aliases: ["lunge", "lunges", "walking lunge"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-lunge-bb", name: "Barbell Lunges", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["barbell"], aliases: ["bb lunge", "barbell lunge"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-lunge-reverse", name: "Reverse Lunges", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["bodyweight", "dumbbell"], aliases: ["reverse lunge", "step back lunge"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-lunge-walking", name: "Walking Lunges", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["bodyweight", "dumbbell"], aliases: ["walk lunge"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-lunge-curtsy", name: "Curtsy Lunges", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["bodyweight", "dumbbell"], aliases: ["curtsy lunge", "crossover lunge"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-leg-ext", name: "Leg Extension", defaultUnit: "reps", muscles: { primary: ["QUADS"] }, equipment: ["machine"], aliases: ["leg extensions", "quad extension"], tags: ["isolation", "legs"], movement: "legs" },
  { id: "l-bulgarian", name: "Bulgarian Split Squat", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["dumbbell", "bench"], aliases: ["bss", "split squat"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-hack-squat", name: "Hack Squat", defaultUnit: "reps", muscles: { primary: ["QUADS"] }, equipment: ["machine"], aliases: ["hack squat machine"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-step-up", name: "Step Ups", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["dumbbell", "bench"], aliases: ["step up", "box step up"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-belt-squat", name: "Belt Squat", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["machine"], aliases: ["belt squat machine"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-wall-sit", name: "Wall Sit", defaultUnit: "sec", muscles: { primary: ["QUADS"] }, equipment: ["bodyweight"], aliases: ["wall squat hold", "wall sit hold"], tags: ["isometric", "legs", "bodyweight"], movement: "legs" },
  { id: "l-box-jump", name: "Box Jump", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES", "CALVES"] }, equipment: ["bodyweight"], aliases: ["box jumps", "plyometric jump"], tags: ["compound", "legs", "bodyweight"], movement: "legs" },
  { id: "l-broad-jump", name: "Broad Jump", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["bodyweight"], aliases: ["standing long jump"], tags: ["compound", "legs", "bodyweight"], movement: "legs" },
  { id: "l-hip-abduction", name: "Hip Abduction", defaultUnit: "reps", muscles: { primary: ["GLUTES"] }, equipment: ["machine"], aliases: ["abductor machine", "hip abductor"], tags: ["isolation", "legs"], movement: "legs" },
  { id: "l-hip-adduction", name: "Hip Adduction", defaultUnit: "reps", muscles: { primary: ["QUADS"] }, equipment: ["machine"], aliases: ["adductor machine", "hip adductor", "inner thigh"], tags: ["isolation", "legs"], movement: "legs" },

  // ===========================================================================
  // LEGS — Posterior chain (hamstrings / glutes)
  // ===========================================================================
  { id: "p-rdl-bb", name: "Romanian Deadlift", defaultUnit: "reps", muscles: { primary: ["HAMSTRINGS", "GLUTES"] }, equipment: ["barbell"], aliases: ["rdl", "stiff leg deadlift", "romanian deadlifts"], tags: ["compound", "legs"], movement: "legs" },
  { id: "p-rdl-db", name: "Dumbbell Romanian Deadlift", defaultUnit: "reps", muscles: { primary: ["HAMSTRINGS", "GLUTES"] }, equipment: ["dumbbell"], aliases: ["db rdl", "dumbbell rdl"], tags: ["compound", "legs"], movement: "legs" },
  { id: "p-rdl-single", name: "Single Leg Romanian Deadlift", defaultUnit: "reps", muscles: { primary: ["HAMSTRINGS", "GLUTES"] }, equipment: ["dumbbell"], aliases: ["single leg rdl", "one leg rdl"], tags: ["compound", "legs"], movement: "legs" },
  { id: "p-leg-curl", name: "Leg Curl", defaultUnit: "reps", muscles: { primary: ["HAMSTRINGS"] }, equipment: ["machine"], aliases: ["hamstring curl", "lying leg curl", "seated leg curl", "leg curls"], tags: ["isolation", "legs"], movement: "legs" },
  { id: "p-nordic-curl", name: "Nordic Curl", defaultUnit: "reps", muscles: { primary: ["HAMSTRINGS"] }, equipment: ["bodyweight"], aliases: ["nordic hamstring curl", "russian curl"], tags: ["isolation", "legs", "bodyweight"], movement: "legs" },
  { id: "p-hip-thrust", name: "Hip Thrust", defaultUnit: "reps", muscles: { primary: ["GLUTES", "HAMSTRINGS"] }, equipment: ["barbell", "bench"], aliases: ["barbell hip thrust", "glute bridge"], tags: ["compound", "legs"], movement: "legs" },
  { id: "p-glute-bridge", name: "Glute Bridge", defaultUnit: "reps", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["bridge", "bodyweight glute bridge"], tags: ["isolation", "legs", "bodyweight"], movement: "legs" },
  { id: "p-glute-kickback", name: "Glute Kickback", defaultUnit: "reps", muscles: { primary: ["GLUTES"] }, equipment: ["cable", "machine"], aliases: ["cable kickback", "donkey kick machine"], tags: ["isolation", "legs"], movement: "legs" },
  { id: "p-donkey-kick", name: "Donkey Kick", defaultUnit: "reps", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["donkey kicks", "glute donkey kick"], tags: ["isolation", "legs", "bodyweight"], movement: "legs" },
  { id: "p-fire-hydrant", name: "Fire Hydrant", defaultUnit: "reps", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["fire hydrants", "hip abduction"], tags: ["isolation", "legs", "bodyweight"], movement: "legs" },
  { id: "p-clamshell", name: "Clamshell", defaultUnit: "reps", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["clamshells", "banded clamshell"], tags: ["isolation", "legs", "bodyweight"], movement: "legs" },
  { id: "p-good-morning", name: "Good Morning", defaultUnit: "reps", muscles: { primary: ["HAMSTRINGS", "BACK", "GLUTES"] }, equipment: ["barbell"], aliases: ["good mornings"], tags: ["compound", "legs"], movement: "legs" },
  { id: "p-calf-raise-stand", name: "Standing Calf Raise", defaultUnit: "reps", muscles: { primary: ["CALVES"] }, equipment: ["machine"], aliases: ["calf raise", "calf raises"], tags: ["isolation", "legs"], movement: "legs" },
  { id: "p-calf-raise-seat", name: "Seated Calf Raise", defaultUnit: "reps", muscles: { primary: ["CALVES"] }, equipment: ["machine"], aliases: ["seated calf", "seated calf raises"], tags: ["isolation", "legs"], movement: "legs" },
  { id: "p-calf-raise-bw", name: "Bodyweight Calf Raise", defaultUnit: "reps", muscles: { primary: ["CALVES"] }, equipment: ["bodyweight"], aliases: ["bw calf raise", "calf raise bodyweight"], tags: ["isolation", "legs", "bodyweight"], movement: "legs" },
  { id: "p-calf-raise-single", name: "Single Leg Calf Raise", defaultUnit: "reps", muscles: { primary: ["CALVES"] }, equipment: ["bodyweight"], aliases: ["one leg calf raise", "unilateral calf raise"], tags: ["isolation", "legs", "bodyweight"], movement: "legs" },

  // ===========================================================================
  // SHOULDERS
  // ===========================================================================
  { id: "s-ohp-bb", name: "Overhead Press", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT", "TRICEPS"] }, equipment: ["barbell"], aliases: ["ohp", "military press", "barbell overhead press", "shoulder press"], tags: ["compound", "push"], movement: "shoulders" },
  { id: "s-ohp-db", name: "Dumbbell Shoulder Press", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT", "TRICEPS"] }, equipment: ["dumbbell"], aliases: ["db shoulder press", "db ohp", "seated shoulder press"], tags: ["compound", "push"], movement: "shoulders" },
  { id: "s-arnold-press", name: "Arnold Press", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT", "LATERAL_DELT", "TRICEPS"] }, equipment: ["dumbbell"], aliases: ["arnold dumbbell press"], tags: ["compound", "push"], movement: "shoulders" },
  { id: "s-push-press", name: "Push Press", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT", "TRICEPS"] }, equipment: ["barbell"], aliases: ["push press barbell"], tags: ["compound", "push"], movement: "shoulders" },
  { id: "s-machine-press", name: "Machine Shoulder Press", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT", "TRICEPS"] }, equipment: ["machine"], aliases: ["shoulder press machine"], tags: ["compound", "push"], movement: "shoulders" },
  { id: "s-lateral-raise", name: "Lateral Raise", defaultUnit: "reps", muscles: { primary: ["LATERAL_DELT"] }, equipment: ["dumbbell"], aliases: ["side raise", "lateral raises", "db lateral raise"], tags: ["isolation", "push"], movement: "shoulders" },
  { id: "s-lateral-raise-cable", name: "Cable Lateral Raise", defaultUnit: "reps", muscles: { primary: ["LATERAL_DELT"] }, equipment: ["cable"], aliases: ["cable side raise"], tags: ["isolation", "push"], movement: "shoulders" },
  { id: "s-front-raise", name: "Front Raise", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT"] }, equipment: ["dumbbell"], aliases: ["front delt raise", "db front raise"], tags: ["isolation", "push"], movement: "shoulders" },
  { id: "s-front-raise-plate", name: "Plate Front Raise", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT"] }, equipment: ["bodyweight"], aliases: ["plate raise", "weight plate raise"], tags: ["isolation", "push"], movement: "shoulders" },
  { id: "s-upright-row", name: "Upright Row", defaultUnit: "reps", muscles: { primary: ["LATERAL_DELT", "ANTERIOR_DELT"] }, equipment: ["barbell", "dumbbell"], aliases: ["upright rows"], tags: ["compound", "pull"], movement: "shoulders" },
  { id: "s-shrug-bb", name: "Barbell Shrug", defaultUnit: "reps", muscles: { primary: ["BACK"] }, equipment: ["barbell"], aliases: ["shrugs", "barbell shrugs", "bb shrug"], tags: ["isolation", "pull"], movement: "shoulders" },
  { id: "s-shrug-db", name: "Dumbbell Shrug", defaultUnit: "reps", muscles: { primary: ["BACK"] }, equipment: ["dumbbell"], aliases: ["db shrug", "dumbbell shrugs"], tags: ["isolation", "pull"], movement: "shoulders" },
  { id: "s-lu-raise", name: "Lu Raise", defaultUnit: "reps", muscles: { primary: ["LATERAL_DELT", "ANTERIOR_DELT"] }, equipment: ["dumbbell"], aliases: ["lu xiaojun raise", "Y raise standing"], tags: ["isolation", "push"], movement: "shoulders" },
  { id: "s-reverse-pec-deck", name: "Reverse Pec Deck", defaultUnit: "reps", muscles: { primary: ["POSTERIOR_DELT"] }, equipment: ["machine"], aliases: ["machine reverse fly", "rear delt machine"], tags: ["isolation", "pull"], movement: "shoulders" },

  // ===========================================================================
  // ARMS — Biceps
  // ===========================================================================
  { id: "a-curl-bb", name: "Barbell Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS"] }, equipment: ["barbell"], aliases: ["bicep curl", "barbell curls", "bb curl"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-curl-db", name: "Dumbbell Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS"] }, equipment: ["dumbbell"], aliases: ["bicep curl", "db curl", "dumbbell curls"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-hammer-curl", name: "Hammer Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS", "FOREARMS"] }, equipment: ["dumbbell"], aliases: ["hammer curls", "db hammer curl"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-preacher-curl", name: "Preacher Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS"] }, equipment: ["barbell", "dumbbell"], aliases: ["preacher curls", "ez bar curl"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-incline-curl", name: "Incline Dumbbell Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS"] }, equipment: ["dumbbell", "bench"], aliases: ["incline curl", "incline curls"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-cable-curl", name: "Cable Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS"] }, equipment: ["cable"], aliases: ["cable bicep curl"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-conc-curl", name: "Concentration Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS"] }, equipment: ["dumbbell"], aliases: ["concentration curls"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-spider-curl", name: "Spider Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS"] }, equipment: ["dumbbell", "bench"], aliases: ["spider curls", "prone curl"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-reverse-curl", name: "Reverse Curl", defaultUnit: "reps", muscles: { primary: ["FOREARMS", "BICEPS"] }, equipment: ["barbell", "dumbbell"], aliases: ["reverse curls", "reverse grip curl"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-zottman-curl", name: "Zottman Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS", "FOREARMS"] }, equipment: ["dumbbell"], aliases: ["zottman curls"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-curl-21s", name: "21s Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS"] }, equipment: ["barbell", "dumbbell"], aliases: ["21s", "21 curls"], tags: ["isolation", "pull"], movement: "arms" },

  // ===========================================================================
  // ARMS — Triceps
  // ===========================================================================
  { id: "a-tri-pushdown", name: "Tricep Pushdown", defaultUnit: "reps", muscles: { primary: ["TRICEPS"] }, equipment: ["cable"], aliases: ["cable pushdown", "rope pushdown", "tricep pushdowns"], tags: ["isolation", "push"], movement: "arms" },
  { id: "a-tri-overhead", name: "Overhead Tricep Extension", defaultUnit: "reps", muscles: { primary: ["TRICEPS"] }, equipment: ["dumbbell", "cable"], aliases: ["tricep extension", "overhead extension", "skull crusher"], tags: ["isolation", "push"], movement: "arms" },
  { id: "a-tri-skullcrusher", name: "Skullcrusher", defaultUnit: "reps", muscles: { primary: ["TRICEPS"] }, equipment: ["barbell", "dumbbell"], aliases: ["skull crusher", "lying tricep extension", "skullcrushers"], tags: ["isolation", "push"], movement: "arms" },
  { id: "a-tri-kickback", name: "Tricep Kickback", defaultUnit: "reps", muscles: { primary: ["TRICEPS"] }, equipment: ["dumbbell"], aliases: ["kickback", "db kickback", "tricep kickbacks"], tags: ["isolation", "push"], movement: "arms" },
  { id: "a-close-grip-bench", name: "Close Grip Bench Press", defaultUnit: "reps", muscles: { primary: ["TRICEPS", "CHEST"] }, equipment: ["barbell", "bench"], aliases: ["close grip bench", "cgbp"], tags: ["compound", "push"], movement: "arms" },
  { id: "a-dip-tricep", name: "Tricep Dips", defaultUnit: "reps", muscles: { primary: ["TRICEPS", "CHEST"] }, equipment: ["bodyweight", "dip bar"], aliases: ["tricep dip", "bench dip"], tags: ["compound", "push", "bodyweight"], movement: "arms" },
  { id: "a-tri-cable-overhead", name: "Cable Overhead Tricep Extension", defaultUnit: "reps", muscles: { primary: ["TRICEPS"] }, equipment: ["cable"], aliases: ["cable overhead extension", "rope overhead"], tags: ["isolation", "push"], movement: "arms" },
  { id: "a-dip-machine", name: "Dip Machine", defaultUnit: "reps", muscles: { primary: ["TRICEPS", "CHEST"] }, equipment: ["machine"], aliases: ["assisted dip machine", "machine dip"], tags: ["compound", "push"], movement: "arms" },
  { id: "a-wrist-curl", name: "Wrist Curl", defaultUnit: "reps", muscles: { primary: ["FOREARMS"] }, equipment: ["dumbbell", "barbell"], aliases: ["wrist curls", "forearm curl"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-reverse-wrist-curl", name: "Reverse Wrist Curl", defaultUnit: "reps", muscles: { primary: ["FOREARMS"] }, equipment: ["dumbbell", "barbell"], aliases: ["wrist extension", "forearm extension"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-farmers-carry", name: "Farmer's Carry", defaultUnit: "sec", muscles: { primary: ["FOREARMS", "BACK", "ABS"] }, equipment: ["dumbbell", "kettlebell"], aliases: ["farmer walk", "farmers walk", "loaded carry"], tags: ["compound", "pull"], movement: "arms" },

  // ===========================================================================
  // CORE
  // ===========================================================================
  { id: "x-plank", name: "Plank", defaultUnit: "sec", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["front plank", "elbow plank"], tags: ["isometric", "core", "bodyweight"], movement: "core" },
  { id: "x-side-plank", name: "Side Plank", defaultUnit: "sec", muscles: { primary: ["OBLIQUES", "ABS"] }, equipment: ["bodyweight"], aliases: ["lateral plank"], tags: ["isometric", "core", "bodyweight"], movement: "core" },
  { id: "x-crunch", name: "Crunches", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["crunch", "ab crunch"], tags: ["isolation", "core", "bodyweight"], movement: "core" },
  { id: "x-situp", name: "Sit Ups", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["sit up", "situp"], tags: ["isolation", "core", "bodyweight"], movement: "core" },
  { id: "x-leg-raise", name: "Leg Raise", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["lying leg raise", "hanging leg raise", "leg raises"], tags: ["isolation", "core", "bodyweight"], movement: "core" },
  { id: "x-hanging-leg-raise", name: "Hanging Leg Raise", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["pull-up bar"], aliases: ["hanging knee raise"], tags: ["isolation", "core"], movement: "core" },
  { id: "x-russian-twist", name: "Russian Twist", defaultUnit: "reps", muscles: { primary: ["OBLIQUES", "ABS"] }, equipment: ["bodyweight", "dumbbell"], aliases: ["russian twists", "oblique twist"], tags: ["isolation", "core"], movement: "core" },
  { id: "x-ab-wheel", name: "Ab Wheel Rollout", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["ab wheel"], aliases: ["ab roller", "rollout"], tags: ["isolation", "core"], movement: "core" },
  { id: "x-cable-crunch", name: "Cable Crunch", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["cable"], aliases: ["cable crunches", "kneeling cable crunch"], tags: ["isolation", "core"], movement: "core" },
  { id: "x-dead-bug", name: "Dead Bug", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["dead bugs"], tags: ["isolation", "core", "bodyweight"], movement: "core" },
  { id: "x-mountain-climber", name: "Mountain Climbers", defaultUnit: "reps", muscles: { primary: ["ABS", "QUADS", "ANTERIOR_DELT"] }, equipment: ["bodyweight"], aliases: ["mountain climber", "running plank"], tags: ["cardio", "core", "bodyweight"], movement: "core" },
  { id: "x-bicycle-crunch", name: "Bicycle Crunch", defaultUnit: "reps", muscles: { primary: ["ABS", "OBLIQUES"] }, equipment: ["bodyweight"], aliases: ["bicycle crunches", "cross body crunch"], tags: ["isolation", "core", "bodyweight"], movement: "core" },
  { id: "x-v-up", name: "V-Up", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["v ups", "jackknife sit up"], tags: ["isolation", "core", "bodyweight"], movement: "core" },
  { id: "x-flutter-kick", name: "Flutter Kicks", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["flutter kick", "scissor kicks"], tags: ["isolation", "core", "bodyweight"], movement: "core" },
  { id: "x-hollow-hold", name: "Hollow Body Hold", defaultUnit: "sec", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["hollow hold", "hollow body"], tags: ["isometric", "core", "bodyweight"], movement: "core" },
  { id: "x-bird-dog", name: "Bird Dog", defaultUnit: "reps", muscles: { primary: ["ABS", "BACK"] }, equipment: ["bodyweight"], aliases: ["bird dogs", "quadruped"], tags: ["isolation", "core", "bodyweight"], movement: "core" },
  { id: "x-pallof-press", name: "Pallof Press", defaultUnit: "reps", muscles: { primary: ["ABS", "OBLIQUES"] }, equipment: ["cable"], aliases: ["anti rotation press", "pallof"], tags: ["isolation", "core"], movement: "core" },
  { id: "x-woodchop", name: "Cable Woodchop", defaultUnit: "reps", muscles: { primary: ["OBLIQUES", "ABS"] }, equipment: ["cable"], aliases: ["woodchop", "wood chop", "cable chop"], tags: ["isolation", "core"], movement: "core" },
  { id: "x-toe-touch", name: "Toe Touch Crunch", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["toe touches", "straight leg crunch"], tags: ["isolation", "core", "bodyweight"], movement: "core" },
  { id: "x-heel-tap", name: "Heel Taps", defaultUnit: "reps", muscles: { primary: ["OBLIQUES", "ABS"] }, equipment: ["bodyweight"], aliases: ["heel touches", "oblique heel tap"], tags: ["isolation", "core", "bodyweight"], movement: "core" },
  { id: "x-dragon-flag", name: "Dragon Flag", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["bodyweight", "bench"], aliases: ["dragon flags"], tags: ["isolation", "core", "bodyweight"], movement: "core" },
  { id: "x-copenhagen-plank", name: "Copenhagen Plank", defaultUnit: "sec", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["copenhagen", "adductor plank"], tags: ["isometric", "core", "bodyweight"], movement: "core" },
  { id: "x-l-sit", name: "L-Sit", defaultUnit: "sec", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["l sit hold", "parallette l-sit"], tags: ["isometric", "core", "bodyweight"], movement: "core" },
  { id: "x-hanging-windshield", name: "Hanging Windshield Wipers", defaultUnit: "reps", muscles: { primary: ["OBLIQUES", "ABS"] }, equipment: ["pull-up bar"], aliases: ["windshield wipers", "hanging wipers"], tags: ["isolation", "core"], movement: "core" },

  // ===========================================================================
  // OLYMPIC LIFTS
  // ===========================================================================
  { id: "o-clean", name: "Clean", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES", "BACK"] }, equipment: ["barbell"], aliases: ["power clean", "squat clean"], tags: ["compound", "olympic"], movement: "legs" },
  { id: "o-clean-hang", name: "Hang Clean", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES", "BACK"] }, equipment: ["barbell"], aliases: ["hang power clean"], tags: ["compound", "olympic"], movement: "legs" },
  { id: "o-snatch", name: "Snatch", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES", "BACK", "ANTERIOR_DELT"] }, equipment: ["barbell"], aliases: ["power snatch", "squat snatch"], tags: ["compound", "olympic"], movement: "legs" },
  { id: "o-clean-jerk", name: "Clean and Jerk", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES", "BACK", "ANTERIOR_DELT", "TRICEPS"] }, equipment: ["barbell"], aliases: ["clean & jerk", "c&j"], tags: ["compound", "olympic"], movement: "legs" },
  { id: "o-thruster", name: "Thruster", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES", "ANTERIOR_DELT", "TRICEPS"] }, equipment: ["barbell", "dumbbell"], aliases: ["thrusters", "squat to press"], tags: ["compound", "olympic"], movement: "legs" },
  { id: "o-push-jerk", name: "Push Jerk", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT", "TRICEPS", "QUADS"] }, equipment: ["barbell"], aliases: ["jerk", "split jerk"], tags: ["compound", "olympic"], movement: "shoulders" },

  // ===========================================================================
  // FUNCTIONAL / CROSSFIT
  // ===========================================================================
  { id: "f-kb-swing", name: "Kettlebell Swing", defaultUnit: "reps", muscles: { primary: ["GLUTES", "HAMSTRINGS", "BACK"] }, equipment: ["kettlebell"], aliases: ["kb swing", "russian swing", "american swing"], tags: ["compound", "legs"], movement: "legs" },
  { id: "f-kb-snatch", name: "Kettlebell Snatch", defaultUnit: "reps", muscles: { primary: ["GLUTES", "BACK", "ANTERIOR_DELT"] }, equipment: ["kettlebell"], aliases: ["kb snatch"], tags: ["compound", "olympic"], movement: "legs" },
  { id: "f-kb-clean-press", name: "Kettlebell Clean and Press", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT", "GLUTES", "BACK"] }, equipment: ["kettlebell"], aliases: ["kb clean press"], tags: ["compound"], movement: "shoulders" },
  { id: "f-kb-goblet-squat", name: "Kettlebell Goblet Squat", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["kettlebell"], aliases: ["kb goblet squat"], tags: ["compound", "legs"], movement: "legs" },
  { id: "f-turkish-getup", name: "Turkish Get Up", defaultUnit: "reps", muscles: { primary: ["ABS", "ANTERIOR_DELT", "GLUTES"] }, equipment: ["kettlebell", "dumbbell"], aliases: ["tgu", "turkish getup"], tags: ["compound"], movement: "core" },
  { id: "f-sled-push", name: "Sled Push", defaultUnit: "sec", muscles: { primary: ["QUADS", "GLUTES", "CALVES"] }, equipment: ["machine"], aliases: ["prowler push", "sled drive"], tags: ["compound", "legs", "cardio"], movement: "legs" },
  { id: "f-sled-pull", name: "Sled Pull", defaultUnit: "sec", muscles: { primary: ["BACK", "HAMSTRINGS", "GLUTES"] }, equipment: ["machine"], aliases: ["prowler pull", "sled drag"], tags: ["compound", "legs", "cardio"], movement: "legs" },
  { id: "f-tire-flip", name: "Tire Flip", defaultUnit: "reps", muscles: { primary: ["BACK", "QUADS", "GLUTES"] }, equipment: ["bodyweight"], aliases: ["tire flips"], tags: ["compound"], movement: "legs" },
  { id: "f-battle-rope", name: "Battle Ropes", defaultUnit: "sec", muscles: { primary: ["ANTERIOR_DELT", "ABS"] }, equipment: ["bodyweight"], aliases: ["battle rope", "rope slams", "rope waves"], tags: ["cardio", "compound"], movement: "cardio" },
  { id: "f-burpee", name: "Burpees", defaultUnit: "reps", muscles: { primary: ["CHEST", "QUADS", "ABS"] }, equipment: ["bodyweight"], aliases: ["burpee", "squat thrust"], tags: ["compound", "cardio", "bodyweight"], movement: "cardio" },

  // ===========================================================================
  // CARDIO
  // ===========================================================================
  { id: "r-run", name: "Running", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "CALVES", "GLUTES"] }, equipment: [], aliases: ["run", "jog", "jogging", "treadmill run"], tags: ["cardio"], movement: "cardio" },
  { id: "r-run-outdoor", name: "Outdoor Running", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "CALVES", "GLUTES"] }, equipment: [], aliases: ["outdoor run", "road running", "trail running"], tags: ["cardio"], movement: "cardio" },
  { id: "r-walk", name: "Walking", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "CALVES"] }, equipment: [], aliases: ["walk", "treadmill walk", "incline walk"], tags: ["cardio"], movement: "cardio" },
  { id: "r-walk-incline", name: "Incline Walking", defaultUnit: "min", muscles: { primary: ["GLUTES", "HAMSTRINGS", "CALVES", "QUADS"] }, equipment: ["machine"], aliases: ["incline treadmill", "treadmill incline walk"], tags: ["cardio"], movement: "cardio" },
  { id: "r-bike", name: "Cycling", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "CALVES"] }, equipment: ["bike"], aliases: ["bike", "biking", "stationary bike", "spin"], tags: ["cardio"], movement: "cardio" },
  { id: "r-bike-outdoor", name: "Outdoor Cycling", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "CALVES"] }, equipment: [], aliases: ["road bike", "bike ride", "cycling outdoor"], tags: ["cardio"], movement: "cardio" },
  { id: "r-swim", name: "Swimming", defaultUnit: "min", muscles: { primary: ["BACK", "CHEST", "ANTERIOR_DELT", "ABS", "QUADS"] }, equipment: [], aliases: ["swim", "laps swimming"], tags: ["cardio"], movement: "cardio" },
  { id: "r-swim-laps", name: "Lap Swimming", defaultUnit: "laps", muscles: { primary: ["BACK", "ANTERIOR_DELT", "CHEST", "ABS", "QUADS"] }, equipment: [], aliases: ["swim laps", "pool laps"], tags: ["cardio"], movement: "cardio" },
  { id: "r-elliptical", name: "Elliptical", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "HAMSTRINGS"] }, equipment: ["machine"], aliases: ["elliptical machine", "cross trainer"], tags: ["cardio"], movement: "cardio" },
  { id: "r-stairmaster", name: "Stairmaster", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "CALVES"] }, equipment: ["machine"], aliases: ["stair climber", "stair stepper", "stairs"], tags: ["cardio"], movement: "cardio" },
  { id: "r-rowing", name: "Rowing Machine", defaultUnit: "min", muscles: { primary: ["BACK", "QUADS", "BICEPS", "GLUTES"] }, equipment: ["machine"], aliases: ["rower", "erg", "ergometer", "rowing"], tags: ["cardio"], movement: "cardio" },
  { id: "r-jump-rope", name: "Jump Rope", defaultUnit: "min", muscles: { primary: ["CALVES", "QUADS"] }, equipment: ["jump rope"], aliases: ["skipping", "skip rope"], tags: ["cardio"], movement: "cardio" },
  { id: "r-sprints", name: "Sprints", defaultUnit: "sec", muscles: { primary: ["QUADS", "HAMSTRINGS", "GLUTES", "CALVES"] }, equipment: [], aliases: ["sprint", "interval sprints"], tags: ["cardio", "hiit"], movement: "cardio" },
  { id: "r-hike", name: "Hiking", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "CALVES"] }, equipment: [], aliases: ["hike", "trail hike"], tags: ["cardio"], movement: "cardio" },
  { id: "r-assault-bike", name: "Assault Bike", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "BACK", "ABS"] }, equipment: ["machine"], aliases: ["air bike", "airdyne", "fan bike"], tags: ["cardio", "hiit"], movement: "cardio" },
  { id: "r-ski-erg", name: "Ski Erg", defaultUnit: "min", muscles: { primary: ["BACK", "ABS", "TRICEPS", "ANTERIOR_DELT"] }, equipment: ["machine"], aliases: ["ski ergometer", "skierg"], tags: ["cardio"], movement: "cardio" },
  { id: "r-jumping-jack", name: "Jumping Jacks", defaultUnit: "reps", muscles: { primary: ["CALVES", "QUADS"] }, equipment: ["bodyweight"], aliases: ["jumping jacks", "star jumps"], tags: ["cardio", "bodyweight"], movement: "cardio" },
  { id: "r-high-knees", name: "High Knees", defaultUnit: "sec", muscles: { primary: ["QUADS", "ABS"] }, equipment: ["bodyweight"], aliases: ["high knee run", "marching"], tags: ["cardio", "bodyweight"], movement: "cardio" },
  { id: "r-butt-kicks", name: "Butt Kicks", defaultUnit: "sec", muscles: { primary: ["HAMSTRINGS", "CALVES"] }, equipment: ["bodyweight"], aliases: ["butt kick run"], tags: ["cardio", "bodyweight"], movement: "cardio" },
  { id: "r-box-jump-cardio", name: "Box Jumps (Cardio)", defaultUnit: "reps", muscles: { primary: ["QUADS", "CALVES", "GLUTES"] }, equipment: ["bodyweight"], aliases: ["plyo box jump"], tags: ["cardio", "bodyweight", "hiit"], movement: "cardio" },

  // ===========================================================================
  // SPORT / ATHLETIC
  // ===========================================================================
  { id: "sp-basketball", name: "Basketball", defaultUnit: "min", muscles: { primary: ["QUADS", "CALVES", "GLUTES", "HAMSTRINGS", "ABS"] }, equipment: [], aliases: ["basketball practice", "hoops"], tags: ["sport"], movement: "sport" },
  { id: "sp-soccer", name: "Soccer", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "CALVES", "GLUTES", "ABS"] }, equipment: [], aliases: ["soccer practice", "football (soccer)"], tags: ["sport"], movement: "sport" },
  { id: "sp-football", name: "Football", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "HAMSTRINGS", "CHEST", "ABS"] }, equipment: [], aliases: ["football practice", "american football"], tags: ["sport"], movement: "sport" },
  { id: "sp-tennis", name: "Tennis", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "CALVES", "ABS", "FOREARMS"] }, equipment: [], aliases: ["tennis practice", "tennis match"], tags: ["sport"], movement: "sport" },
  { id: "sp-badminton", name: "Badminton", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "CALVES", "ABS"] }, equipment: [], aliases: ["badminton match", "shuttlecock"], tags: ["sport"], movement: "sport" },
  { id: "sp-table-tennis", name: "Table Tennis", defaultUnit: "min", muscles: { primary: ["ANTERIOR_DELT", "ABS", "FOREARMS", "QUADS"] }, equipment: [], aliases: ["ping pong", "table tennis match"], tags: ["sport"], movement: "sport" },
  { id: "sp-pickleball", name: "Pickleball", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "CALVES", "ABS", "FOREARMS"] }, equipment: [], aliases: ["pickleball match"], tags: ["sport"], movement: "sport" },
  { id: "sp-racquetball", name: "Racquetball", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "CALVES", "ABS", "FOREARMS"] }, equipment: [], aliases: ["racquetball match", "squash"], tags: ["sport"], movement: "sport" },
  { id: "sp-squash", name: "Squash", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "CALVES", "ABS", "FOREARMS"] }, equipment: [], aliases: ["squash match"], tags: ["sport"], movement: "sport" },
  { id: "sp-polo", name: "Water Polo", defaultUnit: "min", muscles: { primary: ["ANTERIOR_DELT", "BACK", "QUADS", "ABS", "CHEST", "GLUTES"] }, equipment: [], aliases: ["polo", "water polo practice"], tags: ["sport"], movement: "sport" },
  { id: "sp-volleyball", name: "Volleyball", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "CALVES", "GLUTES", "ABS"] }, equipment: [], aliases: ["volleyball practice"], tags: ["sport"], movement: "sport" },
  { id: "sp-baseball", name: "Baseball", defaultUnit: "min", muscles: { primary: ["ANTERIOR_DELT", "OBLIQUES", "QUADS", "FOREARMS", "BACK"] }, equipment: [], aliases: ["baseball practice", "batting practice"], tags: ["sport"], movement: "sport" },
  { id: "sp-softball", name: "Softball", defaultUnit: "min", muscles: { primary: ["ANTERIOR_DELT", "OBLIQUES", "QUADS", "FOREARMS", "BACK"] }, equipment: [], aliases: ["softball practice"], tags: ["sport"], movement: "sport" },
  { id: "sp-hockey", name: "Hockey", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "HAMSTRINGS", "ABS", "ANTERIOR_DELT"] }, equipment: [], aliases: ["ice hockey", "hockey practice", "field hockey"], tags: ["sport"], movement: "sport" },
  { id: "sp-lacrosse", name: "Lacrosse", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "ABS", "GLUTES", "BACK"] }, equipment: [], aliases: ["lacrosse practice", "lax"], tags: ["sport"], movement: "sport" },
  { id: "sp-rugby", name: "Rugby", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "HAMSTRINGS", "CHEST", "ABS"] }, equipment: [], aliases: ["rugby practice", "rugby match"], tags: ["sport"], movement: "sport" },
  { id: "sp-cricket", name: "Cricket", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "OBLIQUES", "BACK", "FOREARMS"] }, equipment: [], aliases: ["cricket practice", "cricket match"], tags: ["sport"], movement: "sport" },
  { id: "sp-golf", name: "Golf", defaultUnit: "min", muscles: { primary: ["OBLIQUES", "ABS", "BACK", "GLUTES", "FOREARMS"] }, equipment: [], aliases: ["golf round", "driving range"], tags: ["sport"], movement: "sport" },
  { id: "sp-boxing", name: "Boxing", defaultUnit: "min", muscles: { primary: ["ANTERIOR_DELT", "ABS", "TRICEPS", "BACK", "CALVES"] }, equipment: [], aliases: ["boxing training", "heavy bag"], tags: ["sport"], movement: "sport" },
  { id: "sp-kickboxing", name: "Kickboxing", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "ABS", "GLUTES", "HAMSTRINGS"] }, equipment: [], aliases: ["kickboxing class", "muay thai"], tags: ["sport"], movement: "sport" },
  { id: "sp-mma", name: "MMA Training", defaultUnit: "min", muscles: { primary: ["QUADS", "ABS", "BACK", "GLUTES", "ANTERIOR_DELT"] }, equipment: [], aliases: ["martial arts", "mma"], tags: ["sport"], movement: "sport" },
  { id: "sp-bjj", name: "Brazilian Jiu-Jitsu", defaultUnit: "min", muscles: { primary: ["BACK", "ABS", "GLUTES", "BICEPS", "FOREARMS"] }, equipment: [], aliases: ["bjj", "jiu jitsu", "grappling"], tags: ["sport"], movement: "sport" },
  { id: "sp-karate", name: "Karate", defaultUnit: "min", muscles: { primary: ["QUADS", "ABS", "ANTERIOR_DELT", "GLUTES", "CALVES"] }, equipment: [], aliases: ["karate practice", "karate class"], tags: ["sport"], movement: "sport" },
  { id: "sp-judo", name: "Judo", defaultUnit: "min", muscles: { primary: ["BACK", "ABS", "GLUTES", "BICEPS", "FOREARMS"] }, equipment: [], aliases: ["judo practice", "judo class"], tags: ["sport"], movement: "sport" },
  { id: "sp-taekwondo", name: "Taekwondo", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "ABS", "GLUTES", "CALVES"] }, equipment: [], aliases: ["tkd", "tae kwon do"], tags: ["sport"], movement: "sport" },
  { id: "sp-wrestling", name: "Wrestling", defaultUnit: "min", muscles: { primary: ["BACK", "QUADS", "ABS", "GLUTES", "BICEPS"] }, equipment: [], aliases: ["wrestling practice"], tags: ["sport"], movement: "sport" },
  { id: "sp-fencing", name: "Fencing", defaultUnit: "min", muscles: { primary: ["QUADS", "CALVES", "HAMSTRINGS", "ANTERIOR_DELT", "ABS"] }, equipment: [], aliases: ["fencing practice", "epee", "foil", "sabre"], tags: ["sport"], movement: "sport" },
  { id: "sp-climbing", name: "Rock Climbing", defaultUnit: "min", muscles: { primary: ["BACK", "BICEPS", "FOREARMS", "ABS", "ANTERIOR_DELT"] }, equipment: [], aliases: ["climbing", "bouldering", "sport climbing", "indoor climbing"], tags: ["sport"], movement: "sport" },
  { id: "sp-surfing", name: "Surfing", defaultUnit: "min", muscles: { primary: ["BACK", "ANTERIOR_DELT", "ABS", "CHEST", "QUADS"] }, equipment: [], aliases: ["surf", "surf session"], tags: ["sport"], movement: "sport" },
  { id: "sp-skiing", name: "Skiing", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "GLUTES", "ABS", "CALVES"] }, equipment: [], aliases: ["ski", "downhill skiing", "alpine skiing"], tags: ["sport"], movement: "sport" },
  { id: "sp-snowboarding", name: "Snowboarding", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "GLUTES", "ABS", "CALVES"] }, equipment: [], aliases: ["snowboard"], tags: ["sport"], movement: "sport" },
  { id: "sp-xc-ski", name: "Cross-Country Skiing", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "BACK", "TRICEPS", "ABS"] }, equipment: [], aliases: ["xc skiing", "nordic skiing"], tags: ["sport", "cardio"], movement: "sport" },
  { id: "sp-skateboarding", name: "Skateboarding", defaultUnit: "min", muscles: { primary: ["QUADS", "CALVES", "ABS", "GLUTES"] }, equipment: [], aliases: ["skate", "skating"], tags: ["sport"], movement: "sport" },
  { id: "sp-rowing-sport", name: "Rowing (Sport)", defaultUnit: "min", muscles: { primary: ["BACK", "QUADS", "BICEPS", "GLUTES", "ABS"] }, equipment: [], aliases: ["crew", "sculling", "rowing team"], tags: ["sport", "cardio"], movement: "sport" },
  { id: "sp-gymnastics", name: "Gymnastics", defaultUnit: "min", muscles: { primary: ["ABS", "QUADS", "ANTERIOR_DELT", "BACK", "CHEST"] }, equipment: [], aliases: ["gymnastics practice", "gymnastics class"], tags: ["sport"], movement: "sport" },
  { id: "sp-dance", name: "Dance", defaultUnit: "min", muscles: { primary: ["QUADS", "CALVES", "GLUTES", "ABS", "HAMSTRINGS"] }, equipment: [], aliases: ["dance class", "dance practice", "dancing", "ballet", "salsa", "hip hop dance"], tags: ["sport"], movement: "sport" },
  { id: "sp-handball", name: "Handball", defaultUnit: "min", muscles: { primary: ["QUADS", "ANTERIOR_DELT", "ABS", "GLUTES", "BACK"] }, equipment: [], aliases: ["handball match"], tags: ["sport"], movement: "sport" },
  { id: "sp-ultimate", name: "Ultimate Frisbee", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "ANTERIOR_DELT", "GLUTES", "ABS"] }, equipment: [], aliases: ["ultimate", "frisbee"], tags: ["sport"], movement: "sport" },
  { id: "sp-crossfit", name: "CrossFit", defaultUnit: "min", muscles: { primary: ["QUADS", "BACK", "ABS", "GLUTES", "ANTERIOR_DELT"] }, equipment: [], aliases: ["crossfit wod", "wod", "metcon"], tags: ["sport"], movement: "sport" },
  { id: "sp-track", name: "Track & Field", defaultUnit: "min", muscles: { primary: ["QUADS", "HAMSTRINGS", "GLUTES", "CALVES", "ABS"] }, equipment: [], aliases: ["track practice", "sprinting", "hurdles", "javelin", "shot put"], tags: ["sport"], movement: "sport" },

  // ===========================================================================
  // MOBILITY / FLEXIBILITY
  // ===========================================================================
  { id: "m-yoga", name: "Yoga", defaultUnit: "min", muscles: { primary: ["ABS", "BACK", "GLUTES"] }, equipment: [], aliases: ["yoga flow", "yoga session"], tags: ["mobility", "flexibility"], movement: "mobility" },
  { id: "m-yoga-power", name: "Power Yoga", defaultUnit: "min", muscles: { primary: ["ABS", "QUADS", "BACK"] }, equipment: [], aliases: ["power yoga", "vinyasa"], tags: ["mobility", "flexibility"], movement: "mobility" },
  { id: "m-yoga-hot", name: "Hot Yoga", defaultUnit: "min", muscles: { primary: ["ABS", "BACK", "GLUTES"] }, equipment: [], aliases: ["bikram", "hot yoga class"], tags: ["mobility", "flexibility"], movement: "mobility" },
  { id: "m-pilates", name: "Pilates", defaultUnit: "min", muscles: { primary: ["ABS", "GLUTES", "BACK"] }, equipment: [], aliases: ["pilates class", "mat pilates", "reformer pilates"], tags: ["mobility", "core"], movement: "mobility" },
  { id: "m-foam-roll", name: "Foam Rolling", defaultUnit: "min", muscles: { primary: ["BACK", "QUADS", "GLUTES"] }, equipment: ["foam roller"], aliases: ["foam roll", "myofascial release"], tags: ["mobility", "recovery"], movement: "mobility" },
  { id: "m-dynamic-warmup", name: "Dynamic Warm-Up", defaultUnit: "min", muscles: { primary: ["QUADS", "GLUTES", "HAMSTRINGS"] }, equipment: ["bodyweight"], aliases: ["warm up", "warmup", "dynamic stretch"], tags: ["mobility"], movement: "mobility" },
  { id: "m-tai-chi", name: "Tai Chi", defaultUnit: "min", muscles: { primary: ["QUADS", "ABS", "CALVES"] }, equipment: [], aliases: ["tai chi class", "taichi"], tags: ["mobility", "flexibility"], movement: "mobility" },
  { id: "m-hip-90-90", name: "90/90 Hip Switch", defaultUnit: "reps", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["hip 90 90", "90 90 stretch", "hip switch"], tags: ["mobility", "bodyweight"], movement: "mobility" },
  { id: "m-worlds-greatest", name: "World's Greatest Stretch", defaultUnit: "reps", muscles: { primary: ["QUADS", "BACK", "GLUTES"] }, equipment: ["bodyweight"], aliases: ["greatest stretch", "wgs"], tags: ["mobility", "bodyweight"], movement: "mobility" },
  { id: "m-shoulder-dislocate", name: "Shoulder Dislocates", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT", "POSTERIOR_DELT"] }, equipment: ["bodyweight"], aliases: ["band pass through", "dowel dislocate", "shoulder pass-through"], tags: ["mobility", "bodyweight"], movement: "mobility" },
  { id: "m-ankle-mobility", name: "Ankle Mobility Drill", defaultUnit: "reps", muscles: { primary: ["CALVES"] }, equipment: ["bodyweight"], aliases: ["ankle circles", "ankle dorsiflexion", "wall ankle stretch"], tags: ["mobility", "bodyweight"], movement: "mobility" },
  { id: "m-hip-circles", name: "Hip Circles", defaultUnit: "reps", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["hip rotations", "standing hip circles"], tags: ["mobility", "bodyweight"], movement: "mobility" },
  { id: "m-thoracic-rotation", name: "Thoracic Rotation", defaultUnit: "reps", muscles: { primary: ["BACK"] }, equipment: ["bodyweight"], aliases: ["t-spine rotation", "open book stretch"], tags: ["mobility", "bodyweight"], movement: "mobility" },

  // ===========================================================================
  // STRETCHES — General
  // ===========================================================================
  { id: "s-hamstring", name: "Hamstring Stretch", defaultUnit: "sec", muscles: { primary: ["HAMSTRINGS"] }, equipment: ["bodyweight"], aliases: ["standing hamstring stretch", "seated hamstring stretch", "toe touch"], tags: ["stretch", "isometric", "bodyweight", "posture"], movement: "stretch" },
  { id: "s-quad", name: "Quad Stretch", defaultUnit: "sec", muscles: { primary: ["QUADS"] }, equipment: ["bodyweight"], aliases: ["standing quad stretch", "quad pull"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-calf", name: "Calf Stretch", defaultUnit: "sec", muscles: { primary: ["CALVES"] }, equipment: ["bodyweight"], aliases: ["wall calf stretch", "standing calf stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-glute", name: "Glute Stretch", defaultUnit: "sec", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["pigeon stretch", "figure four stretch", "seated glute stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-pigeon", name: "Pigeon Pose", defaultUnit: "sec", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["pigeon stretch", "sleeping pigeon"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-lat", name: "Lat Stretch", defaultUnit: "sec", muscles: { primary: ["BACK"] }, equipment: ["bodyweight"], aliases: ["overhead lat stretch", "doorway lat stretch", "side lat stretch"], tags: ["stretch", "isometric", "bodyweight", "posture"], movement: "stretch" },
  { id: "s-shoulder-cross", name: "Cross-Body Shoulder Stretch", defaultUnit: "sec", muscles: { primary: ["POSTERIOR_DELT"] }, equipment: ["bodyweight"], aliases: ["cross body stretch", "rear delt stretch", "shoulder stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-tricep-overhead", name: "Overhead Tricep Stretch", defaultUnit: "sec", muscles: { primary: ["TRICEPS"] }, equipment: ["bodyweight"], aliases: ["tricep stretch", "behind head stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-bicep-wall", name: "Wall Bicep Stretch", defaultUnit: "sec", muscles: { primary: ["BICEPS"] }, equipment: ["bodyweight"], aliases: ["bicep stretch", "doorway bicep stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-neck-tilt", name: "Neck Side Tilt Stretch", defaultUnit: "sec", muscles: { primary: ["BACK"] }, equipment: ["bodyweight"], aliases: ["neck stretch", "lateral neck stretch", "neck tilt"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-neck-rotation", name: "Neck Rotation Stretch", defaultUnit: "sec", muscles: { primary: ["BACK"] }, equipment: ["bodyweight"], aliases: ["neck rotation", "neck turn"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-wrist-flexor", name: "Wrist Flexor Stretch", defaultUnit: "sec", muscles: { primary: ["FOREARMS"] }, equipment: ["bodyweight"], aliases: ["wrist stretch", "forearm flexor stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-wrist-extensor", name: "Wrist Extensor Stretch", defaultUnit: "sec", muscles: { primary: ["FOREARMS"] }, equipment: ["bodyweight"], aliases: ["reverse wrist stretch", "forearm extensor stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-it-band", name: "IT Band Stretch", defaultUnit: "sec", muscles: { primary: ["QUADS"] }, equipment: ["bodyweight"], aliases: ["iliotibial band stretch", "it band foam roll"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-butterfly", name: "Butterfly Stretch", defaultUnit: "sec", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["groin stretch", "adductor stretch", "seated butterfly"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-straddle", name: "Straddle Stretch", defaultUnit: "sec", muscles: { primary: ["HAMSTRINGS", "GLUTES"] }, equipment: ["bodyweight"], aliases: ["wide leg stretch", "seated straddle", "middle split"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-frog", name: "Frog Stretch", defaultUnit: "sec", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["frog pose", "groin stretch frog"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-cobra", name: "Cobra Stretch", defaultUnit: "sec", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["cobra pose", "bhujangasana", "upward facing dog"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-puppy-pose", name: "Puppy Pose", defaultUnit: "sec", muscles: { primary: ["BACK", "CHEST"] }, equipment: ["bodyweight"], aliases: ["extended puppy pose", "melting heart pose"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-thread-needle", name: "Thread the Needle", defaultUnit: "reps", muscles: { primary: ["BACK"] }, equipment: ["bodyweight"], aliases: ["thread needle stretch", "thoracic rotation stretch"], tags: ["stretch", "mobility", "bodyweight"], movement: "stretch" },
  { id: "s-seated-twist", name: "Seated Spinal Twist", defaultUnit: "sec", muscles: { primary: ["BACK", "ABS"] }, equipment: ["bodyweight"], aliases: ["spinal twist", "seated twist", "supine twist"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-scorpion", name: "Scorpion Stretch", defaultUnit: "reps", muscles: { primary: ["ABS", "QUADS"] }, equipment: ["bodyweight"], aliases: ["prone scorpion", "scorpion twist"], tags: ["stretch", "mobility", "bodyweight"], movement: "stretch" },
  { id: "s-sleeper", name: "Sleeper Stretch", defaultUnit: "sec", muscles: { primary: ["POSTERIOR_DELT"] }, equipment: ["bodyweight"], aliases: ["sleeper stretch shoulder", "internal rotation stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-banded-shoulder", name: "Banded Shoulder Stretch", defaultUnit: "sec", muscles: { primary: ["ANTERIOR_DELT", "CHEST"] }, equipment: ["bodyweight"], aliases: ["band shoulder stretch", "resistance band stretch"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-downward-dog", name: "Downward Dog", defaultUnit: "sec", muscles: { primary: ["HAMSTRINGS", "CALVES", "BACK"] }, equipment: ["bodyweight"], aliases: ["down dog", "adho mukha svanasana"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-upward-dog", name: "Upward Dog", defaultUnit: "sec", muscles: { primary: ["ABS", "CHEST"] }, equipment: ["bodyweight"], aliases: ["up dog", "urdhva mukha svanasana"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-standing-pike", name: "Standing Pike Stretch", defaultUnit: "sec", muscles: { primary: ["HAMSTRINGS"] }, equipment: ["bodyweight"], aliases: ["forward fold", "standing forward bend", "uttanasana"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-pancake", name: "Pancake Stretch", defaultUnit: "sec", muscles: { primary: ["HAMSTRINGS", "GLUTES"] }, equipment: ["bodyweight"], aliases: ["pancake fold", "wide straddle forward fold"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },

  // ===========================================================================
  // STRETCHES — Kyphosis / Rounded Upper Back
  // ===========================================================================
  { id: "s-chest-doorway", name: "Doorway Chest Stretch", defaultUnit: "sec", muscles: { primary: ["CHEST", "ANTERIOR_DELT"] }, equipment: ["bodyweight"], aliases: ["pec stretch", "doorway stretch", "chest opener"], tags: ["stretch", "isometric", "bodyweight", "posture", "kyphosis"], movement: "stretch" },
  { id: "s-thoracic-ext", name: "Thoracic Extension", defaultUnit: "sec", muscles: { primary: ["BACK"] }, equipment: ["foam roller"], aliases: ["thoracic spine extension", "upper back extension", "foam roller thoracic"], tags: ["stretch", "isometric", "posture", "kyphosis", "mobility"], movement: "stretch" },
  { id: "s-cat-cow", name: "Cat-Cow Stretch", defaultUnit: "reps", muscles: { primary: ["BACK", "ABS"] }, equipment: ["bodyweight"], aliases: ["cat cow", "cat camel", "spinal flexion extension"], tags: ["stretch", "mobility", "bodyweight", "posture", "kyphosis"], movement: "stretch" },
  { id: "s-chin-tuck", name: "Chin Tucks", defaultUnit: "reps", muscles: { primary: ["BACK"] }, equipment: ["bodyweight"], aliases: ["chin tuck", "neck retraction", "cervical retraction"], tags: ["stretch", "posture", "bodyweight", "kyphosis"], movement: "stretch" },
  { id: "s-wall-angel", name: "Wall Angels", defaultUnit: "reps", muscles: { primary: ["POSTERIOR_DELT", "BACK"] }, equipment: ["bodyweight"], aliases: ["wall slide", "wall angel", "scapular wall slide"], tags: ["stretch", "mobility", "bodyweight", "posture", "kyphosis"], movement: "stretch" },
  { id: "s-prone-y-raise", name: "Prone Y Raise", defaultUnit: "reps", muscles: { primary: ["BACK", "POSTERIOR_DELT"] }, equipment: ["bodyweight"], aliases: ["y raise", "floor y raise", "prone y"], tags: ["stretch", "mobility", "bodyweight", "posture", "kyphosis"], movement: "stretch" },

  // ===========================================================================
  // STRETCHES — Anterior Pelvic Tilt
  // ===========================================================================
  { id: "s-hip-flexor", name: "Hip Flexor Stretch", defaultUnit: "sec", muscles: { primary: ["QUADS"] }, equipment: ["bodyweight"], aliases: ["kneeling hip flexor stretch", "psoas stretch", "lunge stretch"], tags: ["stretch", "isometric", "bodyweight", "posture", "apt"], movement: "stretch" },
  { id: "s-couch", name: "Couch Stretch", defaultUnit: "sec", muscles: { primary: ["QUADS"] }, equipment: ["bodyweight"], aliases: ["wall quad stretch", "elevated hip flexor stretch", "rear foot elevated stretch"], tags: ["stretch", "isometric", "bodyweight", "posture", "apt"], movement: "stretch" },
  { id: "s-childs-pose", name: "Child's Pose", defaultUnit: "sec", muscles: { primary: ["BACK"] }, equipment: ["bodyweight"], aliases: ["child's pose", "resting pose", "balasana"], tags: ["stretch", "isometric", "bodyweight", "posture", "apt"], movement: "stretch" },
  { id: "s-knee-to-chest", name: "Knee to Chest Stretch", defaultUnit: "sec", muscles: { primary: ["GLUTES", "BACK"] }, equipment: ["bodyweight"], aliases: ["single knee to chest", "double knee to chest", "low back stretch"], tags: ["stretch", "isometric", "bodyweight", "posture", "apt"], movement: "stretch" },
  { id: "s-pelvic-tilt", name: "Posterior Pelvic Tilts", defaultUnit: "reps", muscles: { primary: ["ABS", "GLUTES"] }, equipment: ["bodyweight"], aliases: ["pelvic tilt", "supine pelvic tilt", "lying pelvic tilt"], tags: ["stretch", "mobility", "bodyweight", "posture", "apt"], movement: "stretch" },
  { id: "s-glute-bridge", name: "Glute Bridge Hold", defaultUnit: "sec", muscles: { primary: ["GLUTES", "HAMSTRINGS"] }, equipment: ["bodyweight"], aliases: ["bridge hold", "hip bridge hold", "glute bridge"], tags: ["stretch", "isometric", "bodyweight", "posture", "apt"], movement: "stretch" },
  { id: "s-dead-hang", name: "Dead Hang", defaultUnit: "sec", muscles: { primary: ["BACK"] }, equipment: ["pull-up bar"], aliases: ["bar hang", "passive hang", "spinal decompression"], tags: ["stretch", "isometric", "posture", "apt", "kyphosis"], movement: "stretch" },
  { id: "s-happy-baby", name: "Happy Baby", defaultUnit: "sec", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["happy baby pose", "ananda balasana"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
  { id: "s-supine-twist", name: "Supine Twist", defaultUnit: "sec", muscles: { primary: ["BACK", "ABS"] }, equipment: ["bodyweight"], aliases: ["lying twist", "supine spinal twist"], tags: ["stretch", "isometric", "bodyweight"], movement: "stretch" },
];
