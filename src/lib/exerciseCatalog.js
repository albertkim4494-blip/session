/**
 * Exercise catalog — auto-generated from ExerciseDB + custom exercises.
 *
 * DO NOT EDIT MANUALLY — regenerate with: node scripts/generate-catalog.js
 *
 * Each entry has: id, name, defaultUnit, muscles{primary[], secondary[], targetRaw?[], secondaryRaw?[]},
 *   equipment[], aliases[], tags[], movement, gifUrl?
 *
 * `defaultUnit` values: reps, min, sec, laps
 * `muscles.primary/secondary` values: ANTERIOR_DELT, LATERAL_DELT, POSTERIOR_DELT, CHEST, TRICEPS,
 *   BACK, BICEPS, FOREARMS, QUADS, HAMSTRINGS, GLUTES, CALVES, ABS, OBLIQUES
 *
 * Generated: 2026-02-15
 * ExerciseDB exercises: 365
 * Custom exercises: 60
 */

export const EQUIPMENT_CATEGORIES = {
  dumbbell:   new Set(["dumbbell"]),
  barbell:    new Set(["barbell"]),
  kettlebell: new Set(["kettlebell"]),
  bands:      new Set(["band"]),
  full_gym:   null, // no filter
};

export const EQUIPMENT_LABELS = {
  dumbbell: "Dumbbells",
  barbell: "Barbell & Rack",
  kettlebell: "Kettlebells",
  bands: "Bands",
  full_gym: "Full Gym",
};

export function buildAllowedEquipment(selected) {
  if (!Array.isArray(selected) || selected.length === 0) return new Set(["bodyweight"]);
  if (selected.includes("full_gym")) return null;
  const allowed = new Set(["bodyweight"]);
  for (const cat of selected) {
    const set = EQUIPMENT_CATEGORIES[cat];
    if (set) for (const eq of set) allowed.add(eq);
  }
  return allowed;
}

/**
 * Check if an exercise is available for a given equipment selection.
 * Accepts both new array format and legacy string format.
 */
export function exerciseFitsEquipment(entry, equipmentSelection) {
  // Handle legacy string values
  if (typeof equipmentSelection === "string") {
    const LEGACY = { home: [], basic: ["dumbbell", "kettlebell"], gym: ["full_gym"] };
    equipmentSelection = LEGACY[equipmentSelection] || ["full_gym"];
  }
  const allowed = buildAllowedEquipment(equipmentSelection);
  if (!allowed) return true;
  if (!entry.equipment || entry.equipment.length === 0) return true;
  return entry.equipment.some((e) => allowed.has(e));
}

export const EXERCISE_CATALOG = [
  {
    "id": "edb-C0MA9bC",
    "name": "Dumbbell One Arm Bent-over Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "one arm row",
      "single arm row",
      "one arm db row"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/C0MA9bC.gif"
  },
  {
    "id": "edb-b9kqlBy",
    "name": "Kettlebell Alternating Renegade Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ABS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "core",
        "shoulders"
      ]
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [
      "renegade row",
      "plank row"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/b9kqlBy.gif"
  },
  {
    "id": "edb-ZX9UZmj",
    "name": "Smith Bent Over Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/ZX9UZmj.gif"
  },
  {
    "id": "edb-7vG5o25",
    "name": "Dumbbell Incline Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "shoulders"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/7vG5o25.gif"
  },
  {
    "id": "edb-bZGHsAZ",
    "name": "Inverted Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "bodyweight row",
      "australian pull-up",
      "body row"
    ],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/bZGHsAZ.gif"
  },
  {
    "id": "edb-BJ0Hz5L",
    "name": "Dumbbell Bent Over Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "db row",
      "dumbbell row"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/BJ0Hz5L.gif"
  },
  {
    "id": "edb-SzX3uzM",
    "name": "Barbell Reverse Grip Bent Over Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "reverse grip row",
      "yates row",
      "underhand row"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/SzX3uzM.gif"
  },
  {
    "id": "edb-9pQSkH8",
    "name": "Dumbbell Reverse Grip Incline Bench Two Arm Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/9pQSkH8.gif"
  },
  {
    "id": "edb-eZyBC3j",
    "name": "Barbell Bent Over Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "bent over row",
      "barbell row",
      "bb row"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/eZyBC3j.gif"
  },
  {
    "id": "edb-aaXr7ld",
    "name": "Lever T Bar Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "t-bar row",
      "t bar row",
      "landmine row"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/aaXr7ld.gif"
  },
  {
    "id": "edb-nZZZy9m",
    "name": "Lever High Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "rear deltoids"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/nZZZy9m.gif"
  },
  {
    "id": "edb-fUBheHs",
    "name": "Cable Seated Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "seated row",
      "cable row",
      "seated cable row"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/fUBheHs.gif"
  },
  {
    "id": "edb-4f8RXP8",
    "name": "Cable Standing Row (v-bar)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "shoulders"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/4f8RXP8.gif"
  },
  {
    "id": "edb-GaSzzuh",
    "name": "Back Lever",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS",
        "ABS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms",
        "core"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/GaSzzuh.gif"
  },
  {
    "id": "edb-GSDioYu",
    "name": "Upper Back Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/GSDioYu.gif"
  },
  {
    "id": "edb-hbY9wqG",
    "name": "Front Lever Reps",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ABS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "core",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/hbY9wqG.gif"
  },
  {
    "id": "edb-yaAxcQr",
    "name": "Rope Climb",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "FOREARMS",
        "BICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "forearms",
        "biceps",
        "shoulders"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/yaAxcQr.gif"
  },
  {
    "id": "edb-4OaumBr",
    "name": "Suspended Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "trx row",
      "suspension row",
      "ring row"
    ],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/4OaumBr.gif"
  },
  {
    "id": "edb-r0z6xzQ",
    "name": "Barbell Pendlay Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "pendlay row",
      "strict row"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/r0z6xzQ.gif"
  },
  {
    "id": "edb-oHg8eop",
    "name": "Medicine Ball Overhead Slam",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "ABS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "shoulders",
        "core"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/oHg8eop.gif"
  },
  {
    "id": "edb-g9AsZ8P",
    "name": "Kettlebell One Arm Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/g9AsZ8P.gif"
  },
  {
    "id": "edb-EIsE3u8",
    "name": "Cable One Arm Bent Over Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/EIsE3u8.gif"
  },
  {
    "id": "edb-7I6LNUG",
    "name": "Lever Seated Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "machine row",
      "seated machine row"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/7I6LNUG.gif"
  },
  {
    "id": "edb-Nu7jqFE",
    "name": "Resistance Band Seated Straight Back Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/Nu7jqFE.gif"
  },
  {
    "id": "edb-SJqRxOt",
    "name": "Cable Rope Seated Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/SJqRxOt.gif"
  },
  {
    "id": "edb-3ZflifB",
    "name": "Cable Pushdown",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "FOREARMS"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "forearms"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "tricep pushdown",
      "triceps pushdown",
      "cable tricep pushdown"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/3ZflifB.gif"
  },
  {
    "id": "edb-mpKZGWz",
    "name": "Dumbbell Lying Triceps Extension",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "shoulders"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "db skull crusher",
      "dumbbell skull crusher",
      "lying db extension"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/mpKZGWz.gif"
  },
  {
    "id": "edb-W6PxUkg",
    "name": "Dumbbell Kickback",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "shoulders"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "tricep kickback",
      "kickback",
      "triceps kickback"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/W6PxUkg.gif"
  },
  {
    "id": "edb-ezTvXcr",
    "name": "Ring Dips",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "CHEST",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "chest",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "ring dip",
      "gymnastic ring dip"
    ],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/ezTvXcr.gif"
  },
  {
    "id": "edb-kont8Ut",
    "name": "Dumbbell Seated Triceps Extension",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "shoulders"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "overhead tricep extension",
      "seated overhead extension",
      "db overhead extension"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/kont8Ut.gif"
  },
  {
    "id": "edb-PdmaD0N",
    "name": "Dumbbell Standing Triceps Extension",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "shoulders"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "standing overhead extension",
      "overhead extension"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/PdmaD0N.gif"
  },
  {
    "id": "edb-J6Dx1Mu",
    "name": "Barbell Close-grip Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "CHEST",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "chest",
        "shoulders"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "close grip bench",
      "cgbp",
      "close grip bench press"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/J6Dx1Mu.gif"
  },
  {
    "id": "edb-dU605di",
    "name": "Cable Pushdown (with Rope Attachment)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "FOREARMS"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "forearms"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "rope pushdown",
      "tricep rope pushdown",
      "rope tricep pushdown"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/dU605di.gif"
  },
  {
    "id": "edb-h8LFzo9",
    "name": "Barbell Lying Triceps Extension Skull Crusher",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "shoulders"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "skull crusher",
      "skull crushers",
      "lying triceps extension",
      "french press"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/h8LFzo9.gif"
  },
  {
    "id": "edb-soIB2rj",
    "name": "Diamond Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "CHEST",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "chest",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "close grip push-up",
      "triangle push-up",
      "diamond pushup"
    ],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/soIB2rj.gif"
  },
  {
    "id": "edb-X6C6i5Y",
    "name": "Triceps Dip",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "CHEST",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "chest",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "bench dip",
      "tricep dip",
      "chair dip"
    ],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/X6C6i5Y.gif"
  },
  {
    "id": "edb-rQxwMxO",
    "name": "Handstand Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "CHEST",
        "ABS"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "shoulders",
        "chest",
        "core"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "hspu",
      "handstand pushup",
      "pike press"
    ],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/rQxwMxO.gif"
  },
  {
    "id": "edb-Eg98Ft9",
    "name": "Cable Shrug",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "traps"
      ],
      "secondaryRaw": [
        "shoulders"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "cable shrugs"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/Eg98Ft9.gif"
  },
  {
    "id": "edb-7xeukSt",
    "name": "Scapula Dips",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "traps"
      ],
      "secondaryRaw": [
        "rhomboids",
        "deltoids"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/7xeukSt.gif"
  },
  {
    "id": "edb-8ARQ9Hw",
    "name": "Kettlebell Sumo High Pull",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "GLUTES",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "traps"
      ],
      "secondaryRaw": [
        "shoulders",
        "glutes",
        "hamstrings"
      ]
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [
      "sumo high pull",
      "kb high pull"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/8ARQ9Hw.gif"
  },
  {
    "id": "edb-dG7tG5y",
    "name": "Barbell Shrug",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "traps"
      ],
      "secondaryRaw": [
        "shoulders"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "shrug",
      "shrugs",
      "bb shrug"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/dG7tG5y.gif"
  },
  {
    "id": "edb-NJzBsGJ",
    "name": "Dumbbell Shrug",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "traps"
      ],
      "secondaryRaw": [
        "shoulders"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "db shrug",
      "dumbbell shrugs"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/NJzBsGJ.gif"
  },
  {
    "id": "edb-uTBt1HV",
    "name": "Scapular Pull-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS"
      ],
      "targetRaw": [
        "traps"
      ],
      "secondaryRaw": [
        "biceps",
        "rhomboids",
        "rear deltoids"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/uTBt1HV.gif"
  },
  {
    "id": "edb-qLpO4vV",
    "name": "Back Extension on Exercise Ball",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "spine"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "stability ball back extension",
      "swiss ball back extension"
    ],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/qLpO4vV.gif"
  },
  {
    "id": "edb-rUXfn3R",
    "name": "Lever Back Extension",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "spine"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "machine back extension"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/rUXfn3R.gif"
  },
  {
    "id": "edb-01qpYSe",
    "name": "Upward Facing Dog",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "CHEST"
      ],
      "targetRaw": [
        "spine"
      ],
      "secondaryRaw": [
        "shoulders",
        "chest"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "upward dog",
      "up dog",
      "cobra stretch"
    ],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/01qpYSe.gif"
  },
  {
    "id": "edb-zhMwOwE",
    "name": "Hyperextension",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "spine"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "back extension",
      "hyper extension",
      "roman chair",
      "45 degree back extension"
    ],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/zhMwOwE.gif"
  },
  {
    "id": "edb-jV65tKx",
    "name": "Scapula Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "serratus anterior"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/jV65tKx.gif"
  },
  {
    "id": "edb-T2fA5Ir",
    "name": "Squat on Bosu Ball",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/T2fA5Ir.gif"
  },
  {
    "id": "edb-SGY8Zui",
    "name": "Barbell Clean and Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "HAMSTRINGS",
        "GLUTES",
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "hamstrings",
        "glutes",
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "clean and press",
      "clean & press",
      "clean press"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/SGY8Zui.gif"
  },
  {
    "id": "edb-BWnJR72",
    "name": "Lying (side) Quads Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "hamstrings"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/BWnJR72.gif"
  },
  {
    "id": "edb-wWFspEi",
    "name": "Smith Single Leg Split Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "smith bulgarian split squat",
      "smith machine split squat"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/wWFspEi.gif"
  },
  {
    "id": "edb-gfk9kD4",
    "name": "Barbell Overhead Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS",
        "CALVES",
        "ABS"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings",
        "calves",
        "core"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "overhead squat",
      "ohs"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/gfk9kD4.gif"
  },
  {
    "id": "edb-tFGKm99",
    "name": "Intermediate Hip Flexor and Quad Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "HAMSTRINGS",
        "GLUTES"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "hamstrings",
        "glutes"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/tFGKm99.gif"
  },
  {
    "id": "edb-W31mMjd",
    "name": "Barbell Side Split Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/W31mMjd.gif"
  },
  {
    "id": "edb-dG5Smob",
    "name": "Snatch Pull",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "HAMSTRINGS",
        "GLUTES",
        "CALVES"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "hamstrings",
        "glutes",
        "calves"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "snatch high pull"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/dG5Smob.gif"
  },
  {
    "id": "edb-qx4fgX7",
    "name": "Dumbbell Single Leg Split Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "bulgarian split squat",
      "db bulgarian",
      "rear foot elevated split squat",
      "bss"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/qx4fgX7.gif"
  },
  {
    "id": "edb-mweqJin",
    "name": "Quick Feet V. 2",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "CALVES",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "calves",
        "hamstrings"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/mweqJin.gif"
  },
  {
    "id": "edb-9E25EOx",
    "name": "Split Squats",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "split squat",
      "static lunge"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/9E25EOx.gif"
  },
  {
    "id": "edb-uZKq7lo",
    "name": "Forward Jump",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "CALVES",
        "HAMSTRINGS",
        "GLUTES"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "calves",
        "hamstrings",
        "glutes"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/uZKq7lo.gif"
  },
  {
    "id": "edb-Y1MsI1l",
    "name": "Resistance Band Leg Extension",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "hamstrings"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Y1MsI1l.gif"
  },
  {
    "id": "edb-my33uHU",
    "name": "Lever Leg Extension",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "hamstrings"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "leg extension",
      "quad extension",
      "leg extensions"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/my33uHU.gif"
  },
  {
    "id": "edb-xdYPUtE",
    "name": "Sissy Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "CALVES",
        "GLUTES"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "calves",
        "glutes"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "sissy squats"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/xdYPUtE.gif"
  },
  {
    "id": "edb-yn8yg1r",
    "name": "Dumbbell Goblet Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "goblet squat",
      "db goblet squat"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/yn8yg1r.gif"
  },
  {
    "id": "edb-V07qpXy",
    "name": "Leg Press (Machine)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "HAMSTRINGS",
        "GLUTES"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "hamstrings",
        "glutes"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "leg press",
      "machine leg press",
      "45 degree leg press"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/V07qpXy.gif"
  },
  {
    "id": "edb-qPEzJjA",
    "name": "Farmers Walk",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "CALVES",
        "FOREARMS",
        "ABS"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "calves",
        "forearms",
        "core"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "farmer walk",
      "farmer carry",
      "farmer's walk",
      "farmers carry",
      "loaded carry"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/qPEzJjA.gif"
  },
  {
    "id": "edb-DOoWcnA",
    "name": "Lever Chest Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "machine chest press",
      "chest press machine",
      "seated chest press"
    ],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/DOoWcnA.gif"
  },
  {
    "id": "edb-UKWTJWR",
    "name": "Cable Standing Up Straight Crossovers",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "deltoids",
        "triceps"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/UKWTJWR.gif"
  },
  {
    "id": "edb-gw9PqGk",
    "name": "Full Planche Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS",
        "ABS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps",
        "core"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/gw9PqGk.gif"
  },
  {
    "id": "edb-IaGQCrC",
    "name": "Suspended Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT",
        "ABS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders",
        "core"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/IaGQCrC.gif"
  },
  {
    "id": "edb-xLYSdtg",
    "name": "Cable Middle Fly",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "deltoids",
        "triceps"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "cable fly",
      "cable crossover",
      "cable flye",
      "cable chest fly"
    ],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/xLYSdtg.gif"
  },
  {
    "id": "edb-PAgTVaK",
    "name": "Assisted Chest Dip (kneeling)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/PAgTVaK.gif"
  },
  {
    "id": "edb-9sgNE2O",
    "name": "Barbell Decline Pullover",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/9sgNE2O.gif"
  },
  {
    "id": "edb-sVvXT5J",
    "name": "Exercise Ball Pike Push Up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS",
        "ABS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps",
        "core"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/sVvXT5J.gif"
  },
  {
    "id": "edb-3TZduzM",
    "name": "Barbell Incline Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "incline bench",
      "incline press",
      "incline barbell press"
    ],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/3TZduzM.gif"
  },
  {
    "id": "edb-ZOuKWir",
    "name": "Kneeling Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "knee push-up",
      "modified push-up",
      "beginner push-up"
    ],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/ZOuKWir.gif"
  },
  {
    "id": "edb-HbSG1Pw",
    "name": "Isometric Chest Squeeze",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/HbSG1Pw.gif"
  },
  {
    "id": "edb-MUic5zN",
    "name": "Single Arm Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT",
        "ABS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders",
        "core"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/MUic5zN.gif"
  },
  {
    "id": "edb-SpYC0Kp",
    "name": "Dumbbell Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "db bench press",
      "flat db press",
      "dumbbell press"
    ],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/SpYC0Kp.gif"
  },
  {
    "id": "edb-7saC5zz",
    "name": "Cable Decline Fly",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "decline cable fly",
      "low cable crossover"
    ],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/7saC5zz.gif"
  },
  {
    "id": "edb-Snj1wSv",
    "name": "Plyo Push Up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT",
        "ABS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders",
        "core"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "plyometric push-up",
      "explosive push-up",
      "plyo pushup"
    ],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/Snj1wSv.gif"
  },
  {
    "id": "edb-9WTm7dq",
    "name": "Chest Dip",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "dips",
      "parallel bar dip",
      "chest dips"
    ],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/9WTm7dq.gif"
  },
  {
    "id": "edb-I1OBLnn",
    "name": "Weighted Svend Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "svend press",
      "plate squeeze press"
    ],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/I1OBLnn.gif"
  },
  {
    "id": "edb-rWoBmi5",
    "name": "Korean Dips",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/rWoBmi5.gif"
  },
  {
    "id": "edb-9XjtHvS",
    "name": "Dumbbell Pullover",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "BACK",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "latissimus dorsi",
        "triceps"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "db pullover",
      "chest pullover"
    ],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/9XjtHvS.gif"
  },
  {
    "id": "edb-xXm4nYq",
    "name": "Dumbbell Decline Fly",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/xXm4nYq.gif"
  },
  {
    "id": "edb-v3xmPAR",
    "name": "Lever Seated Fly",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "BACK"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "deltoids",
        "trapezius"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/v3xmPAR.gif"
  },
  {
    "id": "edb-PG1kcIb",
    "name": "Dumbbell Incline Hammer Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/PG1kcIb.gif"
  },
  {
    "id": "edb-i5cEhka",
    "name": "Decline Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "feet elevated push-up",
      "decline pushup"
    ],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/i5cEhka.gif"
  },
  {
    "id": "edb-7xI5MXA",
    "name": "Cable Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/7xI5MXA.gif"
  },
  {
    "id": "edb-trqKQv2",
    "name": "Smith Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/trqKQv2.gif"
  },
  {
    "id": "edb-4x5Okof",
    "name": "Resistance Band Seated Chest Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/4x5Okof.gif"
  },
  {
    "id": "edb-EIeI8Vf",
    "name": "Barbell Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "bench press",
      "flat bench",
      "bench",
      "flat bench press",
      "bb bench press"
    ],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/EIeI8Vf.gif"
  },
  {
    "id": "edb-LEH9jxP",
    "name": "Push-up (wall)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "deltoids"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/LEH9jxP.gif"
  },
  {
    "id": "edb-nIR4Rwl",
    "name": "Cable Seated Chest Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/nIR4Rwl.gif"
  },
  {
    "id": "edb-rg59QCH",
    "name": "Kettlebell One Arm Floor Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/rg59QCH.gif"
  },
  {
    "id": "edb-5v7KYld",
    "name": "Smith Incline Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/5v7KYld.gif"
  },
  {
    "id": "edb-I4hDWkc",
    "name": "Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT",
        "ABS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "deltoids",
        "core"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "pushup",
      "push up",
      "press up"
    ],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/I4hDWkc.gif"
  },
  {
    "id": "edb-tBWXbIT",
    "name": "Cable Incline Fly",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "deltoids",
        "triceps"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "low to high cable fly",
      "incline cable fly"
    ],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/tBWXbIT.gif"
  },
  {
    "id": "edb-vptOQ4N",
    "name": "Deep Push Up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/vptOQ4N.gif"
  },
  {
    "id": "edb-Ff18ItA",
    "name": "Weighted Straight Bar Dip",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/Ff18ItA.gif"
  },
  {
    "id": "edb-A9qxk2F",
    "name": "Archer Push Up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT",
        "ABS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders",
        "core"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/A9qxk2F.gif"
  },
  {
    "id": "edb-4GqRrAk",
    "name": "Superman Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ABS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "core",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/4GqRrAk.gif"
  },
  {
    "id": "edb-DwhEmmE",
    "name": "Dumbbell Decline Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "decline db press",
      "db decline press"
    ],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/DwhEmmE.gif"
  },
  {
    "id": "edb-yz9nUhF",
    "name": "Dumbbell Fly",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "dumbbell flye",
      "db fly",
      "flat fly",
      "chest fly",
      "pec fly"
    ],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/yz9nUhF.gif"
  },
  {
    "id": "edb-epOSYUZ",
    "name": "Modified Hindu Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT",
        "ABS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders",
        "core"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/epOSYUZ.gif"
  },
  {
    "id": "edb-OVLmUuL",
    "name": "Dumbbell Incline Palm-in Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/OVLmUuL.gif"
  },
  {
    "id": "edb-B1EVP9F",
    "name": "Incline Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "incline pushup",
      "elevated push-up"
    ],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/B1EVP9F.gif"
  },
  {
    "id": "edb-aDoFKrE",
    "name": "Medicine Ball Chest Pass",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/aDoFKrE.gif"
  },
  {
    "id": "edb-pvBMLHA",
    "name": "Push-up Plus",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/pvBMLHA.gif"
  },
  {
    "id": "edb-JmMVpR3",
    "name": "Wide Hand Push Up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "wide push-up",
      "wide pushup",
      "wide grip push-up"
    ],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/JmMVpR3.gif"
  },
  {
    "id": "edb-qEse6fe",
    "name": "Shoulder Tap Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ABS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "core"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/qEse6fe.gif"
  },
  {
    "id": "edb-3uj0Ozg",
    "name": "Dynamic Chest Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/3uj0Ozg.gif"
  },
  {
    "id": "edb-ESOd5Pl",
    "name": "Dumbbell Incline Fly",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "incline fly",
      "incline flye",
      "db incline fly"
    ],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/ESOd5Pl.gif"
  },
  {
    "id": "edb-i8BdLTK",
    "name": "Dumbbell Straight Arm Pullover",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "BACK",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "latissimus dorsi",
        "triceps"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/i8BdLTK.gif"
  },
  {
    "id": "edb-GrO65fd",
    "name": "Barbell Decline Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "decline bench",
      "decline press"
    ],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/GrO65fd.gif"
  },
  {
    "id": "edb-Uto7l43",
    "name": "Chest and Front of Shoulder Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "deltoids"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/Uto7l43.gif"
  },
  {
    "id": "edb-jHAnWmT",
    "name": "Lever Incline Chest Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/jHAnWmT.gif"
  },
  {
    "id": "edb-wigSg76",
    "name": "Clap Push Up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "clapping push-up",
      "clap pushup"
    ],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/wigSg76.gif"
  },
  {
    "id": "edb-W8KAlkI",
    "name": "Push-up Medicine Ball",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT",
        "ABS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders",
        "core"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/W8KAlkI.gif"
  },
  {
    "id": "edb-ns0SIbU",
    "name": "Dumbbell Incline Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "incline db press",
      "db incline press",
      "incline dumbbell press"
    ],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/ns0SIbU.gif"
  },
  {
    "id": "edb-72BC5Za",
    "name": "Archer Pull Up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/72BC5Za.gif"
  },
  {
    "id": "edb-7F1DVzn",
    "name": "Lever Front Pulldown",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "rhomboids",
        "rear deltoids"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "lat pulldown",
      "lat pull down",
      "pulldown",
      "front pulldown"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/7F1DVzn.gif"
  },
  {
    "id": "edb-r1XNRYB",
    "name": "Band Assisted Pull-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/r1XNRYB.gif"
  },
  {
    "id": "edb-ecpY0rH",
    "name": "Reverse Grip Machine Lat Pulldown",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/ecpY0rH.gif"
  },
  {
    "id": "edb-Q2Eu1Ax",
    "name": "Cable Lying Extension Pullover (with Rope Attachment)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/Q2Eu1Ax.gif"
  },
  {
    "id": "edb-lBDjFxJ",
    "name": "Pull-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "pullup",
      "pull up"
    ],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/lBDjFxJ.gif"
  },
  {
    "id": "edb-qdRxqCj",
    "name": "Cable Pulldown (pro Lat Bar)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "cable lat pulldown",
      "wide grip pulldown",
      "cable pulldown"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/qdRxqCj.gif"
  },
  {
    "id": "edb-yJUHKTn",
    "name": "Muscle Up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "TRICEPS",
        "ANTERIOR_DELT",
        "CHEST"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "triceps",
        "shoulders",
        "chest"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "muscle-up",
      "bar muscle up"
    ],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/yJUHKTn.gif"
  },
  {
    "id": "edb-x69MAlq",
    "name": "Cable Straight Arm Pulldown",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "BICEPS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "shoulders",
        "biceps"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "straight arm pulldown",
      "straight arm pushdown",
      "stiff arm pulldown"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/x69MAlq.gif"
  },
  {
    "id": "edb-DptumMx",
    "name": "Band Close-grip Pulldown",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/DptumMx.gif"
  },
  {
    "id": "edb-HjdqmZa",
    "name": "One Arm Chin-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/HjdqmZa.gif"
  },
  {
    "id": "edb-i6LWjok",
    "name": "Barbell Pullover",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "CHEST",
        "TRICEPS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "chest",
        "triceps"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/i6LWjok.gif"
  },
  {
    "id": "edb-T2mxWqc",
    "name": "Chin-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "chinup",
      "chin up",
      "underhand pull-up"
    ],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/T2mxWqc.gif"
  },
  {
    "id": "edb-f38OEuO",
    "name": "Kneeling Lat Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/f38OEuO.gif"
  },
  {
    "id": "edb-Qqi7bko",
    "name": "Wide Grip Pull-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "wide pull-up",
      "wide pullup"
    ],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/Qqi7bko.gif"
  },
  {
    "id": "edb-xBYcQHj",
    "name": "Cable Underhand Pulldown",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "reverse grip pulldown",
      "underhand pulldown",
      "reverse pulldown"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/xBYcQHj.gif"
  },
  {
    "id": "edb-4U7iLb5",
    "name": "Lever Pullover",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "triceps",
        "shoulders"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/4U7iLb5.gif"
  },
  {
    "id": "edb-kiJ4Z2K",
    "name": "Assisted Pull-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/kiJ4Z2K.gif"
  },
  {
    "id": "edb-VnfUNW7",
    "name": "Close Grip Chin-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/VnfUNW7.gif"
  },
  {
    "id": "edb-HMzLjXx",
    "name": "Weighted Pull-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "weighted pullup",
      "weighted chin-up"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/HMzLjXx.gif"
  },
  {
    "id": "edb-YAk5dIw",
    "name": "Reverse Grip Pull-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/YAk5dIw.gif"
  },
  {
    "id": "edb-d1GgzTU",
    "name": "L-pull-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/d1GgzTU.gif"
  },
  {
    "id": "edb-Zg3XY7P",
    "name": "Lever Seated Leg Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "CALVES"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "calves"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "leg curl",
      "hamstring curl",
      "seated leg curl",
      "leg curls"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Zg3XY7P.gif"
  },
  {
    "id": "edb-FkBIE6a",
    "name": "Dumbbell Lying Femoral",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "GLUTES"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "glutes"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/FkBIE6a.gif"
  },
  {
    "id": "edb-99rWm7w",
    "name": "Hamstring Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "GLUTES"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "glutes"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "standing hamstring stretch",
      "toe touch"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/99rWm7w.gif"
  },
  {
    "id": "edb-0mB6wHO",
    "name": "Runners Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "CALVES",
        "QUADS"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "calves",
        "quadriceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "runner's stretch",
      "hip flexor stretch"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight",
      "cardio"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/0mB6wHO.gif"
  },
  {
    "id": "edb-Vvwjz6N",
    "name": "Glute-ham Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "GLUTES",
        "BACK"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "glutes",
        "lower back"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "ghr",
      "glute ham raise",
      "nordic curl"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Vvwjz6N.gif"
  },
  {
    "id": "edb-LHWF7us",
    "name": "Kettlebell Hang Clean",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "GLUTES",
        "QUADS",
        "CALVES"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "glutes",
        "quadriceps",
        "calves"
      ]
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [
      "hang clean",
      "kb hang clean"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/LHWF7us.gif"
  },
  {
    "id": "edb-hrVQWvE",
    "name": "Barbell Straight Leg Deadlift",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "GLUTES",
        "BACK"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "glutes",
        "lower back"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "straight leg deadlift",
      "sldl",
      "stiff legged deadlift"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/hrVQWvE.gif"
  },
  {
    "id": "edb-XlZ4lAC",
    "name": "Barbell Good Morning",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "lower back"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "good morning",
      "good mornings",
      "gm"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/XlZ4lAC.gif"
  },
  {
    "id": "edb-ZSY3MsL",
    "name": "Self Assisted Inverse Leg Curl (on Floor)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "GLUTES",
        "CALVES"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "glutes",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/ZSY3MsL.gif"
  },
  {
    "id": "edb-SiWCcTN",
    "name": "Power Clean",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "GLUTES",
        "QUADS",
        "CALVES"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "glutes",
        "quadriceps",
        "calves"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "clean",
      "power cleans"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/SiWCcTN.gif"
  },
  {
    "id": "edb-DFGXwZr",
    "name": "World Greatest Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "GLUTES",
        "QUADS",
        "CALVES"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "glutes",
        "quadriceps",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "world's greatest stretch",
      "wgs"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/DFGXwZr.gif"
  },
  {
    "id": "edb-ZA8b5hc",
    "name": "Kettlebell Goblet Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [
      "kb goblet squat",
      "kettlebell squat"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/ZA8b5hc.gif"
  },
  {
    "id": "edb-gKozT8X",
    "name": "Dumbbell Single Leg Deadlift",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "HAMSTRINGS",
        "GLUTES"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "lower back"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "single leg deadlift",
      "one leg deadlift"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/gKozT8X.gif"
  },
  {
    "id": "edb-wQ2c4XD",
    "name": "Barbell Romanian Deadlift",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "GLUTES",
        "BACK"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "lower back"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "rdl",
      "romanian deadlift",
      "stiff leg deadlift"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/wQ2c4XD.gif"
  },
  {
    "id": "edb-Ha7SZ3y",
    "name": "Kettlebell Turkish Get Up (squat Style)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "ABS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "core"
      ]
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [
      "turkish get up",
      "tgu",
      "turkish getup"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Ha7SZ3y.gif"
  },
  {
    "id": "edb-DB0n8AG",
    "name": "Kettlebell Front Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [
      "kb front squat"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/DB0n8AG.gif"
  },
  {
    "id": "edb-nUwVh7b",
    "name": "Dumbbell Deadlift",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK",
        "HAMSTRINGS",
        "GLUTES"
      ],
      "secondary": [],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "lower back"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "db deadlift"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/nUwVh7b.gif"
  },
  {
    "id": "edb-6pTkI99",
    "name": "Dumbbell One Arm Snatch",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS",
        "ABS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "quadriceps",
        "core"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "db snatch",
      "dumbbell snatch"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/6pTkI99.gif"
  },
  {
    "id": "edb-KgI0tqW",
    "name": "Barbell Sumo Deadlift",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES",
        "HAMSTRINGS",
        "QUADS"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "quadriceps",
        "lower back"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "sumo deadlift",
      "sumo dl",
      "wide stance deadlift"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/KgI0tqW.gif"
  },
  {
    "id": "edb-gUjqdei",
    "name": "Curtsey Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "curtsy lunge",
      "curtsey lunge",
      "crossover lunge"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/gUjqdei.gif"
  },
  {
    "id": "edb-E4R8Hz1",
    "name": "Band Hip Lift",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "quadriceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "banded hip thrust",
      "band glute bridge"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/E4R8Hz1.gif"
  },
  {
    "id": "edb-1gFNTZV",
    "name": "Barbell Jump Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "jump squat barbell"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/1gFNTZV.gif"
  },
  {
    "id": "edb-t8iSghb",
    "name": "Barbell Lunge",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "bb lunge",
      "barbell walking lunge"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/t8iSghb.gif"
  },
  {
    "id": "edb-OM46QHm",
    "name": "Cable Pull Through (with Rope)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "BACK"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "lower back"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "cable pull through",
      "pull through",
      "cable pull-through"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/OM46QHm.gif"
  },
  {
    "id": "edb-SSsBDwB",
    "name": "Dumbbell Rear Lunge",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "reverse lunge",
      "step back lunge"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/SSsBDwB.gif"
  },
  {
    "id": "edb-oZjMu1t",
    "name": "Tire Flip",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS",
        "ABS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "quadriceps",
        "core"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "tire flips",
      "tyre flip"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/oZjMu1t.gif"
  },
  {
    "id": "edb-d960PgE",
    "name": "Barbell Seated Good Morning",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "BACK"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "lower back"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/d960PgE.gif"
  },
  {
    "id": "edb-GWoKnIm",
    "name": "Weighted Cossack Squats",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/GWoKnIm.gif"
  },
  {
    "id": "edb-dzz6BiV",
    "name": "Smith Sumo Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/dzz6BiV.gif"
  },
  {
    "id": "edb-jFtipLl",
    "name": "Smith Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "smith machine squat"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/jFtipLl.gif"
  },
  {
    "id": "edb-qKBpF7I",
    "name": "Barbell Glute Bridge",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "BACK"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "lower back"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "weighted glute bridge",
      "bb glute bridge"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/qKBpF7I.gif"
  },
  {
    "id": "edb-eGDudUV",
    "name": "Cable Deadlift",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES",
        "HAMSTRINGS",
        "BACK"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "quadriceps",
        "lower back"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/eGDudUV.gif"
  },
  {
    "id": "edb-UVo2Qs2",
    "name": "Flutter Kicks",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hip flexors",
        "lower abs"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/UVo2Qs2.gif"
  },
  {
    "id": "edb-10Z2DXU",
    "name": "Leg Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/10Z2DXU.gif"
  },
  {
    "id": "edb-OrETs32",
    "name": "Reverse Hyper on Flat Bench",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "BACK"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "lower back"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/OrETs32.gif"
  },
  {
    "id": "edb-pZwUsKB",
    "name": "Iron Cross Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "quadriceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/pZwUsKB.gif"
  },
  {
    "id": "edb-aXtJhlg",
    "name": "Dumbbell Step-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "step up",
      "step-up",
      "box step up"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/aXtJhlg.gif"
  },
  {
    "id": "edb-QY39eBr",
    "name": "Seated Piriformis Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/QY39eBr.gif"
  },
  {
    "id": "edb-qXTaZnJ",
    "name": "Barbell Full Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES",
        "ABS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves",
        "core"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "squat",
      "back squat",
      "barbell squat",
      "bb squat"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/qXTaZnJ.gif"
  },
  {
    "id": "edb-Qa55kX1",
    "name": "Sled Hack Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "hack squat",
      "machine hack squat"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Qa55kX1.gif"
  },
  {
    "id": "edb-LIlE5Tn",
    "name": "Jump Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "bodyweight jump squat",
      "squat jump"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/LIlE5Tn.gif"
  },
  {
    "id": "edb-Kxquu2E",
    "name": "Barbell Step-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "barbell step up",
      "weighted step up"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Kxquu2E.gif"
  },
  {
    "id": "edb-rR0LJzx",
    "name": "Dumbbell Romanian Deadlift",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "GLUTES",
        "BACK"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "lower back"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "db rdl",
      "dumbbell rdl"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/rR0LJzx.gif"
  },
  {
    "id": "edb-C31LMnP",
    "name": "One Leg Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "one legged squat",
      "assisted pistol squat"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/C31LMnP.gif"
  },
  {
    "id": "edb-zG0zs85",
    "name": "Barbell Front Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS",
        "CALVES",
        "ABS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves",
        "core"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "front squat",
      "front rack squat"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/zG0zs85.gif"
  },
  {
    "id": "edb-jQGwmxN",
    "name": "Trap Bar Deadlift",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "HAMSTRINGS"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "quadriceps",
        "lower back"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "hex bar deadlift",
      "trap bar dl"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/jQGwmxN.gif"
  },
  {
    "id": "edb-nqs5HGV",
    "name": "Single Leg Squat (pistol) Male",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "pistol squat",
      "pistol",
      "single leg squat"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/nqs5HGV.gif"
  },
  {
    "id": "edb-IZVHb27",
    "name": "Walking Lunge",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "walking lunges",
      "lunge walk"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/IZVHb27.gif"
  },
  {
    "id": "edb-LSTChY9",
    "name": "Barbell Zercher Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES",
        "ABS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves",
        "core"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "zercher squat",
      "zercher"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/LSTChY9.gif"
  },
  {
    "id": "edb-ila4NZS",
    "name": "Barbell Deadlift",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK",
        "HAMSTRINGS",
        "GLUTES"
      ],
      "secondary": [],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "lower back"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "deadlift",
      "conventional deadlift",
      "dl"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/ila4NZS.gif"
  },
  {
    "id": "edb-GibBPPg",
    "name": "Glute Bridge March",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "quadriceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "glute bridge",
      "bridge",
      "hip bridge"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/GibBPPg.gif"
  },
  {
    "id": "edb-UHJlbu3",
    "name": "Kettlebell Swing",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "ABS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "core"
      ]
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [
      "kb swing",
      "kettlebell swings",
      "russian swing"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/UHJlbu3.gif"
  },
  {
    "id": "edb-PM1PZjg",
    "name": "Lunge with Jump",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "jump lunge",
      "jumping lunge",
      "split jump"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/PM1PZjg.gif"
  },
  {
    "id": "edb-WWD6FzI",
    "name": "Single Leg Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/WWD6FzI.gif"
  },
  {
    "id": "edb-u27Kcdz",
    "name": "Bench Hip Extension",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/u27Kcdz.gif"
  },
  {
    "id": "edb-RRWFUcw",
    "name": "Dumbbell Lunge",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "db lunge",
      "weighted lunge"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/RRWFUcw.gif"
  },
  {
    "id": "edb-O95afRA",
    "name": "Monster Walk",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "quadriceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/O95afRA.gif"
  },
  {
    "id": "edb-kMzUs9Y",
    "name": "Forward Lunge",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "lunge",
      "lunges",
      "forward lunges"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/kMzUs9Y.gif"
  },
  {
    "id": "edb-7Hg55JG",
    "name": "Dumbbell Clean",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "quadriceps",
        "calves"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "db clean",
      "dumbbell power clean"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/7Hg55JG.gif"
  },
  {
    "id": "edb-py1HSzx",
    "name": "Barbell Lateral Lunge",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/py1HSzx.gif"
  },
  {
    "id": "edb-2Dk4xQV",
    "name": "Rocking Frog Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings",
        "quadriceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/2Dk4xQV.gif"
  },
  {
    "id": "edb-mtXengz",
    "name": "Dumbbell Finger Curls",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [],
      "targetRaw": [
        "forearms"
      ],
      "secondaryRaw": [
        "wrist flexors",
        "wrist extensors"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "finger curl",
      "grip training"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/mtXengz.gif"
  },
  {
    "id": "edb-82LxxkW",
    "name": "Barbell Wrist Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "BICEPS"
      ],
      "targetRaw": [
        "forearms"
      ],
      "secondaryRaw": [
        "biceps",
        "brachialis"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "wrist curl",
      "forearm curl"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/82LxxkW.gif"
  },
  {
    "id": "edb-LsZkfU6",
    "name": "Barbell Reverse Wrist Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "BICEPS"
      ],
      "targetRaw": [
        "forearms"
      ],
      "secondaryRaw": [
        "biceps",
        "brachialis"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "reverse wrist curl",
      "wrist extension"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/LsZkfU6.gif"
  },
  {
    "id": "edb-bd5b860",
    "name": "Wrist Rollerer",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "BICEPS",
        "TRICEPS"
      ],
      "targetRaw": [
        "forearms"
      ],
      "secondaryRaw": [
        "biceps",
        "triceps"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/bd5b860.gif"
  },
  {
    "id": "edb-awG04cF",
    "name": "Finger Curls",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [],
      "targetRaw": [
        "forearms"
      ],
      "secondaryRaw": [
        "wrist flexors",
        "grip muscles"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/awG04cF.gif"
  },
  {
    "id": "edb-FWdVhcW",
    "name": "Cable Standing Shoulder External Rotation",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "rotator cuff",
        "trapezius"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/FWdVhcW.gif"
  },
  {
    "id": "edb-bmBf7LN",
    "name": "Dumbbell Lying External Shoulder Rotation",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "TRICEPS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "rotator cuff",
        "triceps"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/bmBf7LN.gif"
  },
  {
    "id": "edb-u2X71Np",
    "name": "Cable Front Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "TRICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "triceps",
        "forearms"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/u2X71Np.gif"
  },
  {
    "id": "edb-hxyTtWj",
    "name": "Dumbbell Seated Lateral Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "LATERAL_DELT"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "traps",
        "upper back"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "seated lateral raise",
      "seated side raise"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/hxyTtWj.gif"
  },
  {
    "id": "edb-wdRZISl",
    "name": "Barbell Standing Close Grip Military Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "TRICEPS",
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "triceps",
        "upper back"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "military press",
      "strict press",
      "barbell ohp"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/wdRZISl.gif"
  },
  {
    "id": "edb-tc5dYrf",
    "name": "Band Standing Rear Delt Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "POSTERIOR_DELT"
      ],
      "secondary": [
        "BACK",
        "BICEPS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "trapezius",
        "rhomboids",
        "biceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/tc5dYrf.gif"
  },
  {
    "id": "edb-xMjBKwn",
    "name": "Dumbbell Lateral to Front Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "BACK",
        "BICEPS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "trapezius",
        "biceps"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/xMjBKwn.gif"
  },
  {
    "id": "edb-EAs3xL9",
    "name": "Dumbbell Reverse Fly",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "POSTERIOR_DELT"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "trapezius",
        "rhomboids"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "reverse fly",
      "rear delt fly",
      "reverse flye",
      "bent over fly"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/EAs3xL9.gif"
  },
  {
    "id": "edb-aqvSOQE",
    "name": "Cable Cross-over Revers Fly",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "POSTERIOR_DELT"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "rhomboids",
        "trapezius"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "cable reverse fly",
      "cable rear delt fly",
      "reverse cable fly"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/aqvSOQE.gif"
  },
  {
    "id": "edb-f7Y9eDZ",
    "name": "Barbell Thruster",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "QUADS",
        "GLUTES",
        "HAMSTRINGS",
        "ABS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "quadriceps",
        "glutes",
        "hamstrings",
        "core"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "thruster",
      "thrusters",
      "front squat to press"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/f7Y9eDZ.gif"
  },
  {
    "id": "edb-cALKspW",
    "name": "Cable Upright Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "BACK",
        "BICEPS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "traps",
        "biceps"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "upright row cable"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/cALKspW.gif"
  },
  {
    "id": "edb-xUwnBMT",
    "name": "Smith Seated Shoulder Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "TRICEPS",
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "triceps",
        "upper back"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "smith machine shoulder press",
      "smith press"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/xUwnBMT.gif"
  },
  {
    "id": "edb-UDlhcO8",
    "name": "Barbell Upright Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "BACK",
        "BICEPS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "traps",
        "biceps"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "upright row",
      "bb upright row"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/UDlhcO8.gif"
  },
  {
    "id": "edb-QfAKy1G",
    "name": "Dumbbell Cuban Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "TRICEPS",
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "triceps",
        "upper back"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/QfAKy1G.gif"
  },
  {
    "id": "edb-aXcUyKb",
    "name": "Kettlebell One Arm Snatch",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "BACK",
        "FOREARMS",
        "ABS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "trapezius",
        "forearms",
        "core"
      ]
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [
      "kb snatch",
      "kettlebell snatch"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/aXcUyKb.gif"
  },
  {
    "id": "edb-v1qBec9",
    "name": "Dumbbell Rear Lateral Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "LATERAL_DELT"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "traps",
        "rhomboids"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "rear delt raise",
      "bent over lateral raise"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/v1qBec9.gif"
  },
  {
    "id": "edb-BkxB8LW",
    "name": "Kettlebell Seated Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "TRICEPS",
        "ABS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "triceps",
        "core"
      ]
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/BkxB8LW.gif"
  },
  {
    "id": "edb-DsgkuIt",
    "name": "Dumbbell Lateral Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "LATERAL_DELT"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "traps"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "lateral raise",
      "side raise",
      "side lateral raise",
      "lat raise"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/DsgkuIt.gif"
  },
  {
    "id": "edb-sTfvVsG",
    "name": "Band Reverse Fly",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "POSTERIOR_DELT"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "upper back",
        "trapezius"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "band rear delt fly",
      "resistance band reverse fly"
    ],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/sTfvVsG.gif"
  },
  {
    "id": "edb-Xy4jlWA",
    "name": "Dumbbell Arnold Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "TRICEPS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "triceps",
        "upper chest"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "arnold press",
      "arnold shoulder press"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/Xy4jlWA.gif"
  },
  {
    "id": "edb-FS63wTN",
    "name": "Dumbbell Push Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "TRICEPS",
        "ABS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "triceps",
        "core"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "push press",
      "db push press"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/FS63wTN.gif"
  },
  {
    "id": "edb-3eGE2JC",
    "name": "Dumbbell Front Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "BICEPS",
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "biceps",
        "trapezius"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "front raise",
      "front delt raise"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/3eGE2JC.gif"
  },
  {
    "id": "edb-A6wtbuL",
    "name": "Dumbbell Standing Overhead Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "TRICEPS",
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "triceps",
        "upper back"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "overhead press",
      "ohp",
      "shoulder press",
      "db overhead press",
      "standing press"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/A6wtbuL.gif"
  },
  {
    "id": "edb-RJa4tCo",
    "name": "Battling Ropes",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "FOREARMS",
        "ABS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "forearms",
        "core"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "battle ropes",
      "battle rope",
      "rope slams",
      "rope waves"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/RJa4tCo.gif"
  },
  {
    "id": "edb-ainizkb",
    "name": "Dumbbell Upright Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "BACK",
        "BICEPS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "traps",
        "biceps"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "db upright row"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/ainizkb.gif"
  },
  {
    "id": "edb-goJ6ezq",
    "name": "Cable Lateral Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "LATERAL_DELT"
      ],
      "secondary": [
        "BACK",
        "TRICEPS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "traps",
        "triceps"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "cable side raise"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/goJ6ezq.gif"
  },
  {
    "id": "edb-xifhB5W",
    "name": "Rear Deltoid Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "POSTERIOR_DELT"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "trapezius",
        "rhomboids"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/xifhB5W.gif"
  },
  {
    "id": "edb-TFA88iB",
    "name": "Band Front Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "TRICEPS",
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "triceps",
        "upper back"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/TFA88iB.gif"
  },
  {
    "id": "edb-znQUdHY",
    "name": "Dumbbell Seated Shoulder Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "TRICEPS",
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "triceps",
        "upper back"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/znQUdHY.gif"
  },
  {
    "id": "edb-wqNPGCg",
    "name": "Cable Rear Delt Row (with Rope)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "POSTERIOR_DELT"
      ],
      "secondary": [
        "BACK",
        "BICEPS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "trapezius",
        "rhomboids",
        "biceps"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/wqNPGCg.gif"
  },
  {
    "id": "custom-cable-face-pull",
    "name": "Cable Face Pull",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "POSTERIOR_DELT"
      ],
      "secondary": [
        "BACK",
        "BICEPS"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "face pull",
      "rope face pull",
      "cable rope face pull",
      "face pulls"
    ],
    "tags": [
      "compound",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/ZfyAGhK.gif"
  },
  {
    "id": "edb-PzQanLE",
    "name": "Cable Shoulder Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "TRICEPS",
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "triceps",
        "upper back"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/PzQanLE.gif"
  },
  {
    "id": "edb-peAeMR3",
    "name": "Band Shoulder Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "TRICEPS",
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "triceps",
        "upper back"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/peAeMR3.gif"
  },
  {
    "id": "edb-b2Uoz54",
    "name": "Barbell Front Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "BICEPS",
        "TRICEPS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "biceps",
        "triceps"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/b2Uoz54.gif"
  },
  {
    "id": "edb-67n3r98",
    "name": "Lever Shoulder Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "TRICEPS",
        "CHEST"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "triceps",
        "chest"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/67n3r98.gif"
  },
  {
    "id": "edb-kTbSH9h",
    "name": "Barbell Seated Overhead Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "TRICEPS",
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "triceps",
        "upper back"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "seated ohp",
      "seated press",
      "bb overhead press"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/kTbSH9h.gif"
  },
  {
    "id": "edb-myfUsKf",
    "name": "Lever Seated Reverse Fly",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "POSTERIOR_DELT"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "trapezius",
        "rhomboids"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "machine reverse fly",
      "pec deck reverse",
      "rear delt machine"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/myfUsKf.gif"
  },
  {
    "id": "edb-EKXOMEh",
    "name": "Dumbbell Rear Delt Row_shoulder",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "POSTERIOR_DELT"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "trapezius",
        "rhomboids"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/EKXOMEh.gif"
  },
  {
    "id": "edb-dRTfGZT",
    "name": "Lever Lateral Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "LATERAL_DELT"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "traps",
        "upper back"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/dRTfGZT.gif"
  },
  {
    "id": "edb-mu5Guxt",
    "name": "Dumbbell Rear Delt Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "POSTERIOR_DELT"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "trapezius",
        "rhomboids"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "rear delt raise db",
      "bent over raise"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/mu5Guxt.gif"
  },
  {
    "id": "edb-yWxMvB5",
    "name": "Kettlebell Thruster",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "QUADS",
        "GLUTES",
        "ABS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "quadriceps",
        "glutes",
        "core"
      ]
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [
      "kb thruster"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/yWxMvB5.gif"
  },
  {
    "id": "edb-H1PESYI",
    "name": "Stationary Bike Run",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/H1PESYI.gif"
  },
  {
    "id": "edb-oLrKqDH",
    "name": "Run",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "running",
      "jog",
      "jogging",
      "treadmill"
    ],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/oLrKqDH.gif"
  },
  {
    "id": "edb-5MRH8H2",
    "name": "Ski Step",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES",
        "CALVES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/5MRH8H2.gif"
  },
  {
    "id": "edb-tnaj0mT",
    "name": "Swing 360",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "ABS"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "shoulders",
        "core"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/tnaj0mT.gif"
  },
  {
    "id": "edb-j9Q5crt",
    "name": "Walking on Stepmill",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES",
        "CALVES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "stairmaster",
      "stair climber",
      "step mill",
      "stair stepper"
    ],
    "tags": [
      "isolation",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/j9Q5crt.gif"
  },
  {
    "id": "edb-zfNHMN9",
    "name": "Skater Hops",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES",
        "CALVES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "skaters",
      "speed skaters",
      "lateral hops"
    ],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/zfNHMN9.gif"
  },
  {
    "id": "edb-ealLwvX",
    "name": "High Knee Against Wall",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES",
        "CALVES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "high knees",
      "high knee run"
    ],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/ealLwvX.gif"
  },
  {
    "id": "edb-rjiM4L3",
    "name": "Walking on Incline Treadmill",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "incline walk",
      "treadmill incline",
      "incline treadmill"
    ],
    "tags": [
      "isolation",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/rjiM4L3.gif"
  },
  {
    "id": "edb-RJgzwny",
    "name": "Mountain Climber",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ABS",
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "core",
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "mountain climbers",
      "mt climber"
    ],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/RJgzwny.gif"
  },
  {
    "id": "edb-dK9394r",
    "name": "Burpee",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES",
        "ANTERIOR_DELT",
        "CHEST"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves",
        "shoulders",
        "chest"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "burpees"
    ],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/dK9394r.gif"
  },
  {
    "id": "edb-e1e76I2",
    "name": "Jump Rope",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "CALVES",
        "QUADS",
        "HAMSTRINGS",
        "GLUTES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "calves",
        "quadriceps",
        "hamstrings",
        "glutes"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "skipping",
      "skip rope",
      "skipping rope"
    ],
    "tags": [
      "isolation",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/e1e76I2.gif"
  },
  {
    "id": "edb-0Yz8WdV",
    "name": "Bear Crawl",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ABS",
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "core",
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/0Yz8WdV.gif"
  },
  {
    "id": "edb-km2Ljzj",
    "name": "Wheel Run",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/km2Ljzj.gif"
  },
  {
    "id": "edb-XSCHmiI",
    "name": "Cross Trainer",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "glutes"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "elliptical cross trainer"
    ],
    "tags": [
      "isolation",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/XSCHmiI.gif"
  },
  {
    "id": "edb-0JtKWum",
    "name": "Dumbbell Burpee",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES",
        "ANTERIOR_DELT",
        "TRICEPS",
        "ABS"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves",
        "shoulders",
        "triceps",
        "core"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/0JtKWum.gif"
  },
  {
    "id": "edb-fNGumX0",
    "name": "Back and Forth Step",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES",
        "CALVES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/fNGumX0.gif"
  },
  {
    "id": "edb-a8VDgLw",
    "name": "Stationary Bike",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "exercise bike",
      "spin bike",
      "cycling machine"
    ],
    "tags": [
      "isolation",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/a8VDgLw.gif"
  },
  {
    "id": "edb-rjtuP6X",
    "name": "Elliptical",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES",
        "CALVES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "elliptical machine",
      "elliptical trainer"
    ],
    "tags": [
      "isolation",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/rjtuP6X.gif"
  },
  {
    "id": "edb-HtfCpfi",
    "name": "Star Jump",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "jumping jack",
      "jumping jacks",
      "star jumps"
    ],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/HtfCpfi.gif"
  },
  {
    "id": "edb-J9zIWig",
    "name": "Walking High Knees Lunge",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES",
        "CALVES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/J9zIWig.gif"
  },
  {
    "id": "edb-8ozhUIZ",
    "name": "Barbell Standing Calf Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "GLUTES"
      ],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "hamstrings",
        "glutes"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "standing calf raise",
      "calf raise",
      "calf raises"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/8ozhUIZ.gif"
  },
  {
    "id": "edb-1kB3Wmk",
    "name": "Dumbbell Single Leg Calf Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "ankles"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/1kB3Wmk.gif"
  },
  {
    "id": "edb-bOOdeyc",
    "name": "Lever Seated Calf Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "soleus",
        "ankle stabilizers"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "machine seated calf raise"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/bOOdeyc.gif"
  },
  {
    "id": "edb-m0tCHqc",
    "name": "Calf Stretch with Hands Against Wall",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "hamstrings"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/m0tCHqc.gif"
  },
  {
    "id": "edb-u5ESqzH",
    "name": "Donkey Calf Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "GLUTES"
      ],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "hamstrings",
        "glutes"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "donkey calf",
      "donkey raise"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/u5ESqzH.gif"
  },
  {
    "id": "edb-Lsqrgh4",
    "name": "Smith Reverse Calf Raises",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "hamstrings"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Lsqrgh4.gif"
  },
  {
    "id": "edb-r29jP7S",
    "name": "Dumbbell Seated Calf Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "hamstrings"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "seated calf raise"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/r29jP7S.gif"
  },
  {
    "id": "edb-bJYHBIN",
    "name": "Bodyweight Standing Calf Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "ankles",
        "feet"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "bodyweight calf raise",
      "bw calf raise"
    ],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/bJYHBIN.gif"
  },
  {
    "id": "edb-dPmaUaU",
    "name": "Dumbbell Standing Calf Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "ankles"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/dPmaUaU.gif"
  },
  {
    "id": "edb-X7jbxra",
    "name": "Circles Knee Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS"
      ],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "hamstrings",
        "quadriceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/X7jbxra.gif"
  },
  {
    "id": "edb-qCNVnaU",
    "name": "Calf Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "hamstrings"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "leg press calf raise",
      "calf press on leg press"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/qCNVnaU.gif"
  },
  {
    "id": "edb-uL9CsKm",
    "name": "Ankle Circles",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "ankle stabilizers"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/uL9CsKm.gif"
  },
  {
    "id": "edb-ykUOVze",
    "name": "Lever Standing Calf Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "soleus",
        "ankle stabilizers"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "machine calf raise",
      "standing machine calf raise"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/ykUOVze.gif"
  },
  {
    "id": "edb-F3xgbjF",
    "name": "Dumbbell Incline Biceps Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "FOREARMS"
      ],
      "targetRaw": [
        "biceps"
      ],
      "secondaryRaw": [
        "forearms"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "incline curl",
      "incline dumbbell curl",
      "incline bicep curl"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/F3xgbjF.gif"
  },
  {
    "id": "edb-kXaIn5A",
    "name": "Dumbbell Zottman Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "FOREARMS"
      ],
      "targetRaw": [
        "biceps"
      ],
      "secondaryRaw": [
        "forearms"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "zottman curl",
      "zottman curls"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/kXaIn5A.gif"
  },
  {
    "id": "edb-IENzBdA",
    "name": "Barbell Drag Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "FOREARMS"
      ],
      "targetRaw": [
        "biceps"
      ],
      "secondaryRaw": [
        "forearms"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "drag curl",
      "body drag curl"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/IENzBdA.gif"
  },
  {
    "id": "edb-gvsWLQw",
    "name": "Dumbbell Concentration Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "FOREARMS"
      ],
      "targetRaw": [
        "biceps"
      ],
      "secondaryRaw": [
        "forearms"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "concentration curl",
      "seated concentration curl"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/gvsWLQw.gif"
  },
  {
    "id": "edb-guT8YnS",
    "name": "Biceps Pull-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "FOREARMS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "biceps"
      ],
      "secondaryRaw": [
        "forearms",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "biceps chin-up",
      "close grip pull-up"
    ],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/guT8YnS.gif"
  },
  {
    "id": "edb-qOgPVf6",
    "name": "Barbell Preacher Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "FOREARMS"
      ],
      "targetRaw": [
        "biceps"
      ],
      "secondaryRaw": [
        "forearms"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "preacher curl",
      "scott curl",
      "ez bar preacher curl"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/qOgPVf6.gif"
  },
  {
    "id": "edb-6TG6x2w",
    "name": "Ez Barbell Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "FOREARMS"
      ],
      "targetRaw": [
        "biceps"
      ],
      "secondaryRaw": [
        "forearms"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "ez curl",
      "ez bar curl",
      "easy bar curl",
      "cambered bar curl"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/6TG6x2w.gif"
  },
  {
    "id": "edb-25GPyDY",
    "name": "Barbell Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "FOREARMS"
      ],
      "targetRaw": [
        "biceps"
      ],
      "secondaryRaw": [
        "forearms"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "bb curl",
      "standing barbell curl",
      "bicep curl barbell"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/25GPyDY.gif"
  },
  {
    "id": "edb-NbVPDMW",
    "name": "Dumbbell Biceps Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "FOREARMS"
      ],
      "targetRaw": [
        "biceps"
      ],
      "secondaryRaw": [
        "forearms"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "bicep curl",
      "db curl",
      "dumbbell curl",
      "bicep curls"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/NbVPDMW.gif"
  },
  {
    "id": "edb-G08RZcQ",
    "name": "Cable Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "FOREARMS"
      ],
      "targetRaw": [
        "biceps"
      ],
      "secondaryRaw": [
        "forearms"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "cable bicep curl",
      "cable curls"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/G08RZcQ.gif"
  },
  {
    "id": "edb-slDvUAU",
    "name": "Dumbbell Hammer Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "FOREARMS"
      ],
      "targetRaw": [
        "biceps"
      ],
      "secondaryRaw": [
        "forearms"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "hammer curl",
      "hammer curls",
      "neutral grip curl"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/slDvUAU.gif"
  },
  {
    "id": "edb-HPlPoQA",
    "name": "Cable Hammer Curl (with Rope)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "FOREARMS"
      ],
      "targetRaw": [
        "biceps"
      ],
      "secondaryRaw": [
        "forearms"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "rope hammer curl",
      "cable rope curl"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/HPlPoQA.gif"
  },
  {
    "id": "edb-VO2qeJg",
    "name": "Side Plank Hip Adduction",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "OBLIQUES",
        "GLUTES"
      ],
      "targetRaw": [
        "adductors"
      ],
      "secondaryRaw": [
        "obliques",
        "glutes"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/VO2qeJg.gif"
  },
  {
    "id": "edb-oHsrypV",
    "name": "Lever Seated Hip Adduction",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "HAMSTRINGS",
        "GLUTES"
      ],
      "targetRaw": [
        "adductors"
      ],
      "secondaryRaw": [
        "hamstrings",
        "glutes"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "hip adduction",
      "adduction machine",
      "hip adductor",
      "inner thigh machine"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/oHsrypV.gif"
  },
  {
    "id": "edb-bWlZvXh",
    "name": "Butterfly Yoga Pose",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "adductors"
      ],
      "secondaryRaw": [
        "hamstrings",
        "groin"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/bWlZvXh.gif"
  },
  {
    "id": "edb-hBGWILP",
    "name": "Cable Hip Adduction",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "GLUTES"
      ],
      "targetRaw": [
        "adductors"
      ],
      "secondaryRaw": [
        "glutes",
        "quadriceps"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/hBGWILP.gif"
  },
  {
    "id": "edb-IpONWYv",
    "name": "Dumbbell Side Bend",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "side bends",
      "weighted side bend"
    ],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/IpONWYv.gif"
  },
  {
    "id": "edb-VBAWRPG",
    "name": "Weighted Front Plank",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "BACK"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "lower back"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "weighted plank",
      "plank with plate"
    ],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/VBAWRPG.gif"
  },
  {
    "id": "edb-s8nrDXF",
    "name": "Weighted Crunch",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/s8nrDXF.gif"
  },
  {
    "id": "edb-5VXmnV5",
    "name": "Bodyweight Incline Side Plank",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "side plank incline",
      "side plank hold incline"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/5VXmnV5.gif"
  },
  {
    "id": "edb-9pa4H5m",
    "name": "Band Horizontal Pallof Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES",
        "GLUTES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques",
        "glutes"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "pallof press",
      "anti-rotation press",
      "pallof"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/9pa4H5m.gif"
  },
  {
    "id": "edb-NKJ8o6x",
    "name": "Pelvic Tilt",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "lower back"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/NKJ8o6x.gif"
  },
  {
    "id": "edb-nCU1Ekp",
    "name": "Reverse Crunch",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "reverse crunches",
      "lower ab crunch"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/nCU1Ekp.gif"
  },
  {
    "id": "edb-ZNgOYQU",
    "name": "Vertical Leg Raise (on Parallel Bars)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "parallel bar leg raise",
      "knee raise on parallel bars"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/ZNgOYQU.gif"
  },
  {
    "id": "edb-WW95auq",
    "name": "Cable Kneeling Crunch",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "cable crunch",
      "cable crunches",
      "rope crunch"
    ],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/WW95auq.gif"
  },
  {
    "id": "edb-wPypxFY",
    "name": "Cable Side Bend",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "cable oblique",
      "cable side bends"
    ],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/wPypxFY.gif"
  },
  {
    "id": "edb-mbkgB44",
    "name": "Jackknife Sit-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "jackknife",
      "v-up",
      "pike crunch"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/mbkgB44.gif"
  },
  {
    "id": "edb-LYJodFS",
    "name": "Lean Planche",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "CHEST",
        "TRICEPS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "chest",
        "triceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "planche lean",
      "pseudo planche"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/LYJodFS.gif"
  },
  {
    "id": "edb-9Tkqa9O",
    "name": "Kettlebell Windmill",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques",
        "shoulders"
      ]
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/9Tkqa9O.gif"
  },
  {
    "id": "edb-YZ4961r",
    "name": "Full Planche",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "CHEST",
        "TRICEPS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "chest",
        "triceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/YZ4961r.gif"
  },
  {
    "id": "edb-EZeDVzO",
    "name": "Weighted Decline Sit-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "BACK"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors",
        "lower back"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/EZeDVzO.gif"
  },
  {
    "id": "edb-ZgsNQ6d",
    "name": "Inchworm",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "hamstrings"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "inchworms",
      "walk out"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/ZgsNQ6d.gif"
  },
  {
    "id": "edb-H6ETwO9",
    "name": "Band V-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/H6ETwO9.gif"
  },
  {
    "id": "edb-I3tsCnC",
    "name": "Hanging Leg Raise",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "hanging knee raise",
      "leg raise",
      "hanging leg raises"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/I3tsCnC.gif"
  },
  {
    "id": "edb-MCUhf1F",
    "name": "Crunch (on Stability Ball)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/MCUhf1F.gif"
  },
  {
    "id": "edb-ztAa1RK",
    "name": "Band Alternating V-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/ztAa1RK.gif"
  },
  {
    "id": "edb-6ZCiYWQ",
    "name": "Sit-up with Arms on Chest",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "sit-up",
      "situp",
      "sit up"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/6ZCiYWQ.gif"
  },
  {
    "id": "edb-1ZFqTDN",
    "name": "Air Bike",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "bicycle crunch",
      "bicycles",
      "bicycle kick",
      "air bicycle"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/1ZFqTDN.gif"
  },
  {
    "id": "edb-196HJGw",
    "name": "Hip Raise (bent Knee)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "hip raise",
      "reverse crunch hip raise",
      "leg hip raise"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/196HJGw.gif"
  },
  {
    "id": "edb-BaE7O6U",
    "name": "Hanging Oblique Knee Raise",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/BaE7O6U.gif"
  },
  {
    "id": "edb-iny3m5y",
    "name": "Dead Bug",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "BACK"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors",
        "lower back"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "dead bugs",
      "opposite arm leg raise"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/iny3m5y.gif"
  },
  {
    "id": "edb-ZuXu4Eq",
    "name": "V-sit on Floor",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "v-sit",
      "v sit",
      "v-up hold"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/ZuXu4Eq.gif"
  },
  {
    "id": "edb-UpWmA5E",
    "name": "L-sit on Floor",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "l-sit",
      "l sit",
      "l-sit hold"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/UpWmA5E.gif"
  },
  {
    "id": "edb-4Ml7QFO",
    "name": "Hanging Straight Leg Raise",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "toes to bar",
      "straight leg raise"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/4Ml7QFO.gif"
  },
  {
    "id": "edb-CosupLu",
    "name": "Front Plank with Twist",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "plank rotation",
      "plank twist"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/CosupLu.gif"
  },
  {
    "id": "edb-Hy9D21L",
    "name": "45° Side Bend",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "side bend",
      "oblique bend"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/Hy9D21L.gif"
  },
  {
    "id": "edb-QYysSLV",
    "name": "Landmine 180",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES",
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques",
        "quadriceps"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "landmine twist",
      "landmine rotation",
      "landmine oblique"
    ],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/QYysSLV.gif"
  },
  {
    "id": "edb-G7PXMlT",
    "name": "Band Vertical Pallof Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES",
        "GLUTES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques",
        "glutes"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/G7PXMlT.gif"
  },
  {
    "id": "edb-NAgVB3t",
    "name": "Wheel Rollerout",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "BACK"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "lower back"
      ]
    },
    "equipment": [
      "ab wheel"
    ],
    "aliases": [
      "ab wheel",
      "ab roller",
      "ab wheel rollout",
      "rollout"
    ],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/NAgVB3t.gif"
  },
  {
    "id": "edb-K9VL0Jq",
    "name": "Lunge with Twist",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "GLUTES",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "quadriceps",
        "glutes",
        "hamstrings"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/K9VL0Jq.gif"
  },
  {
    "id": "edb-9IxJdtC",
    "name": "Lying Leg-hip Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/9IxJdtC.gif"
  },
  {
    "id": "edb-TFqbd8t",
    "name": "Crunch Floor",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "crunches",
      "crunch",
      "basic crunch",
      "floor crunch"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/TFqbd8t.gif"
  },
  {
    "id": "edb-QLL2gdc",
    "name": "Decline Sit-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "BACK"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors",
        "lower back"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/QLL2gdc.gif"
  },
  {
    "id": "edb-PkCN2lv",
    "name": "Front Lever",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "BACK",
        "ANTERIOR_DELT",
        "FOREARMS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "lats",
        "shoulders",
        "forearms"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/PkCN2lv.gif"
  },
  {
    "id": "edb-tFToB7l",
    "name": "Reverse Plank with Leg Lift",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS",
        "POSTERIOR_DELT"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/tFToB7l.gif"
  },
  {
    "id": "edb-aVs3BR3",
    "name": "Cable Twist",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [
      "cable woodchop",
      "cable rotation",
      "woodchopper"
    ],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/aVs3BR3.gif"
  },
  {
    "id": "edb-9Ap7miY",
    "name": "Decline Crunch",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/9Ap7miY.gif"
  },
  {
    "id": "edb-QUDd8WS",
    "name": "Oblique Crunches Floor",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "oblique crunch",
      "side crunch",
      "oblique crunches"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/QUDd8WS.gif"
  },
  {
    "id": "edb-WhuFnR7",
    "name": "Lying Leg Raise Flat Bench",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/WhuFnR7.gif"
  },
  {
    "id": "edb-VEcJRo2",
    "name": "Hanging Leg Hip Raise",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "BACK"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors",
        "lower back"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/VEcJRo2.gif"
  },
  {
    "id": "edb-yRpV5TC",
    "name": "Shoulder Tap",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "shoulder taps",
      "plank shoulder tap"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/yRpV5TC.gif"
  },
  {
    "id": "edb-fZFZ704",
    "name": "Weighted Russian Twist",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES",
        "BACK"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques",
        "lower back"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "russian twist with weight",
      "medicine ball russian twist"
    ],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/fZFZ704.gif"
  },
  {
    "id": "edb-weoDEpH",
    "name": "Captains Chair Straight Leg Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "captain's chair",
      "captains chair leg raise",
      "roman chair leg raise"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/weoDEpH.gif"
  },
  {
    "id": "edb-nuBF9MO",
    "name": "Hanging Pike",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors",
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/nuBF9MO.gif"
  },
  {
    "id": "edb-h1ezqSu",
    "name": "Kneeling Plank Tap Shoulder",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/h1ezqSu.gif"
  },
  {
    "id": "edb-rbu5UUb",
    "name": "Cross Body Crunch",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "cross crunch",
      "crossover crunch",
      "bicycle crunch on floor"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/rbu5UUb.gif"
  },
  {
    "id": "edb-XVDdcoj",
    "name": "Russian Twist",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "OBLIQUES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "obliques"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "russian twists",
      "seated twist"
    ],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/XVDdcoj.gif"
  },
  {
    "id": "edb-CHpahtl",
    "name": "Lever Seated Hip Abduction",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "abductors"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "hip abduction",
      "abduction machine",
      "hip abductor"
    ],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/CHpahtl.gif"
  },
  {
    "id": "edb-0xDpB4L",
    "name": "Resistance Band Seated Hip Abduction",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "abductors"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/0xDpB4L.gif"
  },
  {
    "id": "custom-push-jerk",
    "name": "Push Jerk",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT",
        "TRICEPS",
        "QUADS"
      ],
      "secondary": []
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "jerk",
      "push jerks"
    ],
    "tags": [
      "compound",
      "olympic"
    ],
    "movement": "push"
  },
  {
    "id": "custom-sled-push",
    "name": "Sled Push",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "CALVES"
      ],
      "secondary": []
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "prowler push",
      "sled drive",
      "prowler"
    ],
    "tags": [
      "compound",
      "legs",
      "cardio"
    ],
    "movement": "legs"
  },
  {
    "id": "custom-sled-pull",
    "name": "Sled Pull",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK",
        "HAMSTRINGS",
        "GLUTES"
      ],
      "secondary": []
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "prowler pull",
      "sled drag"
    ],
    "tags": [
      "compound",
      "legs",
      "cardio"
    ],
    "movement": "legs"
  },
  {
    "id": "custom-hike",
    "name": "Hiking",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "CALVES"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "hike",
      "trail hike",
      "trail walk"
    ],
    "tags": [
      "cardio"
    ],
    "movement": "cardio"
  },
  {
    "id": "custom-sprints",
    "name": "Sprints",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES",
        "CALVES"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "sprint",
      "interval sprints",
      "wind sprints",
      "dashes"
    ],
    "tags": [
      "cardio",
      "hiit"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/Qoujh3Q.gif"
  },
  {
    "id": "sp-basketball",
    "name": "Basketball",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "CALVES",
        "GLUTES",
        "HAMSTRINGS",
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "basketball practice",
      "hoops"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-soccer",
    "name": "Soccer",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES",
        "GLUTES",
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "soccer practice",
      "football (soccer)"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-football",
    "name": "Football",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "HAMSTRINGS",
        "CHEST",
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "football practice",
      "american football"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-tennis",
    "name": "Tennis",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "ANTERIOR_DELT",
        "CALVES",
        "ABS",
        "FOREARMS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "tennis practice",
      "tennis match"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-badminton",
    "name": "Badminton",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "ANTERIOR_DELT",
        "CALVES",
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "badminton match",
      "shuttlecock"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-table-tennis",
    "name": "Table Tennis",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT",
        "ABS",
        "FOREARMS",
        "QUADS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "ping pong",
      "table tennis match"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-pickleball",
    "name": "Pickleball",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "ANTERIOR_DELT",
        "CALVES",
        "ABS",
        "FOREARMS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "pickleball match"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-racquetball",
    "name": "Racquetball",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "ANTERIOR_DELT",
        "CALVES",
        "ABS",
        "FOREARMS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "racquetball match",
      "squash"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-squash",
    "name": "Squash",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "ANTERIOR_DELT",
        "CALVES",
        "ABS",
        "FOREARMS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "squash match"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-polo",
    "name": "Water Polo",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT",
        "BACK",
        "QUADS",
        "ABS",
        "CHEST",
        "GLUTES"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "polo",
      "water polo practice"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-volleyball",
    "name": "Volleyball",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "ANTERIOR_DELT",
        "CALVES",
        "GLUTES",
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "volleyball practice"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-baseball",
    "name": "Baseball",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT",
        "OBLIQUES",
        "QUADS",
        "FOREARMS",
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "baseball practice",
      "batting practice"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-softball",
    "name": "Softball",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT",
        "OBLIQUES",
        "QUADS",
        "FOREARMS",
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "softball practice"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-hockey",
    "name": "Hockey",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "HAMSTRINGS",
        "ABS",
        "ANTERIOR_DELT"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "ice hockey",
      "hockey practice",
      "field hockey"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-lacrosse",
    "name": "Lacrosse",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "ANTERIOR_DELT",
        "ABS",
        "GLUTES",
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "lacrosse practice",
      "lax"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-rugby",
    "name": "Rugby",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "HAMSTRINGS",
        "CHEST",
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "rugby practice",
      "rugby match"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-cricket",
    "name": "Cricket",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "ANTERIOR_DELT",
        "OBLIQUES",
        "BACK",
        "FOREARMS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "cricket practice",
      "cricket match"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-golf",
    "name": "Golf",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "OBLIQUES",
        "ABS",
        "BACK",
        "GLUTES",
        "FOREARMS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "golf round",
      "driving range"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-boxing",
    "name": "Boxing",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT",
        "ABS",
        "TRICEPS",
        "BACK",
        "CALVES"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "boxing training",
      "heavy bag"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-kickboxing",
    "name": "Kickboxing",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "ANTERIOR_DELT",
        "ABS",
        "GLUTES",
        "HAMSTRINGS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "kickboxing class",
      "muay thai"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-mma",
    "name": "MMA Training",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "ABS",
        "BACK",
        "GLUTES",
        "ANTERIOR_DELT"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "martial arts",
      "mma"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-bjj",
    "name": "Brazilian Jiu-Jitsu",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "BACK",
        "ABS",
        "GLUTES",
        "BICEPS",
        "FOREARMS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "bjj",
      "jiu jitsu",
      "grappling"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-karate",
    "name": "Karate",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "ABS",
        "ANTERIOR_DELT",
        "GLUTES",
        "CALVES"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "karate practice",
      "karate class"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-judo",
    "name": "Judo",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "BACK",
        "ABS",
        "GLUTES",
        "BICEPS",
        "FOREARMS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "judo practice",
      "judo class"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-taekwondo",
    "name": "Taekwondo",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "HAMSTRINGS",
        "ABS",
        "GLUTES",
        "CALVES"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "tkd",
      "tae kwon do"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-wrestling",
    "name": "Wrestling",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "BACK",
        "QUADS",
        "ABS",
        "GLUTES",
        "BICEPS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "wrestling practice"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-fencing",
    "name": "Fencing",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "CALVES",
        "HAMSTRINGS",
        "ANTERIOR_DELT",
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "fencing practice",
      "epee",
      "foil",
      "sabre"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-climbing",
    "name": "Rock Climbing",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "BACK",
        "BICEPS",
        "FOREARMS",
        "ABS",
        "ANTERIOR_DELT"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "climbing",
      "bouldering",
      "sport climbing",
      "indoor climbing"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-surfing",
    "name": "Surfing",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "BACK",
        "ANTERIOR_DELT",
        "ABS",
        "CHEST",
        "QUADS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "surf",
      "surf session"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-skiing",
    "name": "Skiing",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES",
        "ABS",
        "CALVES"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "ski",
      "downhill skiing",
      "alpine skiing"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-snowboarding",
    "name": "Snowboarding",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES",
        "ABS",
        "CALVES"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "snowboard"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-xc-ski",
    "name": "Cross-Country Skiing",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "BACK",
        "TRICEPS",
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "xc skiing",
      "nordic skiing"
    ],
    "tags": [
      "sport",
      "cardio"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-skateboarding",
    "name": "Skateboarding",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "CALVES",
        "ABS",
        "GLUTES"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "skate",
      "skating"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-rowing-sport",
    "name": "Rowing (Sport)",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "BACK",
        "QUADS",
        "BICEPS",
        "GLUTES",
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "crew",
      "sculling",
      "rowing team"
    ],
    "tags": [
      "sport",
      "cardio"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-gymnastics",
    "name": "Gymnastics",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS",
        "QUADS",
        "ANTERIOR_DELT",
        "BACK",
        "CHEST"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "gymnastics practice",
      "gymnastics class"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-dance",
    "name": "Dance",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "CALVES",
        "GLUTES",
        "ABS",
        "HAMSTRINGS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "dance class",
      "dance practice",
      "dancing",
      "ballet",
      "salsa",
      "hip hop dance"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-handball",
    "name": "Handball",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "ANTERIOR_DELT",
        "ABS",
        "GLUTES",
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "handball match"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-ultimate",
    "name": "Ultimate Frisbee",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "HAMSTRINGS",
        "ANTERIOR_DELT",
        "GLUTES",
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "ultimate",
      "frisbee"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-crossfit",
    "name": "CrossFit",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "BACK",
        "ABS",
        "GLUTES",
        "ANTERIOR_DELT"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "crossfit wod",
      "wod",
      "metcon"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-track",
    "name": "Track & Field",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES",
        "CALVES",
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "track practice",
      "sprinting",
      "hurdles",
      "javelin",
      "shot put"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-swimming",
    "name": "Swimming",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "BACK",
        "ANTERIOR_DELT",
        "ABS",
        "QUADS",
        "HAMSTRINGS"
      ],
      "secondary": [
        "TRICEPS",
        "BICEPS",
        "CALVES",
        "GLUTES"
      ]
    },
    "equipment": [],
    "aliases": [
      "swim",
      "laps",
      "freestyle",
      "backstroke",
      "breaststroke",
      "butterfly",
      "open water"
    ],
    "tags": [
      "sport",
      "cardio"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-cycling",
    "name": "Cycling",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES",
        "CALVES"
      ],
      "secondary": [
        "ABS",
        "BACK"
      ]
    },
    "equipment": [],
    "aliases": [
      "biking",
      "road cycling",
      "mountain biking",
      "mtb",
      "bike ride",
      "spinning",
      "indoor cycling",
      "bmx"
    ],
    "tags": [
      "sport",
      "cardio"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-triathlon",
    "name": "Triathlon",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES",
        "BACK",
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "CALVES",
        "ABS",
        "TRICEPS",
        "BICEPS"
      ]
    },
    "equipment": [],
    "aliases": [
      "tri",
      "ironman",
      "sprint triathlon",
      "olympic triathlon",
      "swim bike run"
    ],
    "tags": [
      "sport",
      "cardio"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-ice-hockey",
    "name": "Ice Hockey",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "HAMSTRINGS",
        "ABS",
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "CALVES",
        "BACK",
        "FOREARMS"
      ]
    },
    "equipment": [],
    "aliases": [
      "hockey on ice",
      "pond hockey",
      "shinny"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-beach-volleyball",
    "name": "Beach Volleyball",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "ANTERIOR_DELT",
        "ABS",
        "CALVES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "BACK",
        "FOREARMS"
      ]
    },
    "equipment": [],
    "aliases": [
      "sand volleyball",
      "beach volley"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-figure-skating",
    "name": "Figure Skating",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "HAMSTRINGS",
        "ABS",
        "CALVES"
      ],
      "secondary": [
        "BACK",
        "ANTERIOR_DELT"
      ]
    },
    "equipment": [],
    "aliases": [
      "ice skating",
      "skating"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-speed-skating",
    "name": "Speed Skating",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "HAMSTRINGS",
        "CALVES",
        "ABS"
      ],
      "secondary": [
        "BACK"
      ]
    },
    "equipment": [],
    "aliases": [
      "short track",
      "long track",
      "inline skating"
    ],
    "tags": [
      "sport",
      "cardio"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-curling",
    "name": "Curling",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "HAMSTRINGS",
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "BACK"
      ]
    },
    "equipment": [],
    "aliases": [
      "curling match"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-sailing",
    "name": "Sailing",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS",
        "BACK",
        "ANTERIOR_DELT",
        "FOREARMS"
      ],
      "secondary": [
        "QUADS",
        "BICEPS"
      ]
    },
    "equipment": [],
    "aliases": [
      "sail",
      "yachting",
      "dinghy sailing"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-weightlifting",
    "name": "Weightlifting (Olympic)",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "BACK",
        "ANTERIOR_DELT",
        "HAMSTRINGS"
      ],
      "secondary": [
        "ABS",
        "TRICEPS",
        "CALVES",
        "FOREARMS"
      ]
    },
    "equipment": [],
    "aliases": [
      "olympic lifting",
      "oly lifting",
      "snatch practice",
      "clean and jerk practice"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-archery",
    "name": "Archery",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "BACK",
        "ANTERIOR_DELT",
        "FOREARMS",
        "ABS"
      ],
      "secondary": [
        "BICEPS",
        "TRICEPS"
      ]
    },
    "equipment": [],
    "aliases": [
      "bow",
      "recurve",
      "compound bow",
      "target archery"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-diving",
    "name": "Diving",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS",
        "QUADS",
        "ANTERIOR_DELT",
        "BACK",
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ]
    },
    "equipment": [],
    "aliases": [
      "springboard diving",
      "platform diving"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-biathlon",
    "name": "Biathlon",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES",
        "ABS",
        "BACK"
      ],
      "secondary": [
        "CALVES",
        "ANTERIOR_DELT",
        "FOREARMS"
      ]
    },
    "equipment": [],
    "aliases": [
      "ski and shoot",
      "cross country shooting"
    ],
    "tags": [
      "sport",
      "cardio"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-kayaking",
    "name": "Kayaking",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "BACK",
        "ANTERIOR_DELT",
        "ABS",
        "BICEPS",
        "FOREARMS"
      ],
      "secondary": [
        "TRICEPS",
        "QUADS"
      ]
    },
    "equipment": [],
    "aliases": [
      "canoeing",
      "canoe",
      "kayak",
      "paddling",
      "canoe sprint",
      "kayak slalom"
    ],
    "tags": [
      "sport",
      "cardio"
    ],
    "movement": "sport"
  },
  {
    "id": "sp-bowling",
    "name": "Bowling",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT",
        "FOREARMS",
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "BACK"
      ]
    },
    "equipment": [],
    "aliases": [
      "ten pin bowling",
      "bowling league"
    ],
    "tags": [
      "sport"
    ],
    "movement": "sport"
  },
  {
    "id": "edb-uOV3Itw",
    "name": "Triceps Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "shoulders"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "stretch",
      "flexibility",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/uOV3Itw.gif"
  },
  {
    "id": "edb-QoHIhPl",
    "name": "Behind Head Chest Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "stretch",
      "flexibility",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/QoHIhPl.gif"
  },
  {
    "id": "edb-x2chWLO",
    "name": "Neck Side Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [],
      "targetRaw": [
        "levator scapulae"
      ],
      "secondaryRaw": [
        "trapezius",
        "sternocleidomastoid"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "stretch",
      "flexibility",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/x2chWLO.gif"
  },
  {
    "id": "edb-JbC2iaV",
    "name": "Spine Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "HAMSTRINGS",
        "GLUTES"
      ],
      "targetRaw": [
        "spine"
      ],
      "secondaryRaw": [
        "hamstrings",
        "glutes"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "stretch",
      "flexibility",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/JbC2iaV.gif"
  },
  {
    "id": "edb-isofgzg",
    "name": "Roller Back Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "HAMSTRINGS",
        "GLUTES"
      ],
      "targetRaw": [
        "spine"
      ],
      "secondaryRaw": [
        "hamstrings",
        "glutes"
      ]
    },
    "equipment": [
      "ab wheel"
    ],
    "aliases": [],
    "tags": [
      "stretch",
      "flexibility",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/isofgzg.gif"
  },
  {
    "id": "edb-1jXLYEw",
    "name": "Standing Lateral Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "OBLIQUES"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "shoulders",
        "obliques"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "stretch",
      "flexibility",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/1jXLYEw.gif"
  },
  {
    "id": "edb-QFmz6ch",
    "name": "Seated Lower Back Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "stretch",
      "flexibility",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/QFmz6ch.gif"
  },
  {
    "id": "edb-xGgAGPm",
    "name": "Chair Leg Extended Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "HAMSTRINGS",
        "CALVES"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "hamstrings",
        "calves"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "stretch",
      "flexibility",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/xGgAGPm.gif"
  },
  {
    "id": "edb-sU5BrfP",
    "name": "Leg Up Hamstring Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "GLUTES"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "glutes"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "stretch",
      "flexibility",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/sU5BrfP.gif"
  },
  {
    "id": "edb-yn0LjwL",
    "name": "Assisted Lying Glutes Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "stretch",
      "flexibility",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/yn0LjwL.gif"
  },
  {
    "id": "edb-DeDThfG",
    "name": "Seated Glute Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "hamstrings"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "stretch",
      "flexibility",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/DeDThfG.gif"
  },
  {
    "id": "edb-17bqEXD",
    "name": "Seated Calf Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "hamstrings"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "stretch",
      "flexibility",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/17bqEXD.gif"
  },
  {
    "id": "edb-1LVFcEn",
    "name": "Calf Stretch With Rope",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "hamstrings"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "stretch",
      "flexibility",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/1LVFcEn.gif"
  },
  {
    "id": "edb-hC6oYY5",
    "name": "Assisted Side Lying Adductor Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "HAMSTRINGS",
        "GLUTES"
      ],
      "targetRaw": [
        "adductors"
      ],
      "secondaryRaw": [
        "hamstrings",
        "glutes"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "stretch",
      "flexibility",
      "bodyweight"
    ],
    "movement": "stretch",
    "gifUrl": "https://static.exercisedb.dev/media/hC6oYY5.gif"
  },
  {
    "id": "custom-plank",
    "name": "Plank",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "GLUTES"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "front plank",
      "forearm plank",
      "plank hold",
      "elbow plank"
    ],
    "tags": [
      "isometric",
      "bodyweight",
      "core"
    ],
    "movement": "core",
    "gifUrl": null
  },
  {
    "id": "custom-side-plank",
    "name": "Side Plank",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "OBLIQUES"
      ],
      "secondary": [
        "ABS",
        "GLUTES"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "side plank hold",
      "lateral plank"
    ],
    "tags": [
      "isometric",
      "bodyweight",
      "core"
    ],
    "movement": "core",
    "gifUrl": null
  },
  {
    "id": "custom-barbell-hip-thrust",
    "name": "Barbell Hip Thrust",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "barbell hip thrusts",
      "bb hip thrust",
      "weighted hip thrust"
    ],
    "tags": [
      "compound",
      "glute"
    ],
    "movement": "legs",
    "gifUrl": null
  },
  {
    "id": "custom-box-jump",
    "name": "Box Jump",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "GLUTES",
        "CALVES",
        "HAMSTRINGS"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "box jumps",
      "plyo box jump"
    ],
    "tags": [
      "plyometric",
      "explosive",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": null
  },
  {
    "id": "custom-wall-sit",
    "name": "Wall Sit",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "GLUTES",
        "CALVES"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "wall squat",
      "wall sit hold"
    ],
    "tags": [
      "isometric",
      "bodyweight"
    ],
    "movement": "legs"
  },
  {
    "id": "custom-hollow-body-hold",
    "name": "Hollow Body Hold",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "hollow hold",
      "hollow body",
      "hollow position"
    ],
    "tags": [
      "isometric",
      "bodyweight",
      "core"
    ],
    "movement": "core"
  },
  {
    "id": "custom-dead-hang",
    "name": "Dead Hang",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "BACK",
        "BICEPS"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "hanging",
      "bar hang",
      "passive hang"
    ],
    "tags": [
      "isometric",
      "bodyweight",
      "grip"
    ],
    "movement": "pull"
  },
  {
    "id": "custom-rack-pull",
    "name": "Barbell Rack Pull",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK",
        "HAMSTRINGS"
      ],
      "secondary": [
        "GLUTES",
        "FOREARMS"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "rack pull",
      "rack pulls",
      "block pull"
    ],
    "tags": [
      "compound",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/za9Ni4z.gif"
  },
  {
    "id": "custom-reverse-curl",
    "name": "Barbell Reverse Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "BICEPS"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "reverse curl",
      "reverse curls",
      "overhand curl"
    ],
    "tags": [
      "isolation"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/xNrS20v.gif"
  },
  {
    "id": "custom-floor-press",
    "name": "Dumbbell Floor Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "ANTERIOR_DELT"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [
      "floor press",
      "db floor press"
    ],
    "tags": [
      "compound",
      "push"
    ],
    "movement": "push"
  },
  {
    "id": "custom-clamshell",
    "name": "Clamshell",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "clamshells",
      "banded clamshell"
    ],
    "tags": [
      "isolation",
      "bodyweight",
      "activation"
    ],
    "movement": "legs",
    "gifUrl": null
  },
  {
    "id": "custom-fire-hydrant",
    "name": "Fire Hydrant",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "ABS"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "fire hydrants",
      "dirty dog"
    ],
    "tags": [
      "isolation",
      "bodyweight",
      "activation"
    ],
    "movement": "legs",
    "gifUrl": null
  },
  {
    "id": "custom-donkey-kick",
    "name": "Donkey Kick",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "donkey kicks"
    ],
    "tags": [
      "isolation",
      "bodyweight",
      "activation"
    ],
    "movement": "legs",
    "gifUrl": null
  },
  {
    "id": "custom-bodyweight-hip-thrust",
    "name": "Hip Thrust",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS"
      ]
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "bodyweight hip thrust",
      "bw hip thrust"
    ],
    "tags": [
      "compound",
      "bodyweight",
      "glute"
    ],
    "movement": "legs",
    "gifUrl": null
  },
  {
    "id": "custom-band-face-pull",
    "name": "Band Face Pull",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "POSTERIOR_DELT"
      ],
      "secondary": [
        "BACK"
      ]
    },
    "equipment": [
      "band"
    ],
    "aliases": [
      "banded face pull",
      "resistance band face pull"
    ],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": null
  }
];
