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
 *   BACK, BICEPS, QUADS, HAMSTRINGS, GLUTES, CALVES, ABS
 */

export const EXERCISE_CATALOG = [
  // ===========================================================================
  // PUSH — Chest
  // ===========================================================================
  { id: "c-bench-flat-bb", name: "Barbell Bench Press", defaultUnit: "reps", muscles: { primary: ["CHEST", "TRICEPS", "ANTERIOR_DELT"] }, equipment: ["barbell", "bench"], aliases: ["flat bench", "bench press"], tags: ["compound", "push"], movement: "push" },
  { id: "c-bench-flat-db", name: "Dumbbell Bench Press", defaultUnit: "reps", muscles: { primary: ["CHEST", "TRICEPS", "ANTERIOR_DELT"] }, equipment: ["dumbbell", "bench"], aliases: ["db bench"], tags: ["compound", "push"], movement: "push" },
  { id: "c-bench-incline-bb", name: "Incline Barbell Bench Press", defaultUnit: "reps", muscles: { primary: ["CHEST", "ANTERIOR_DELT", "TRICEPS"] }, equipment: ["barbell", "bench"], aliases: ["incline bench", "incline press"], tags: ["compound", "push"], movement: "push" },
  { id: "c-bench-incline-db", name: "Incline Dumbbell Bench Press", defaultUnit: "reps", muscles: { primary: ["CHEST", "ANTERIOR_DELT", "TRICEPS"] }, equipment: ["dumbbell", "bench"], aliases: ["incline db bench"], tags: ["compound", "push"], movement: "push" },
  { id: "c-bench-decline-bb", name: "Decline Barbell Bench Press", defaultUnit: "reps", muscles: { primary: ["CHEST", "TRICEPS"] }, equipment: ["barbell", "bench"], aliases: ["decline bench"], tags: ["compound", "push"], movement: "push" },
  { id: "c-fly-flat-db", name: "Dumbbell Fly", defaultUnit: "reps", muscles: { primary: ["CHEST"] }, equipment: ["dumbbell", "bench"], aliases: ["chest fly", "db fly", "dumbbell flye"], tags: ["isolation", "push"], movement: "push" },
  { id: "c-fly-cable", name: "Cable Fly", defaultUnit: "reps", muscles: { primary: ["CHEST"] }, equipment: ["cable"], aliases: ["cable crossover", "cable chest fly"], tags: ["isolation", "push"], movement: "push" },
  { id: "c-pushup", name: "Push Ups", defaultUnit: "reps", muscles: { primary: ["CHEST", "TRICEPS", "ANTERIOR_DELT"] }, equipment: ["bodyweight"], aliases: ["pushup", "push-up"], tags: ["compound", "push", "bodyweight"], movement: "push" },
  { id: "c-dip-chest", name: "Chest Dips", defaultUnit: "reps", muscles: { primary: ["CHEST", "TRICEPS", "ANTERIOR_DELT"] }, equipment: ["bodyweight", "dip bar"], aliases: ["dip", "dips"], tags: ["compound", "push", "bodyweight"], movement: "push" },
  { id: "c-machine-press", name: "Machine Chest Press", defaultUnit: "reps", muscles: { primary: ["CHEST", "TRICEPS"] }, equipment: ["machine"], aliases: ["chest press machine"], tags: ["compound", "push"], movement: "push" },
  { id: "c-pec-deck", name: "Pec Deck", defaultUnit: "reps", muscles: { primary: ["CHEST"] }, equipment: ["machine"], aliases: ["pec fly machine", "machine fly"], tags: ["isolation", "push"], movement: "push" },

  // ===========================================================================
  // PULL — Back
  // ===========================================================================
  { id: "b-pullup", name: "Pull Ups", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["bodyweight", "pull-up bar"], aliases: ["pullup", "pull-up"], tags: ["compound", "pull", "bodyweight"], movement: "pull" },
  { id: "b-chinup", name: "Chin Ups", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["bodyweight", "pull-up bar"], aliases: ["chinup", "chin-up"], tags: ["compound", "pull", "bodyweight"], movement: "pull" },
  { id: "b-row-bb", name: "Barbell Row", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["barbell"], aliases: ["bent over row", "bb row", "barbell rows"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-row-db", name: "Dumbbell Row", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["dumbbell"], aliases: ["db row", "one arm row", "single arm row"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-row-cable", name: "Seated Cable Row", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["cable"], aliases: ["cable row", "seated row"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-lat-pulldown", name: "Lat Pulldown", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["cable"], aliases: ["pulldown", "lat pull down", "lat pulldowns"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-deadlift-conv", name: "Deadlift", defaultUnit: "reps", muscles: { primary: ["BACK", "HAMSTRINGS", "GLUTES"] }, equipment: ["barbell"], aliases: ["conventional deadlift", "dead lift"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-tbar-row", name: "T-Bar Row", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["barbell", "landmine"], aliases: ["t bar row", "landmine row"], tags: ["compound", "pull"], movement: "pull" },
  { id: "b-face-pull", name: "Face Pulls", defaultUnit: "reps", muscles: { primary: ["POSTERIOR_DELT", "BACK"] }, equipment: ["cable"], aliases: ["face pull", "cable face pull"], tags: ["isolation", "pull"], movement: "pull" },
  { id: "b-reverse-fly-db", name: "Reverse Dumbbell Fly", defaultUnit: "reps", muscles: { primary: ["POSTERIOR_DELT"] }, equipment: ["dumbbell"], aliases: ["reverse flye", "rear delt fly"], tags: ["isolation", "pull"], movement: "pull" },
  { id: "b-machine-row", name: "Machine Row", defaultUnit: "reps", muscles: { primary: ["BACK", "BICEPS"] }, equipment: ["machine"], aliases: ["chest supported row"], tags: ["compound", "pull"], movement: "pull" },

  // ===========================================================================
  // LEGS — Quads
  // ===========================================================================
  { id: "l-squat-bb", name: "Barbell Squat", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["barbell", "squat rack"], aliases: ["back squat", "squat", "barbell back squat"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-squat-front", name: "Front Squat", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["barbell", "squat rack"], aliases: ["front squat"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-squat-goblet", name: "Goblet Squat", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["dumbbell", "kettlebell"], aliases: ["goblet squat"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-leg-press", name: "Leg Press", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["machine"], aliases: ["machine leg press"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-lunge-db", name: "Dumbbell Lunges", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["dumbbell"], aliases: ["lunge", "lunges", "walking lunge"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-lunge-bb", name: "Barbell Lunges", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["barbell"], aliases: ["bb lunge", "barbell lunge"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-leg-ext", name: "Leg Extension", defaultUnit: "reps", muscles: { primary: ["QUADS"] }, equipment: ["machine"], aliases: ["leg extensions", "quad extension"], tags: ["isolation", "legs"], movement: "legs" },
  { id: "l-bulgarian", name: "Bulgarian Split Squat", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["dumbbell", "bench"], aliases: ["bss", "split squat"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-hack-squat", name: "Hack Squat", defaultUnit: "reps", muscles: { primary: ["QUADS"] }, equipment: ["machine"], aliases: ["hack squat machine"], tags: ["compound", "legs"], movement: "legs" },
  { id: "l-step-up", name: "Step Ups", defaultUnit: "reps", muscles: { primary: ["QUADS", "GLUTES"] }, equipment: ["dumbbell", "bench"], aliases: ["step up", "box step up"], tags: ["compound", "legs"], movement: "legs" },

  // ===========================================================================
  // LEGS — Posterior chain (hamstrings / glutes)
  // ===========================================================================
  { id: "p-rdl-bb", name: "Romanian Deadlift", defaultUnit: "reps", muscles: { primary: ["HAMSTRINGS", "GLUTES"] }, equipment: ["barbell"], aliases: ["rdl", "stiff leg deadlift", "romanian deadlifts"], tags: ["compound", "legs"], movement: "legs" },
  { id: "p-rdl-db", name: "Dumbbell Romanian Deadlift", defaultUnit: "reps", muscles: { primary: ["HAMSTRINGS", "GLUTES"] }, equipment: ["dumbbell"], aliases: ["db rdl", "dumbbell rdl"], tags: ["compound", "legs"], movement: "legs" },
  { id: "p-leg-curl", name: "Leg Curl", defaultUnit: "reps", muscles: { primary: ["HAMSTRINGS"] }, equipment: ["machine"], aliases: ["hamstring curl", "lying leg curl", "seated leg curl", "leg curls"], tags: ["isolation", "legs"], movement: "legs" },
  { id: "p-hip-thrust", name: "Hip Thrust", defaultUnit: "reps", muscles: { primary: ["GLUTES", "HAMSTRINGS"] }, equipment: ["barbell", "bench"], aliases: ["barbell hip thrust", "glute bridge"], tags: ["compound", "legs"], movement: "legs" },
  { id: "p-glute-bridge", name: "Glute Bridge", defaultUnit: "reps", muscles: { primary: ["GLUTES"] }, equipment: ["bodyweight"], aliases: ["bridge", "bodyweight glute bridge"], tags: ["isolation", "legs", "bodyweight"], movement: "legs" },
  { id: "p-good-morning", name: "Good Morning", defaultUnit: "reps", muscles: { primary: ["HAMSTRINGS", "BACK"] }, equipment: ["barbell"], aliases: ["good mornings"], tags: ["compound", "legs"], movement: "legs" },
  { id: "p-calf-raise-stand", name: "Standing Calf Raise", defaultUnit: "reps", muscles: { primary: ["CALVES"] }, equipment: ["machine"], aliases: ["calf raise", "calf raises"], tags: ["isolation", "legs"], movement: "legs" },
  { id: "p-calf-raise-seat", name: "Seated Calf Raise", defaultUnit: "reps", muscles: { primary: ["CALVES"] }, equipment: ["machine"], aliases: ["seated calf", "seated calf raises"], tags: ["isolation", "legs"], movement: "legs" },

  // ===========================================================================
  // SHOULDERS
  // ===========================================================================
  { id: "s-ohp-bb", name: "Overhead Press", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT", "TRICEPS"] }, equipment: ["barbell"], aliases: ["ohp", "military press", "barbell overhead press", "shoulder press"], tags: ["compound", "push"], movement: "shoulders" },
  { id: "s-ohp-db", name: "Dumbbell Shoulder Press", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT", "TRICEPS"] }, equipment: ["dumbbell"], aliases: ["db shoulder press", "db ohp", "seated shoulder press"], tags: ["compound", "push"], movement: "shoulders" },
  { id: "s-arnold-press", name: "Arnold Press", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT", "LATERAL_DELT"] }, equipment: ["dumbbell"], aliases: ["arnold dumbbell press"], tags: ["compound", "push"], movement: "shoulders" },
  { id: "s-lateral-raise", name: "Lateral Raise", defaultUnit: "reps", muscles: { primary: ["LATERAL_DELT"] }, equipment: ["dumbbell"], aliases: ["side raise", "lateral raises", "db lateral raise"], tags: ["isolation", "push"], movement: "shoulders" },
  { id: "s-lateral-raise-cable", name: "Cable Lateral Raise", defaultUnit: "reps", muscles: { primary: ["LATERAL_DELT"] }, equipment: ["cable"], aliases: ["cable side raise"], tags: ["isolation", "push"], movement: "shoulders" },
  { id: "s-front-raise", name: "Front Raise", defaultUnit: "reps", muscles: { primary: ["ANTERIOR_DELT"] }, equipment: ["dumbbell"], aliases: ["front delt raise", "db front raise"], tags: ["isolation", "push"], movement: "shoulders" },
  { id: "s-upright-row", name: "Upright Row", defaultUnit: "reps", muscles: { primary: ["LATERAL_DELT", "ANTERIOR_DELT"] }, equipment: ["barbell", "dumbbell"], aliases: ["upright rows"], tags: ["compound", "pull"], movement: "shoulders" },
  { id: "s-shrug-bb", name: "Barbell Shrug", defaultUnit: "reps", muscles: { primary: ["BACK"] }, equipment: ["barbell"], aliases: ["shrugs", "barbell shrugs", "bb shrug"], tags: ["isolation", "pull"], movement: "shoulders" },
  { id: "s-shrug-db", name: "Dumbbell Shrug", defaultUnit: "reps", muscles: { primary: ["BACK"] }, equipment: ["dumbbell"], aliases: ["db shrug", "dumbbell shrugs"], tags: ["isolation", "pull"], movement: "shoulders" },

  // ===========================================================================
  // ARMS — Biceps
  // ===========================================================================
  { id: "a-curl-bb", name: "Barbell Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS"] }, equipment: ["barbell"], aliases: ["bicep curl", "barbell curls", "bb curl"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-curl-db", name: "Dumbbell Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS"] }, equipment: ["dumbbell"], aliases: ["bicep curl", "db curl", "dumbbell curls"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-hammer-curl", name: "Hammer Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS"] }, equipment: ["dumbbell"], aliases: ["hammer curls", "db hammer curl"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-preacher-curl", name: "Preacher Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS"] }, equipment: ["barbell", "dumbbell"], aliases: ["preacher curls", "ez bar curl"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-incline-curl", name: "Incline Dumbbell Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS"] }, equipment: ["dumbbell", "bench"], aliases: ["incline curl", "incline curls"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-cable-curl", name: "Cable Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS"] }, equipment: ["cable"], aliases: ["cable bicep curl"], tags: ["isolation", "pull"], movement: "arms" },
  { id: "a-conc-curl", name: "Concentration Curl", defaultUnit: "reps", muscles: { primary: ["BICEPS"] }, equipment: ["dumbbell"], aliases: ["concentration curls"], tags: ["isolation", "pull"], movement: "arms" },

  // ===========================================================================
  // ARMS — Triceps
  // ===========================================================================
  { id: "a-tri-pushdown", name: "Tricep Pushdown", defaultUnit: "reps", muscles: { primary: ["TRICEPS"] }, equipment: ["cable"], aliases: ["cable pushdown", "rope pushdown", "tricep pushdowns"], tags: ["isolation", "push"], movement: "arms" },
  { id: "a-tri-overhead", name: "Overhead Tricep Extension", defaultUnit: "reps", muscles: { primary: ["TRICEPS"] }, equipment: ["dumbbell", "cable"], aliases: ["tricep extension", "overhead extension", "skull crusher"], tags: ["isolation", "push"], movement: "arms" },
  { id: "a-tri-skullcrusher", name: "Skullcrusher", defaultUnit: "reps", muscles: { primary: ["TRICEPS"] }, equipment: ["barbell", "dumbbell"], aliases: ["skull crusher", "lying tricep extension", "skullcrushers"], tags: ["isolation", "push"], movement: "arms" },
  { id: "a-tri-kickback", name: "Tricep Kickback", defaultUnit: "reps", muscles: { primary: ["TRICEPS"] }, equipment: ["dumbbell"], aliases: ["kickback", "db kickback", "tricep kickbacks"], tags: ["isolation", "push"], movement: "arms" },
  { id: "a-close-grip-bench", name: "Close Grip Bench Press", defaultUnit: "reps", muscles: { primary: ["TRICEPS", "CHEST"] }, equipment: ["barbell", "bench"], aliases: ["close grip bench", "cgbp"], tags: ["compound", "push"], movement: "arms" },
  { id: "a-dip-tricep", name: "Tricep Dips", defaultUnit: "reps", muscles: { primary: ["TRICEPS", "CHEST"] }, equipment: ["bodyweight", "dip bar"], aliases: ["tricep dip", "bench dip"], tags: ["compound", "push", "bodyweight"], movement: "arms" },

  // ===========================================================================
  // CORE
  // ===========================================================================
  { id: "x-plank", name: "Plank", defaultUnit: "sec", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["front plank", "elbow plank"], tags: ["isometric", "core", "bodyweight"], movement: "core" },
  { id: "x-side-plank", name: "Side Plank", defaultUnit: "sec", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["lateral plank"], tags: ["isometric", "core", "bodyweight"], movement: "core" },
  { id: "x-crunch", name: "Crunches", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["crunch", "ab crunch"], tags: ["isolation", "core", "bodyweight"], movement: "core" },
  { id: "x-situp", name: "Sit Ups", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["sit up", "situp"], tags: ["isolation", "core", "bodyweight"], movement: "core" },
  { id: "x-leg-raise", name: "Leg Raise", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["lying leg raise", "hanging leg raise", "leg raises"], tags: ["isolation", "core", "bodyweight"], movement: "core" },
  { id: "x-hanging-leg-raise", name: "Hanging Leg Raise", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["pull-up bar"], aliases: ["hanging knee raise"], tags: ["isolation", "core"], movement: "core" },
  { id: "x-russian-twist", name: "Russian Twist", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["bodyweight", "dumbbell"], aliases: ["russian twists", "oblique twist"], tags: ["isolation", "core"], movement: "core" },
  { id: "x-ab-wheel", name: "Ab Wheel Rollout", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["ab wheel"], aliases: ["ab roller", "rollout"], tags: ["isolation", "core"], movement: "core" },
  { id: "x-cable-crunch", name: "Cable Crunch", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["cable"], aliases: ["cable crunches", "kneeling cable crunch"], tags: ["isolation", "core"], movement: "core" },
  { id: "x-dead-bug", name: "Dead Bug", defaultUnit: "reps", muscles: { primary: ["ABS"] }, equipment: ["bodyweight"], aliases: ["dead bugs"], tags: ["isolation", "core", "bodyweight"], movement: "core" },

  // ===========================================================================
  // CARDIO
  // ===========================================================================
  { id: "r-run", name: "Running", defaultUnit: "min", muscles: { primary: [] }, equipment: [], aliases: ["run", "jog", "jogging", "treadmill run"], tags: ["cardio"], movement: "cardio" },
  { id: "r-walk", name: "Walking", defaultUnit: "min", muscles: { primary: [] }, equipment: [], aliases: ["walk", "treadmill walk", "incline walk"], tags: ["cardio"], movement: "cardio" },
  { id: "r-bike", name: "Cycling", defaultUnit: "min", muscles: { primary: [] }, equipment: ["bike"], aliases: ["bike", "biking", "stationary bike", "spin"], tags: ["cardio"], movement: "cardio" },
  { id: "r-swim", name: "Swimming", defaultUnit: "min", muscles: { primary: [] }, equipment: [], aliases: ["swim", "laps swimming"], tags: ["cardio"], movement: "cardio" },
  { id: "r-elliptical", name: "Elliptical", defaultUnit: "min", muscles: { primary: [] }, equipment: ["machine"], aliases: ["elliptical machine", "cross trainer"], tags: ["cardio"], movement: "cardio" },
  { id: "r-stairmaster", name: "Stairmaster", defaultUnit: "min", muscles: { primary: [] }, equipment: ["machine"], aliases: ["stair climber", "stair stepper", "stairs"], tags: ["cardio"], movement: "cardio" },
  { id: "r-rowing", name: "Rowing Machine", defaultUnit: "min", muscles: { primary: ["BACK"] }, equipment: ["machine"], aliases: ["rower", "erg", "ergometer", "rowing"], tags: ["cardio"], movement: "cardio" },
  { id: "r-jump-rope", name: "Jump Rope", defaultUnit: "min", muscles: { primary: [] }, equipment: ["jump rope"], aliases: ["skipping", "skip rope"], tags: ["cardio"], movement: "cardio" },
  { id: "r-sprints", name: "Sprints", defaultUnit: "sec", muscles: { primary: [] }, equipment: [], aliases: ["sprint", "interval sprints"], tags: ["cardio", "hiit"], movement: "cardio" },
  { id: "r-hike", name: "Hiking", defaultUnit: "min", muscles: { primary: [] }, equipment: [], aliases: ["hike", "trail hike"], tags: ["cardio"], movement: "cardio" },

  // ===========================================================================
  // SPORT / ATHLETIC
  // ===========================================================================
  { id: "sp-basketball", name: "Basketball", defaultUnit: "min", muscles: { primary: [] }, equipment: [], aliases: ["basketball practice", "hoops"], tags: ["sport"], movement: "sport" },
  { id: "sp-soccer", name: "Soccer", defaultUnit: "min", muscles: { primary: [] }, equipment: [], aliases: ["soccer practice", "football (soccer)"], tags: ["sport"], movement: "sport" },
  { id: "sp-tennis", name: "Tennis", defaultUnit: "min", muscles: { primary: [] }, equipment: [], aliases: ["tennis practice", "tennis match"], tags: ["sport"], movement: "sport" },
  { id: "sp-polo", name: "Water Polo", defaultUnit: "min", muscles: { primary: [] }, equipment: [], aliases: ["polo", "water polo practice"], tags: ["sport"], movement: "sport" },
  { id: "sp-volleyball", name: "Volleyball", defaultUnit: "min", muscles: { primary: [] }, equipment: [], aliases: ["volleyball practice"], tags: ["sport"], movement: "sport" },
  { id: "sp-boxing", name: "Boxing", defaultUnit: "min", muscles: { primary: [] }, equipment: [], aliases: ["boxing training", "heavy bag"], tags: ["sport"], movement: "sport" },
  { id: "sp-mma", name: "MMA Training", defaultUnit: "min", muscles: { primary: [] }, equipment: [], aliases: ["martial arts", "mma"], tags: ["sport"], movement: "sport" },
  { id: "sp-wrestling", name: "Wrestling", defaultUnit: "min", muscles: { primary: [] }, equipment: [], aliases: ["wrestling practice"], tags: ["sport"], movement: "sport" },

  // ===========================================================================
  // MOBILITY / FLEXIBILITY
  // ===========================================================================
  { id: "m-yoga", name: "Yoga", defaultUnit: "min", muscles: { primary: [] }, equipment: [], aliases: ["yoga flow", "yoga session"], tags: ["mobility", "flexibility"], movement: "mobility" },
  { id: "m-stretching", name: "Stretching", defaultUnit: "min", muscles: { primary: [] }, equipment: [], aliases: ["stretch", "static stretching", "dynamic stretching"], tags: ["mobility", "flexibility"], movement: "mobility" },
  { id: "m-foam-roll", name: "Foam Rolling", defaultUnit: "min", muscles: { primary: [] }, equipment: ["foam roller"], aliases: ["foam roll", "myofascial release"], tags: ["mobility", "recovery"], movement: "mobility" },
];
