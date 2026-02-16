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
 * ExerciseDB exercises: 1500
 * Custom exercises: 119
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
  {
    "id": "edb-VPPtusI",
    "name": "Inverted Row Bent Knees",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/VPPtusI.gif"
  },
  {
    "id": "edb-8d8qJQI",
    "name": "Barbell Reverse Grip Incline Bench Row",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/8d8qJQI.gif"
  },
  {
    "id": "edb-JGKowMS",
    "name": "Smith Narrow Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/JGKowMS.gif"
  },
  {
    "id": "edb-dmgMp3n",
    "name": "Barbell Incline Row",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/dmgMp3n.gif"
  },
  {
    "id": "edb-ZqNOWQ6",
    "name": "Lever Reverse Grip Vertical Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/ZqNOWQ6.gif"
  },
  {
    "id": "edb-w2oRpuH",
    "name": "Lever Alternating Narrow Grip Seated Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/w2oRpuH.gif"
  },
  {
    "id": "edb-zYmNaoY",
    "name": "Elevator",
    "defaultUnit": "reps",
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
        "shoulders",
        "trapezius"
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
    "gifUrl": "https://static.exercisedb.dev/media/zYmNaoY.gif"
  },
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/C0MA9bC.gif"
  },
  {
    "id": "edb-UFGF6gk",
    "name": "Cable Rope Crossover Seated Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/UFGF6gk.gif"
  },
  {
    "id": "edb-c8oybX6",
    "name": "Cable Rope Elevated Seated Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/c8oybX6.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/b9kqlBy.gif"
  },
  {
    "id": "edb-WrYPP2g",
    "name": "Cable One Arm Straight Back High Row (kneeling)",
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
    "gifUrl": "https://static.exercisedb.dev/media/WrYPP2g.gif"
  },
  {
    "id": "edb-km0sQC0",
    "name": "Band One Arm Standing Low Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/km0sQC0.gif"
  },
  {
    "id": "edb-Ca76jUE",
    "name": "Kettlebell Alternating Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/Ca76jUE.gif"
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
    "id": "edb-xbkPfaw",
    "name": "Bodyweight Standing One Arm Row",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/xbkPfaw.gif"
  },
  {
    "id": "edb-bKWbrTA",
    "name": "One Arm Towel Row",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/bKWbrTA.gif"
  },
  {
    "id": "edb-XUUD0Fs",
    "name": "Dumbbell Lying Rear Delt Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "POSTERIOR_DELT",
        "BICEPS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "shoulders",
        "biceps"
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
    "gifUrl": "https://static.exercisedb.dev/media/XUUD0Fs.gif"
  },
  {
    "id": "edb-Fhdtwf3",
    "name": "Lever One Arm Bent Over Row",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/Fhdtwf3.gif"
  },
  {
    "id": "edb-PNtsX17",
    "name": "Cable Reverse-grip Straight Back Seated High Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/PNtsX17.gif"
  },
  {
    "id": "edb-OmQ8w0p",
    "name": "Cable Palm Rotational Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/OmQ8w0p.gif"
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
    "id": "edb-hvV79Si",
    "name": "Cable Low Seated Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/hvV79Si.gif"
  },
  {
    "id": "edb-wf24o8S",
    "name": "Kettlebell Two Arm Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/wf24o8S.gif"
  },
  {
    "id": "edb-BReCuOn",
    "name": "Bodyweight Squatting Row (with Towel)",
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
    "gifUrl": "https://static.exercisedb.dev/media/BReCuOn.gif"
  },
  {
    "id": "edb-oROuvrX",
    "name": "Lever Unilateral Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/oROuvrX.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/bZGHsAZ.gif"
  },
  {
    "id": "edb-uTv34oq",
    "name": "Bodyweight Standing Row (with Towel)",
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
    "gifUrl": "https://static.exercisedb.dev/media/uTv34oq.gif"
  },
  {
    "id": "edb-X6ytgYZ",
    "name": "Dumbbell Side Plank with Rear Fly",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "POSTERIOR_DELT",
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
    "gifUrl": "https://static.exercisedb.dev/media/X6ytgYZ.gif"
  },
  {
    "id": "edb-G70mEAJ",
    "name": "Chin-ups (narrow Parallel Grip)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/G70mEAJ.gif"
  },
  {
    "id": "edb-FVM1AUZ",
    "name": "Lever T-bar Reverse Grip Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/FVM1AUZ.gif"
  },
  {
    "id": "edb-JF8AkMX",
    "name": "Standing Archer",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "shoulders",
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
    "gifUrl": "https://static.exercisedb.dev/media/JF8AkMX.gif"
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
    "aliases": [],
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
    "aliases": [],
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
    "id": "edb-R5swFnc",
    "name": "Cambered Bar Lying Row",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/R5swFnc.gif"
  },
  {
    "id": "edb-wd4ds3s",
    "name": "Bodyweight Standing Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/wd4ds3s.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/eZyBC3j.gif"
  },
  {
    "id": "edb-JOZhu2h",
    "name": "Cable Standing Twist Row (v-bar)",
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
    "gifUrl": "https://static.exercisedb.dev/media/JOZhu2h.gif"
  },
  {
    "id": "edb-3xK09Sk",
    "name": "Bodyweight Squatting Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/3xK09Sk.gif"
  },
  {
    "id": "edb-aaxA3cm",
    "name": "Smith Reverse Grip Bent Over Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/aaxA3cm.gif"
  },
  {
    "id": "edb-Q4DSJPC",
    "name": "Smith One Arm Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/Q4DSJPC.gif"
  },
  {
    "id": "edb-uX3sUBz",
    "name": "Inverted Row V. 2",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/uX3sUBz.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/aaXr7ld.gif"
  },
  {
    "id": "edb-wt6rwjk",
    "name": "Dumbbell Palm Rotational Bent Over Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/wt6rwjk.gif"
  },
  {
    "id": "edb-BgljGjd",
    "name": "Lever Reverse T-bar Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/BgljGjd.gif"
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
    "id": "edb-v2DfH14",
    "name": "Bodyweight Standing Close-grip One Arm Row",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/v2DfH14.gif"
  },
  {
    "id": "edb-veXwo0D",
    "name": "Cable Floor Seated Wide-grip Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/veXwo0D.gif"
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
    "aliases": [],
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
    "id": "edb-vpp9Ku2",
    "name": "Cable Seated One Arm Alternate Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/vpp9Ku2.gif"
  },
  {
    "id": "edb-tig3PXb",
    "name": "Bodyweight Standing Close-grip Row",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/tig3PXb.gif"
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
    "id": "edb-PQStVXH",
    "name": "Cable Upper Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/PQStVXH.gif"
  },
  {
    "id": "edb-qcY50ZD",
    "name": "Cable Seated Wide-grip Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/qcY50ZD.gif"
  },
  {
    "id": "edb-GSDioYu",
    "name": "Upper Back Stretch",
    "defaultUnit": "reps",
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
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/GSDioYu.gif"
  },
  {
    "id": "edb-MgKwAAo",
    "name": "Cable Rope Extension Incline Bench Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/MgKwAAo.gif"
  },
  {
    "id": "edb-O4oIqQD",
    "name": "Bodyweight Standing One Arm Row (with Towel)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/O4oIqQD.gif"
  },
  {
    "id": "edb-ZIViNh1",
    "name": "Dumbbell Reverse Grip Incline Bench One Arm Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "POSTERIOR_DELT"
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
    "gifUrl": "https://static.exercisedb.dev/media/ZIViNh1.gif"
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/r0z6xzQ.gif"
  },
  {
    "id": "edb-Jsgsc27",
    "name": "Barbell One Arm Bent Over Row",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/Jsgsc27.gif"
  },
  {
    "id": "edb-OIFMAp1",
    "name": "Lever One Arm Lateral High Row",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/OIFMAp1.gif"
  },
  {
    "id": "edb-MSfvriJ",
    "name": "Skin the Cat",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/MSfvriJ.gif"
  },
  {
    "id": "edb-Mxa7Cr8",
    "name": "Inverted Row on Bench",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/Mxa7Cr8.gif"
  },
  {
    "id": "edb-kesXOpB",
    "name": "Cable Decline Seated Wide-grip Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/kesXOpB.gif"
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
    "id": "edb-ZSJNetl",
    "name": "Cable High Row (kneeling)",
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
    "gifUrl": "https://static.exercisedb.dev/media/ZSJNetl.gif"
  },
  {
    "id": "edb-PbzNu7c",
    "name": "Dumbbell Incline Y-raise",
    "defaultUnit": "reps",
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
        "shoulders",
        "rear deltoids"
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
    "gifUrl": "https://static.exercisedb.dev/media/PbzNu7c.gif"
  },
  {
    "id": "edb-LuBEORI",
    "name": "Lever Bent-over Row with V-bar",
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
    "gifUrl": "https://static.exercisedb.dev/media/LuBEORI.gif"
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
    "id": "edb-jdiExfW",
    "name": "Inverted Row with Straps",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/jdiExfW.gif"
  },
  {
    "id": "edb-wbUYILZ",
    "name": "Elbow Lift - Reverse Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "TRICEPS",
        "POSTERIOR_DELT"
      ],
      "targetRaw": [
        "upper back"
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
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/wbUYILZ.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/7I6LNUG.gif"
  },
  {
    "id": "edb-yaMIo4D",
    "name": "Cable Incline Bench Row",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/yaMIo4D.gif"
  },
  {
    "id": "edb-X3cqyXz",
    "name": "Lever Bent Over Row",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/X3cqyXz.gif"
  },
  {
    "id": "edb-IGjKj1v",
    "name": "Lever Narrow Grip Seated Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/IGjKj1v.gif"
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
    "id": "edb-bLyQokI",
    "name": "London Bridge",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "shoulders",
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
    "gifUrl": "https://static.exercisedb.dev/media/bLyQokI.gif"
  },
  {
    "id": "edb-G8dXpNG",
    "name": "Ez Bar Reverse Grip Bent Over Row",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/G8dXpNG.gif"
  },
  {
    "id": "edb-DKBwJrL",
    "name": "Band One Arm Twisting Seated Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/DKBwJrL.gif"
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
    "id": "edb-Tq6gbK6",
    "name": "Cable Straight Back Seated Row",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "upper back"
      ],
      "secondaryRaw": [
        "biceps",
        "forearms",
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
    "gifUrl": "https://static.exercisedb.dev/media/Tq6gbK6.gif"
  },
  {
    "id": "edb-Nh3mvOO",
    "name": "Dumbbell Reverse Grip Row (female)",
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
    "gifUrl": "https://static.exercisedb.dev/media/Nh3mvOO.gif"
  },
  {
    "id": "edb-WM6TvvW",
    "name": "Cable Low Seated Row Controlled",
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
    "gifUrl": "https://static.exercisedb.dev/media/WM6TvvW.gif"
  },
  {
    "id": "edb-N6dZN2I",
    "name": "Side Cable High Row (kneeling)",
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
    "gifUrl": "https://static.exercisedb.dev/media/N6dZN2I.gif"
  },
  {
    "id": "edb-u3UuCZu",
    "name": "Intense Kettlebell Two Arm Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/u3UuCZu.gif"
  },
  {
    "id": "edb-KWyEjtI",
    "name": "Precision Style Lever Bent-over Row with V-bar",
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
    "gifUrl": "https://static.exercisedb.dev/media/KWyEjtI.gif"
  },
  {
    "id": "edb-pgIdT6i",
    "name": "Band One Arm Standing Low Row - Lateral Variation",
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
    "gifUrl": "https://static.exercisedb.dev/media/pgIdT6i.gif"
  },
  {
    "id": "edb-dAJscVq",
    "name": "Cable Incline Bench Row - Elite Variation",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/dAJscVq.gif"
  },
  {
    "id": "edb-9fCHfSc",
    "name": "Pointed Cable Palm Rotational Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/9fCHfSc.gif"
  },
  {
    "id": "edb-1u36hhy",
    "name": "Stability Lever Narrow Grip Seated Row",
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
    "gifUrl": "https://static.exercisedb.dev/media/1u36hhy.gif"
  },
  {
    "id": "edb-w44vFvP",
    "name": "Smith One Arm Row Linear",
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
    "gifUrl": "https://static.exercisedb.dev/media/w44vFvP.gif"
  },
  {
    "id": "edb-A3P4O0R",
    "name": "Cable Seated Row with Reverse",
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
    "gifUrl": "https://static.exercisedb.dev/media/A3P4O0R.gif"
  },
  {
    "id": "edb-5lE7XRz",
    "name": "Smith Bent Over Row with Declined",
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
    "gifUrl": "https://static.exercisedb.dev/media/5lE7XRz.gif"
  },
  {
    "id": "edb-KQfySvS",
    "name": "Dumbbell Reverse Grip Row (female) Hold",
    "defaultUnit": "sec",
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
    "gifUrl": "https://static.exercisedb.dev/media/KQfySvS.gif"
  },
  {
    "id": "edb-iCPqbki",
    "name": "Lever Narrow Grip Seated Row - Strength Variation",
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
    "gifUrl": "https://static.exercisedb.dev/media/iCPqbki.gif"
  },
  {
    "id": "edb-1YUWDNZ",
    "name": "Extended Style Inverted Row",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/1YUWDNZ.gif"
  },
  {
    "id": "edb-LMGXZn8",
    "name": "Barbell Decline Close Grip to Skull Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/LMGXZn8.gif"
  },
  {
    "id": "edb-x6KpKpq",
    "name": "Close-grip Push-up",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/x6KpKpq.gif"
  },
  {
    "id": "edb-obe5LMq",
    "name": "Band Side Triceps Extension",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/obe5LMq.gif"
  },
  {
    "id": "edb-qRZ5S1N",
    "name": "Cable One Arm Tricep Pushdown",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/qRZ5S1N.gif"
  },
  {
    "id": "edb-XooAdhl",
    "name": "Handstand",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "ABS"
      ],
      "targetRaw": [
        "triceps"
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
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/XooAdhl.gif"
  },
  {
    "id": "edb-iaapw0g",
    "name": "Ez Barbell Seated Triceps Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/iaapw0g.gif"
  },
  {
    "id": "edb-WcHl7ru",
    "name": "Smith Close-grip Bench Press",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/WcHl7ru.gif"
  },
  {
    "id": "edb-uxJcFUU",
    "name": "Cable Lying Triceps Extension V. 2",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/uxJcFUU.gif"
  },
  {
    "id": "edb-U3ffHlY",
    "name": "Cable Rope Lying on Floor Tricep Extension",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/U3ffHlY.gif"
  },
  {
    "id": "edb-Gchi5Tr",
    "name": "Cable Alternate Triceps Extension",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Gchi5Tr.gif"
  },
  {
    "id": "edb-NN8nSNT",
    "name": "Cable Rope High Pulley Overhead Tricep Extension",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/NN8nSNT.gif"
  },
  {
    "id": "edb-jDnrkar",
    "name": "Dumbbell Incline One Arm Hammer Press on Exercise Ball",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "CHEST"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "shoulders",
        "chest"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/jDnrkar.gif"
  },
  {
    "id": "edb-s0HKO2I",
    "name": "Bodyweight Kneeling Triceps Extension",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "CHEST"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "shoulders",
        "chest"
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
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/s0HKO2I.gif"
  },
  {
    "id": "edb-gAwDzB3",
    "name": "Cable Triceps Pushdown (v-bar)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/gAwDzB3.gif"
  },
  {
    "id": "edb-HEJ6DIX",
    "name": "Cable Kickback",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/HEJ6DIX.gif"
  },
  {
    "id": "edb-cAvTaSg",
    "name": "Dumbbell Kickbacks on Exercise Ball",
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
        "shoulders",
        "back"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/cAvTaSg.gif"
  },
  {
    "id": "edb-zZlORz6",
    "name": "Dumbbell Lying One Arm Supinated Triceps Extension",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/zZlORz6.gif"
  },
  {
    "id": "edb-J60bN17",
    "name": "Assisted Triceps Dip (kneeling)",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/J60bN17.gif"
  },
  {
    "id": "edb-z6TAHoT",
    "name": "Dumbbell Twisting Bench Press",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/z6TAHoT.gif"
  },
  {
    "id": "edb-Wgbn9qo",
    "name": "Triceps Dip (between Benches)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Wgbn9qo.gif"
  },
  {
    "id": "edb-RxayqAZ",
    "name": "Dumbbell Close-grip Press",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/RxayqAZ.gif"
  },
  {
    "id": "edb-LkoAWAE",
    "name": "Elbow Dips",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/LkoAWAE.gif"
  },
  {
    "id": "edb-da4cXST",
    "name": "Ez-bar Close-grip Bench Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/da4cXST.gif"
  },
  {
    "id": "edb-bndCa3Q",
    "name": "Barbell Pin Presses",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/bndCa3Q.gif"
  },
  {
    "id": "edb-2IxROQ1",
    "name": "Cable Overhead Triceps Extension (rope Attachment)",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/2IxROQ1.gif"
  },
  {
    "id": "edb-wOLmCXc",
    "name": "Dumbbell Tricep Kickback with Stork Stance",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/wOLmCXc.gif"
  },
  {
    "id": "edb-wkgnGfb",
    "name": "Dumbbell Incline Hammer Press on Exercise Ball",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/wkgnGfb.gif"
  },
  {
    "id": "edb-uOV3Itw",
    "name": "Triceps Stretch",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/uOV3Itw.gif"
  },
  {
    "id": "edb-L2V5Nan",
    "name": "Dumbbell Lying Extension (across Face)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/L2V5Nan.gif"
  },
  {
    "id": "edb-vtusOWT",
    "name": "Barbell One Arm Floor Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/vtusOWT.gif"
  },
  {
    "id": "edb-bZq4bwK",
    "name": "Weighted Tricep Dips",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/bZq4bwK.gif"
  },
  {
    "id": "edb-VjYliFZ",
    "name": "Cable Reverse-grip Pushdown",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/VjYliFZ.gif"
  },
  {
    "id": "edb-1YB40kg",
    "name": "Incline Close-grip Push-up",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/1YB40kg.gif"
  },
  {
    "id": "edb-JhYSVwT",
    "name": "Dumbbell Seated Bench Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/JhYSVwT.gif"
  },
  {
    "id": "edb-i11JWU7",
    "name": "Cable Standing Reverse Grip One Arm Overhead Tricep Extension",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "POSTERIOR_DELT"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "shoulders"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/i11JWU7.gif"
  },
  {
    "id": "edb-4cWjYEN",
    "name": "Narrow Push-up on Exercise Ball",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/4cWjYEN.gif"
  },
  {
    "id": "edb-zd4P4B2",
    "name": "Stalder Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "ABS"
      ],
      "targetRaw": [
        "triceps"
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
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/zd4P4B2.gif"
  },
  {
    "id": "edb-Z5YStHW",
    "name": "Overhead Triceps Stretch",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Z5YStHW.gif"
  },
  {
    "id": "edb-v3vLFW0",
    "name": "Close-grip Push-up (on Knees)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/v3vLFW0.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/3ZflifB.gif"
  },
  {
    "id": "edb-4Jt8QsQ",
    "name": "Push-up on Lower Arms",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/4Jt8QsQ.gif"
  },
  {
    "id": "edb-U7D9Fx3",
    "name": "Dumbbell Incline Two Arm Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/U7D9Fx3.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/mpKZGWz.gif"
  },
  {
    "id": "edb-CJwa0vD",
    "name": "Dumbbell Standing Bent Over One Arm Triceps Extension",
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
        "shoulders",
        "back"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/CJwa0vD.gif"
  },
  {
    "id": "edb-iZop9xO",
    "name": "Barbell Lying Triceps Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/iZop9xO.gif"
  },
  {
    "id": "edb-D5yqP2p",
    "name": "Lever Overhand Triceps Dip",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/D5yqP2p.gif"
  },
  {
    "id": "edb-EcaV7aL",
    "name": "Barbell Lying Close-grip Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/EcaV7aL.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/W6PxUkg.gif"
  },
  {
    "id": "edb-wpbD28t",
    "name": "Side Push-up",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/wpbD28t.gif"
  },
  {
    "id": "edb-OTgkHwR",
    "name": "Dumbbell Decline Triceps Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/OTgkHwR.gif"
  },
  {
    "id": "edb-1xHyxys",
    "name": "Cable High Pulley Overhead Tricep Extension",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/1xHyxys.gif"
  },
  {
    "id": "edb-OVIKwsd",
    "name": "Dumbbell Incline Triceps Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/OVIKwsd.gif"
  },
  {
    "id": "edb-Hx1WC8I",
    "name": "Cable Incline Triceps Extension",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Hx1WC8I.gif"
  },
  {
    "id": "edb-4ievMJ9",
    "name": "Dumbbell Seated Bent Over Triceps Extension",
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
        "shoulders",
        "back"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/4ievMJ9.gif"
  },
  {
    "id": "edb-yg8Totb",
    "name": "Barbell Lying Back of the Head Tricep Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/yg8Totb.gif"
  },
  {
    "id": "edb-eOCOwIR",
    "name": "Dumbbell Lying Elbow Press",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/eOCOwIR.gif"
  },
  {
    "id": "edb-gtO1ErP",
    "name": "Weighted Three Bench Dips",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/gtO1ErP.gif"
  },
  {
    "id": "edb-pP8wP2P",
    "name": "Dumbbell Neutral Grip Bench Press",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/pP8wP2P.gif"
  },
  {
    "id": "edb-HJ63mSO",
    "name": "Barbell Lying Close-grip Triceps Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/HJ63mSO.gif"
  },
  {
    "id": "edb-CQHoDm0",
    "name": "Ez Barbell Decline Triceps Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/CQHoDm0.gif"
  },
  {
    "id": "edb-VQ3sNCn",
    "name": "Dumbbell Seated One Arm Kickback",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/VQ3sNCn.gif"
  },
  {
    "id": "edb-6CKUx7o",
    "name": "Ez Bar Lying Close Grip Triceps Extension Behind Head",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/6CKUx7o.gif"
  },
  {
    "id": "edb-ufaxB52",
    "name": "Band Close-grip Push-up",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/ufaxB52.gif"
  },
  {
    "id": "edb-bpJL2Qs",
    "name": "Dumbbell Pronate-grip Triceps Extension",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/bpJL2Qs.gif"
  },
  {
    "id": "edb-K1vlode",
    "name": "Weighted Triceps Dip on High Parallel Bars",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/K1vlode.gif"
  },
  {
    "id": "edb-DQ0cqkT",
    "name": "Three Bench Dip",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/DQ0cqkT.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/ezTvXcr.gif"
  },
  {
    "id": "edb-s5PdDyY",
    "name": "Dumbbell Tate Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/s5PdDyY.gif"
  },
  {
    "id": "edb-RrLske5",
    "name": "Bench Dip (knees Bent)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/RrLske5.gif"
  },
  {
    "id": "edb-dZl9Q27",
    "name": "Barbell Standing Overhead Triceps Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/dZl9Q27.gif"
  },
  {
    "id": "edb-ZujAdR9",
    "name": "Cable Rope Incline Tricep Extension",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/ZujAdR9.gif"
  },
  {
    "id": "edb-o8aOcrz",
    "name": "Smith Machine Incline Tricep Extension",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/o8aOcrz.gif"
  },
  {
    "id": "edb-wu5LXwz",
    "name": "Olympic Barbell Triceps Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/wu5LXwz.gif"
  },
  {
    "id": "edb-VYmYxK5",
    "name": "Dumbbell One Arm Hammer Press on Exercise Ball",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "CHEST"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "shoulders",
        "chest"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/VYmYxK5.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/PdmaD0N.gif"
  },
  {
    "id": "edb-NfP83rA",
    "name": "Dumbbell Lying Alternate Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/NfP83rA.gif"
  },
  {
    "id": "edb-VuoerH0",
    "name": "Triceps Dip (bench Leg)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/VuoerH0.gif"
  },
  {
    "id": "edb-Al3tP0D",
    "name": "Medicine Ball Supine Chest Throw",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Al3tP0D.gif"
  },
  {
    "id": "edb-OxJk1fg",
    "name": "Cable Triceps Pushdown (v-bar) (with Arm Blaster)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/OxJk1fg.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/J6Dx1Mu.gif"
  },
  {
    "id": "edb-7HcfMBP",
    "name": "Assisted Standing Triceps Extension (with Towel)",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/7HcfMBP.gif"
  },
  {
    "id": "edb-kprile3",
    "name": "Exercise Ball Dip",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/kprile3.gif"
  },
  {
    "id": "edb-4CBIBOM",
    "name": "Barbell Seated Close Grip Behind Neck Triceps Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/4CBIBOM.gif"
  },
  {
    "id": "edb-7aVz15j",
    "name": "Triceps Dips Floor",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/7aVz15j.gif"
  },
  {
    "id": "edb-8K7m2SS",
    "name": "Medicine Ball Close Grip Push Up",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/8K7m2SS.gif"
  },
  {
    "id": "edb-KyLtiLT",
    "name": "Ez Barbell Incline Triceps Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/KyLtiLT.gif"
  },
  {
    "id": "edb-sYCcnon",
    "name": "Cable Standing One Arm Triceps Extension",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/sYCcnon.gif"
  },
  {
    "id": "edb-hnOYgH3",
    "name": "Ez Barbell Jm Bench Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/hnOYgH3.gif"
  },
  {
    "id": "edb-EMpUwRI",
    "name": "Barbell Lying Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/EMpUwRI.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/dU605di.gif"
  },
  {
    "id": "edb-vvNjDJS",
    "name": "Cable Two Arm Tricep Kickback",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/vvNjDJS.gif"
  },
  {
    "id": "edb-U6G2gk9",
    "name": "Body-up",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/U6G2gk9.gif"
  },
  {
    "id": "edb-Db7eEgw",
    "name": "Cable Concentration Extension (on Knee)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Db7eEgw.gif"
  },
  {
    "id": "edb-yRLPCLu",
    "name": "Barbell Reverse Grip Skullcrusher",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/yRLPCLu.gif"
  },
  {
    "id": "edb-7ePTw4B",
    "name": "Exercise Ball Seated Triceps Stretch",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/7ePTw4B.gif"
  },
  {
    "id": "edb-XalXcvM",
    "name": "Dumbbell Forward Lunge Triceps Extension",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "ABS"
      ],
      "targetRaw": [
        "triceps"
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
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/XalXcvM.gif"
  },
  {
    "id": "edb-3T12T87",
    "name": "Dumbbell Standing Bent Over Two Arm Triceps Extension",
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
        "shoulders",
        "back"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/3T12T87.gif"
  },
  {
    "id": "edb-wyaqzOS",
    "name": "Dumbbell Lying One Arm Pronated Triceps Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/wyaqzOS.gif"
  },
  {
    "id": "edb-KZXAtKQ",
    "name": "Push-up Close-grip Off Dumbbell",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/KZXAtKQ.gif"
  },
  {
    "id": "edb-BCUR88E",
    "name": "Dumbbell Standing One Arm Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/BCUR88E.gif"
  },
  {
    "id": "edb-UmpPAAe",
    "name": "Dumbbell Standing Kickback",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/UmpPAAe.gif"
  },
  {
    "id": "edb-ZsiqXYa",
    "name": "Barbell Jm Bench Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/ZsiqXYa.gif"
  },
  {
    "id": "edb-Gi2BXfK",
    "name": "Dumbbell Standing Alternating Tricep Kickback",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Gi2BXfK.gif"
  },
  {
    "id": "edb-Ser9eQp",
    "name": "Lever Triceps Extension",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Ser9eQp.gif"
  },
  {
    "id": "edb-MU9HnE7",
    "name": "Weighted Bench Dip",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/MU9HnE7.gif"
  },
  {
    "id": "edb-ziFKQXP",
    "name": "Dumbbell One Arm French Press on Exercise Ball",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/ziFKQXP.gif"
  },
  {
    "id": "edb-641mIfk",
    "name": "Barbell Incline Reverse-grip Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "CHEST",
        "POSTERIOR_DELT"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/641mIfk.gif"
  },
  {
    "id": "edb-9RT8oQW",
    "name": "Bench Dip on Floor",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/9RT8oQW.gif"
  },
  {
    "id": "edb-nAuHPcD",
    "name": "Dumbbell One Arm Triceps Extension (on Bench)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/nAuHPcD.gif"
  },
  {
    "id": "edb-YqJw82s",
    "name": "Barbell Reverse Close-grip Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "CHEST",
        "POSTERIOR_DELT"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/YqJw82s.gif"
  },
  {
    "id": "edb-yB9SvIF",
    "name": "Smith Machine Decline Close Grip Bench Press",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/yB9SvIF.gif"
  },
  {
    "id": "edb-ThKP69G",
    "name": "Cable Reverse Grip Triceps Pushdown (sz-bar) (with Arm Blaster)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/ThKP69G.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/soIB2rj.gif"
  },
  {
    "id": "edb-5uFK1xr",
    "name": "Barbell Seated Overhead Triceps Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/5uFK1xr.gif"
  },
  {
    "id": "edb-1cTf2Ux",
    "name": "Ez Bar Standing French Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/1cTf2Ux.gif"
  },
  {
    "id": "edb-vpQaQkH",
    "name": "Ski Ergometer",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "FOREARMS"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "shoulders",
        "forearms"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/vpQaQkH.gif"
  },
  {
    "id": "edb-FAoIFMw",
    "name": "One Arm Dip",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/FAoIFMw.gif"
  },
  {
    "id": "edb-7jGOBF3",
    "name": "Dumbbell Close Grip Press",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/7jGOBF3.gif"
  },
  {
    "id": "edb-gx7s7uF",
    "name": "Barbell Incline Close Grip Bench Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/gx7s7uF.gif"
  },
  {
    "id": "edb-x0lwvfq",
    "name": "Dumbbell Seated Bent Over Alternate Kickback",
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
        "shoulders",
        "back"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/x0lwvfq.gif"
  },
  {
    "id": "edb-BRImeP8",
    "name": "Lever Seated Dip",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/BRImeP8.gif"
  },
  {
    "id": "edb-8eqjhOl",
    "name": "Dumbbell Palms in Incline Bench Press",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/8eqjhOl.gif"
  },
  {
    "id": "edb-NZ5Qqkz",
    "name": "Reverse Dip",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "CHEST",
        "POSTERIOR_DELT"
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/NZ5Qqkz.gif"
  },
  {
    "id": "edb-5fKX7wi",
    "name": "Dumbbell Seated Reverse Grip One Arm Overhead Tricep Extension",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "POSTERIOR_DELT"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/5fKX7wi.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/X6C6i5Y.gif"
  },
  {
    "id": "edb-DgZQ11d",
    "name": "Ez Barbell Decline Close Grip Face Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/DgZQ11d.gif"
  },
  {
    "id": "edb-6MfS53i",
    "name": "Dumbbell Lying Single Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/6MfS53i.gif"
  },
  {
    "id": "edb-LL1UiTX",
    "name": "Dumbbell Incline One Arm Hammer Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "CHEST"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "shoulders",
        "chest"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/LL1UiTX.gif"
  },
  {
    "id": "edb-bQy2Eni",
    "name": "Dumbbell One Arm Kickback",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/bQy2Eni.gif"
  },
  {
    "id": "edb-FQXdXzY",
    "name": "Dumbbells Seated Triceps Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/FQXdXzY.gif"
  },
  {
    "id": "edb-en550rk",
    "name": "Dumbbell Seated Kickback",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/en550rk.gif"
  },
  {
    "id": "edb-Gm2Uv1z",
    "name": "Exercise Ball Supine Triceps Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Gm2Uv1z.gif"
  },
  {
    "id": "edb-CFN9P8G",
    "name": "Ez Bar French Press on Exercise Ball",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/CFN9P8G.gif"
  },
  {
    "id": "edb-SHUMp5H",
    "name": "Dumbbell Decline One Arm Hammer Press",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/SHUMp5H.gif"
  },
  {
    "id": "edb-c3QQLPi",
    "name": "Cable Rear Drive",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "POSTERIOR_DELT"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "shoulders",
        "back"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/c3QQLPi.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/rQxwMxO.gif"
  },
  {
    "id": "edb-KWdF2JI",
    "name": "Cable Kneeling Triceps Extension",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/KWdF2JI.gif"
  },
  {
    "id": "edb-fSrPP6B",
    "name": "Triceps Press",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/fSrPP6B.gif"
  },
  {
    "id": "edb-05Cf2v8",
    "name": "Impossible Dips",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/05Cf2v8.gif"
  },
  {
    "id": "edb-1TVoin7",
    "name": "Barbell Lying Triceps Extension Double",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/1TVoin7.gif"
  },
  {
    "id": "edb-syUwUKY",
    "name": "Rotated Dumbbell Pronate-grip Triceps Extension",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/syUwUKY.gif"
  },
  {
    "id": "edb-omsF3RN",
    "name": "Dynamic Style Band Side Triceps Extension",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/omsF3RN.gif"
  },
  {
    "id": "edb-pNIKolI",
    "name": "Exercise Ball Seated Triceps Stretch Wide",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/pNIKolI.gif"
  },
  {
    "id": "edb-jvEXp4N",
    "name": "Endurance Style One Arm Dip",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/jvEXp4N.gif"
  },
  {
    "id": "edb-9tvVVM9",
    "name": "Flexible Cable Triceps Pushdown (v-bar)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/9tvVVM9.gif"
  },
  {
    "id": "edb-w7obpWd",
    "name": "Active Style Cable Pushdown",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/w7obpWd.gif"
  },
  {
    "id": "edb-TBNaSNs",
    "name": "Ez Barbell Decline Close Grip Face Press - Mini Variation",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/TBNaSNs.gif"
  },
  {
    "id": "edb-C8Crfa4",
    "name": "Targeted Style Smith Close-grip Bench Press",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/C8Crfa4.gif"
  },
  {
    "id": "edb-iFsqlCD",
    "name": "Prone Medicine Ball Close Grip Push Up",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/iFsqlCD.gif"
  },
  {
    "id": "edb-9ZGnq1w",
    "name": "Triceps Dip (between Benches) - Extreme Variation",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/9ZGnq1w.gif"
  },
  {
    "id": "edb-qU8bYp7",
    "name": "Rough Cable Standing One Arm Triceps Extension",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/qU8bYp7.gif"
  },
  {
    "id": "edb-I6Ca0a7",
    "name": "Complete Style Ez Bar Lying Close Grip Triceps Extension Behind Head",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/I6Ca0a7.gif"
  },
  {
    "id": "edb-7WcQgkm",
    "name": "Smith Machine Incline Tricep Extension - Straight Variation",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/7WcQgkm.gif"
  },
  {
    "id": "edb-1IFV9h3",
    "name": "Push-up on Lower Arms - Resistance Variation",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/1IFV9h3.gif"
  },
  {
    "id": "edb-OJFgZJ0",
    "name": "Dynamic Style Barbell Lying Back of the Head Tricep Extension",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/OJFgZJ0.gif"
  },
  {
    "id": "edb-7R4NIjL",
    "name": "Assisted Standing Triceps Extension (with Towel) with Horizontal",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/7R4NIjL.gif"
  },
  {
    "id": "edb-W7yh3Yo",
    "name": "Wall Style Dumbbell One Arm French Press on Exercise Ball",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/W7yh3Yo.gif"
  },
  {
    "id": "edb-VsopqcV",
    "name": "Macro Style Close-grip Push-up",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/VsopqcV.gif"
  },
  {
    "id": "edb-vNPJbDA",
    "name": "Cable Rope Incline Tricep Extension - Reverse Variation",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": [
        "POSTERIOR_DELT"
      ],
      "targetRaw": [
        "triceps"
      ],
      "secondaryRaw": [
        "shoulders"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/vNPJbDA.gif"
  },
  {
    "id": "edb-trmte8s",
    "name": "Band Shrug",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/trmte8s.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/Eg98Ft9.gif"
  },
  {
    "id": "edb-cbuFJrn",
    "name": "Lever Gripless Shrug V. 2",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "FOREARMS"
      ],
      "targetRaw": [
        "traps"
      ],
      "secondaryRaw": [
        "shoulders",
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
    "gifUrl": "https://static.exercisedb.dev/media/cbuFJrn.gif"
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
    "id": "edb-cwsAI4G",
    "name": "Dumbbell Decline Shrug",
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
        "shoulders",
        "rhomboids"
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
    "gifUrl": "https://static.exercisedb.dev/media/cwsAI4G.gif"
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/dG7tG5y.gif"
  },
  {
    "id": "edb-ZZKbeMw",
    "name": "Lever Shrug",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/ZZKbeMw.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/NJzBsGJ.gif"
  },
  {
    "id": "edb-f91FwXG",
    "name": "Lever Gripless Shrug",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "FOREARMS"
      ],
      "targetRaw": [
        "traps"
      ],
      "secondaryRaw": [
        "shoulders",
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
    "gifUrl": "https://static.exercisedb.dev/media/f91FwXG.gif"
  },
  {
    "id": "edb-OUQ0ZyW",
    "name": "Smith Shrug",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/OUQ0ZyW.gif"
  },
  {
    "id": "edb-JymLInS",
    "name": "Dumbbell Incline Shrug",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/JymLInS.gif"
  },
  {
    "id": "edb-bRlbdjK",
    "name": "Dumbbell Decline Shrug V. 2",
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
        "shoulders",
        "rhomboids"
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
    "gifUrl": "https://static.exercisedb.dev/media/bRlbdjK.gif"
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
    "id": "edb-MzNnwx9",
    "name": "Smith Back Shrug",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/MzNnwx9.gif"
  },
  {
    "id": "edb-IH2kr7n",
    "name": "Dumbbell Decline Shrug - Rigid Variation",
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
        "shoulders",
        "rhomboids"
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
    "gifUrl": "https://static.exercisedb.dev/media/IH2kr7n.gif"
  },
  {
    "id": "edb-DIVyqrU",
    "name": "Sphinx",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/DIVyqrU.gif"
  },
  {
    "id": "edb-zkgRrbK",
    "name": "Hyperextension (on Bench)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/zkgRrbK.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/qLpO4vV.gif"
  },
  {
    "id": "edb-WME869U",
    "name": "Exercise Ball Back Extension with Knees Off Ground",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/WME869U.gif"
  },
  {
    "id": "edb-cuKYxhu",
    "name": "Standing Pelvic Tilt",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ABS"
      ],
      "targetRaw": [
        "spine"
      ],
      "secondaryRaw": [
        "abdominals"
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
    "gifUrl": "https://static.exercisedb.dev/media/cuKYxhu.gif"
  },
  {
    "id": "edb-isofgzg",
    "name": "Roller Back Stretch",
    "defaultUnit": "reps",
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
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/isofgzg.gif"
  },
  {
    "id": "edb-lCKm4Rs",
    "name": "Exercise Ball Prone Leg Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "ABS",
        "GLUTES"
      ],
      "targetRaw": [
        "spine"
      ],
      "secondaryRaw": [
        "abdominals",
        "glutes"
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
    "gifUrl": "https://static.exercisedb.dev/media/lCKm4Rs.gif"
  },
  {
    "id": "edb-o1HGDSq",
    "name": "Exercise Ball Back Extension with Hands Behind Head",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/o1HGDSq.gif"
  },
  {
    "id": "edb-PERjVm8",
    "name": "Exercise Ball Back Extension with Arms Extended",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/PERjVm8.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/rUXfn3R.gif"
  },
  {
    "id": "edb-p195zsJ",
    "name": "Two Toe Touch (male)",
    "defaultUnit": "reps",
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
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/p195zsJ.gif"
  },
  {
    "id": "edb-ANbbry2",
    "name": "Lower Back Curl",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/ANbbry2.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/01qpYSe.gif"
  },
  {
    "id": "edb-WVD66ff",
    "name": "Exercise Ball Back Extension with Rotation",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/WVD66ff.gif"
  },
  {
    "id": "edb-JbC2iaV",
    "name": "Spine Stretch",
    "defaultUnit": "reps",
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
      "isolation",
      "pull",
      "bodyweight",
      "cardio"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/JbC2iaV.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/zhMwOwE.gif"
  },
  {
    "id": "edb-d7z1Y7V",
    "name": "Exercise Ball Hug",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/d7z1Y7V.gif"
  },
  {
    "id": "edb-KUaoUV8",
    "name": "Band Straight Leg Deadlift",
    "defaultUnit": "reps",
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
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/KUaoUV8.gif"
  },
  {
    "id": "edb-8urJS9b",
    "name": "Weighted Hyperextension (on Stability Ball)",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/8urJS9b.gif"
  },
  {
    "id": "edb-O3INw8V",
    "name": "Improved Sphinx",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/O3INw8V.gif"
  },
  {
    "id": "edb-lRcrlH8",
    "name": "Fast Band Straight Leg Deadlift",
    "defaultUnit": "reps",
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
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/lRcrlH8.gif"
  },
  {
    "id": "edb-ayAHcEm",
    "name": "Smith Incline Shoulder Raises",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "BACK"
      ],
      "targetRaw": [
        "serratus anterior"
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
    "gifUrl": "https://static.exercisedb.dev/media/ayAHcEm.gif"
  },
  {
    "id": "edb-6e2DcYX",
    "name": "Dumbbell Incline Shoulder Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "BACK"
      ],
      "targetRaw": [
        "serratus anterior"
      ],
      "secondaryRaw": [
        "deltoids",
        "trapezius"
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
    "gifUrl": "https://static.exercisedb.dev/media/6e2DcYX.gif"
  },
  {
    "id": "edb-GdMa1ET",
    "name": "Incline Scapula Push Up",
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
    "gifUrl": "https://static.exercisedb.dev/media/GdMa1ET.gif"
  },
  {
    "id": "edb-xi0yckC",
    "name": "Barbell Incline Shoulder Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "BACK"
      ],
      "targetRaw": [
        "serratus anterior"
      ],
      "secondaryRaw": [
        "deltoids",
        "trapezius"
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
    "gifUrl": "https://static.exercisedb.dev/media/xi0yckC.gif"
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
    "id": "edb-gMyx3Qn",
    "name": "High Style Scapula Push-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/gMyx3Qn.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/SGY8Zui.gif"
  },
  {
    "id": "edb-YUYAMEj",
    "name": "Assisted Prone Lying Quads Stretch",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/YUYAMEj.gif"
  },
  {
    "id": "edb-W9pFVv1",
    "name": "Barbell Bench Squat",
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
    "gifUrl": "https://static.exercisedb.dev/media/W9pFVv1.gif"
  },
  {
    "id": "edb-QpXqiq8",
    "name": "Suspended Split Squat",
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
    "gifUrl": "https://static.exercisedb.dev/media/QpXqiq8.gif"
  },
  {
    "id": "edb-BWnJR72",
    "name": "Lying (side) Quads Stretch",
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
    "gifUrl": "https://static.exercisedb.dev/media/BWnJR72.gif"
  },
  {
    "id": "edb-5BZHW9s",
    "name": "Squat to Overhead Reach with Twist",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS",
        "ABS"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings",
        "core"
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
    "gifUrl": "https://static.exercisedb.dev/media/5BZHW9s.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/wWFspEi.gif"
  },
  {
    "id": "edb-xGgAGPm",
    "name": "Chair Leg Extended Stretch",
    "defaultUnit": "reps",
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
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/xGgAGPm.gif"
  },
  {
    "id": "edb-r5DgrW9",
    "name": "Dumbbell Supported Squat",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/r5DgrW9.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/gfk9kD4.gif"
  },
  {
    "id": "edb-HBYyX94",
    "name": "Barbell Split Squat V. 2",
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
    "gifUrl": "https://static.exercisedb.dev/media/HBYyX94.gif"
  },
  {
    "id": "edb-tFGKm99",
    "name": "Intermediate Hip Flexor and Quad Stretch",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/tFGKm99.gif"
  },
  {
    "id": "edb-Gu2rNJd",
    "name": "Smith Chair Squat",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Gu2rNJd.gif"
  },
  {
    "id": "edb-RYcV1kH",
    "name": "Barbell Squat Jump Step Rear Lunge",
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
    "gifUrl": "https://static.exercisedb.dev/media/RYcV1kH.gif"
  },
  {
    "id": "edb-uKyN64F",
    "name": "Barbell One Leg Squat",
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
    "gifUrl": "https://static.exercisedb.dev/media/uKyN64F.gif"
  },
  {
    "id": "edb-oR7O9LW",
    "name": "Barbell Squat (on Knees)",
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
    "gifUrl": "https://static.exercisedb.dev/media/oR7O9LW.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/dG5Smob.gif"
  },
  {
    "id": "edb-y8bYM8w",
    "name": "Band Single Leg Split Squat",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/y8bYM8w.gif"
  },
  {
    "id": "edb-IMRsOCn",
    "name": "Squat Jerk",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/IMRsOCn.gif"
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/9E25EOx.gif"
  },
  {
    "id": "edb-Y7YcmIJ",
    "name": "Barbell Bench Front Squat",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Y7YcmIJ.gif"
  },
  {
    "id": "edb-HUEqZ1y",
    "name": "Barbell Side Split Squat V. 2",
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
    "gifUrl": "https://static.exercisedb.dev/media/HUEqZ1y.gif"
  },
  {
    "id": "edb-0lQnxMZ",
    "name": "Weighted Sissy Squat",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/0lQnxMZ.gif"
  },
  {
    "id": "edb-gFyFj9z",
    "name": "Dumbbell Step-up Lunge",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/gFyFj9z.gif"
  },
  {
    "id": "edb-s7HX1BY",
    "name": "Barbell Wide Squat",
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
    "gifUrl": "https://static.exercisedb.dev/media/s7HX1BY.gif"
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
    "id": "edb-xAySMB0",
    "name": "Balance Board",
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
    "gifUrl": "https://static.exercisedb.dev/media/xAySMB0.gif"
  },
  {
    "id": "edb-arsYEd3",
    "name": "Band One Arm Single Leg Split Squat",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/arsYEd3.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/my33uHU.gif"
  },
  {
    "id": "edb-QChZi3x",
    "name": "Squat to Overhead Reach",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS",
        "ABS"
      ],
      "targetRaw": [
        "quads"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings",
        "core"
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
    "gifUrl": "https://static.exercisedb.dev/media/QChZi3x.gif"
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/yn8yg1r.gif"
  },
  {
    "id": "edb-V07qpXy",
    "name": "Lever Alternate Leg Press",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/V07qpXy.gif"
  },
  {
    "id": "edb-gGNQmVt",
    "name": "Barbell Single Leg Split Squat",
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
    "gifUrl": "https://static.exercisedb.dev/media/gGNQmVt.gif"
  },
  {
    "id": "edb-qBcKorM",
    "name": "All Fours Squad Stretch",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/qBcKorM.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/qPEzJjA.gif"
  },
  {
    "id": "edb-QjE2DcA",
    "name": "Dumbbell Step-up Split Squat",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/QjE2DcA.gif"
  },
  {
    "id": "edb-6YUfHPL",
    "name": "Quads",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/6YUfHPL.gif"
  },
  {
    "id": "edb-SaDOwk7",
    "name": "Backward Jump",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/SaDOwk7.gif"
  },
  {
    "id": "edb-Ul5OFSV",
    "name": "Resistance Band Leg Extension Declined",
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
    "gifUrl": "https://static.exercisedb.dev/media/Ul5OFSV.gif"
  },
  {
    "id": "edb-IBj3nsn",
    "name": "Quick Feet V. 2 with Bent",
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
    "gifUrl": "https://static.exercisedb.dev/media/IBj3nsn.gif"
  },
  {
    "id": "edb-DoEYq4s",
    "name": "Sissy Squat Isolation",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/DoEYq4s.gif"
  },
  {
    "id": "edb-fF6GKVh",
    "name": "Chair Leg Extended Stretch with Modified",
    "defaultUnit": "reps",
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
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/fF6GKVh.gif"
  },
  {
    "id": "edb-LzX8YEz",
    "name": "All Fours Squad Stretch - Elevated Variation",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/LzX8YEz.gif"
  },
  {
    "id": "edb-7858za8",
    "name": "Fluid Dumbbell Step-up Lunge",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/7858za8.gif"
  },
  {
    "id": "edb-MDFxU4b",
    "name": "Quads Complex",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/MDFxU4b.gif"
  },
  {
    "id": "edb-echClj7",
    "name": "Barbell Squat (on Knees) with Pure",
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
    "gifUrl": "https://static.exercisedb.dev/media/echClj7.gif"
  },
  {
    "id": "edb-27NNGFr",
    "name": "Cable Incline Fly (on Stability Ball)",
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
    "gifUrl": "https://static.exercisedb.dev/media/27NNGFr.gif"
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
    "aliases": [],
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
    "id": "edb-PnZJIrk",
    "name": "Assisted Wide-grip Chest Dip (kneeling)",
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
    "gifUrl": "https://static.exercisedb.dev/media/PnZJIrk.gif"
  },
  {
    "id": "edb-LQFOrMn",
    "name": "Chest Dip on Straight Bar",
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
    "gifUrl": "https://static.exercisedb.dev/media/LQFOrMn.gif"
  },
  {
    "id": "edb-33AzZeV",
    "name": "Barbell Front Raise and Pullover",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/33AzZeV.gif"
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
    "id": "edb-REGM1dE",
    "name": "Dumbbell One Arm Decline Chest Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/REGM1dE.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/xLYSdtg.gif"
  },
  {
    "id": "edb-1PLE8e9",
    "name": "Dumbbell Incline Twisted Flyes",
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
    "gifUrl": "https://static.exercisedb.dev/media/1PLE8e9.gif"
  },
  {
    "id": "edb-CB8WET1",
    "name": "Incline Push Up Depth Jump",
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
    "gifUrl": "https://static.exercisedb.dev/media/CB8WET1.gif"
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
    "id": "edb-wDN97Ca",
    "name": "Machine Inner Chest Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/wDN97Ca.gif"
  },
  {
    "id": "edb-wXvUZC8",
    "name": "Push and Pull Bodyweight",
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
    "gifUrl": "https://static.exercisedb.dev/media/wXvUZC8.gif"
  },
  {
    "id": "edb-CjETvlw",
    "name": "Roller Seated Single Leg Shoulder Flexor Depresor Retractor",
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
      "ab wheel"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/CjETvlw.gif"
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
    "id": "edb-8coXSYU",
    "name": "Roller Seated Shoulder Flexor Depresor Retractor",
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
      "ab wheel"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/8coXSYU.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/3TZduzM.gif"
  },
  {
    "id": "edb-O2K9Vb5",
    "name": "Wide-grip Chest Dip on High Parallel Bars",
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
    "gifUrl": "https://static.exercisedb.dev/media/O2K9Vb5.gif"
  },
  {
    "id": "edb-reFHapa",
    "name": "Dumbbell Decline Twist Fly",
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
    "gifUrl": "https://static.exercisedb.dev/media/reFHapa.gif"
  },
  {
    "id": "edb-c16nYGA",
    "name": "Band One Arm Twisting Chest Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/c16nYGA.gif"
  },
  {
    "id": "edb-PSlvNMs",
    "name": "Weighted Drop Push Up",
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
    "gifUrl": "https://static.exercisedb.dev/media/PSlvNMs.gif"
  },
  {
    "id": "edb-13TpY4H",
    "name": "Raise Single Arm Push-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/13TpY4H.gif"
  },
  {
    "id": "edb-NCmbLCw",
    "name": "Push-up (wall) V. 2",
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
    "gifUrl": "https://static.exercisedb.dev/media/NCmbLCw.gif"
  },
  {
    "id": "edb-ZOuKWir",
    "name": "Kneeling Push-up (male)",
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
    "id": "edb-DU7I633",
    "name": "Barbell Reverse Grip Incline Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "POSTERIOR_DELT"
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
    "gifUrl": "https://static.exercisedb.dev/media/DU7I633.gif"
  },
  {
    "id": "edb-ktf3nvW",
    "name": "Kettlebell Plyo Push-up",
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
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/ktf3nvW.gif"
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
    "id": "edb-hl8DUh8",
    "name": "Barbell Decline Wide-grip Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/hl8DUh8.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/SpYC0Kp.gif"
  },
  {
    "id": "edb-K3dIO25",
    "name": "Dumbbell Lying One Arm Press V. 2",
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
    "gifUrl": "https://static.exercisedb.dev/media/K3dIO25.gif"
  },
  {
    "id": "edb-KHGNa16",
    "name": "Cable Decline One Arm Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/KHGNa16.gif"
  },
  {
    "id": "edb-o17Jfkt",
    "name": "Lever Incline Chest Press V. 2",
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
    "gifUrl": "https://static.exercisedb.dev/media/o17Jfkt.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/7saC5zz.gif"
  },
  {
    "id": "edb-DotAgEF",
    "name": "Barbell Reverse Grip Decline Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "POSTERIOR_DELT"
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
    "gifUrl": "https://static.exercisedb.dev/media/DotAgEF.gif"
  },
  {
    "id": "edb-ykA5tU7",
    "name": "Chest Stretch with Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/ykA5tU7.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/Snj1wSv.gif"
  },
  {
    "id": "edb-945zpRg",
    "name": "Barbell Wide Reverse Grip Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "POSTERIOR_DELT"
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
    "gifUrl": "https://static.exercisedb.dev/media/945zpRg.gif"
  },
  {
    "id": "edb-Am02iPd",
    "name": "Dumbbell One Arm Fly on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/Am02iPd.gif"
  },
  {
    "id": "edb-T0yTjgW",
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
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/T0yTjgW.gif"
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/I1OBLnn.gif"
  },
  {
    "id": "edb-rDAiRf9",
    "name": "Dumbbell Incline One Arm Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/rDAiRf9.gif"
  },
  {
    "id": "edb-tgryw5Y",
    "name": "Push-up (on Stability Ball)",
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
    "gifUrl": "https://static.exercisedb.dev/media/tgryw5Y.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/9XjtHvS.gif"
  },
  {
    "id": "edb-XgWyAiA",
    "name": "Chest Dip (on Dip-pull-up Cage)",
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
    "gifUrl": "https://static.exercisedb.dev/media/XgWyAiA.gif"
  },
  {
    "id": "edb-PDaMuyV",
    "name": "Dumbbell One Arm Incline Chest Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/PDaMuyV.gif"
  },
  {
    "id": "edb-TVdivgY",
    "name": "Dumbbell Incline Alternate Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/TVdivgY.gif"
  },
  {
    "id": "edb-RoV1Rfa",
    "name": "Assisted Seated Pectoralis Major Stretch with Stability Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/RoV1Rfa.gif"
  },
  {
    "id": "edb-2kr2lWy",
    "name": "Push-up (bosu Ball)",
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
    "gifUrl": "https://static.exercisedb.dev/media/2kr2lWy.gif"
  },
  {
    "id": "edb-7w6i0vE",
    "name": "Kettlebell Alternating Press on Floor",
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
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/7w6i0vE.gif"
  },
  {
    "id": "edb-2Pya1cP",
    "name": "Cable Decline Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/2Pya1cP.gif"
  },
  {
    "id": "edb-11wrviz",
    "name": "Isometric Wipers",
    "defaultUnit": "sec",
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
    "gifUrl": "https://static.exercisedb.dev/media/11wrviz.gif"
  },
  {
    "id": "edb-B3Rxp6L",
    "name": "Dumbbell Incline Breeding",
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
    "gifUrl": "https://static.exercisedb.dev/media/B3Rxp6L.gif"
  },
  {
    "id": "edb-vAwm6rK",
    "name": "Cable Press on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/vAwm6rK.gif"
  },
  {
    "id": "edb-rseLfH3",
    "name": "Kettlebell Extended Range One Arm Press on Floor",
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
    "gifUrl": "https://static.exercisedb.dev/media/rseLfH3.gif"
  },
  {
    "id": "edb-LLNh6q5",
    "name": "Dumbbell Incline One Arm Fly on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/LLNh6q5.gif"
  },
  {
    "id": "edb-w4dLzSx",
    "name": "Cable One Arm Decline Chest Fly",
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
    "gifUrl": "https://static.exercisedb.dev/media/w4dLzSx.gif"
  },
  {
    "id": "edb-GKEH6jj",
    "name": "Cable One Arm Incline Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/GKEH6jj.gif"
  },
  {
    "id": "edb-Bg5JKSH",
    "name": "Dumbbell Incline One Arm Press on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/Bg5JKSH.gif"
  },
  {
    "id": "edb-JsKq9so",
    "name": "Barbell Wide Bench Press",
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
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/JsKq9so.gif"
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
    "id": "edb-F7vjXqT",
    "name": "Incline Push-up (on Box)",
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
    "gifUrl": "https://static.exercisedb.dev/media/F7vjXqT.gif"
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
    "id": "edb-Lt3iWnf",
    "name": "Dumbbell Fly on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/Lt3iWnf.gif"
  },
  {
    "id": "edb-HYe1ZqR",
    "name": "Dumbbell Incline Fly on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/HYe1ZqR.gif"
  },
  {
    "id": "edb-dB07vDu",
    "name": "Cable One Arm Lateral Bent-over",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/dB07vDu.gif"
  },
  {
    "id": "edb-wi2H9QX",
    "name": "Smith Wide Grip Decline Bench Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/wi2H9QX.gif"
  },
  {
    "id": "edb-dCJnuVq",
    "name": "Medicine Ball Chest Push From 3 Point Stance",
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
    "gifUrl": "https://static.exercisedb.dev/media/dCJnuVq.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/i5cEhka.gif"
  },
  {
    "id": "edb-1qrWgZ2",
    "name": "Dumbbell Decline Hammer Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/1qrWgZ2.gif"
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
    "id": "edb-lI7easp",
    "name": "Dumbbell Pullover Hip Extension on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/lI7easp.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/EIeI8Vf.gif"
  },
  {
    "id": "edb-zK8Fu1W",
    "name": "Smith Reverse-grip Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "POSTERIOR_DELT"
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
    "gifUrl": "https://static.exercisedb.dev/media/zK8Fu1W.gif"
  },
  {
    "id": "edb-ETZfAbZ",
    "name": "Smith Decline Bench Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/ETZfAbZ.gif"
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
    "id": "edb-bfiHMpI",
    "name": "Dumbbell Incline Press on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/bfiHMpI.gif"
  },
  {
    "id": "edb-wVompEp",
    "name": "Push Up on Bosu Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/wVompEp.gif"
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
    "aliases": [],
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
    "aliases": [],
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
    "id": "edb-pAIWRGu",
    "name": "Hands Bike",
    "defaultUnit": "min",
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
    "gifUrl": "https://static.exercisedb.dev/media/pAIWRGu.gif"
  },
  {
    "id": "edb-Q497lAE",
    "name": "Drop Push Up",
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
    "gifUrl": "https://static.exercisedb.dev/media/Q497lAE.gif"
  },
  {
    "id": "edb-GXoaSgn",
    "name": "Barbell Guillotine Bench Press",
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
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/GXoaSgn.gif"
  },
  {
    "id": "edb-CMAxnsG",
    "name": "Clock Push-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/CMAxnsG.gif"
  },
  {
    "id": "edb-khlHMqs",
    "name": "Band Bench Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/khlHMqs.gif"
  },
  {
    "id": "edb-QZFv5ui",
    "name": "Dumbbell One Arm Press on Exercise Ball",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/QZFv5ui.gif"
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
    "id": "edb-Y4BRNQF",
    "name": "Push-up (on Stability Ball)",
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
    "gifUrl": "https://static.exercisedb.dev/media/Y4BRNQF.gif"
  },
  {
    "id": "edb-Ze7MoIb",
    "name": "Dumbbell One Arm Reverse Grip Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "POSTERIOR_DELT"
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
    "gifUrl": "https://static.exercisedb.dev/media/Ze7MoIb.gif"
  },
  {
    "id": "edb-vi8EhoE",
    "name": "Dumbbell Around Pullover",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "BACK"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "latissimus dorsi"
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
    "gifUrl": "https://static.exercisedb.dev/media/vi8EhoE.gif"
  },
  {
    "id": "edb-WbNq5Xu",
    "name": "Lever Standing Chest Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/WbNq5Xu.gif"
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
    "id": "edb-Gw2HFvW",
    "name": "Dumbbell Incline One Arm Fly",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/Gw2HFvW.gif"
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
    "id": "edb-FVmZVhk",
    "name": "Cable Low Fly",
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
    "gifUrl": "https://static.exercisedb.dev/media/FVmZVhk.gif"
  },
  {
    "id": "edb-Vh0GsK4",
    "name": "Cable Incline Bench Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/Vh0GsK4.gif"
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/yz9nUhF.gif"
  },
  {
    "id": "edb-P14Dz9D",
    "name": "Cable One Arm Incline Fly on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/P14Dz9D.gif"
  },
  {
    "id": "edb-neonEDL",
    "name": "Floor Fly (with Barbell)",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/neonEDL.gif"
  },
  {
    "id": "edb-epOSYUZ",
    "name": "Modified Hindu Push-up (male)",
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
    "id": "edb-pX9Elbe",
    "name": "Medicine Ball Chest Push with Run Release",
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
      "push",
      "cardio"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/pX9Elbe.gif"
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
    "id": "edb-iK59oEA",
    "name": "Dumbbell Lying Pullover on Exercise Ball",
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
        "shoulders",
        "back"
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
    "gifUrl": "https://static.exercisedb.dev/media/iK59oEA.gif"
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
    "aliases": [],
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
    "id": "edb-zGSIWQi",
    "name": "Dumbbell Lying One Arm Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/zGSIWQi.gif"
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
    "id": "edb-6t00BsF",
    "name": "Cable One Arm Incline Press on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/6t00BsF.gif"
  },
  {
    "id": "edb-j7XMAyn",
    "name": "Cable Upper Chest Crossovers",
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
    "gifUrl": "https://static.exercisedb.dev/media/j7XMAyn.gif"
  },
  {
    "id": "edb-Pr9Rhf4",
    "name": "Cable Standing Fly",
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
    "gifUrl": "https://static.exercisedb.dev/media/Pr9Rhf4.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "push",
      "bodyweight"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/JmMVpR3.gif"
  },
  {
    "id": "edb-zoOvPcx",
    "name": "Smith Wide Grip Bench Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/zoOvPcx.gif"
  },
  {
    "id": "edb-78VqWQK",
    "name": "Smith Incline Reverse-grip Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "POSTERIOR_DELT"
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
    "gifUrl": "https://static.exercisedb.dev/media/78VqWQK.gif"
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
    "id": "edb-MKIelrR",
    "name": "Cable One Arm Press on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/MKIelrR.gif"
  },
  {
    "id": "edb-3uj0Ozg",
    "name": "Dynamic Chest Stretch (male)",
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
    "gifUrl": "https://static.exercisedb.dev/media/3uj0Ozg.gif"
  },
  {
    "id": "edb-QoHIhPl",
    "name": "Behind Head Chest Stretch",
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
    "gifUrl": "https://static.exercisedb.dev/media/QoHIhPl.gif"
  },
  {
    "id": "edb-7aolH9D",
    "name": "Medicine Ball Chest Push Multiple Response",
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
    "gifUrl": "https://static.exercisedb.dev/media/7aolH9D.gif"
  },
  {
    "id": "edb-MY9P1WA",
    "name": "Smith Decline Reverse-grip Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "POSTERIOR_DELT"
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
    "gifUrl": "https://static.exercisedb.dev/media/MY9P1WA.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/ESOd5Pl.gif"
  },
  {
    "id": "edb-Bpkf41o",
    "name": "Dumbbell One Arm Chest Fly on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/Bpkf41o.gif"
  },
  {
    "id": "edb-P9ZRyLT",
    "name": "Hyght Dumbbell Fly",
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
    "gifUrl": "https://static.exercisedb.dev/media/P9ZRyLT.gif"
  },
  {
    "id": "edb-QyO6Uma",
    "name": "Smith Machine Reverse Decline Close Grip Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "POSTERIOR_DELT"
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
    "gifUrl": "https://static.exercisedb.dev/media/QyO6Uma.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/GrO65fd.gif"
  },
  {
    "id": "edb-7E06s6d",
    "name": "Chest Tap Push-up (male)",
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
    "gifUrl": "https://static.exercisedb.dev/media/7E06s6d.gif"
  },
  {
    "id": "edb-hHy8tQG",
    "name": "Cable One Arm Fly on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/hHy8tQG.gif"
  },
  {
    "id": "edb-0CXGHya",
    "name": "Cable Cross-over Variation",
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
    "gifUrl": "https://static.exercisedb.dev/media/0CXGHya.gif"
  },
  {
    "id": "edb-7gdLIXa",
    "name": "Dumbbell Lying Hammer Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/7gdLIXa.gif"
  },
  {
    "id": "edb-Uto7l43",
    "name": "Chest and Front of Shoulder Stretch",
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
    "aliases": [],
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
    "id": "edb-FSD6PGL",
    "name": "Dumbbell Pullover on Exercise Ball",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "BACK"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "latissimus dorsi"
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
    "gifUrl": "https://static.exercisedb.dev/media/FSD6PGL.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/ns0SIbU.gif"
  },
  {
    "id": "edb-vsVoPHt",
    "name": "Lever Decline Chest Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/vsVoPHt.gif"
  },
  {
    "id": "edb-jeHtrlO",
    "name": "Medicine Ball Chest Push Single Response",
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
    "gifUrl": "https://static.exercisedb.dev/media/jeHtrlO.gif"
  },
  {
    "id": "edb-UIbGx6H",
    "name": "Dumbbell Reverse Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "POSTERIOR_DELT"
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
    "gifUrl": "https://static.exercisedb.dev/media/UIbGx6H.gif"
  },
  {
    "id": "edb-NL6YBwN",
    "name": "Dumbbell Decline One Arm Fly",
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
    "gifUrl": "https://static.exercisedb.dev/media/NL6YBwN.gif"
  },
  {
    "id": "edb-pH2x2jj",
    "name": "Dumbbell One Leg Fly on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/pH2x2jj.gif"
  },
  {
    "id": "edb-lJJ7Yq8",
    "name": "Cable Lying Fly",
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
    "gifUrl": "https://static.exercisedb.dev/media/lJJ7Yq8.gif"
  },
  {
    "id": "edb-bQHPBU3",
    "name": "Dumbbell One Arm Pullover on Exercise Ball",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "BACK"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "latissimus dorsi",
        "rhomboids"
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
    "gifUrl": "https://static.exercisedb.dev/media/bQHPBU3.gif"
  },
  {
    "id": "edb-XaaRnRn",
    "name": "Incline Reverse Grip Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "POSTERIOR_DELT"
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
    "gifUrl": "https://static.exercisedb.dev/media/XaaRnRn.gif"
  },
  {
    "id": "edb-o5Jsk92",
    "name": "Dumbbell One Arm Bench Fly",
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
    "gifUrl": "https://static.exercisedb.dev/media/o5Jsk92.gif"
  },
  {
    "id": "edb-O8o7q4d",
    "name": "Dumbbell Press on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/O8o7q4d.gif"
  },
  {
    "id": "edb-ookVu2D",
    "name": "Wall Style Dumbbell Pullover Hip Extension on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/ookVu2D.gif"
  },
  {
    "id": "edb-F56Xpw3",
    "name": "Fierce Weighted Straight Bar Dip",
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
    "gifUrl": "https://static.exercisedb.dev/media/F56Xpw3.gif"
  },
  {
    "id": "edb-sJElUUI",
    "name": "Dumbbell Incline One Arm Press on Exercise Ball Modified",
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
    "gifUrl": "https://static.exercisedb.dev/media/sJElUUI.gif"
  },
  {
    "id": "edb-mAYqY4M",
    "name": "Stretched Full Planche Push-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/mAYqY4M.gif"
  },
  {
    "id": "edb-xOXZJRZ",
    "name": "Clock Push-up Extreme",
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
    "gifUrl": "https://static.exercisedb.dev/media/xOXZJRZ.gif"
  },
  {
    "id": "edb-W1p7BND",
    "name": "Chest Stretch with Exercise Ball Partial",
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
    "gifUrl": "https://static.exercisedb.dev/media/W1p7BND.gif"
  },
  {
    "id": "edb-vocve3e",
    "name": "Gentle Style Dumbbell One Leg Fly on Exercise Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/vocve3e.gif"
  },
  {
    "id": "edb-j6uIfep",
    "name": "Contracted Kettlebell Extended Range One Arm Press on Floor",
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
    "gifUrl": "https://static.exercisedb.dev/media/j6uIfep.gif"
  },
  {
    "id": "edb-3QgteDK",
    "name": "Barbell Wide Reverse Grip Bench Press Horizontal",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "POSTERIOR_DELT"
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
    "gifUrl": "https://static.exercisedb.dev/media/3QgteDK.gif"
  },
  {
    "id": "edb-numr601",
    "name": "Light Lever Standing Chest Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/numr601.gif"
  },
  {
    "id": "edb-woLo1QN",
    "name": "Incline Push-up (on Box) - Active Variation",
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
    "gifUrl": "https://static.exercisedb.dev/media/woLo1QN.gif"
  },
  {
    "id": "edb-drfGhTV",
    "name": "Balance Cable Incline Fly",
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
    "gifUrl": "https://static.exercisedb.dev/media/drfGhTV.gif"
  },
  {
    "id": "edb-FSF9WOs",
    "name": "Wide-grip Chest Dip on High Parallel Bars - Low Variation",
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
    "gifUrl": "https://static.exercisedb.dev/media/FSF9WOs.gif"
  },
  {
    "id": "edb-QoSZo2Y",
    "name": "Cable One Arm Incline Press with Rigid",
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
    "gifUrl": "https://static.exercisedb.dev/media/QoSZo2Y.gif"
  },
  {
    "id": "edb-EpKrFiv",
    "name": "Incline Push Up Depth Jump with Complex",
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
    "gifUrl": "https://static.exercisedb.dev/media/EpKrFiv.gif"
  },
  {
    "id": "edb-Aj9vWh7",
    "name": "Isolation Assisted Seated Pectoralis Major Stretch with Stability Ball",
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
    "gifUrl": "https://static.exercisedb.dev/media/Aj9vWh7.gif"
  },
  {
    "id": "edb-qBl14UC",
    "name": "Push-up (wall) with Static",
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
    "gifUrl": "https://static.exercisedb.dev/media/qBl14UC.gif"
  },
  {
    "id": "edb-jCBOdh0",
    "name": "Rough Cable Decline Fly",
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
    "gifUrl": "https://static.exercisedb.dev/media/jCBOdh0.gif"
  },
  {
    "id": "edb-9Z23cLE",
    "name": "Barbell Incline Bench Press Seated",
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
    "aliases": [],
    "tags": [
      "isolation",
      "push"
    ],
    "movement": "push",
    "gifUrl": "https://static.exercisedb.dev/media/9Z23cLE.gif"
  },
  {
    "id": "edb-qlZUaZ8",
    "name": "Dumbbell Incline One Arm Press on Exercise Ball with Extended",
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
    "gifUrl": "https://static.exercisedb.dev/media/qlZUaZ8.gif"
  },
  {
    "id": "edb-P7zSvul",
    "name": "Push Up on Bosu Ball with Improved",
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
    "gifUrl": "https://static.exercisedb.dev/media/P7zSvul.gif"
  },
  {
    "id": "edb-Gu2ENkm",
    "name": "Deep Smith Machine Reverse Decline Close Grip Bench Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "POSTERIOR_DELT"
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
    "gifUrl": "https://static.exercisedb.dev/media/Gu2ENkm.gif"
  },
  {
    "id": "edb-afv0ZAS",
    "name": "Upright Smith Incline Bench Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/afv0ZAS.gif"
  },
  {
    "id": "edb-r4RZKpF",
    "name": "Dumbbell One Arm Fly on Exercise Ball Improved",
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
    "gifUrl": "https://static.exercisedb.dev/media/r4RZKpF.gif"
  },
  {
    "id": "edb-Xd65M9w",
    "name": "Dumbbell Around Pullover - Intensive Variation",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CHEST"
      ],
      "secondary": [
        "TRICEPS",
        "BACK"
      ],
      "targetRaw": [
        "pectorals"
      ],
      "secondaryRaw": [
        "triceps",
        "latissimus dorsi"
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
    "gifUrl": "https://static.exercisedb.dev/media/Xd65M9w.gif"
  },
  {
    "id": "edb-iDGtjyi",
    "name": "Chest and Front of Shoulder Stretch Micro",
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
    "gifUrl": "https://static.exercisedb.dev/media/iDGtjyi.gif"
  },
  {
    "id": "edb-o80Xu9C",
    "name": "Intensified Style Kettlebell Extended Range One Arm Press on Floor",
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
    "gifUrl": "https://static.exercisedb.dev/media/o80Xu9C.gif"
  },
  {
    "id": "edb-oQRJYkC",
    "name": "Side Push Neck Stretch",
    "defaultUnit": "reps",
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
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/oQRJYkC.gif"
  },
  {
    "id": "edb-x2chWLO",
    "name": "Neck Side Stretch",
    "defaultUnit": "reps",
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
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/x2chWLO.gif"
  },
  {
    "id": "edb-ZZTGMKh",
    "name": "One Arm Against Wall",
    "defaultUnit": "reps",
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
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/ZZTGMKh.gif"
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
    "id": "edb-1jXLYEw",
    "name": "Standing Lateral Stretch",
    "defaultUnit": "reps",
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
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/1jXLYEw.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/7F1DVzn.gif"
  },
  {
    "id": "edb-isAAZWA",
    "name": "Side-to-side Chin",
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
    "gifUrl": "https://static.exercisedb.dev/media/isAAZWA.gif"
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
    "id": "edb-EyLrNC2",
    "name": "Exercise Ball Alternating Arm Ups",
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
        "lats"
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
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/EyLrNC2.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/lBDjFxJ.gif"
  },
  {
    "id": "edb-QFmz6ch",
    "name": "Seated Lower Back Stretch",
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
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/QFmz6ch.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/qdRxqCj.gif"
  },
  {
    "id": "edb-MCkqdKE",
    "name": "Weighted Muscle Up (on Bar)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "TRICEPS",
        "ANTERIOR_DELT",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "triceps",
        "shoulders",
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
    "gifUrl": "https://static.exercisedb.dev/media/MCkqdKE.gif"
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
    "aliases": [],
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
    "aliases": [],
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
    "id": "edb-yU7w7CA",
    "name": "Exercise Ball Lower Back Stretch (pyramid)",
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
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/yU7w7CA.gif"
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
    "id": "edb-JsOV1SU",
    "name": "Weighted Muscle Up",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/JsOV1SU.gif"
  },
  {
    "id": "edb-7OeHptV",
    "name": "Assisted Standing Chin-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/7OeHptV.gif"
  },
  {
    "id": "edb-pM07UxU",
    "name": "Kipping Muscle Up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "TRICEPS",
        "ANTERIOR_DELT",
        "ABS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
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
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/pM07UxU.gif"
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
    "id": "edb-PsVS1QP",
    "name": "Medicine Ball Catch and Overhead Throw",
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
        "lats"
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
    "gifUrl": "https://static.exercisedb.dev/media/PsVS1QP.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/T2mxWqc.gif"
  },
  {
    "id": "edb-U5INZY6",
    "name": "Cable One Arm Pulldown",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/U5INZY6.gif"
  },
  {
    "id": "edb-mExgrF9",
    "name": "Bench Pull-ups",
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
    "gifUrl": "https://static.exercisedb.dev/media/mExgrF9.gif"
  },
  {
    "id": "edb-OYFhXVD",
    "name": "Wide Grip Rear Pull-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/OYFhXVD.gif"
  },
  {
    "id": "edb-f38OEuO",
    "name": "Kneeling Lat Stretch",
    "defaultUnit": "reps",
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
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/f38OEuO.gif"
  },
  {
    "id": "edb-zCgxPbV",
    "name": "Cable Twisting Pull",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/zCgxPbV.gif"
  },
  {
    "id": "edb-4LoWllp",
    "name": "Band Fixed Back Close Grip Pulldown",
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
    "gifUrl": "https://static.exercisedb.dev/media/4LoWllp.gif"
  },
  {
    "id": "edb-ky8FLU8",
    "name": "Lever Reverse Grip Lateral Pulldown",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/ky8FLU8.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/Qqi7bko.gif"
  },
  {
    "id": "edb-f4xtKBj",
    "name": "Assisted Standing Pull-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/f4xtKBj.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/xBYcQHj.gif"
  },
  {
    "id": "edb-hMEptv0",
    "name": "Barbell Decline Bent Arm Pullover",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "TRICEPS",
        "CHEST"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "triceps",
        "chest"
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
    "gifUrl": "https://static.exercisedb.dev/media/hMEptv0.gif"
  },
  {
    "id": "edb-cQ19bBP",
    "name": "Rocky Pull-up Pulldown",
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
    "gifUrl": "https://static.exercisedb.dev/media/cQ19bBP.gif"
  },
  {
    "id": "edb-nDK1HJ0",
    "name": "Ez Bar Lying Bent Arms Pullover",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "TRICEPS",
        "CHEST"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "triceps",
        "chest"
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
    "gifUrl": "https://static.exercisedb.dev/media/nDK1HJ0.gif"
  },
  {
    "id": "edb-jDOKRM5",
    "name": "Side Lying Floor Stretch",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "OBLIQUES",
        "GLUTES"
      ],
      "targetRaw": [
        "lats"
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
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/jDOKRM5.gif"
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
    "id": "edb-cA9FuWG",
    "name": "Barbell Bent Arm Pullover",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "TRICEPS",
        "CHEST"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "triceps",
        "chest"
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
    "gifUrl": "https://static.exercisedb.dev/media/cA9FuWG.gif"
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
    "id": "edb-IL0JUxR",
    "name": "Gironda Sternum Chin",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/IL0JUxR.gif"
  },
  {
    "id": "edb-SpsOSXk",
    "name": "Cable Rear Pulldown",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/SpsOSXk.gif"
  },
  {
    "id": "edb-1PK5Uo3",
    "name": "Cable Incline Pushdown",
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
    "gifUrl": "https://static.exercisedb.dev/media/1PK5Uo3.gif"
  },
  {
    "id": "edb-YtgD7Xq",
    "name": "Shoulder Grip Pull-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/YtgD7Xq.gif"
  },
  {
    "id": "edb-T8UpLkb",
    "name": "Mixed Grip Chin-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/T8UpLkb.gif"
  },
  {
    "id": "edb-CuaWCmC",
    "name": "Cable Lateral Pulldown (with Rope Attachment)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/CuaWCmC.gif"
  },
  {
    "id": "edb-pwt0pnM",
    "name": "Cable Seated High Row (v-bar)",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/pwt0pnM.gif"
  },
  {
    "id": "edb-sM84pE4",
    "name": "Exercise Ball Lat Stretch",
    "defaultUnit": "reps",
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
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/sM84pE4.gif"
  },
  {
    "id": "edb-Gk1r408",
    "name": "Weighted Close Grip Chin-up on Dip Cage",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/Gk1r408.gif"
  },
  {
    "id": "edb-rkg41Fb",
    "name": "Twin Handle Parallel Grip Lat Pulldown",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/rkg41Fb.gif"
  },
  {
    "id": "edb-Af0EW2I",
    "name": "Muscle-up (on Vertical Bar)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "TRICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
        "triceps",
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
    "gifUrl": "https://static.exercisedb.dev/media/Af0EW2I.gif"
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
    "id": "edb-znLogoF",
    "name": "Barbell Pullover to Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "TRICEPS",
        "CHEST",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "triceps",
        "chest",
        "shoulders"
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
    "gifUrl": "https://static.exercisedb.dev/media/znLogoF.gif"
  },
  {
    "id": "edb-OQ1otBN",
    "name": "Cable Cross-over Lateral Pulldown",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/OQ1otBN.gif"
  },
  {
    "id": "edb-k6tUeqS",
    "name": "Band Underhand Pulldown",
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
    "gifUrl": "https://static.exercisedb.dev/media/k6tUeqS.gif"
  },
  {
    "id": "edb-4IKbhHV",
    "name": "Alternate Lateral Pulldown",
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
        "rhomboids"
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
    "gifUrl": "https://static.exercisedb.dev/media/4IKbhHV.gif"
  },
  {
    "id": "edb-c3Pfhti",
    "name": "Roller Side Lat Stretch",
    "defaultUnit": "reps",
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
      "ab wheel"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/c3Pfhti.gif"
  },
  {
    "id": "edb-ZH68exZ",
    "name": "Band Fixed Back Underhand Pulldown",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/ZH68exZ.gif"
  },
  {
    "id": "edb-LEprlgG",
    "name": "Cable Lat Pulldown Full Range of Motion",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/LEprlgG.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/HMzLjXx.gif"
  },
  {
    "id": "edb-CmEr4pM",
    "name": "Cable Wide Grip Rear Pulldown Behind Neck",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/CmEr4pM.gif"
  },
  {
    "id": "edb-ZgwWBoC",
    "name": "Cable Thibaudeau Kayak Row",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/ZgwWBoC.gif"
  },
  {
    "id": "edb-rTbyBYV",
    "name": "Exercise Ball Lying Side Lat Stretch",
    "defaultUnit": "reps",
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
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/rTbyBYV.gif"
  },
  {
    "id": "edb-4c9BhzB",
    "name": "Cable Lateral Pulldown with V-bar",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/4c9BhzB.gif"
  },
  {
    "id": "edb-eYnzaCm",
    "name": "Cable Bar Lateral Pulldown",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/eYnzaCm.gif"
  },
  {
    "id": "edb-Hj4FOCd",
    "name": "Barbell Decline Wide-grip Pullover",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "TRICEPS",
        "CHEST"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "triceps",
        "chest"
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
    "gifUrl": "https://static.exercisedb.dev/media/Hj4FOCd.gif"
  },
  {
    "id": "edb-0V2YQjW",
    "name": "Pull Up (neutral Grip)",
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
    "gifUrl": "https://static.exercisedb.dev/media/0V2YQjW.gif"
  },
  {
    "id": "edb-pmnrOp0",
    "name": "Band Kneeling One Arm Pulldown",
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
        "rhomboids"
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
    "gifUrl": "https://static.exercisedb.dev/media/pmnrOp0.gif"
  },
  {
    "id": "edb-fXfqg1E",
    "name": "Weighted One Hand Pull Up",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/fXfqg1E.gif"
  },
  {
    "id": "edb-MaMuGH6",
    "name": "Lever Assisted Chin-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/MaMuGH6.gif"
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
    "id": "edb-PskORrA",
    "name": "Cable Pushdown (straight Arm) V. 2",
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
    "gifUrl": "https://static.exercisedb.dev/media/PskORrA.gif"
  },
  {
    "id": "edb-vrhHa6D",
    "name": "Assisted Parallel Close Grip Pull-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/vrhHa6D.gif"
  },
  {
    "id": "edb-DT14T9T",
    "name": "Cable Straight Arm Pulldown (with Rope)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/DT14T9T.gif"
  },
  {
    "id": "edb-chfnQnM",
    "name": "Back Pec Stretch",
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
        "lats"
      ],
      "secondaryRaw": [
        "shoulders",
        "chest"
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
    "gifUrl": "https://static.exercisedb.dev/media/chfnQnM.gif"
  },
  {
    "id": "edb-CbFSYC1",
    "name": "Rear Pull-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/CbFSYC1.gif"
  },
  {
    "id": "edb-tTuZSDT",
    "name": "Lever One Arm Lateral Wide Pulldown",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/tTuZSDT.gif"
  },
  {
    "id": "edb-RVwzP10",
    "name": "Cable Pulldown",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/RVwzP10.gif"
  },
  {
    "id": "edb-f7fnAIB",
    "name": "Cable Squat Row (with Rope Attachment)",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/f7fnAIB.gif"
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
    "id": "edb-G1qWW6M",
    "name": "Macro Style Weighted One Hand Pull Up",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/G1qWW6M.gif"
  },
  {
    "id": "edb-3nvEbbF",
    "name": "Cable Twisting Pull with Intensified",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/3nvEbbF.gif"
  },
  {
    "id": "edb-0I5fUyn",
    "name": "Band Underhand Pulldown with Classic",
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
    "gifUrl": "https://static.exercisedb.dev/media/0I5fUyn.gif"
  },
  {
    "id": "edb-IU4QNJ6",
    "name": "Pure Chin-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/IU4QNJ6.gif"
  },
  {
    "id": "edb-EnPivTL",
    "name": "Barbell Bent Arm Pullover - Powerful Variation",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "TRICEPS",
        "CHEST"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "triceps",
        "chest"
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
    "gifUrl": "https://static.exercisedb.dev/media/EnPivTL.gif"
  },
  {
    "id": "edb-JxrY9mC",
    "name": "Stability Style Band Kneeling One Arm Pulldown",
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
        "rhomboids"
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
    "gifUrl": "https://static.exercisedb.dev/media/JxrY9mC.gif"
  },
  {
    "id": "edb-b5uBMv2",
    "name": "Exercise Ball Alternating Arm Ups with Fast",
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
        "lats"
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
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/b5uBMv2.gif"
  },
  {
    "id": "edb-Rsxr3xl",
    "name": "One Arm Against Wall Compressed",
    "defaultUnit": "reps",
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
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/Rsxr3xl.gif"
  },
  {
    "id": "edb-J1vH2X0",
    "name": "Weighted One Hand Pull Up Fast",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/J1vH2X0.gif"
  },
  {
    "id": "edb-dVeWXf2",
    "name": "Chin-up Diagonal",
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
    "gifUrl": "https://static.exercisedb.dev/media/dVeWXf2.gif"
  },
  {
    "id": "edb-ninBEOY",
    "name": "Twisted Side-to-side Chin",
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
    "gifUrl": "https://static.exercisedb.dev/media/ninBEOY.gif"
  },
  {
    "id": "edb-0MlxeMn",
    "name": "Gentle Style Cable Pulldown (pro Lat Bar)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/0MlxeMn.gif"
  },
  {
    "id": "edb-LlSe9IK",
    "name": "Assisted Standing Chin-up with Focused",
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
    "gifUrl": "https://static.exercisedb.dev/media/LlSe9IK.gif"
  },
  {
    "id": "edb-5ipN0iE",
    "name": "Assisted Pull-up Inclined",
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
    "gifUrl": "https://static.exercisedb.dev/media/5ipN0iE.gif"
  },
  {
    "id": "edb-N3EirIW",
    "name": "Lever Assisted Chin-up with Twisted",
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
    "gifUrl": "https://static.exercisedb.dev/media/N3EirIW.gif"
  },
  {
    "id": "edb-nFHk9fU",
    "name": "Cable Lateral Pulldown (with Rope Attachment) Core",
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
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/nFHk9fU.gif"
  },
  {
    "id": "edb-AwAIlSo",
    "name": "Squared Reverse Grip Machine Lat Pulldown",
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
    "gifUrl": "https://static.exercisedb.dev/media/AwAIlSo.gif"
  },
  {
    "id": "edb-znf7t8E",
    "name": "Kipping Muscle Up with Triple",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": [
        "BICEPS",
        "TRICEPS",
        "ANTERIOR_DELT",
        "ABS"
      ],
      "targetRaw": [
        "lats"
      ],
      "secondaryRaw": [
        "biceps",
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
      "pull",
      "bodyweight"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/znf7t8E.gif"
  },
  {
    "id": "edb-BeReYBf",
    "name": "Side-to-side Chin with Reverse",
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
    "gifUrl": "https://static.exercisedb.dev/media/BeReYBf.gif"
  },
  {
    "id": "edb-Y8dOJlH",
    "name": "Cable Squat Row (with Rope Attachment) Heavy",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "pull"
    ],
    "movement": "pull",
    "gifUrl": "https://static.exercisedb.dev/media/Y8dOJlH.gif"
  },
  {
    "id": "edb-17lJ1kr",
    "name": "Lever Lying Leg Curl",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/17lJ1kr.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Zg3XY7P.gif"
  },
  {
    "id": "edb-zHEpuuc",
    "name": "Cable Assisted Inverse Leg Curl",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/zHEpuuc.gif"
  },
  {
    "id": "edb-nnmCTLN",
    "name": "Lever Kneeling Leg Curl",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/nnmCTLN.gif"
  },
  {
    "id": "edb-VedGSby",
    "name": "Assisted Prone Hamstring",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/VedGSby.gif"
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/99rWm7w.gif"
  },
  {
    "id": "edb-0mB6wHO",
    "name": "Runners Stretch",
    "defaultUnit": "reps",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight",
      "cardio"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/0mB6wHO.gif"
  },
  {
    "id": "edb-v7p5bYl",
    "name": "Kick Out Sit",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "QUADS",
        "GLUTES"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "quadriceps",
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
    "gifUrl": "https://static.exercisedb.dev/media/v7p5bYl.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Vvwjz6N.gif"
  },
  {
    "id": "edb-HIgYKAB",
    "name": "Seated Wide Angle Pose Sequence",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "QUADS",
        "CALVES"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "quadriceps",
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
    "gifUrl": "https://static.exercisedb.dev/media/HIgYKAB.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/LHWF7us.gif"
  },
  {
    "id": "edb-K5xgdvI",
    "name": "Reclining Big Toe Pose with Rope",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "CALVES",
        "GLUTES"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "calves",
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
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/K5xgdvI.gif"
  },
  {
    "id": "edb-sU5BrfP",
    "name": "Leg Up Hamstring Stretch",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/sU5BrfP.gif"
  },
  {
    "id": "edb-C5jncD2",
    "name": "Standing Single Leg Curl",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/C5jncD2.gif"
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/XlZ4lAC.gif"
  },
  {
    "id": "edb-yRYyfdA",
    "name": "Exercise Ball Seated Hamstring Stretch",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/yRYyfdA.gif"
  },
  {
    "id": "edb-0rHfvy9",
    "name": "Inverse Leg Curl (on Pull-up Cable Machine)",
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
    "gifUrl": "https://static.exercisedb.dev/media/0rHfvy9.gif"
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
    "id": "edb-ms7tjSG",
    "name": "Inverse Leg Curl (bench Support)",
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
    "gifUrl": "https://static.exercisedb.dev/media/ms7tjSG.gif"
  },
  {
    "id": "edb-E4PwJqI",
    "name": "Self Assisted Inverse Leg Curl",
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
    "gifUrl": "https://static.exercisedb.dev/media/E4PwJqI.gif"
  },
  {
    "id": "edb-UXpKJoq",
    "name": "Lever Lying Two-one Leg Curl",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/UXpKJoq.gif"
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
    "aliases": [],
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/DFGXwZr.gif"
  },
  {
    "id": "edb-xTjr103",
    "name": "Standing Hamstring and Calf Stretch with Strap",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/xTjr103.gif"
  },
  {
    "id": "edb-LNE3wfo",
    "name": "Single Leg Platform Slide",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": [
        "GLUTES",
        "QUADS"
      ],
      "targetRaw": [
        "hamstrings"
      ],
      "secondaryRaw": [
        "glutes",
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
    "gifUrl": "https://static.exercisedb.dev/media/LNE3wfo.gif"
  },
  {
    "id": "edb-GwYwElT",
    "name": "Self Assisted Inverse Leg Curl",
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
    "gifUrl": "https://static.exercisedb.dev/media/GwYwElT.gif"
  },
  {
    "id": "edb-oMwyl17",
    "name": "Intense Barbell Straight Leg Deadlift",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/oMwyl17.gif"
  },
  {
    "id": "edb-fBnPpzd",
    "name": "Flexible Assisted Prone Hamstring",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/fBnPpzd.gif"
  },
  {
    "id": "edb-fjjY3N4",
    "name": "Inverted Style Inverse Leg Curl (on Pull-up Cable Machine)",
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
    "gifUrl": "https://static.exercisedb.dev/media/fjjY3N4.gif"
  },
  {
    "id": "edb-0br45wL",
    "name": "Push-up Inside Leg Kick",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/0br45wL.gif"
  },
  {
    "id": "edb-ecl28tP",
    "name": "Dumbbell Contralateral Forward Lunge",
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
    "gifUrl": "https://static.exercisedb.dev/media/ecl28tP.gif"
  },
  {
    "id": "edb-kuMiR2T",
    "name": "Band Stiff Leg Deadlift",
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
    "gifUrl": "https://static.exercisedb.dev/media/kuMiR2T.gif"
  },
  {
    "id": "edb-ZA8b5hc",
    "name": "Kettlebell Goblet Squat",
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
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/ZA8b5hc.gif"
  },
  {
    "id": "edb-H6ybluc",
    "name": "Dumbbell Single Leg Squat",
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
    "gifUrl": "https://static.exercisedb.dev/media/H6ybluc.gif"
  },
  {
    "id": "edb-DhMl549",
    "name": "Barbell Full Squat (back Pov)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/DhMl549.gif"
  },
  {
    "id": "edb-RtyAsy1",
    "name": "Arms Apart Circular Toe Touch (male)",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/RtyAsy1.gif"
  },
  {
    "id": "edb-oom75KC",
    "name": "Dumbbell Straight Leg Deadlift",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/oom75KC.gif"
  },
  {
    "id": "edb-daBmy1Y",
    "name": "Dumbbell Single Leg Deadlift with Stepbox Support",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/daBmy1Y.gif"
  },
  {
    "id": "edb-d5bTEPV",
    "name": "Band Step-up",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/d5bTEPV.gif"
  },
  {
    "id": "edb-gKozT8X",
    "name": "Dumbbell Single Leg Deadlift",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/gKozT8X.gif"
  },
  {
    "id": "edb-vM5YS2g",
    "name": "Reverse Hyper Extension (on Stability Ball)",
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
    "gifUrl": "https://static.exercisedb.dev/media/vM5YS2g.gif"
  },
  {
    "id": "edb-JrOHAZc",
    "name": "Barbell Stiff Leg Good Morning",
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
    "gifUrl": "https://static.exercisedb.dev/media/JrOHAZc.gif"
  },
  {
    "id": "edb-wQ2c4XD",
    "name": "Barbell Romanian Deadlift",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Ha7SZ3y.gif"
  },
  {
    "id": "edb-Gnfo4FM",
    "name": "Barbell High Bar Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Gnfo4FM.gif"
  },
  {
    "id": "edb-DB0n8AG",
    "name": "Kettlebell Front Squat",
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
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/DB0n8AG.gif"
  },
  {
    "id": "edb-yn0LjwL",
    "name": "Assisted Lying Glutes Stretch",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/yn0LjwL.gif"
  },
  {
    "id": "edb-nUwVh7b",
    "name": "Dumbbell Deadlift",
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
      "dumbbell"
    ],
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/6pTkI99.gif"
  },
  {
    "id": "edb-tj41Nu6",
    "name": "Sled 45в° Leg Wide Press",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/tj41Nu6.gif"
  },
  {
    "id": "edb-rmEukuS",
    "name": "Single Leg Bridge with Outstretched Leg",
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
    "gifUrl": "https://static.exercisedb.dev/media/rmEukuS.gif"
  },
  {
    "id": "edb-KgI0tqW",
    "name": "Barbell Sumo Deadlift",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS",
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
    "aliases": [],
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/E4R8Hz1.gif"
  },
  {
    "id": "edb-Pjbc0Kt",
    "name": "Resistance Band Hip Thrusts on Knees (female)",
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
    "gifUrl": "https://static.exercisedb.dev/media/Pjbc0Kt.gif"
  },
  {
    "id": "edb-UgDm3oy",
    "name": "Kneeling Jump Squat",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/UgDm3oy.gif"
  },
  {
    "id": "edb-yn2lLSI",
    "name": "Sled 45в° Leg Press (back Pov)",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/yn2lLSI.gif"
  },
  {
    "id": "edb-1gFNTZV",
    "name": "Barbell Jump Squat",
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
      "barbell"
    ],
    "aliases": [],
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/t8iSghb.gif"
  },
  {
    "id": "edb-IeTIEqg",
    "name": "Barbell Front Chest Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/IeTIEqg.gif"
  },
  {
    "id": "edb-M72BExt",
    "name": "Exercise Ball One Leg Prone Lower Body Rotation",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/M72BExt.gif"
  },
  {
    "id": "edb-GUT8I22",
    "name": "Lever Deadlift",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/GUT8I22.gif"
  },
  {
    "id": "edb-bTpEUcm",
    "name": "Barbell Low Bar Squat",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/bTpEUcm.gif"
  },
  {
    "id": "edb-TUZLh71",
    "name": "Band Squat",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/TUZLh71.gif"
  },
  {
    "id": "edb-5eLRITT",
    "name": "Dumbbell Stiff Leg Deadlift",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/5eLRITT.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/OM46QHm.gif"
  },
  {
    "id": "edb-euI1BwR",
    "name": "Barbell Speed Squat",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/euI1BwR.gif"
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/oZjMu1t.gif"
  },
  {
    "id": "edb-P9GFBME",
    "name": "Spider Crawl Push Up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "ABS",
        "CHEST",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "core",
        "chest",
        "shoulders"
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
    "gifUrl": "https://static.exercisedb.dev/media/P9GFBME.gif"
  },
  {
    "id": "edb-lHeUULr",
    "name": "Band Straight Back Stiff Leg Deadlift",
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
    "gifUrl": "https://static.exercisedb.dev/media/lHeUULr.gif"
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
    "name": "Weighted Cossack Squats (male)",
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
    "id": "edb-AX1kB0o",
    "name": "Twist Hip Lift",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "OBLIQUES",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "obliques",
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
    "gifUrl": "https://static.exercisedb.dev/media/AX1kB0o.gif"
  },
  {
    "id": "edb-jFtipLl",
    "name": "Smith Squat",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/jFtipLl.gif"
  },
  {
    "id": "edb-gEyURal",
    "name": "Barbell Single Leg Deadlift",
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
    "gifUrl": "https://static.exercisedb.dev/media/gEyURal.gif"
  },
  {
    "id": "edb-aWedzZX",
    "name": "Glute Bridge Two Legs on Bench (male)",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/aWedzZX.gif"
  },
  {
    "id": "edb-5WiFcYk",
    "name": "Weighted Lunge with Swing",
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
    "gifUrl": "https://static.exercisedb.dev/media/5WiFcYk.gif"
  },
  {
    "id": "edb-yq3GAJX",
    "name": "Hands Reversed Clasped Circular Toe Touch (male)",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/yq3GAJX.gif"
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
    "aliases": [],
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
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS",
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
    "id": "edb-bdWcbaU",
    "name": "Frankenstein Squat",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/bdWcbaU.gif"
  },
  {
    "id": "edb-13VW2VO",
    "name": "Weighted Stretch Lunge",
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
    "gifUrl": "https://static.exercisedb.dev/media/13VW2VO.gif"
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
    "id": "edb-qg2PGl6",
    "name": "Barbell Glute Bridge Two Legs on Bench (male)",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/qg2PGl6.gif"
  },
  {
    "id": "edb-10Z2DXU",
    "name": "Sled 45в° Leg Press",
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
    "id": "edb-JZuApnB",
    "name": "Weighted Squat",
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
    "gifUrl": "https://static.exercisedb.dev/media/JZuApnB.gif"
  },
  {
    "id": "edb-OPqShYN",
    "name": "Lever Hip Extension V. 2",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/OPqShYN.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/aXtJhlg.gif"
  },
  {
    "id": "edb-2Qh2J1e",
    "name": "Sled 45° Leg Press (side Pov)",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/2Qh2J1e.gif"
  },
  {
    "id": "edb-QY39eBr",
    "name": "Seated Piriformis Stretch",
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
    "gifUrl": "https://static.exercisedb.dev/media/QY39eBr.gif"
  },
  {
    "id": "edb-qXTaZnJ",
    "name": "Barbell Full Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/qXTaZnJ.gif"
  },
  {
    "id": "edb-SNFfUff",
    "name": "Barbell Lying Lifting (on Hip)",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/SNFfUff.gif"
  },
  {
    "id": "edb-w1NOByi",
    "name": "Band Squat Row",
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
        "quadriceps",
        "back"
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
    "gifUrl": "https://static.exercisedb.dev/media/w1NOByi.gif"
  },
  {
    "id": "edb-vIICElP",
    "name": "Band Lying Hip Internal Rotation",
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
    "gifUrl": "https://static.exercisedb.dev/media/vIICElP.gif"
  },
  {
    "id": "edb-lFhb2Rw",
    "name": "Smith Front Squat (clean Grip)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/lFhb2Rw.gif"
  },
  {
    "id": "edb-Qa55kX1",
    "name": "Sled Hack Squat",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Qa55kX1.gif"
  },
  {
    "id": "edb-UfePqpx",
    "name": "Smith Deadlift",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/UfePqpx.gif"
  },
  {
    "id": "edb-GOJKFfO",
    "name": "Exercise Ball One Legged Diagonal Kick Hamstring Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
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
    "gifUrl": "https://static.exercisedb.dev/media/GOJKFfO.gif"
  },
  {
    "id": "edb-62Nw60O",
    "name": "Barbell Rear Lunge V. 2",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/62Nw60O.gif"
  },
  {
    "id": "edb-LIlE5Tn",
    "name": "Jump Squat",
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
    "aliases": [],
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
      "barbell"
    ],
    "aliases": [],
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/rR0LJzx.gif"
  },
  {
    "id": "edb-wSScovH",
    "name": "Band Bent-over Hip Extension",
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
    "gifUrl": "https://static.exercisedb.dev/media/wSScovH.gif"
  },
  {
    "id": "edb-b63ZzGe",
    "name": "Potty Squat with Support",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/b63ZzGe.gif"
  },
  {
    "id": "edb-C31LMnP",
    "name": "One Leg Squat",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/C31LMnP.gif"
  },
  {
    "id": "edb-Krmb3cB",
    "name": "Lever Reverse Hyperextension",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Krmb3cB.gif"
  },
  {
    "id": "edb-9KU9TYF",
    "name": "Lever Horizontal One Leg Press",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/9KU9TYF.gif"
  },
  {
    "id": "edb-jNU1gFQ",
    "name": "Outside Leg Kick Push-up",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/jNU1gFQ.gif"
  },
  {
    "id": "edb-zG0zs85",
    "name": "Barbell Front Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/zG0zs85.gif"
  },
  {
    "id": "edb-pkSoCW9",
    "name": "Barbell Jefferson Squat",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/pkSoCW9.gif"
  },
  {
    "id": "edb-jQGwmxN",
    "name": "Trap Bar Deadlift",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/jQGwmxN.gif"
  },
  {
    "id": "edb-mnzcrIB",
    "name": "Dumbbell Bench Squat",
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
    "gifUrl": "https://static.exercisedb.dev/media/mnzcrIB.gif"
  },
  {
    "id": "edb-nqs5HGV",
    "name": "Single Leg Squat (pistol) Male",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/nqs5HGV.gif"
  },
  {
    "id": "edb-ZuPXtCK",
    "name": "Smith Hack Squat",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/ZuPXtCK.gif"
  },
  {
    "id": "edb-RQNVT10",
    "name": "Assisted Lying Gluteus and Piriformis Stretch",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/RQNVT10.gif"
  },
  {
    "id": "edb-S4pwGlc",
    "name": "Dumbbell Plyo Squat",
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
    "gifUrl": "https://static.exercisedb.dev/media/S4pwGlc.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/IZVHb27.gif"
  },
  {
    "id": "edb-DeDThfG",
    "name": "Seated Glute Stretch",
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
    "gifUrl": "https://static.exercisedb.dev/media/DeDThfG.gif"
  },
  {
    "id": "edb-LSTChY9",
    "name": "Barbell Zercher Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
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
    "aliases": [],
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
    "gifUrl": "https://static.exercisedb.dev/media/ila4NZS.gif"
  },
  {
    "id": "edb-Kpajagk",
    "name": "Cable Standing Hip Extension",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Kpajagk.gif"
  },
  {
    "id": "edb-XsCcxCC",
    "name": "Lever Seated Good Morning",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/XsCcxCC.gif"
  },
  {
    "id": "edb-D9qe7CM",
    "name": "Pelvic Tilt Into Bridge",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/D9qe7CM.gif"
  },
  {
    "id": "edb-vR1vold",
    "name": "Barbell Full Zercher Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/vR1vold.gif"
  },
  {
    "id": "edb-BmrwWzo",
    "name": "Dumbbell Sumo Pull Through",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/BmrwWzo.gif"
  },
  {
    "id": "edb-1bQkKZK",
    "name": "Smith Bent Knee Good Morning",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/1bQkKZK.gif"
  },
  {
    "id": "edb-iYzB0Cz",
    "name": "Barbell Full Squat (side Pov)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/iYzB0Cz.gif"
  },
  {
    "id": "edb-VaP75jl",
    "name": "Barbell Rear Lunge",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/VaP75jl.gif"
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/UHJlbu3.gif"
  },
  {
    "id": "edb-WKMQzCD",
    "name": "Kettlebell Lunge Pass Through",
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
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/WKMQzCD.gif"
  },
  {
    "id": "edb-6sYyrRX",
    "name": "Bent Knee Lying Twist (male)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "OBLIQUES",
        "QUADS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "obliques",
        "hip flexors"
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
    "gifUrl": "https://static.exercisedb.dev/media/6sYyrRX.gif"
  },
  {
    "id": "edb-RGLscZM",
    "name": "Smith Low Bar Squat",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/RGLscZM.gif"
  },
  {
    "id": "edb-znP9SIh",
    "name": "Hug Keens to Chest",
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
    "gifUrl": "https://static.exercisedb.dev/media/znP9SIh.gif"
  },
  {
    "id": "edb-BbfB8Gb",
    "name": "Basic Toe Touch (male)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
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
    "gifUrl": "https://static.exercisedb.dev/media/BbfB8Gb.gif"
  },
  {
    "id": "edb-HsvHqgf",
    "name": "Dumbbell Squat",
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
    "gifUrl": "https://static.exercisedb.dev/media/HsvHqgf.gif"
  },
  {
    "id": "edb-VtTbiP3",
    "name": "Band Pull Through",
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
    "gifUrl": "https://static.exercisedb.dev/media/VtTbiP3.gif"
  },
  {
    "id": "edb-UpAlold",
    "name": "Rear Decline Bridge",
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
    "gifUrl": "https://static.exercisedb.dev/media/UpAlold.gif"
  },
  {
    "id": "edb-2DxtqHL",
    "name": "Barbell One Arm Side Deadlift",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "HAMSTRINGS",
        "QUADS",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/2DxtqHL.gif"
  },
  {
    "id": "edb-5bpPTHv",
    "name": "Kettlebell Pistol Squat",
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
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/5bpPTHv.gif"
  },
  {
    "id": "edb-5VCj6iH",
    "name": "Barbell Hack Squat",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/5VCj6iH.gif"
  },
  {
    "id": "edb-9gbyYKk",
    "name": "Band Seated Hip Internal Rotation",
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
    "gifUrl": "https://static.exercisedb.dev/media/9gbyYKk.gif"
  },
  {
    "id": "edb-qi996YS",
    "name": "Barbell Clean-grip Front Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/qi996YS.gif"
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
    "aliases": [],
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
    "name": "Sled 45 Degrees One Leg Press",
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
    "id": "edb-9n2149Z",
    "name": "Sled Lying Squat",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/9n2149Z.gif"
  },
  {
    "id": "edb-sVQCCeG",
    "name": "March Sit (wall)",
    "defaultUnit": "sec",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/sVQCCeG.gif"
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
    "id": "edb-HsjbB1z",
    "name": "Smith Sprint Lunge",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/HsjbB1z.gif"
  },
  {
    "id": "edb-wfotm7S",
    "name": "Bodyweight Drop Jump Squat",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/wfotm7S.gif"
  },
  {
    "id": "edb-RRWFUcw",
    "name": "Dumbbell Lunge",
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
    "gifUrl": "https://static.exercisedb.dev/media/RRWFUcw.gif"
  },
  {
    "id": "edb-elhhVgj",
    "name": "Barbell Narrow Stance Squat",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/elhhVgj.gif"
  },
  {
    "id": "edb-NNoHCEA",
    "name": "Smith Full Squat",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/NNoHCEA.gif"
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
    "id": "edb-oMypNrz",
    "name": "Roller Hip Stretch",
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
      "ab wheel"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/oMypNrz.gif"
  },
  {
    "id": "edb-2LQkNPW",
    "name": "Exercise Ball Hip Flexor Stretch",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
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
    "gifUrl": "https://static.exercisedb.dev/media/2LQkNPW.gif"
  },
  {
    "id": "edb-kMzUs9Y",
    "name": "Forward Lunge (male)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/kMzUs9Y.gif"
  },
  {
    "id": "edb-XPUDTt7",
    "name": "Pike-to-cobra Push-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "ABS",
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "glutes"
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
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/XPUDTt7.gif"
  },
  {
    "id": "edb-0L2KwtI",
    "name": "Roller Hip Lat Stretch",
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
      "ab wheel"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/0L2KwtI.gif"
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
    "aliases": [],
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
    "id": "edb-TDYiji6",
    "name": "Jump Squat V. 2",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/TDYiji6.gif"
  },
  {
    "id": "edb-gf3ZjB9",
    "name": "Sled Closer Hack Squat",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/gf3ZjB9.gif"
  },
  {
    "id": "edb-2Dk4xQV",
    "name": "Rocking Frog Stretch",
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
    "gifUrl": "https://static.exercisedb.dev/media/2Dk4xQV.gif"
  },
  {
    "id": "edb-B5xca8s",
    "name": "Hands Clasped Circular Toe Touch (male)",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/B5xca8s.gif"
  },
  {
    "id": "edb-7zdxRTl",
    "name": "Smith Leg Press",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/7zdxRTl.gif"
  },
  {
    "id": "edb-SP3hUez",
    "name": "Swimmer Kicks V. 2 (male)",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/SP3hUez.gif"
  },
  {
    "id": "edb-za9Ni4z",
    "name": "Barbell Rack Pull",
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
    "gifUrl": "https://static.exercisedb.dev/media/za9Ni4z.gif"
  },
  {
    "id": "edb-u0cNiij",
    "name": "Low Glute Bridge on Floor",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/u0cNiij.gif"
  },
  {
    "id": "edb-vpleANJ",
    "name": "Inclined Style Pelvic Tilt Into Bridge",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/vpleANJ.gif"
  },
  {
    "id": "edb-4H86mXM",
    "name": "Sled 45 Degrees One Leg Press Pointed",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/4H86mXM.gif"
  },
  {
    "id": "edb-9vz4JlC",
    "name": "Weighted Lunge with Swing Twisted",
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
    "gifUrl": "https://static.exercisedb.dev/media/9vz4JlC.gif"
  },
  {
    "id": "edb-PDHE73u",
    "name": "Controlled Band Straight Back Stiff Leg Deadlift",
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
    "gifUrl": "https://static.exercisedb.dev/media/PDHE73u.gif"
  },
  {
    "id": "edb-Ql4g5s8",
    "name": "Forward Lunge (male) with Bench",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Ql4g5s8.gif"
  },
  {
    "id": "edb-hjWjJEm",
    "name": "Exercise Ball Hip Flexor Stretch Pointed",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "glutes"
      ],
      "secondaryRaw": [
        "quadriceps",
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
    "gifUrl": "https://static.exercisedb.dev/media/hjWjJEm.gif"
  },
  {
    "id": "edb-8IbNZwc",
    "name": "Rough Band Hip Lift",
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
    "gifUrl": "https://static.exercisedb.dev/media/8IbNZwc.gif"
  },
  {
    "id": "edb-2Ty4idJ",
    "name": "Advanced Dumbbell Stiff Leg Deadlift",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/2Ty4idJ.gif"
  },
  {
    "id": "edb-p5v6rdT",
    "name": "Iron Cross Stretch - Deep Variation",
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
    "gifUrl": "https://static.exercisedb.dev/media/p5v6rdT.gif"
  },
  {
    "id": "edb-cuC7529",
    "name": "One Leg Squat - Expanded Variation",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/cuC7529.gif"
  },
  {
    "id": "edb-iqH55N8",
    "name": "Fierce Style Forward Lunge (male)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/iqH55N8.gif"
  },
  {
    "id": "edb-qFHvMnv",
    "name": "Micro Style Barbell Speed Squat",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/qFHvMnv.gif"
  },
  {
    "id": "edb-KenZJQV",
    "name": "Barbell High Bar Squat Core",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/KenZJQV.gif"
  },
  {
    "id": "edb-LFIOery",
    "name": "Sharp Style Dumbbell Sumo Pull Through",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/LFIOery.gif"
  },
  {
    "id": "edb-p0OCXGb",
    "name": "Sled 45в° Leg Wide Press - Blunt Variation",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/p0OCXGb.gif"
  },
  {
    "id": "edb-Uywa4S5",
    "name": "Dumbbell Lunge with Firm",
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
    "gifUrl": "https://static.exercisedb.dev/media/Uywa4S5.gif"
  },
  {
    "id": "edb-o6LqKKP",
    "name": "Traditional Barbell Romanian Deadlift",
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
    "gifUrl": "https://static.exercisedb.dev/media/o6LqKKP.gif"
  },
  {
    "id": "edb-kKYTkjJ",
    "name": "Exercise Ball One Leg Prone Lower Body Rotation Fierce",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/kKYTkjJ.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/82LxxkW.gif"
  },
  {
    "id": "edb-7RWNjiB",
    "name": "Dumbbell Lying Pronation on Floor",
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
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/7RWNjiB.gif"
  },
  {
    "id": "edb-Ezpnw9d",
    "name": "Band Reverse Wrist Curl",
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
        "forearms"
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
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Ezpnw9d.gif"
  },
  {
    "id": "edb-6kSxYnw",
    "name": "Barbell Wrist Curl V. 2",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/6kSxYnw.gif"
  },
  {
    "id": "edb-mKwcrHn",
    "name": "Lever Gripper Hands",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/mKwcrHn.gif"
  },
  {
    "id": "edb-yzYH9pI",
    "name": "Barbell Palms Down Wrist Curl Over a Bench",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/yzYH9pI.gif"
  },
  {
    "id": "edb-YtaCTYl",
    "name": "Dumbbell One Arm Seated Neutral Wrist Curl",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/YtaCTYl.gif"
  },
  {
    "id": "edb-rEhi2o5",
    "name": "Dumbbell Lying Supination on Floor",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "BICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "forearms"
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
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/rEhi2o5.gif"
  },
  {
    "id": "edb-2qTvJAZ",
    "name": "Barbell Standing Back Wrist Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "BICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "forearms"
      ],
      "secondaryRaw": [
        "biceps",
        "shoulders"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/2qTvJAZ.gif"
  },
  {
    "id": "edb-SJAA2IQ",
    "name": "Barbell Palms Up Wrist Curl Over a Bench",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "BICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "forearms"
      ],
      "secondaryRaw": [
        "biceps",
        "shoulders"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/SJAA2IQ.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/LsZkfU6.gif"
  },
  {
    "id": "edb-LrV4s90",
    "name": "Cable Wrist Curl",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/LrV4s90.gif"
  },
  {
    "id": "edb-2dImyQ8",
    "name": "Dumbbell Seated Palms Up Wrist Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "BICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "forearms"
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
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/2dImyQ8.gif"
  },
  {
    "id": "edb-qDnGfDb",
    "name": "Barbell Revers Wrist Curl V. 2",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/qDnGfDb.gif"
  },
  {
    "id": "edb-UtmIqcI",
    "name": "Side Wrist Pull Stretch",
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
        "wrists",
        "hands"
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
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/UtmIqcI.gif"
  },
  {
    "id": "edb-M2Pm3zj",
    "name": "Dumbbell Lying Supination",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "BICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "forearms"
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
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/M2Pm3zj.gif"
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
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/bd5b860.gif"
  },
  {
    "id": "edb-arvaszz",
    "name": "Modified Push Up to Lower Arms",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "TRICEPS",
        "CHEST",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "forearms"
      ],
      "secondaryRaw": [
        "triceps",
        "chest",
        "shoulders"
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
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/arvaszz.gif"
  },
  {
    "id": "edb-7f2jsqP",
    "name": "Dumbbell Seated One Arm Rotate",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "BICEPS"
      ],
      "targetRaw": [
        "forearms"
      ],
      "secondaryRaw": [
        "shoulders",
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
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/7f2jsqP.gif"
  },
  {
    "id": "edb-4Jc36XM",
    "name": "Dumbbell Over Bench One Arm Reverse Wrist Curl",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/4Jc36XM.gif"
  },
  {
    "id": "edb-B6dAO1t",
    "name": "Smith Seated Wrist Curl",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/B6dAO1t.gif"
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
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/awG04cF.gif"
  },
  {
    "id": "edb-2zNKRUB",
    "name": "Wrist Circles",
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
        "hands",
        "wrists"
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
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/2zNKRUB.gif"
  },
  {
    "id": "edb-hfmQ0Tz",
    "name": "Smith Standing Back Wrist Curl",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/hfmQ0Tz.gif"
  },
  {
    "id": "edb-3tAXPQ6",
    "name": "Dumbbell Over Bench Revers Wrist Curl",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/3tAXPQ6.gif"
  },
  {
    "id": "edb-BwSNDGt",
    "name": "Dumbbell One Arm Reverse Wrist Curl",
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
        "wrist extensors"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/BwSNDGt.gif"
  },
  {
    "id": "edb-vUTfFHw",
    "name": "Band Wrist Curl",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/vUTfFHw.gif"
  },
  {
    "id": "edb-q8aHNoF",
    "name": "Dumbbell One Arm Wrist Curl",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/q8aHNoF.gif"
  },
  {
    "id": "edb-VhX2JdE",
    "name": "Cable Standing Back Wrist Curl",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/VhX2JdE.gif"
  },
  {
    "id": "edb-D1xYJAU",
    "name": "Dumbbell Over Bench Wrist Curl",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/D1xYJAU.gif"
  },
  {
    "id": "edb-bjqbauy",
    "name": "Weighted Standing Hand Squeeze",
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
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/bjqbauy.gif"
  },
  {
    "id": "edb-I4tibZG",
    "name": "Kettlebell Alternating Hang Clean",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "BACK",
        "ABS"
      ],
      "targetRaw": [
        "forearms"
      ],
      "secondaryRaw": [
        "shoulders",
        "traps",
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
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/I4tibZG.gif"
  },
  {
    "id": "edb-eYmsEPR",
    "name": "Cable Reverse Wrist Curl",
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
        "forearms",
        "wrists"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/eYmsEPR.gif"
  },
  {
    "id": "edb-KI1DjNN",
    "name": "Dumbbell Over Bench One Arm Wrist Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "BICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "forearms"
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
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/KI1DjNN.gif"
  },
  {
    "id": "edb-mym4hJo",
    "name": "Dumbbell Lying Pronation",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "BICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "forearms"
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
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/mym4hJo.gif"
  },
  {
    "id": "edb-BLCvwr2",
    "name": "Dumbbell Reverse Wrist Curl",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/BLCvwr2.gif"
  },
  {
    "id": "edb-7AnZtSv",
    "name": "Dumbbell Over Bench One Arm Wrist Curl - Strength Variation",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": [
        "BICEPS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "forearms"
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
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/7AnZtSv.gif"
  },
  {
    "id": "edb-MqNdIbe",
    "name": "Controlled Wrist Rollerer",
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
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/MqNdIbe.gif"
  },
  {
    "id": "edb-YA2HKGz",
    "name": "Barbell Reverse Wrist Curl - Prone Variation",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/YA2HKGz.gif"
  },
  {
    "id": "edb-84RyJf8",
    "name": "Dumbbell One Arm Shoulder Press",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/84RyJf8.gif"
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
    "movement": "shoulders",
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
    "movement": "shoulders",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/u2X71Np.gif"
  },
  {
    "id": "edb-5KLbZWx",
    "name": "Kettlebell Alternating Press",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/5KLbZWx.gif"
  },
  {
    "id": "edb-PQcUlDi",
    "name": "Cable Supine Reverse Fly",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/PQcUlDi.gif"
  },
  {
    "id": "edb-x306lCW",
    "name": "Dumbbell Upright Shoulder External Rotation",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/x306lCW.gif"
  },
  {
    "id": "edb-prbWx1D",
    "name": "Dumbbell Rotation Reverse Fly",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/prbWx1D.gif"
  },
  {
    "id": "edb-jgbvVJ0",
    "name": "Dumbbell Incline T-raise",
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
        "traps",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/jgbvVJ0.gif"
  },
  {
    "id": "edb-mWBtgmb",
    "name": "Dumbbell Single Arm Overhead Carry",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "BACK",
        "ABS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "traps",
        "core"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/mWBtgmb.gif"
  },
  {
    "id": "edb-AQ0mC4Y",
    "name": "Dumbbell Full Can Lateral Raise",
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
        "rotator cuff"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/AQ0mC4Y.gif"
  },
  {
    "id": "edb-G61cXLk",
    "name": "Cable Kneeling Rear Delt Row (with Rope) (male)",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/G61cXLk.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/tc5dYrf.gif"
  },
  {
    "id": "edb-JzQbv7J",
    "name": "Dumbbell Seated Bent Arm Lateral Raise",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/JzQbv7J.gif"
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/xMjBKwn.gif"
  },
  {
    "id": "edb-aTNKZiC",
    "name": "Dumbbell Incline One Arm Lateral Raise",
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
        "trapezius",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/aTNKZiC.gif"
  },
  {
    "id": "edb-Ys97II0",
    "name": "Dumbbell Seated Front Raise",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/Ys97II0.gif"
  },
  {
    "id": "edb-S37C94C",
    "name": "Kettlebell One Arm Jerk",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/S37C94C.gif"
  },
  {
    "id": "edb-vqsbmL0",
    "name": "Lever Shoulder Press V. 2",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/vqsbmL0.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/EAs3xL9.gif"
  },
  {
    "id": "edb-QT5Q0nK",
    "name": "Dumbbell Seated Alternate Press",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/QT5Q0nK.gif"
  },
  {
    "id": "edb-mTT3KLn",
    "name": "Cable Front Shoulder Raise",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/mTT3KLn.gif"
  },
  {
    "id": "edb-gSw59a4",
    "name": "Dumbbell Lying One Arm Deltoid Rear",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/gSw59a4.gif"
  },
  {
    "id": "edb-UDm6cGl",
    "name": "Kettlebell Seesaw Press",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/UDm6cGl.gif"
  },
  {
    "id": "edb-aqvSOQE",
    "name": "Cable Cross-over Revers Fly",
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
        "rhomboids",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/aqvSOQE.gif"
  },
  {
    "id": "edb-dCPESfR",
    "name": "Barbell Standing Bradford Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/dCPESfR.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/cALKspW.gif"
  },
  {
    "id": "edb-bBi35y3",
    "name": "Dumbbell Standing Alternate Overhead Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/bBi35y3.gif"
  },
  {
    "id": "edb-cALkHHX",
    "name": "Dumbbell Iron Cross",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/cALkHHX.gif"
  },
  {
    "id": "edb-RgJDRR1",
    "name": "Barbell Wide-grip Upright Row",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/RgJDRR1.gif"
  },
  {
    "id": "edb-x825CZm",
    "name": "Cable Seated Rear Lateral Raise",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/x825CZm.gif"
  },
  {
    "id": "edb-Ln9iTbU",
    "name": "Barbell Rear Delt Raise",
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
        "traps",
        "rhomboids"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/Ln9iTbU.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/xUwnBMT.gif"
  },
  {
    "id": "edb-c9MnDRp",
    "name": "Dumbbell Raise",
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
        "traps",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/c9MnDRp.gif"
  },
  {
    "id": "edb-S9zHIvU",
    "name": "Barbell Rear Delt Row",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/S9zHIvU.gif"
  },
  {
    "id": "edb-gH5fRsC",
    "name": "Dumbbell Seated Alternate Front Raise",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/gH5fRsC.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/UDlhcO8.gif"
  },
  {
    "id": "edb-n5cWCsI",
    "name": "Dumbbell One Arm Lateral Raise",
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
        "trapezius",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/n5cWCsI.gif"
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/QfAKy1G.gif"
  },
  {
    "id": "edb-nFUwqG6",
    "name": "Smith Rear Delt Row",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/nFUwqG6.gif"
  },
  {
    "id": "edb-yCvYdi7",
    "name": "Kettlebell One Arm Military Press to the Side",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/yCvYdi7.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/aXcUyKb.gif"
  },
  {
    "id": "edb-7Ba7bQ2",
    "name": "Kettlebell Two Arm Clean",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "BACK",
        "FOREARMS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "traps",
        "forearms"
      ]
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/7Ba7bQ2.gif"
  },
  {
    "id": "edb-53Ttlck",
    "name": "Dumbbell Lying Rear Lateral Raise",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/53Ttlck.gif"
  },
  {
    "id": "edb-KHPZL0b",
    "name": "Cable Alternate Shoulder Press",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/KHPZL0b.gif"
  },
  {
    "id": "edb-vYk8lqw",
    "name": "Dumbbell Incline Rear Lateral Raise",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/vYk8lqw.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
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
    "movement": "shoulders",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/DsgkuIt.gif"
  },
  {
    "id": "edb-aHDy5O5",
    "name": "Band Y-raise",
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
        "traps",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/aHDy5O5.gif"
  },
  {
    "id": "edb-eXMFHww",
    "name": "Landmine Lateral Raise",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/eXMFHww.gif"
  },
  {
    "id": "edb-wEulIzp",
    "name": "Cable One Arm Lateral Raise",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/wEulIzp.gif"
  },
  {
    "id": "edb-kuXhl0o",
    "name": "Kettlebell Pirate Supper Legs",
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
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/kuXhl0o.gif"
  },
  {
    "id": "edb-q7qkONO",
    "name": "Dumbbell Seated Alternate Shoulder",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/q7qkONO.gif"
  },
  {
    "id": "edb-0dCyly0",
    "name": "Barbell Seated Bradford Rocky Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/0dCyly0.gif"
  },
  {
    "id": "edb-vzAxBtt",
    "name": "Kettlebell One Arm Clean and Jerk",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/vzAxBtt.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/sTfvVsG.gif"
  },
  {
    "id": "edb-yUdIGNs",
    "name": "Cable Rear Delt Row (stirrups)",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/yUdIGNs.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/Xy4jlWA.gif"
  },
  {
    "id": "edb-VLYXo8S",
    "name": "Weighted Round Arm",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/VLYXo8S.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/FS63wTN.gif"
  },
  {
    "id": "edb-8DiFDVA",
    "name": "Dumbbell Rear Fly",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/8DiFDVA.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/3eGE2JC.gif"
  },
  {
    "id": "edb-P5p0j8B",
    "name": "Cable Standing Cross-over High Reverse Fly",
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
        "rhomboids",
        "rear deltoids"
      ]
    },
    "equipment": [
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/P5p0j8B.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/A6wtbuL.gif"
  },
  {
    "id": "edb-RSOsp5d",
    "name": "Dumbbell Standing Around World",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/RSOsp5d.gif"
  },
  {
    "id": "edb-u4bAmKp",
    "name": "Band Twisting Overhead Press",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/u4bAmKp.gif"
  },
  {
    "id": "edb-UzkLrem",
    "name": "Dumbbell Rear Lateral Raise (support Head)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/UzkLrem.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/RJa4tCo.gif"
  },
  {
    "id": "edb-I4KkPdl",
    "name": "Kettlebell Double Push Press",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/I4KkPdl.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/ainizkb.gif"
  },
  {
    "id": "edb-tznL2Ad",
    "name": "Kettlebell Double Jerk",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/tznL2Ad.gif"
  },
  {
    "id": "edb-sTg7iys",
    "name": "Band Front Lateral Raise",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/sTg7iys.gif"
  },
  {
    "id": "edb-SxHteRW",
    "name": "Dumbbell Standing Alternate Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "BACK",
        "FOREARMS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "traps",
        "forearms"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/SxHteRW.gif"
  },
  {
    "id": "edb-eOrFCnx",
    "name": "Dumbbell Arnold Press V. 2",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/eOrFCnx.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/goJ6ezq.gif"
  },
  {
    "id": "edb-hvHhCv8",
    "name": "Cable Forward Raise",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/hvHhCv8.gif"
  },
  {
    "id": "edb-UilDHSs",
    "name": "Dumbbell Standing Palms in Press",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/UilDHSs.gif"
  },
  {
    "id": "edb-xifhB5W",
    "name": "Rear Deltoid Stretch",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/xifhB5W.gif"
  },
  {
    "id": "edb-Rr7S3yg",
    "name": "Dumbbell Front Raise V. 2",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/Rr7S3yg.gif"
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/TFA88iB.gif"
  },
  {
    "id": "edb-nxW6BkN",
    "name": "Dumbbell Incline Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "BACK",
        "TRICEPS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "trapezius",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/nxW6BkN.gif"
  },
  {
    "id": "edb-hoXt6wv",
    "name": "Left Hook. Boxing",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "BICEPS",
        "TRICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "delts"
      ],
      "secondaryRaw": [
        "biceps",
        "triceps",
        "forearms"
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/hoXt6wv.gif"
  },
  {
    "id": "edb-1DN3iz4",
    "name": "Smith Upright Row",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/1DN3iz4.gif"
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/znQUdHY.gif"
  },
  {
    "id": "edb-UM8mgyG",
    "name": "Kettlebell Arnold Press",
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
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/UM8mgyG.gif"
  },
  {
    "id": "edb-Ion0XWz",
    "name": "Dumbbell Lying on Floor Rear Delt Raise",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/Ion0XWz.gif"
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/wqNPGCg.gif"
  },
  {
    "id": "edb-ht8xDrP",
    "name": "Smith Standing Behind Head Military Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/ht8xDrP.gif"
  },
  {
    "id": "edb-dNFYIU1",
    "name": "Lever Shoulder Press V. 3",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/dNFYIU1.gif"
  },
  {
    "id": "edb-6cKQC5E",
    "name": "Dumbbell One Arm Upright Row",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/6cKQC5E.gif"
  },
  {
    "id": "edb-vmwLyCg",
    "name": "Dumbbell W-press",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/vmwLyCg.gif"
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/PzQanLE.gif"
  },
  {
    "id": "edb-Iptlv6x",
    "name": "Dumbbell Upright Row (back Pov)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/Iptlv6x.gif"
  },
  {
    "id": "edb-83HoW9X",
    "name": "Barbell Upright Row V. 2",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/83HoW9X.gif"
  },
  {
    "id": "edb-fI18Rbc",
    "name": "Barbell Upright Row V. 3",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/fI18Rbc.gif"
  },
  {
    "id": "edb-jjUPrze",
    "name": "Smith Standing Military Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/jjUPrze.gif"
  },
  {
    "id": "edb-ZEkjZDi",
    "name": "Kettlebell Seated Two Arm Military Press",
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
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/ZEkjZDi.gif"
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/peAeMR3.gif"
  },
  {
    "id": "edb-S8mo30S",
    "name": "Barbell Standing Front Raise Over Head",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/S8mo30S.gif"
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/b2Uoz54.gif"
  },
  {
    "id": "edb-7uFJuXp",
    "name": "Weighted Kneeling Step with Swing",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/7uFJuXp.gif"
  },
  {
    "id": "edb-f1jf47L",
    "name": "Dumbbell Seated Shoulder Press (parallel Grip)",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/f1jf47L.gif"
  },
  {
    "id": "edb-5vfAI0I",
    "name": "Dumbbell Scott Press",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/5vfAI0I.gif"
  },
  {
    "id": "edb-M74kdvm",
    "name": "Kettlebell Double Snatch",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/M74kdvm.gif"
  },
  {
    "id": "edb-3d7wHyd",
    "name": "Dumbbell Bench Seated Press",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/3d7wHyd.gif"
  },
  {
    "id": "edb-hrrS0Ed",
    "name": "Dumbbell Seated Lateral Raise V. 2",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/hrrS0Ed.gif"
  },
  {
    "id": "edb-2KGnL6M",
    "name": "Lever One Arm Shoulder Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/2KGnL6M.gif"
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/67n3r98.gif"
  },
  {
    "id": "edb-BqgCRif",
    "name": "Dumbbell Cuban Press V. 2",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/BqgCRif.gif"
  },
  {
    "id": "edb-fTlkJop",
    "name": "Dumbbell Side Lying One Hand Raise",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/fTlkJop.gif"
  },
  {
    "id": "edb-ngPpyRS",
    "name": "Barbell Seated Behind Head Military Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/ngPpyRS.gif"
  },
  {
    "id": "edb-CggQhII",
    "name": "Lever Military Press",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/CggQhII.gif"
  },
  {
    "id": "edb-blBXysN",
    "name": "Kettlebell Two Arm Military Press",
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
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/blBXysN.gif"
  },
  {
    "id": "edb-YPoVrBi",
    "name": "Cable Seated Shoulder Internal Rotation",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/YPoVrBi.gif"
  },
  {
    "id": "edb-Yg7MJAT",
    "name": "Dumbbell One Arm Lateral Raise with Support",
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
        "trapezius",
        "rotator cuff"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/Yg7MJAT.gif"
  },
  {
    "id": "edb-ocYc6Db",
    "name": "Dumbbell Standing One Arm Palm in Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/ocYc6Db.gif"
  },
  {
    "id": "edb-xHKN2s8",
    "name": "Barbell One Arm Snatch",
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
        "traps",
        "forearms",
        "core"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/xHKN2s8.gif"
  },
  {
    "id": "edb-e25F58f",
    "name": "Dumbbell One Arm Reverse Fly (with Support)",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/e25F58f.gif"
  },
  {
    "id": "edb-e4aFmFY",
    "name": "Weighted Front Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT"
      ],
      "secondary": [
        "BICEPS",
        "FOREARMS"
      ],
      "targetRaw": [
        "delts"
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
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/e4aFmFY.gif"
  },
  {
    "id": "edb-osdXT3K",
    "name": "Kettlebell One Arm Push Press",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/osdXT3K.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/kTbSH9h.gif"
  },
  {
    "id": "edb-903mzG8",
    "name": "Smith Shoulder Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/903mzG8.gif"
  },
  {
    "id": "edb-laVRfDf",
    "name": "Dumbbell Standing Front Raise Above Head",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/laVRfDf.gif"
  },
  {
    "id": "edb-Kyd9Rz5",
    "name": "Barbell Standing Wide Military Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/Kyd9Rz5.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/EKXOMEh.gif"
  },
  {
    "id": "edb-xiHiJcA",
    "name": "Lever Seated Reverse Fly (parallel Grip)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/xiHiJcA.gif"
  },
  {
    "id": "edb-4Leypho",
    "name": "Barbell Skier",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/4Leypho.gif"
  },
  {
    "id": "edb-Gpn4ADc",
    "name": "Smith Behind Neck Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/Gpn4ADc.gif"
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
    "movement": "shoulders",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/mu5Guxt.gif"
  },
  {
    "id": "edb-1TkiAFK",
    "name": "Dumbbell One Arm Shoulder Press V. 2",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/1TkiAFK.gif"
  },
  {
    "id": "edb-xDh0lJr",
    "name": "Standing Behind Neck Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/xDh0lJr.gif"
  },
  {
    "id": "edb-ZfyAGhK",
    "name": "Cable Standing Rear Delt Row (with Rope)",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/ZfyAGhK.gif"
  },
  {
    "id": "edb-fprd84i",
    "name": "Ez Barbell Anti Gravity Press",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/fprd84i.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/yWxMvB5.gif"
  },
  {
    "id": "edb-S93zLTG",
    "name": "Resistance Band Seated Shoulder Press",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/S93zLTG.gif"
  },
  {
    "id": "edb-KwFGiEP",
    "name": "Dumbbell Lying One Arm Rear Lateral Raise",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/KwFGiEP.gif"
  },
  {
    "id": "edb-izMnLqz",
    "name": "Dumbbell Alternate Side Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/izMnLqz.gif"
  },
  {
    "id": "edb-MRaFiZP",
    "name": "Inverted Style Smith Seated Shoulder Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/MRaFiZP.gif"
  },
  {
    "id": "edb-eZ79rbI",
    "name": "Cable Kneeling Rear Delt Row (with Rope) (male) Expanded",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/eZ79rbI.gif"
  },
  {
    "id": "edb-V7rWsT5",
    "name": "Lever Military Press with Strength",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/V7rWsT5.gif"
  },
  {
    "id": "edb-1RIkUHT",
    "name": "Dumbbell Iron Cross - Improved Variation",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/1RIkUHT.gif"
  },
  {
    "id": "edb-hTLtkXL",
    "name": "Resistance Band Seated Shoulder Press with Declined",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/hTLtkXL.gif"
  },
  {
    "id": "edb-1oE78pm",
    "name": "Core Barbell Upright Row V. 2",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/1oE78pm.gif"
  },
  {
    "id": "edb-u1iHcoD",
    "name": "Prone Dumbbell Upright Shoulder External Rotation",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/u1iHcoD.gif"
  },
  {
    "id": "edb-VRBGPHB",
    "name": "Single Smith Shoulder Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/VRBGPHB.gif"
  },
  {
    "id": "edb-hVzPY5j",
    "name": "Athletic Style Battling Ropes",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/hVzPY5j.gif"
  },
  {
    "id": "edb-Mr8d4KA",
    "name": "Kettlebell Arnold Press - Beginner Variation",
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
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/Mr8d4KA.gif"
  },
  {
    "id": "edb-89HVjEp",
    "name": "Kettlebell Seated Press with High",
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
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/89HVjEp.gif"
  },
  {
    "id": "edb-myJeTAe",
    "name": "Tough Cable One Arm Lateral Raise",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/myJeTAe.gif"
  },
  {
    "id": "edb-gWcZD4q",
    "name": "Horizontal Dumbbell Standing Alternate Overhead Press",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "shoulders",
    "gifUrl": "https://static.exercisedb.dev/media/gWcZD4q.gif"
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
    "id": "edb-f9lVSSI",
    "name": "Astride Jumps (male)",
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
    "gifUrl": "https://static.exercisedb.dev/media/f9lVSSI.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/oLrKqDH.gif"
  },
  {
    "id": "edb-CcWEoWV",
    "name": "Short Stride Run",
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
    "gifUrl": "https://static.exercisedb.dev/media/CcWEoWV.gif"
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
    "id": "edb-y5p0H8a",
    "name": "Run (equipment)",
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
    "gifUrl": "https://static.exercisedb.dev/media/y5p0H8a.gif"
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
    "id": "edb-PrQbjvB",
    "name": "Push to Run",
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
    "gifUrl": "https://static.exercisedb.dev/media/PrQbjvB.gif"
  },
  {
    "id": "edb-6FMU51h",
    "name": "Semi Squat Jump (male)",
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
    "gifUrl": "https://static.exercisedb.dev/media/6FMU51h.gif"
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/zfNHMN9.gif"
  },
  {
    "id": "edb-mr7pkqP",
    "name": "Jack Burpee",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/mr7pkqP.gif"
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
    "aliases": [],
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
    "aliases": [],
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/dK9394r.gif"
  },
  {
    "id": "edb-Eh2v5Iu",
    "name": "Scissor Jumps (male)",
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
    "gifUrl": "https://static.exercisedb.dev/media/Eh2v5Iu.gif"
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
    "aliases": [],
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
    "id": "edb-1g5bPpA",
    "name": "Jack Jump (male)",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "CALVES"
      ],
      "targetRaw": [
        "cardiovascular system"
      ],
      "secondaryRaw": [
        "quadriceps",
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
    "gifUrl": "https://static.exercisedb.dev/media/1g5bPpA.gif"
  },
  {
    "id": "edb-XSCHmiI",
    "name": "Cycle Cross Trainer",
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
    "aliases": [],
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
    "id": "edb-ia6kIIl",
    "name": "Half Knee Bends (male)",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/ia6kIIl.gif"
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
    "name": "Stationary Bike Walk",
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
    "gifUrl": "https://static.exercisedb.dev/media/a8VDgLw.gif"
  },
  {
    "id": "edb-rjtuP6X",
    "name": "Walk Elliptical Cross Trainer",
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
    "aliases": [],
    "tags": [
      "isolation",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/rjtuP6X.gif"
  },
  {
    "id": "edb-HtfCpfi",
    "name": "Star Jump (male)",
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
    "id": "edb-v6EKk0O",
    "name": "Half Knee Bends (male) with Blunt",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/v6EKk0O.gif"
  },
  {
    "id": "edb-gTGciXz",
    "name": "Alternating Bear Crawl",
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
    "gifUrl": "https://static.exercisedb.dev/media/gTGciXz.gif"
  },
  {
    "id": "edb-PCUYOMs",
    "name": "Pulse Style Walk Elliptical Cross Trainer",
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
    "aliases": [],
    "tags": [
      "isolation",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/PCUYOMs.gif"
  },
  {
    "id": "edb-pFuK3by",
    "name": "Walk Elliptical Cross Trainer - Expanded Variation",
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
    "aliases": [],
    "tags": [
      "isolation",
      "cardio"
    ],
    "movement": "cardio",
    "gifUrl": "https://static.exercisedb.dev/media/pFuK3by.gif"
  },
  {
    "id": "edb-MrgP9L6",
    "name": "Lever Rotary Calf",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/MrgP9L6.gif"
  },
  {
    "id": "edb-VW88JNd",
    "name": "Dumbbell Seated One Leg Calf Raise - Palm Up",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/VW88JNd.gif"
  },
  {
    "id": "edb-6HiHHe0",
    "name": "Barbell Standing Rocking Leg Calf Raise",
    "defaultUnit": "reps",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/6HiHHe0.gif"
  },
  {
    "id": "edb-ipvgBnC",
    "name": "Barbell Seated Calf Raise",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/ipvgBnC.gif"
  },
  {
    "id": "edb-17bqEXD",
    "name": "Seated Calf Stretch (male)",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/17bqEXD.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/8ozhUIZ.gif"
  },
  {
    "id": "edb-2IHEa2T",
    "name": "Barbell Floor Calf Raise",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/2IHEa2T.gif"
  },
  {
    "id": "edb-LmaFNZS",
    "name": "Weighted Donkey Calf Raise",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/LmaFNZS.gif"
  },
  {
    "id": "edb-jl6uxZV",
    "name": "Band Two Legs Calf Raise - (band Under Both Legs) V. 2",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/jl6uxZV.gif"
  },
  {
    "id": "edb-AxFoqAD",
    "name": "Hack One Leg Calf Raise",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/AxFoqAD.gif"
  },
  {
    "id": "edb-7B4F5nZ",
    "name": "Lever Calf Press",
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
    "gifUrl": "https://static.exercisedb.dev/media/7B4F5nZ.gif"
  },
  {
    "id": "edb-XDOiFns",
    "name": "Sled Forward Angled Calf Raise",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/XDOiFns.gif"
  },
  {
    "id": "edb-XhfS1DZ",
    "name": "Peroneals Stretch",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/XhfS1DZ.gif"
  },
  {
    "id": "edb-ykHcWme",
    "name": "Sled Calf Press on Leg Press",
    "defaultUnit": "reps",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/ykHcWme.gif"
  },
  {
    "id": "edb-0S75mYG",
    "name": "Smith Seated One Leg Calf Raise",
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
    "gifUrl": "https://static.exercisedb.dev/media/0S75mYG.gif"
  },
  {
    "id": "edb-FxhcxUW",
    "name": "Dumbbell Seated One Leg Calf Raise - Hammer Grip",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/FxhcxUW.gif"
  },
  {
    "id": "edb-u0pLNgz",
    "name": "Sled One Leg Calf Press on Leg Press",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/u0pLNgz.gif"
  },
  {
    "id": "edb-1LVFcEn",
    "name": "Calf Stretch with Rope",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/1LVFcEn.gif"
  },
  {
    "id": "edb-j74M6Zn",
    "name": "Exercise Ball on the Wall Calf Raise (tennis Ball Between Knees)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings"
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
    "gifUrl": "https://static.exercisedb.dev/media/j74M6Zn.gif"
  },
  {
    "id": "edb-6HmFgmx",
    "name": "Standing Calf Raise (on a Staircase)",
    "defaultUnit": "min",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight",
      "cardio"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/6HmFgmx.gif"
  },
  {
    "id": "edb-DEEqoI2",
    "name": "Posterior Tibialis Stretch",
    "defaultUnit": "reps",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/DEEqoI2.gif"
  },
  {
    "id": "edb-2ORFMoR",
    "name": "Hack Calf Raise",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/2ORFMoR.gif"
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
    "id": "edb-QsSQWbf",
    "name": "Band Single Leg Reverse Calf Raise",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/QsSQWbf.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/bOOdeyc.gif"
  },
  {
    "id": "edb-rGwhJ5o",
    "name": "Barbell Standing Leg Calf Raise",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/rGwhJ5o.gif"
  },
  {
    "id": "edb-yl2IYyy",
    "name": "Cable Standing Calf Raise",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/yl2IYyy.gif"
  },
  {
    "id": "edb-g376LuL",
    "name": "Sled Lying Calf Press",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/g376LuL.gif"
  },
  {
    "id": "edb-FY3UdNT",
    "name": "Exercise Ball on the Wall Calf Raise (tennis Ball Between Ankles)",
    "defaultUnit": "reps",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/FY3UdNT.gif"
  },
  {
    "id": "edb-xo6sENf",
    "name": "Exercise Ball on the Wall Calf Raise",
    "defaultUnit": "reps",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/xo6sENf.gif"
  },
  {
    "id": "edb-m0tCHqc",
    "name": "Calf Stretch with Hands Against Wall",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
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
    "aliases": [],
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
    "id": "edb-fKZgDEO",
    "name": "Single Leg Calf Raise (on a Dumbbell)",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/fKZgDEO.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/r29jP7S.gif"
  },
  {
    "id": "edb-IeDEXTe",
    "name": "Lever Seated Squat Calf Raise on Leg Press Machine",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES"
      ],
      "targetRaw": [
        "calves"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/IeDEXTe.gif"
  },
  {
    "id": "edb-Ia7tumC",
    "name": "Dumbbell Seated One Leg Calf Raise",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Ia7tumC.gif"
  },
  {
    "id": "edb-C9LuR4A",
    "name": "Lever Donkey Calf Raise",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/C9LuR4A.gif"
  },
  {
    "id": "edb-PzNxakt",
    "name": "Calf Push Stretch with Hands Against Wall",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/PzNxakt.gif"
  },
  {
    "id": "edb-Y4QlY8z",
    "name": "Smith Toe Raise",
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
        "shins"
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
    "gifUrl": "https://static.exercisedb.dev/media/Y4QlY8z.gif"
  },
  {
    "id": "edb-qOKcgVP",
    "name": "Standing Calves Calf Stretch",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/qOKcgVP.gif"
  },
  {
    "id": "edb-GxDwDX0",
    "name": "Assisted Lying Calves Stretch",
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
    "gifUrl": "https://static.exercisedb.dev/media/GxDwDX0.gif"
  },
  {
    "id": "edb-A2upspL",
    "name": "One Leg Donkey Calf Raise",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/A2upspL.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/bJYHBIN.gif"
  },
  {
    "id": "edb-ktsFQAZ",
    "name": "Barbell Seated Calf Raise",
    "defaultUnit": "reps",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/ktsFQAZ.gif"
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
    "id": "edb-6MaEjVA",
    "name": "Smith Standing Leg Calf Raise",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/6MaEjVA.gif"
  },
  {
    "id": "edb-X7jbxra",
    "name": "Circles Knee Stretch",
    "defaultUnit": "reps",
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
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/X7jbxra.gif"
  },
  {
    "id": "edb-0jp9Rlz",
    "name": "One Leg Floor Calf Raise",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/0jp9Rlz.gif"
  },
  {
    "id": "edb-XIHEoCG",
    "name": "Standing Calves",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/XIHEoCG.gif"
  },
  {
    "id": "edb-9GXrTE6",
    "name": "Smith One Leg Floor Calf Raise",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/9GXrTE6.gif"
  },
  {
    "id": "edb-qCNVnaU",
    "name": "Sled 45в° Calf Press",
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
    "id": "edb-iPm26QU",
    "name": "Box Jump Down with One Leg Stabilization",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS",
        "GLUTES"
      ],
      "targetRaw": [
        "calves"
      ],
      "secondaryRaw": [
        "quadriceps",
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
    "gifUrl": "https://static.exercisedb.dev/media/iPm26QU.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/ykUOVze.gif"
  },
  {
    "id": "edb-fgc9Xdl",
    "name": "Cable Standing One Leg Calf Raise",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/fgc9Xdl.gif"
  },
  {
    "id": "edb-9JprnPh",
    "name": "Band Single Leg Calf Raise",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/9JprnPh.gif"
  },
  {
    "id": "edb-ywaNfuh",
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
    "gifUrl": "https://static.exercisedb.dev/media/ywaNfuh.gif"
  },
  {
    "id": "edb-Ie9UGty",
    "name": "Lever Seated Calf Press",
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
        "soleus",
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
    "gifUrl": "https://static.exercisedb.dev/media/Ie9UGty.gif"
  },
  {
    "id": "edb-vobtVkm",
    "name": "Calf Push Stretch with Hands Against Wall Elite",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs",
      "bodyweight"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/vobtVkm.gif"
  },
  {
    "id": "edb-Dx2RIva",
    "name": "Triple Style Sled One Leg Calf Press on Leg Press",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/Dx2RIva.gif"
  },
  {
    "id": "edb-UoX77uR",
    "name": "Dumbbell Seated One Leg Calf Raise - Hammer Grip Deep",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/UoX77uR.gif"
  },
  {
    "id": "edb-DICPHtq",
    "name": "Targeted Style Single Leg Calf Raise (on a Dumbbell)",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/DICPHtq.gif"
  },
  {
    "id": "edb-a4F9Oyc",
    "name": "Kettlebell Double Alternating Hang Clean",
    "defaultUnit": "sec",
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
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/a4F9Oyc.gif"
  },
  {
    "id": "edb-gVlnLIJ",
    "name": "Cable Reverse One Arm Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/gVlnLIJ.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/F3xgbjF.gif"
  },
  {
    "id": "edb-KXyoEtA",
    "name": "Dumbbell Seated Inner Biceps Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/KXyoEtA.gif"
  },
  {
    "id": "edb-OeL23VY",
    "name": "Dumbbell Seated Biceps Curl to Shoulder Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "biceps"
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
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/OeL23VY.gif"
  },
  {
    "id": "edb-GNhAeJ0",
    "name": "Dumbbell Hammer Curls (with Arm Blaster)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/GNhAeJ0.gif"
  },
  {
    "id": "edb-ye84CTU",
    "name": "Lever Preacher Curl V. 2",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/ye84CTU.gif"
  },
  {
    "id": "edb-bWxq4op",
    "name": "Dumbbell One Arm Reverse Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/bWxq4op.gif"
  },
  {
    "id": "edb-F1KxjBa",
    "name": "Dumbbell Peacher Hammer Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/F1KxjBa.gif"
  },
  {
    "id": "edb-lyKCLmK",
    "name": "Dumbbell Seated Revers Grip Concentration Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/lyKCLmK.gif"
  },
  {
    "id": "edb-4dUn2iv",
    "name": "Barbell Standing Close Grip Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/4dUn2iv.gif"
  },
  {
    "id": "edb-OVTZ65k",
    "name": "Ez-barbell Standing Wide Grip Biceps Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/OVTZ65k.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/kXaIn5A.gif"
  },
  {
    "id": "edb-2JCuFTU",
    "name": "Dumbbell Kneeling Bicep Curl Exercise Ball",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/2JCuFTU.gif"
  },
  {
    "id": "edb-uSkDMYl",
    "name": "Dumbbell Bicep Curl with Stork Stance",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/uSkDMYl.gif"
  },
  {
    "id": "edb-QLRmNeT",
    "name": "Dumbbell Seated Alternate Hammer Curl on Exercise Ball",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/QLRmNeT.gif"
  },
  {
    "id": "edb-jK2hZ6n",
    "name": "Dumbbell One Arm Seated Hammer Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/jK2hZ6n.gif"
  },
  {
    "id": "edb-KOpzGBL",
    "name": "Dumbbell Waiter Biceps Curl",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/KOpzGBL.gif"
  },
  {
    "id": "edb-q6y3OhV",
    "name": "Lever Bicep Curl",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/q6y3OhV.gif"
  },
  {
    "id": "edb-IvV6C9M",
    "name": "Dumbbell Over Bench One Arm Neutral Wrist Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/IvV6C9M.gif"
  },
  {
    "id": "edb-hacCyUv",
    "name": "Ez Barbell Close Grip Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/hacCyUv.gif"
  },
  {
    "id": "edb-k5IpyHg",
    "name": "Dumbbell One Arm Concentration Curl (on Stability Ball)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/k5IpyHg.gif"
  },
  {
    "id": "edb-J74XlNf",
    "name": "Dumbbell Alternating Seated Bicep Curl on Exercise Ball",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/J74XlNf.gif"
  },
  {
    "id": "edb-SYJ4Bkt",
    "name": "Barbell Lying Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/SYJ4Bkt.gif"
  },
  {
    "id": "edb-LCtQPn8",
    "name": "Dumbbell Incline Inner Biceps Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/LCtQPn8.gif"
  },
  {
    "id": "edb-VdLZ3nB",
    "name": "Dumbbell One Arm Reverse Spider Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/VdLZ3nB.gif"
  },
  {
    "id": "edb-UNAB8ak",
    "name": "Band One Arm Overhead Biceps Curl",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/UNAB8ak.gif"
  },
  {
    "id": "edb-wDUqY2u",
    "name": "Cable Overhead Curl",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/wDUqY2u.gif"
  },
  {
    "id": "edb-QTXKWPh",
    "name": "Cable Pulldown Bicep Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/QTXKWPh.gif"
  },
  {
    "id": "edb-kj3hy6W",
    "name": "Lever Reverse Grip Preacher Curl",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/kj3hy6W.gif"
  },
  {
    "id": "edb-ffQsyBj",
    "name": "Dumbbell One Arm Standing Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/ffQsyBj.gif"
  },
  {
    "id": "edb-ZXnjcOQ",
    "name": "Cable One Arm Reverse Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/ZXnjcOQ.gif"
  },
  {
    "id": "edb-XFc3vpY",
    "name": "Resistance Band Seated Biceps Curl",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/XFc3vpY.gif"
  },
  {
    "id": "edb-xiA6lRr",
    "name": "Dumbbell Seated Bicep Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/xiA6lRr.gif"
  },
  {
    "id": "edb-3s4NnTh",
    "name": "Dumbbell Standing Biceps Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/3s4NnTh.gif"
  },
  {
    "id": "edb-CvPn9WV",
    "name": "Cable Standing Pulldown (with Rope)",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/CvPn9WV.gif"
  },
  {
    "id": "edb-6sMAmNv",
    "name": "Dumbbell Reverse Spider Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/6sMAmNv.gif"
  },
  {
    "id": "edb-BIb1tGo",
    "name": "Dumbbell Standing One Arm Curl (over Incline Bench)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/BIb1tGo.gif"
  },
  {
    "id": "edb-OAguZoG",
    "name": "Lever Hammer Grip Preacher Curl",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/OAguZoG.gif"
  },
  {
    "id": "edb-CfKsRbG",
    "name": "Dumbbell Alternate Biceps Curl (with Arm Blaster)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/CfKsRbG.gif"
  },
  {
    "id": "edb-b6hQYMb",
    "name": "Lever Preacher Curl",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/b6hQYMb.gif"
  },
  {
    "id": "edb-nFc4FyV",
    "name": "Dumbbell Biceps Curl Reverse",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/nFc4FyV.gif"
  },
  {
    "id": "edb-niXESDw",
    "name": "Dumbbell Biceps Curl Squat",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/niXESDw.gif"
  },
  {
    "id": "edb-aee2Fcj",
    "name": "Barbell Biceps Curl (with Arm Blaster)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/aee2Fcj.gif"
  },
  {
    "id": "edb-4LIG9xr",
    "name": "Barbell Reverse Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/4LIG9xr.gif"
  },
  {
    "id": "edb-H1XAdpk",
    "name": "Dumbbell Biceps Curl V Sit on Bosu Ball",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/H1XAdpk.gif"
  },
  {
    "id": "edb-XVzF3iZ",
    "name": "Dumbbell Lying Supine Biceps Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/XVzF3iZ.gif"
  },
  {
    "id": "edb-84sESNy",
    "name": "Dumbbell Seated One Arm Bicep Curl on Exercise Ball with Leg Raised",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/84sESNy.gif"
  },
  {
    "id": "edb-EmlJR2y",
    "name": "Dumbbell Standing One Arm Curl Over Incline Bench",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/EmlJR2y.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/IENzBdA.gif"
  },
  {
    "id": "edb-Y5X65IB",
    "name": "Ez Barbell Reverse Grip Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Y5X65IB.gif"
  },
  {
    "id": "edb-kmVVAfu",
    "name": "Band Concentration Curl",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/kmVVAfu.gif"
  },
  {
    "id": "edb-BU15nH4",
    "name": "Dumbbell Alternate Biceps Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/BU15nH4.gif"
  },
  {
    "id": "edb-LWuA3aZ",
    "name": "Barbell Standing Reverse Grip Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/LWuA3aZ.gif"
  },
  {
    "id": "edb-TiaZTxx",
    "name": "Dumbbell Seated Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/TiaZTxx.gif"
  },
  {
    "id": "edb-s999Hdo",
    "name": "Dumbbell One Arm Seated Bicep Curl on Exercise Ball",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/s999Hdo.gif"
  },
  {
    "id": "edb-V4ryaZa",
    "name": "Ez Barbell Close-grip Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/V4ryaZa.gif"
  },
  {
    "id": "edb-faHKVkK",
    "name": "Barbell Standing Wide Grip Biceps Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/faHKVkK.gif"
  },
  {
    "id": "edb-otqIxU4",
    "name": "Cable Lying Bicep Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/otqIxU4.gif"
  },
  {
    "id": "edb-eOG0r6v",
    "name": "Cable Reverse Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/eOG0r6v.gif"
  },
  {
    "id": "edb-ae9UoXQ",
    "name": "Dumbbell Incline Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/ae9UoXQ.gif"
  },
  {
    "id": "edb-y5U5B9Y",
    "name": "Dumbbell Zottman Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/y5U5B9Y.gif"
  },
  {
    "id": "edb-YwnI4ja",
    "name": "Cable Standing Inner Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/YwnI4ja.gif"
  },
  {
    "id": "edb-BCGQ6J5",
    "name": "Cable Close Grip Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/BCGQ6J5.gif"
  },
  {
    "id": "edb-gscGLOU",
    "name": "Bodyweight Side Lying Biceps Curl",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/gscGLOU.gif"
  },
  {
    "id": "edb-8fgqP5a",
    "name": "Dumbbell Standing One Arm Concentration Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/8fgqP5a.gif"
  },
  {
    "id": "edb-vBNyir7",
    "name": "Ez Barbell Reverse Grip Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/vBNyir7.gif"
  },
  {
    "id": "edb-LIGZSTA",
    "name": "Dumbbell One Arm Prone Hammer Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/LIGZSTA.gif"
  },
  {
    "id": "edb-Mz6lLcW",
    "name": "Dumbbell Lunge with Bicep Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "QUADS",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "biceps"
      ],
      "secondaryRaw": [
        "quadriceps",
        "hamstrings"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Mz6lLcW.gif"
  },
  {
    "id": "edb-2kattbR",
    "name": "Ez Barbell Spider Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/2kattbR.gif"
  },
  {
    "id": "edb-Qyk5J3p",
    "name": "Dumbbell Cross Body Hammer Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Qyk5J3p.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/gvsWLQw.gif"
  },
  {
    "id": "edb-3XFdb1Z",
    "name": "Cable Squatting Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/3XFdb1Z.gif"
  },
  {
    "id": "edb-1V1gj1u",
    "name": "Barbell Seated Close-grip Concentration Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/1V1gj1u.gif"
  },
  {
    "id": "edb-4hATdoB",
    "name": "Cable Rope One Arm Hammer Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/4hATdoB.gif"
  },
  {
    "id": "edb-61GrD55",
    "name": "Cable Lying Close-grip Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/61GrD55.gif"
  },
  {
    "id": "edb-WLvTAv5",
    "name": "Barbell Prone Incline Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/WLvTAv5.gif"
  },
  {
    "id": "edb-b4b6afT",
    "name": "Weighted Seated Bicep Curl (on Stability Ball)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/b4b6afT.gif"
  },
  {
    "id": "edb-YTur5nR",
    "name": "Cable One Arm Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/YTur5nR.gif"
  },
  {
    "id": "edb-jivWf8n",
    "name": "Dumbbell Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/jivWf8n.gif"
  },
  {
    "id": "edb-cWemPG8",
    "name": "Dumbbell Prone Incline Hammer Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/cWemPG8.gif"
  },
  {
    "id": "edb-vsMcDi9",
    "name": "Barbell Standing Concentration Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/vsMcDi9.gif"
  },
  {
    "id": "edb-IwX5NqK",
    "name": "Cable Reverse Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/IwX5NqK.gif"
  },
  {
    "id": "edb-o1ntciW",
    "name": "Olympic Barbell Hammer Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/o1ntciW.gif"
  },
  {
    "id": "edb-IGtBdNT",
    "name": "Dumbbell Seated Hammer Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/IGtBdNT.gif"
  },
  {
    "id": "edb-KUaZst7",
    "name": "Dumbbell Lying Supine Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/KUaZst7.gif"
  },
  {
    "id": "edb-ioTf098",
    "name": "Cable Overhead Curl on Exercise Ball",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/ioTf098.gif"
  },
  {
    "id": "edb-fy7Tgy4",
    "name": "Dumbbell Alternate Hammer Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/fy7Tgy4.gif"
  },
  {
    "id": "edb-hq2hyDH",
    "name": "Dumbbell Standing Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/hq2hyDH.gif"
  },
  {
    "id": "edb-DpWMFP5",
    "name": "Cable Seated Overhead Curl",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/DpWMFP5.gif"
  },
  {
    "id": "edb-JWjujiY",
    "name": "Dumbbell One Arm Prone Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/JWjujiY.gif"
  },
  {
    "id": "edb-dXz8zjF",
    "name": "Cable Drag Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/dXz8zjF.gif"
  },
  {
    "id": "edb-H9y3Dkr",
    "name": "Cable Two Arm Curl on Incline Bench",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/H9y3Dkr.gif"
  },
  {
    "id": "edb-NdIb5Z1",
    "name": "Barbell Standing Wide-grip Curl",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/NdIb5Z1.gif"
  },
  {
    "id": "edb-fY68AyX",
    "name": "Dumbbell Hammer Curl on Exercise Ball",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/fY68AyX.gif"
  },
  {
    "id": "edb-eHBlPsa",
    "name": "Cable One Arm Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/eHBlPsa.gif"
  },
  {
    "id": "edb-RaflbWD",
    "name": "Dumbbell Incline Curl V. 2",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/RaflbWD.gif"
  },
  {
    "id": "edb-2sQGZ5b",
    "name": "Dumbbell One Arm Standing Hammer Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/2sQGZ5b.gif"
  },
  {
    "id": "edb-M5Y7GPg",
    "name": "Weighted Standing Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/M5Y7GPg.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/guT8YnS.gif"
  },
  {
    "id": "edb-Yza7XrQ",
    "name": "Barbell Alternate Biceps Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Yza7XrQ.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/qOgPVf6.gif"
  },
  {
    "id": "edb-rZ80Gbp",
    "name": "Cable Seated One Arm Concentration Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/rZ80Gbp.gif"
  },
  {
    "id": "edb-vKilzz3",
    "name": "Dumbbell Standing Inner Biceps Curl V. 2",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/vKilzz3.gif"
  },
  {
    "id": "edb-qm9veZw",
    "name": "Dumbbell Lying Wide Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/qm9veZw.gif"
  },
  {
    "id": "edb-uJmK7Z1",
    "name": "Dumbbell Seated Neutral Wrist Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/uJmK7Z1.gif"
  },
  {
    "id": "edb-NlfIbzq",
    "name": "Dumbbell Alternate Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/NlfIbzq.gif"
  },
  {
    "id": "edb-76vfTdU",
    "name": "Dumbbell Step Up Single Leg Balance with Bicep Curl",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "QUADS",
        "GLUTES",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "biceps"
      ],
      "secondaryRaw": [
        "quadriceps",
        "glutes",
        "hamstrings"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/76vfTdU.gif"
  },
  {
    "id": "edb-1VpF8db",
    "name": "Dumbbell Bicep Curl Lunge with Bowling Motion",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/1VpF8db.gif"
  },
  {
    "id": "edb-mwpPcr1",
    "name": "Dumbbell Prone Incline Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/mwpPcr1.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/6TG6x2w.gif"
  },
  {
    "id": "edb-hwygydB",
    "name": "Dumbbell Preacher Curl Over Exercise Ball",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/hwygydB.gif"
  },
  {
    "id": "edb-PcPe0P5",
    "name": "Cable Rope Hammer Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/PcPe0P5.gif"
  },
  {
    "id": "edb-DU5Kkj2",
    "name": "Dumbbell Standing One Arm Reverse Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/DU5Kkj2.gif"
  },
  {
    "id": "edb-sJFIDIp",
    "name": "Biceps Leg Concentration Curl",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/sJFIDIp.gif"
  },
  {
    "id": "edb-2NpxjC1",
    "name": "Dumbbell Hammer Curl V. 2",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/2NpxjC1.gif"
  },
  {
    "id": "edb-P2lNrGL",
    "name": "Cable Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/P2lNrGL.gif"
  },
  {
    "id": "edb-e4ojVhP",
    "name": "Dumbbell Revers Grip Biceps Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/e4ojVhP.gif"
  },
  {
    "id": "edb-4KJEpzb",
    "name": "Kettlebell Bottoms Up Clean From the Hang Position",
    "defaultUnit": "sec",
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
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/4KJEpzb.gif"
  },
  {
    "id": "edb-P2nRiUa",
    "name": "Dumbbell Standing Zottman Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/P2nRiUa.gif"
  },
  {
    "id": "edb-O8Aq69u",
    "name": "Dumbbell Reverse Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/O8Aq69u.gif"
  },
  {
    "id": "edb-7inpWch",
    "name": "Dumbbell Standing Concentration Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/7inpWch.gif"
  },
  {
    "id": "edb-0IgNjSM",
    "name": "Dumbbell Standing Reverse Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/0IgNjSM.gif"
  },
  {
    "id": "edb-8oYqOt9",
    "name": "Cable Seated Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/8oYqOt9.gif"
  },
  {
    "id": "edb-ByX0WxV",
    "name": "Dumbbell Incline Hammer Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/ByX0WxV.gif"
  },
  {
    "id": "edb-xNrS20v",
    "name": "Barbell Reverse Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/xNrS20v.gif"
  },
  {
    "id": "edb-BKa8dmT",
    "name": "Dumbbell Over Bench Neutral Wrist Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/BKa8dmT.gif"
  },
  {
    "id": "edb-WgJnBH5",
    "name": "Dumbbell Seated Biceps Curl (on Stability Ball)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/WgJnBH5.gif"
  },
  {
    "id": "edb-nlJsbkW",
    "name": "Dumbbell Biceps Curl (with Arm Blaster)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/nlJsbkW.gif"
  },
  {
    "id": "edb-NvfE43H",
    "name": "Cable Concentration Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/NvfE43H.gif"
  },
  {
    "id": "edb-3omWx6P",
    "name": "Band Alternating Biceps Curl",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/3omWx6P.gif"
  },
  {
    "id": "edb-tJ5nYqo",
    "name": "Ez-bar Biceps Curl (with Arm Blaster)",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/tJ5nYqo.gif"
  },
  {
    "id": "edb-LeaZOIz",
    "name": "Dumbbell Standing Alternate Hammer Curl and Press",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/LeaZOIz.gif"
  },
  {
    "id": "edb-4dF3maG",
    "name": "Dumbbell One Arm Hammer Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/4dF3maG.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/25GPyDY.gif"
  },
  {
    "id": "edb-2NImIAG",
    "name": "Dumbbell Bicep Curl on Exercise Ball with Leg Raised",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/2NImIAG.gif"
  },
  {
    "id": "edb-7D5bgLT",
    "name": "Dumbbell Seated Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/7D5bgLT.gif"
  },
  {
    "id": "edb-6em2Dxj",
    "name": "Dumbbell Alternate Seated Hammer Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/6em2Dxj.gif"
  },
  {
    "id": "edb-Dsfz0Id",
    "name": "Ez Bar Seated Close Grip Concentration Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Dsfz0Id.gif"
  },
  {
    "id": "edb-Zwiw7XR",
    "name": "Dumbbell Alternating Bicep Curl with Leg Raised on Exercise Ball",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Zwiw7XR.gif"
  },
  {
    "id": "edb-jtFKbt5",
    "name": "Ez Barbell Seated Curls",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/jtFKbt5.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/G08RZcQ.gif"
  },
  {
    "id": "edb-Ye5Qxb0",
    "name": "Ez Barbell Spider Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Ye5Qxb0.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/slDvUAU.gif"
  },
  {
    "id": "edb-sxY5Biu",
    "name": "Dumbbell One Arm Zottman Preacher Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/sxY5Biu.gif"
  },
  {
    "id": "edb-50BETrz",
    "name": "Biceps Narrow Pull-ups",
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
    "aliases": [],
    "tags": [
      "isolation",
      "bodyweight"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/50BETrz.gif"
  },
  {
    "id": "edb-HDYiZcY",
    "name": "Dumbbell Cross Body Hammer Curl V. 2",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/HDYiZcY.gif"
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/HPlPoQA.gif"
  },
  {
    "id": "edb-zILLZ98",
    "name": "Smith Machine Bicep Curl",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/zILLZ98.gif"
  },
  {
    "id": "edb-qAmNMJY",
    "name": "Dumbbell High Curl",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/qAmNMJY.gif"
  },
  {
    "id": "edb-M8IolhQ",
    "name": "Ez Barbell Close Grip Preacher Curl - Precision Variation",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/M8IolhQ.gif"
  },
  {
    "id": "edb-8yBgwBS",
    "name": "Cable Concentration Curl Tempo",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/8yBgwBS.gif"
  },
  {
    "id": "edb-EqHIIjJ",
    "name": "Barbell Reverse Preacher Curl Inclined",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/EqHIIjJ.gif"
  },
  {
    "id": "edb-7y9JIMj",
    "name": "Lever Reverse Grip Preacher Curl with Precision",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/7y9JIMj.gif"
  },
  {
    "id": "edb-Um8xUAc",
    "name": "Barbell Prone Incline Curl with Intensive",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/Um8xUAc.gif"
  },
  {
    "id": "edb-AdxxqfF",
    "name": "Barbell Standing Reverse Grip Curl Resistance",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/AdxxqfF.gif"
  },
  {
    "id": "edb-XE93sQZ",
    "name": "Dumbbell Step Up Single Leg Balance with Bicep Curl - Chair Variation",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": [
        "QUADS",
        "GLUTES",
        "HAMSTRINGS"
      ],
      "targetRaw": [
        "biceps"
      ],
      "secondaryRaw": [
        "quadriceps",
        "glutes",
        "hamstrings"
      ]
    },
    "equipment": [
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/XE93sQZ.gif"
  },
  {
    "id": "edb-xmWQIlT",
    "name": "Hold Style Dumbbell Alternating Seated Bicep Curl on Exercise Ball",
    "defaultUnit": "sec",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/xmWQIlT.gif"
  },
  {
    "id": "edb-QQwxa8g",
    "name": "Intermediate Style Dumbbell Preacher Curl Over Exercise Ball",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/QQwxa8g.gif"
  },
  {
    "id": "edb-XqYQ9JA",
    "name": "Dumbbell One Arm Prone Hammer Curl - Macro Variation",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/XqYQ9JA.gif"
  },
  {
    "id": "edb-79AmJsI",
    "name": "Dumbbell Hammer Curl with Traditional",
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
    "aliases": [],
    "tags": [
      "isolation"
    ],
    "movement": "arms",
    "gifUrl": "https://static.exercisedb.dev/media/79AmJsI.gif"
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
    "id": "edb-hC6oYY5",
    "name": "Assisted Side Lying Adductor Stretch",
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/hC6oYY5.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "legs"
    ],
    "movement": "legs",
    "gifUrl": "https://static.exercisedb.dev/media/oHsrypV.gif"
  },
  {
    "id": "edb-c8f5cSY",
    "name": "Side Lying Hip Adduction (male)",
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
        "adductors"
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
    "gifUrl": "https://static.exercisedb.dev/media/c8f5cSY.gif"
  },
  {
    "id": "edb-bWlZvXh",
    "name": "Butterfly Yoga Pose",
    "defaultUnit": "reps",
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
    "movement": "legs",
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
    "id": "edb-wnEscH8",
    "name": "Barbell Press Sit-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "CHEST"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "chest"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/wnEscH8.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/IpONWYv.gif"
  },
  {
    "id": "edb-REXmfVC",
    "name": "Sledge Hammer",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "FOREARMS",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "forearms",
        "shoulders"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/REXmfVC.gif"
  },
  {
    "id": "edb-Kzg30R7",
    "name": "Band Standing Crunch",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/Kzg30R7.gif"
  },
  {
    "id": "edb-8xUv4J7",
    "name": "Cable Seated Crunch",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/8xUv4J7.gif"
  },
  {
    "id": "edb-qFpAkpP",
    "name": "Cable Standing Lift",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/qFpAkpP.gif"
  },
  {
    "id": "edb-CI6baTY",
    "name": "Bottoms-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/CI6baTY.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/VBAWRPG.gif"
  },
  {
    "id": "edb-03lzqwk",
    "name": "Assisted Hanging Knee Raise",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/03lzqwk.gif"
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
    "id": "edb-BMMolZ3",
    "name": "Tuck Crunch",
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
    "gifUrl": "https://static.exercisedb.dev/media/BMMolZ3.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/5VXmnV5.gif"
  },
  {
    "id": "edb-2Ryn564",
    "name": "Assisted Prone Rectus Femoris Stretch",
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
        "quadriceps"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/2Ryn564.gif"
  },
  {
    "id": "edb-OaE7CpD",
    "name": "Kettlebell Double Windmill",
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
      "kettlebell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/OaE7CpD.gif"
  },
  {
    "id": "edb-Wgaz7pm",
    "name": "Lever Seated Crunch",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/Wgaz7pm.gif"
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
    "aliases": [],
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
    "aliases": [],
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
    "id": "edb-8K0w2yA",
    "name": "Assisted Hanging Knee Raise with Throw Down",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/8K0w2yA.gif"
  },
  {
    "id": "edb-YRaCa5Y",
    "name": "Full Maltese",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "CHEST"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "chest"
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
    "gifUrl": "https://static.exercisedb.dev/media/YRaCa5Y.gif"
  },
  {
    "id": "edb-UGhRD1A",
    "name": "Assisted Lying Leg Raise with Lateral Throw Down",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "OBLIQUES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors",
        "obliques"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/UGhRD1A.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/ZNgOYQU.gif"
  },
  {
    "id": "edb-WCAvOfC",
    "name": "Side-to-side Toe Touch (male)",
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
    "gifUrl": "https://static.exercisedb.dev/media/WCAvOfC.gif"
  },
  {
    "id": "edb-VX5YKR5",
    "name": "Assisted Lying Leg Raise with Throw Down",
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
        "hip flexors",
        "quadriceps"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/VX5YKR5.gif"
  },
  {
    "id": "edb-Qoujh3Q",
    "name": "Wind Sprints",
    "defaultUnit": "reps",
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
        "abs"
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
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/Qoujh3Q.gif"
  },
  {
    "id": "edb-fhZQPlV",
    "name": "Cable Twist (up-down)",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/fhZQPlV.gif"
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/wPypxFY.gif"
  },
  {
    "id": "edb-XeMvLgE",
    "name": "Roller Body Saw",
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
        "triceps",
        "core"
      ]
    },
    "equipment": [
      "ab wheel"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/XeMvLgE.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/mbkgB44.gif"
  },
  {
    "id": "edb-xnInPfE",
    "name": "Barbell Standing Ab Rollerout",
    "defaultUnit": "reps",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/xnInPfE.gif"
  },
  {
    "id": "edb-xmM75XG",
    "name": "Weighted Overhead Crunch (on Stability Ball)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/xmM75XG.gif"
  },
  {
    "id": "edb-KtRomty",
    "name": "Standing Wheel Rollerout",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "BACK",
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "lower back",
        "shoulders"
      ]
    },
    "equipment": [
      "ab wheel"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/KtRomty.gif"
  },
  {
    "id": "edb-tZkGYZ9",
    "name": "Band Bicycle Crunch",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "OBLIQUES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "hip flexors",
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
      "bodyweight",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/tZkGYZ9.gif"
  },
  {
    "id": "edb-75Bgtjy",
    "name": "Potty Squat",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "QUADS",
        "GLUTES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "quadriceps",
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
    "gifUrl": "https://static.exercisedb.dev/media/75Bgtjy.gif"
  },
  {
    "id": "edb-AQIhRjM",
    "name": "Lying Elbow to Knee",
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
    "gifUrl": "https://static.exercisedb.dev/media/AQIhRjM.gif"
  },
  {
    "id": "edb-RqOtqD7",
    "name": "Cable Reverse Crunch",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/RqOtqD7.gif"
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
    "aliases": [],
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
    "id": "edb-HfqciZF",
    "name": "Straddle Maltese",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "CHEST"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "chest"
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
    "gifUrl": "https://static.exercisedb.dev/media/HfqciZF.gif"
  },
  {
    "id": "edb-qcNN2FN",
    "name": "Butt-ups",
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
    "gifUrl": "https://static.exercisedb.dev/media/qcNN2FN.gif"
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
    "id": "edb-SLKj2pX",
    "name": "Cocoons",
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
    "gifUrl": "https://static.exercisedb.dev/media/SLKj2pX.gif"
  },
  {
    "id": "edb-jTkSc6o",
    "name": "Side Hip (on Parallel Bars)",
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
    "gifUrl": "https://static.exercisedb.dev/media/jTkSc6o.gif"
  },
  {
    "id": "edb-qaZVsGk",
    "name": "Alternate Heel Touchers",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/qaZVsGk.gif"
  },
  {
    "id": "edb-TXtXc84",
    "name": "Cable Tuck Reverse Crunch",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/TXtXc84.gif"
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
    "id": "edb-AR0ig3o",
    "name": "Flexion Leg Sit Up (bent Knee)",
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
    "gifUrl": "https://static.exercisedb.dev/media/AR0ig3o.gif"
  },
  {
    "id": "edb-eXFXCY0",
    "name": "Lever Seated Crunch V. 2",
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
        "hip flexors"
      ]
    },
    "equipment": [
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/eXFXCY0.gif"
  },
  {
    "id": "edb-yT9tk17",
    "name": "Twisted Leg Raise (female)",
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
    "gifUrl": "https://static.exercisedb.dev/media/yT9tk17.gif"
  },
  {
    "id": "edb-s34Y4LR",
    "name": "Weighted Seated Twist (on Stability Ball)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/s34Y4LR.gif"
  },
  {
    "id": "edb-pQ0Mx1Z",
    "name": "Flag",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/pQ0Mx1Z.gif"
  },
  {
    "id": "edb-Gxg9lDc",
    "name": "Barbell Rollerout From Bench",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/Gxg9lDc.gif"
  },
  {
    "id": "edb-kjJ3VoQ",
    "name": "Crunch (hands Overhead)",
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
    "gifUrl": "https://static.exercisedb.dev/media/kjJ3VoQ.gif"
  },
  {
    "id": "edb-RKjH6Lt",
    "name": "Side Bridge V. 2",
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
    "gifUrl": "https://static.exercisedb.dev/media/RKjH6Lt.gif"
  },
  {
    "id": "edb-UVL20oz",
    "name": "Otis Up",
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
    "gifUrl": "https://static.exercisedb.dev/media/UVL20oz.gif"
  },
  {
    "id": "edb-rQhGcin",
    "name": "Frog Planche",
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
    "gifUrl": "https://static.exercisedb.dev/media/rQhGcin.gif"
  },
  {
    "id": "edb-R1WYG5D",
    "name": "Suspended Reverse Crunch",
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
    "gifUrl": "https://static.exercisedb.dev/media/R1WYG5D.gif"
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/I3tsCnC.gif"
  },
  {
    "id": "edb-9c6T1YX",
    "name": "Bridge - Mountain Climber (cross Body)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "GLUTES",
        "QUADS",
        "HAMSTRINGS",
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "glutes",
        "quadriceps",
        "hamstrings",
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
    "gifUrl": "https://static.exercisedb.dev/media/9c6T1YX.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/6ZCiYWQ.gif"
  },
  {
    "id": "edb-PQ2AtC3",
    "name": "Lever Seated Leg Raise Crunch",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/PQ2AtC3.gif"
  },
  {
    "id": "edb-1IG6gVF",
    "name": "Prone Twist on Stability Ball",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/1IG6gVF.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/1ZFqTDN.gif"
  },
  {
    "id": "edb-euq4pwp",
    "name": "Band Standing Twisting Crunch",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/euq4pwp.gif"
  },
  {
    "id": "edb-Bn6TXyO",
    "name": "Sit-up V. 2",
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
    "gifUrl": "https://static.exercisedb.dev/media/Bn6TXyO.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/196HJGw.gif"
  },
  {
    "id": "edb-OyoZ3Pu",
    "name": "Leg Pull in Flat Bench",
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
    "gifUrl": "https://static.exercisedb.dev/media/OyoZ3Pu.gif"
  },
  {
    "id": "edb-d9Xaxq6",
    "name": "Cable Russian Twists (on Stability Ball)",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/d9Xaxq6.gif"
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/ZuXu4Eq.gif"
  },
  {
    "id": "edb-225x2Vd",
    "name": "Band Kneeling Twisting Crunch",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/225x2Vd.gif"
  },
  {
    "id": "edb-2jl9K55",
    "name": "Spine Twist",
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
    "gifUrl": "https://static.exercisedb.dev/media/2jl9K55.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/UpWmA5E.gif"
  },
  {
    "id": "edb-jCrtE9b",
    "name": "One Arm Slam (with Medicine Ball)",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "back"
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
    "gifUrl": "https://static.exercisedb.dev/media/jCrtE9b.gif"
  },
  {
    "id": "edb-jpgqxiS",
    "name": "Cable Standing Crunch",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/jpgqxiS.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/4Ml7QFO.gif"
  },
  {
    "id": "edb-aumB2IV",
    "name": "Assisted Sit-up",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/aumB2IV.gif"
  },
  {
    "id": "edb-xgsGFVM",
    "name": "Crab Twist Toe Touch",
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
    "gifUrl": "https://static.exercisedb.dev/media/xgsGFVM.gif"
  },
  {
    "id": "edb-dTg95eZ",
    "name": "Knee Touch Crunch",
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
    "gifUrl": "https://static.exercisedb.dev/media/dTg95eZ.gif"
  },
  {
    "id": "edb-q2ADGqV",
    "name": "Cable Side Crunch",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/q2ADGqV.gif"
  },
  {
    "id": "edb-Gn5FwYT",
    "name": "Stability Ball Crunch (full Range Hands Behind Head)",
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
    "gifUrl": "https://static.exercisedb.dev/media/Gn5FwYT.gif"
  },
  {
    "id": "edb-KCBKjma",
    "name": "Band Jack Knife Sit-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/KCBKjma.gif"
  },
  {
    "id": "edb-9ZGZuOD",
    "name": "Incline Twisting Sit-up",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/9ZGZuOD.gif"
  },
  {
    "id": "edb-kjE55n5",
    "name": "Kettlebell Bent Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS",
        "OBLIQUES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps",
        "obliques"
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
    "gifUrl": "https://static.exercisedb.dev/media/kjE55n5.gif"
  },
  {
    "id": "edb-UEjSrKI",
    "name": "Cable Seated Twist",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/UEjSrKI.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/CosupLu.gif"
  },
  {
    "id": "edb-Sn8wxAI",
    "name": "Crunch (on Stability Ball, Arms Straight)",
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
    "gifUrl": "https://static.exercisedb.dev/media/Sn8wxAI.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/Hy9D21L.gif"
  },
  {
    "id": "edb-MvQPqVW",
    "name": "Cable Judo Flip",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/MvQPqVW.gif"
  },
  {
    "id": "edb-CqhoytW",
    "name": "Smith Hip Raise",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/CqhoytW.gif"
  },
  {
    "id": "edb-g2oKspu",
    "name": "Curl-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/g2oKspu.gif"
  },
  {
    "id": "edb-dFSNDOA",
    "name": "Barbell Seated Twist",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/dFSNDOA.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/QYysSLV.gif"
  },
  {
    "id": "edb-UQr48Oi",
    "name": "Pull-in (on Stability Ball)",
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
    "gifUrl": "https://static.exercisedb.dev/media/UQr48Oi.gif"
  },
  {
    "id": "edb-X3TCNEU",
    "name": "Suspended Abdominal Fallout",
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
    "gifUrl": "https://static.exercisedb.dev/media/X3TCNEU.gif"
  },
  {
    "id": "edb-uWpxD4v",
    "name": "Arm Slingers Hanging Bent Knee Legs",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "back"
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
    "gifUrl": "https://static.exercisedb.dev/media/uWpxD4v.gif"
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
    "id": "edb-WU9BLIs",
    "name": "Weighted Russian Twist (legs Up)",
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
        "hip flexors"
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
    "gifUrl": "https://static.exercisedb.dev/media/WU9BLIs.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/NAgVB3t.gif"
  },
  {
    "id": "edb-hCjGsRQ",
    "name": "Power Point Plank",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS",
        "GLUTES"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps",
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
    "gifUrl": "https://static.exercisedb.dev/media/hCjGsRQ.gif"
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
    "id": "edb-mWppALS",
    "name": "Groin Crunch",
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
        "hip flexors",
        "inner thighs"
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
    "gifUrl": "https://static.exercisedb.dev/media/mWppALS.gif"
  },
  {
    "id": "edb-Y9hNPcN",
    "name": "Seated Side Crunch (wall)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/Y9hNPcN.gif"
  },
  {
    "id": "edb-mgejmGP",
    "name": "Prisoner Half Sit-up (male)",
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
    "gifUrl": "https://static.exercisedb.dev/media/mgejmGP.gif"
  },
  {
    "id": "edb-SKXQAx3",
    "name": "Roller Reverse Crunch",
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
      "ab wheel"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/SKXQAx3.gif"
  },
  {
    "id": "edb-p9cCe2r",
    "name": "Spell Caster",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/p9cCe2r.gif"
  },
  {
    "id": "edb-Hgs6Nl1",
    "name": "Seated Leg Raise",
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
    "gifUrl": "https://static.exercisedb.dev/media/Hgs6Nl1.gif"
  },
  {
    "id": "edb-zhF9lW4",
    "name": "Band Assisted Wheel Rollerout",
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
    "gifUrl": "https://static.exercisedb.dev/media/zhF9lW4.gif"
  },
  {
    "id": "edb-bmwlYvD",
    "name": "Gorilla Chin",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "FOREARMS",
        "BICEPS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "forearms",
        "biceps"
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
    "gifUrl": "https://static.exercisedb.dev/media/bmwlYvD.gif"
  },
  {
    "id": "edb-r7cT9YD",
    "name": "Assisted Motion Russian Twist",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/r7cT9YD.gif"
  },
  {
    "id": "edb-zFzbBfL",
    "name": "Band Push Sit-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "CHEST"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "chest"
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
    "gifUrl": "https://static.exercisedb.dev/media/zFzbBfL.gif"
  },
  {
    "id": "edb-S1JXDAG",
    "name": "Band Seated Twist",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/S1JXDAG.gif"
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
    "id": "edb-1GPHRyK",
    "name": "Janda Sit-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/1GPHRyK.gif"
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
    "aliases": [],
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
    "id": "edb-ErqK3UL",
    "name": "Posterior Step to Overhead Reach",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "GLUTES",
        "HAMSTRINGS",
        "QUADS",
        "POSTERIOR_DELT"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "glutes",
        "hamstrings",
        "quadriceps",
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
    "gifUrl": "https://static.exercisedb.dev/media/ErqK3UL.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/aVs3BR3.gif"
  },
  {
    "id": "edb-bbLR7fB",
    "name": "Band Lying Straight Leg Raise",
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
    "gifUrl": "https://static.exercisedb.dev/media/bbLR7fB.gif"
  },
  {
    "id": "edb-6bOA1Oi",
    "name": "Weighted Side Bend (on Stability Ball)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/6bOA1Oi.gif"
  },
  {
    "id": "edb-7M66AVi",
    "name": "Barbell Rollerout",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/7M66AVi.gif"
  },
  {
    "id": "edb-KhHJ338",
    "name": "Push-up to Side Plank",
    "defaultUnit": "sec",
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
    "gifUrl": "https://static.exercisedb.dev/media/KhHJ338.gif"
  },
  {
    "id": "edb-QOA0FD0",
    "name": "Weighted Hanging Leg-hip Raise",
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
      "dumbbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/QOA0FD0.gif"
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
    "aliases": [],
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
    "id": "edb-i4JkUaL",
    "name": "Barbell Side Bent V. 2",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/i4JkUaL.gif"
  },
  {
    "id": "edb-pj0X0tF",
    "name": "Hanging Straight Leg Hip Raise",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/pj0X0tF.gif"
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
    "id": "edb-G7xoEzr",
    "name": "Barbell Sitted Alternate Leg Raise",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/G7xoEzr.gif"
  },
  {
    "id": "edb-iQ241UP",
    "name": "Half Sit-up (male)",
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
    "gifUrl": "https://static.exercisedb.dev/media/iQ241UP.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/yRpV5TC.gif"
  },
  {
    "id": "edb-szIn2UK",
    "name": "Negative Crunch",
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
    "gifUrl": "https://static.exercisedb.dev/media/szIn2UK.gif"
  },
  {
    "id": "edb-2gPfomN",
    "name": "3/4 Sit-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/2gPfomN.gif"
  },
  {
    "id": "edb-KZn52RC",
    "name": "Flexion Leg Sit Up (straight Arm)",
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
        "hip flexors",
        "quadriceps"
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
    "gifUrl": "https://static.exercisedb.dev/media/KZn52RC.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/fZFZ704.gif"
  },
  {
    "id": "edb-PXTIwgu",
    "name": "Arm Slingers Hanging Straight Legs",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "back"
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
    "gifUrl": "https://static.exercisedb.dev/media/PXTIwgu.gif"
  },
  {
    "id": "edb-yQe5HpE",
    "name": "Barbell Standing Twist",
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
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/yQe5HpE.gif"
  },
  {
    "id": "edb-sZOR9EV",
    "name": "Lever Kneeling Twist",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/sZOR9EV.gif"
  },
  {
    "id": "edb-eVxAzgz",
    "name": "Incline Leg Hip Raise (leg Straight)",
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
    "gifUrl": "https://static.exercisedb.dev/media/eVxAzgz.gif"
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/weoDEpH.gif"
  },
  {
    "id": "edb-Q6bvyen",
    "name": "Hanging Straight Twisting Leg Hip Raise",
    "defaultUnit": "sec",
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
    "gifUrl": "https://static.exercisedb.dev/media/Q6bvyen.gif"
  },
  {
    "id": "edb-ZnJHhMk",
    "name": "Lever Seated Crunch (chest Pad)",
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
      "machine"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/ZnJHhMk.gif"
  },
  {
    "id": "edb-cJgSTmh",
    "name": "Oblique Crunch V. 2",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/cJgSTmh.gif"
  },
  {
    "id": "edb-FFRP97T",
    "name": "Frog Crunch",
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
    "gifUrl": "https://static.exercisedb.dev/media/FFRP97T.gif"
  },
  {
    "id": "edb-BCs0G2F",
    "name": "Barbell Sitted Alternate Leg Raise (female)",
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
        "hip flexors",
        "quadriceps"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/BCs0G2F.gif"
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
    "id": "edb-jvp6DiD",
    "name": "Elbow-to-knee",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/jvp6DiD.gif"
  },
  {
    "id": "edb-YIUAtYf",
    "name": "Weighted Russian Twist V. 2",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/YIUAtYf.gif"
  },
  {
    "id": "edb-C0eCeEt",
    "name": "Twisted Leg Raise",
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
    "gifUrl": "https://static.exercisedb.dev/media/C0eCeEt.gif"
  },
  {
    "id": "edb-qatbkEd",
    "name": "Cable Side Bend Crunch (bosu Ball)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/qatbkEd.gif"
  },
  {
    "id": "edb-XU3ePuv",
    "name": "Cable Standing Crunch (with Rope Attachment)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/XU3ePuv.gif"
  },
  {
    "id": "edb-Kal9cQQ",
    "name": "Kettlebell Advanced Windmill",
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
    "gifUrl": "https://static.exercisedb.dev/media/Kal9cQQ.gif"
  },
  {
    "id": "edb-enxnJcM",
    "name": "Quarter Sit-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/enxnJcM.gif"
  },
  {
    "id": "edb-TV87DNB",
    "name": "Inchworm V. 2",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/TV87DNB.gif"
  },
  {
    "id": "edb-h1ezqSu",
    "name": "Kneeling Plank Tap Shoulder (male)",
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
    "id": "edb-BL3GHeY",
    "name": "Straddle Planche",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "TRICEPS",
        "CHEST"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "triceps",
        "chest"
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
    "gifUrl": "https://static.exercisedb.dev/media/BL3GHeY.gif"
  },
  {
    "id": "edb-L4ay0PW",
    "name": "Kettlebell Figure 8",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "FOREARMS"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "forearms"
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
    "gifUrl": "https://static.exercisedb.dev/media/L4ay0PW.gif"
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
    "aliases": [],
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/XVDdcoj.gif"
  },
  {
    "id": "edb-NAkmgdx",
    "name": "Arms Overhead Full Sit-up (male)",
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
    "gifUrl": "https://static.exercisedb.dev/media/NAkmgdx.gif"
  },
  {
    "id": "edb-CUmLRTA",
    "name": "Cable Kneeling Crunch - Gentle Variation",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/CUmLRTA.gif"
  },
  {
    "id": "edb-3pqGMQj",
    "name": "Band Alternating V-up with Simple",
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
    "gifUrl": "https://static.exercisedb.dev/media/3pqGMQj.gif"
  },
  {
    "id": "edb-gdPIyyO",
    "name": "Hanging Pike with Intense",
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
    "gifUrl": "https://static.exercisedb.dev/media/gdPIyyO.gif"
  },
  {
    "id": "edb-vN5HB0s",
    "name": "Blunt Cable Standing Crunch",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/vN5HB0s.gif"
  },
  {
    "id": "edb-xcLntTC",
    "name": "Slow Leg Pull in Flat Bench",
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
    "gifUrl": "https://static.exercisedb.dev/media/xcLntTC.gif"
  },
  {
    "id": "edb-HZgQPxh",
    "name": "Suspended Abdominal Fallout - Inclined Variation",
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
    "gifUrl": "https://static.exercisedb.dev/media/HZgQPxh.gif"
  },
  {
    "id": "edb-58rdhvL",
    "name": "Narrow Style Band Jack Knife Sit-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/58rdhvL.gif"
  },
  {
    "id": "edb-8gQo5Ss",
    "name": "Single Style Cable Standing Crunch (with Rope Attachment)",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "cardio"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/8gQo5Ss.gif"
  },
  {
    "id": "edb-PKlXuJW",
    "name": "Rough Band Push Sit-up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": [
        "ANTERIOR_DELT",
        "CHEST"
      ],
      "targetRaw": [
        "abs"
      ],
      "secondaryRaw": [
        "shoulders",
        "chest"
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
    "gifUrl": "https://static.exercisedb.dev/media/PKlXuJW.gif"
  },
  {
    "id": "edb-UOphC6N",
    "name": "Cable Side Bend Smooth",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/UOphC6N.gif"
  },
  {
    "id": "edb-7i4msxz",
    "name": "Cocoons with Mega",
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
    "gifUrl": "https://static.exercisedb.dev/media/7i4msxz.gif"
  },
  {
    "id": "edb-6Wr0F3W",
    "name": "Rounded Twisted Leg Raise (female)",
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
    "gifUrl": "https://static.exercisedb.dev/media/6Wr0F3W.gif"
  },
  {
    "id": "edb-Sa8mzWc",
    "name": "Hanging Pike Weak",
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
    "gifUrl": "https://static.exercisedb.dev/media/Sa8mzWc.gif"
  },
  {
    "id": "edb-IxsFgRT",
    "name": "Cable Judo Flip with Static",
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
      "cable"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/IxsFgRT.gif"
  },
  {
    "id": "edb-mpYUPkA",
    "name": "Lying Leg-hip Raise - Contracted Variation",
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
    "gifUrl": "https://static.exercisedb.dev/media/mpYUPkA.gif"
  },
  {
    "id": "edb-ntjtCfu",
    "name": "Barbell Sitted Alternate Leg Raise (female) with Intermediate",
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
        "hip flexors",
        "quadriceps"
      ]
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/ntjtCfu.gif"
  },
  {
    "id": "edb-kk39rUy",
    "name": "Push-up to Side Plank - Athletic Variation",
    "defaultUnit": "sec",
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
    "gifUrl": "https://static.exercisedb.dev/media/kk39rUy.gif"
  },
  {
    "id": "edb-L68dTQj",
    "name": "Band Seated Twist Pure",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/L68dTQj.gif"
  },
  {
    "id": "edb-6vcvsLS",
    "name": "Hanging Straight Leg Raise with Elevated",
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
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/6vcvsLS.gif"
  },
  {
    "id": "edb-WFucoe6",
    "name": "Hanging Straight Twisting Leg Hip Raise with Compound",
    "defaultUnit": "sec",
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
    "gifUrl": "https://static.exercisedb.dev/media/WFucoe6.gif"
  },
  {
    "id": "edb-gSO0KpB",
    "name": "Sit-up with Arms on Chest with Mini",
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
    "gifUrl": "https://static.exercisedb.dev/media/gSO0KpB.gif"
  },
  {
    "id": "edb-tuIZFDt",
    "name": "Intermediate Style Kneeling Plank Tap Shoulder (male)",
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
    "gifUrl": "https://static.exercisedb.dev/media/tuIZFDt.gif"
  },
  {
    "id": "edb-UI81amT",
    "name": "Supine Style Band Alternating V-up",
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
    "gifUrl": "https://static.exercisedb.dev/media/UI81amT.gif"
  },
  {
    "id": "edb-4QqYaJW",
    "name": "Gentle Prone Twist on Stability Ball",
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
      "bodyweight"
    ],
    "aliases": [],
    "tags": [
      "isolation",
      "core",
      "bodyweight"
    ],
    "movement": "core",
    "gifUrl": "https://static.exercisedb.dev/media/4QqYaJW.gif"
  },
  {
    "id": "edb-kLiIFdB",
    "name": "Band Vertical Pallof Press - Seated Variation",
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
    "gifUrl": "https://static.exercisedb.dev/media/kLiIFdB.gif"
  },
  {
    "id": "edb-lFBTISi",
    "name": "Firm Style Hanging Oblique Knee Raise",
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
    "gifUrl": "https://static.exercisedb.dev/media/lFBTISi.gif"
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
    "aliases": [],
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
    "id": "edb-WL4EmxJ",
    "name": "Side Bridge Hip Abduction",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "OBLIQUES"
      ],
      "targetRaw": [
        "abductors"
      ],
      "secondaryRaw": [
        "glutes",
        "obliques"
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
    "gifUrl": "https://static.exercisedb.dev/media/WL4EmxJ.gif"
  },
  {
    "id": "edb-7WaDzyL",
    "name": "Side Hip Abduction",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES"
      ],
      "secondary": [
        "QUADS"
      ],
      "targetRaw": [
        "abductors"
      ],
      "secondaryRaw": [
        "glutes",
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
    "gifUrl": "https://static.exercisedb.dev/media/7WaDzyL.gif"
  },
  {
    "id": "edb-mQ1tBXn",
    "name": "Straight Leg Outer Hip Abductor",
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
    "gifUrl": "https://static.exercisedb.dev/media/mQ1tBXn.gif"
  },
  {
    "id": "edb-Qj0HRAZ",
    "name": "Fast Style Resistance Band Seated Hip Abduction",
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
    "gifUrl": "https://static.exercisedb.dev/media/Qj0HRAZ.gif"
  },
  {
    "id": "custom-clean",
    "name": "Clean",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "power clean",
      "squat clean"
    ],
    "tags": [
      "compound",
      "olympic"
    ],
    "movement": "legs"
  },
  {
    "id": "custom-clean-hang",
    "name": "Hang Clean",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "hang power clean"
    ],
    "tags": [
      "compound",
      "olympic"
    ],
    "movement": "legs"
  },
  {
    "id": "custom-snatch",
    "name": "Snatch",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "BACK",
        "ANTERIOR_DELT"
      ],
      "secondary": []
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "power snatch",
      "squat snatch"
    ],
    "tags": [
      "compound",
      "olympic"
    ],
    "movement": "legs"
  },
  {
    "id": "custom-clean-jerk",
    "name": "Clean and Jerk",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "BACK",
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "secondary": []
    },
    "equipment": [
      "barbell"
    ],
    "aliases": [
      "clean & jerk",
      "c&j"
    ],
    "tags": [
      "compound",
      "olympic"
    ],
    "movement": "legs"
  },
  {
    "id": "custom-thruster",
    "name": "Thruster",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "ANTERIOR_DELT",
        "TRICEPS"
      ],
      "secondary": []
    },
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "aliases": [
      "thrusters",
      "squat to press"
    ],
    "tags": [
      "compound",
      "olympic"
    ],
    "movement": "legs"
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
      "split jerk"
    ],
    "tags": [
      "compound",
      "olympic"
    ],
    "movement": "shoulders"
  },
  {
    "id": "custom-kb-swing",
    "name": "Kettlebell Swing",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES",
        "HAMSTRINGS",
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [
      "kb swing",
      "russian swing",
      "american swing"
    ],
    "tags": [
      "compound",
      "legs"
    ],
    "movement": "legs"
  },
  {
    "id": "custom-kb-snatch",
    "name": "Kettlebell Snatch",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "GLUTES",
        "BACK",
        "ANTERIOR_DELT"
      ],
      "secondary": []
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [
      "kb snatch"
    ],
    "tags": [
      "compound",
      "olympic"
    ],
    "movement": "legs"
  },
  {
    "id": "custom-kb-clean-press",
    "name": "Kettlebell Clean and Press",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT",
        "GLUTES",
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "kettlebell"
    ],
    "aliases": [
      "kb clean press"
    ],
    "tags": [
      "compound"
    ],
    "movement": "shoulders"
  },
  {
    "id": "custom-turkish-getup",
    "name": "Turkish Get Up",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS",
        "ANTERIOR_DELT",
        "GLUTES"
      ],
      "secondary": []
    },
    "equipment": [
      "kettlebell",
      "dumbbell"
    ],
    "aliases": [
      "tgu",
      "turkish getup"
    ],
    "tags": [
      "compound"
    ],
    "movement": "core"
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
      "sled drive"
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
    "id": "custom-tire-flip",
    "name": "Tire Flip",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK",
        "QUADS",
        "GLUTES"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "tire flips"
    ],
    "tags": [
      "compound"
    ],
    "movement": "legs"
  },
  {
    "id": "custom-battle-rope",
    "name": "Battle Ropes",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT",
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "battle rope",
      "rope slams",
      "rope waves"
    ],
    "tags": [
      "cardio",
      "compound"
    ],
    "movement": "cardio"
  },
  {
    "id": "custom-run",
    "name": "Running",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES",
        "GLUTES"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "run",
      "jog",
      "jogging",
      "treadmill run"
    ],
    "tags": [
      "cardio"
    ],
    "movement": "cardio"
  },
  {
    "id": "custom-run-outdoor",
    "name": "Outdoor Running",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES",
        "GLUTES"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "outdoor run",
      "road running",
      "trail running"
    ],
    "tags": [
      "cardio"
    ],
    "movement": "cardio"
  },
  {
    "id": "custom-walk",
    "name": "Walking",
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
      "walk",
      "treadmill walk",
      "incline walk"
    ],
    "tags": [
      "cardio"
    ],
    "movement": "cardio"
  },
  {
    "id": "custom-walk-incline",
    "name": "Incline Walking",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "GLUTES",
        "HAMSTRINGS",
        "CALVES",
        "QUADS"
      ],
      "secondary": []
    },
    "equipment": [
      "machine"
    ],
    "aliases": [
      "incline treadmill",
      "treadmill incline walk"
    ],
    "tags": [
      "cardio"
    ],
    "movement": "cardio"
  },
  {
    "id": "custom-bike-outdoor",
    "name": "Outdoor Cycling",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "HAMSTRINGS",
        "CALVES"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "road bike",
      "bike ride",
      "cycling outdoor"
    ],
    "tags": [
      "cardio"
    ],
    "movement": "cardio"
  },
  {
    "id": "custom-swim",
    "name": "Swimming",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "BACK",
        "CHEST",
        "ANTERIOR_DELT",
        "ABS",
        "QUADS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "swim",
      "laps swimming"
    ],
    "tags": [
      "cardio"
    ],
    "movement": "cardio"
  },
  {
    "id": "custom-swim-laps",
    "name": "Lap Swimming",
    "defaultUnit": "laps",
    "muscles": {
      "primary": [
        "BACK",
        "ANTERIOR_DELT",
        "CHEST",
        "ABS",
        "QUADS"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "swim laps",
      "pool laps"
    ],
    "tags": [
      "cardio"
    ],
    "movement": "cardio"
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
      "trail hike"
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
      "interval sprints"
    ],
    "tags": [
      "cardio",
      "hiit"
    ],
    "movement": "cardio"
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
      "primary": ["BACK", "ANTERIOR_DELT", "ABS", "QUADS", "HAMSTRINGS"],
      "secondary": ["TRICEPS", "BICEPS", "CALVES", "GLUTES"]
    },
    "equipment": [],
    "aliases": ["swim", "laps", "freestyle", "backstroke", "breaststroke", "butterfly", "open water"],
    "tags": ["sport", "cardio"],
    "movement": "sport"
  },
  {
    "id": "sp-cycling",
    "name": "Cycling",
    "defaultUnit": "min",
    "muscles": {
      "primary": ["QUADS", "HAMSTRINGS", "GLUTES", "CALVES"],
      "secondary": ["ABS", "BACK"]
    },
    "equipment": [],
    "aliases": ["biking", "road cycling", "mountain biking", "mtb", "bike ride", "spinning", "indoor cycling", "bmx"],
    "tags": ["sport", "cardio"],
    "movement": "sport"
  },
  {
    "id": "sp-triathlon",
    "name": "Triathlon",
    "defaultUnit": "min",
    "muscles": {
      "primary": ["QUADS", "HAMSTRINGS", "GLUTES", "BACK", "ANTERIOR_DELT"],
      "secondary": ["CALVES", "ABS", "TRICEPS", "BICEPS"]
    },
    "equipment": [],
    "aliases": ["tri", "ironman", "sprint triathlon", "olympic triathlon", "swim bike run"],
    "tags": ["sport", "cardio"],
    "movement": "sport"
  },
  {
    "id": "sp-ice-hockey",
    "name": "Ice Hockey",
    "defaultUnit": "min",
    "muscles": {
      "primary": ["QUADS", "GLUTES", "HAMSTRINGS", "ABS", "ANTERIOR_DELT"],
      "secondary": ["CALVES", "BACK", "FOREARMS"]
    },
    "equipment": [],
    "aliases": ["hockey on ice", "pond hockey", "shinny"],
    "tags": ["sport"],
    "movement": "sport"
  },
  {
    "id": "sp-beach-volleyball",
    "name": "Beach Volleyball",
    "defaultUnit": "min",
    "muscles": {
      "primary": ["QUADS", "GLUTES", "ANTERIOR_DELT", "ABS", "CALVES"],
      "secondary": ["HAMSTRINGS", "BACK", "FOREARMS"]
    },
    "equipment": [],
    "aliases": ["sand volleyball", "beach volley"],
    "tags": ["sport"],
    "movement": "sport"
  },
  {
    "id": "sp-figure-skating",
    "name": "Figure Skating",
    "defaultUnit": "min",
    "muscles": {
      "primary": ["QUADS", "GLUTES", "HAMSTRINGS", "ABS", "CALVES"],
      "secondary": ["BACK", "ANTERIOR_DELT"]
    },
    "equipment": [],
    "aliases": ["ice skating", "skating"],
    "tags": ["sport"],
    "movement": "sport"
  },
  {
    "id": "sp-speed-skating",
    "name": "Speed Skating",
    "defaultUnit": "min",
    "muscles": {
      "primary": ["QUADS", "GLUTES", "HAMSTRINGS", "CALVES", "ABS"],
      "secondary": ["BACK"]
    },
    "equipment": [],
    "aliases": ["short track", "long track", "inline skating"],
    "tags": ["sport", "cardio"],
    "movement": "sport"
  },
  {
    "id": "sp-curling",
    "name": "Curling",
    "defaultUnit": "min",
    "muscles": {
      "primary": ["QUADS", "GLUTES", "HAMSTRINGS", "ABS"],
      "secondary": ["ANTERIOR_DELT", "BACK"]
    },
    "equipment": [],
    "aliases": ["curling match"],
    "tags": ["sport"],
    "movement": "sport"
  },
  {
    "id": "sp-sailing",
    "name": "Sailing",
    "defaultUnit": "min",
    "muscles": {
      "primary": ["ABS", "BACK", "ANTERIOR_DELT", "FOREARMS"],
      "secondary": ["QUADS", "BICEPS"]
    },
    "equipment": [],
    "aliases": ["sail", "yachting", "dinghy sailing"],
    "tags": ["sport"],
    "movement": "sport"
  },
  {
    "id": "sp-weightlifting",
    "name": "Weightlifting (Olympic)",
    "defaultUnit": "min",
    "muscles": {
      "primary": ["QUADS", "GLUTES", "BACK", "ANTERIOR_DELT", "HAMSTRINGS"],
      "secondary": ["ABS", "TRICEPS", "CALVES", "FOREARMS"]
    },
    "equipment": [],
    "aliases": ["olympic lifting", "oly lifting", "snatch practice", "clean and jerk practice"],
    "tags": ["sport"],
    "movement": "sport"
  },
  {
    "id": "sp-archery",
    "name": "Archery",
    "defaultUnit": "min",
    "muscles": {
      "primary": ["BACK", "ANTERIOR_DELT", "FOREARMS", "ABS"],
      "secondary": ["BICEPS", "TRICEPS"]
    },
    "equipment": [],
    "aliases": ["bow", "recurve", "compound bow", "target archery"],
    "tags": ["sport"],
    "movement": "sport"
  },
  {
    "id": "sp-diving",
    "name": "Diving",
    "defaultUnit": "min",
    "muscles": {
      "primary": ["ABS", "QUADS", "ANTERIOR_DELT", "BACK", "GLUTES"],
      "secondary": ["HAMSTRINGS", "CALVES"]
    },
    "equipment": [],
    "aliases": ["springboard diving", "platform diving"],
    "tags": ["sport"],
    "movement": "sport"
  },
  {
    "id": "sp-biathlon",
    "name": "Biathlon",
    "defaultUnit": "min",
    "muscles": {
      "primary": ["QUADS", "HAMSTRINGS", "GLUTES", "ABS", "BACK"],
      "secondary": ["CALVES", "ANTERIOR_DELT", "FOREARMS"]
    },
    "equipment": [],
    "aliases": ["ski and shoot", "cross country shooting"],
    "tags": ["sport", "cardio"],
    "movement": "sport"
  },
  {
    "id": "sp-kayaking",
    "name": "Kayaking",
    "defaultUnit": "min",
    "muscles": {
      "primary": ["BACK", "ANTERIOR_DELT", "ABS", "BICEPS", "FOREARMS"],
      "secondary": ["TRICEPS", "QUADS"]
    },
    "equipment": [],
    "aliases": ["canoeing", "canoe", "kayak", "paddling", "canoe sprint", "kayak slalom"],
    "tags": ["sport", "cardio"],
    "movement": "sport"
  },
  {
    "id": "sp-bowling",
    "name": "Bowling",
    "defaultUnit": "min",
    "muscles": {
      "primary": ["ANTERIOR_DELT", "FOREARMS", "ABS"],
      "secondary": ["QUADS", "BACK"]
    },
    "equipment": [],
    "aliases": ["ten pin bowling", "bowling league"],
    "tags": ["sport"],
    "movement": "sport"
  },
  {
    "id": "m-yoga",
    "name": "Yoga",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS",
        "BACK",
        "GLUTES"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "yoga flow",
      "yoga session"
    ],
    "tags": [
      "mobility",
      "flexibility"
    ],
    "movement": "mobility"
  },
  {
    "id": "m-yoga-power",
    "name": "Power Yoga",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS",
        "QUADS",
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "power yoga",
      "vinyasa"
    ],
    "tags": [
      "mobility",
      "flexibility"
    ],
    "movement": "mobility"
  },
  {
    "id": "m-yoga-hot",
    "name": "Hot Yoga",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS",
        "BACK",
        "GLUTES"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "bikram",
      "hot yoga class"
    ],
    "tags": [
      "mobility",
      "flexibility"
    ],
    "movement": "mobility"
  },
  {
    "id": "m-pilates",
    "name": "Pilates",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "ABS",
        "GLUTES",
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "pilates class",
      "mat pilates",
      "reformer pilates"
    ],
    "tags": [
      "mobility",
      "core"
    ],
    "movement": "mobility"
  },
  {
    "id": "m-foam-roll",
    "name": "Foam Rolling",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "BACK",
        "QUADS",
        "GLUTES"
      ],
      "secondary": []
    },
    "equipment": [
      "foam roller"
    ],
    "aliases": [
      "foam roll",
      "myofascial release"
    ],
    "tags": [
      "mobility",
      "recovery"
    ],
    "movement": "mobility"
  },
  {
    "id": "m-dynamic-warmup",
    "name": "Dynamic Warm-Up",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "GLUTES",
        "HAMSTRINGS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "warm up",
      "warmup",
      "dynamic stretch"
    ],
    "tags": [
      "mobility"
    ],
    "movement": "mobility"
  },
  {
    "id": "m-tai-chi",
    "name": "Tai Chi",
    "defaultUnit": "min",
    "muscles": {
      "primary": [
        "QUADS",
        "ABS",
        "CALVES"
      ],
      "secondary": []
    },
    "equipment": [],
    "aliases": [
      "tai chi class",
      "taichi"
    ],
    "tags": [
      "mobility",
      "flexibility"
    ],
    "movement": "mobility"
  },
  {
    "id": "m-hip-90-90",
    "name": "90/90 Hip Switch",
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
      "hip 90 90",
      "90 90 stretch",
      "hip switch"
    ],
    "tags": [
      "mobility",
      "bodyweight"
    ],
    "movement": "mobility"
  },
  {
    "id": "m-worlds-greatest",
    "name": "World's Greatest Stretch",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "QUADS",
        "BACK",
        "GLUTES"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "greatest stretch",
      "wgs"
    ],
    "tags": [
      "mobility",
      "bodyweight"
    ],
    "movement": "mobility"
  },
  {
    "id": "m-shoulder-dislocate",
    "name": "Shoulder Dislocates",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT",
        "POSTERIOR_DELT"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "band pass through",
      "dowel dislocate",
      "shoulder pass-through"
    ],
    "tags": [
      "mobility",
      "bodyweight"
    ],
    "movement": "mobility"
  },
  {
    "id": "m-ankle-mobility",
    "name": "Ankle Mobility Drill",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "ankle circles",
      "ankle dorsiflexion",
      "wall ankle stretch"
    ],
    "tags": [
      "mobility",
      "bodyweight"
    ],
    "movement": "mobility"
  },
  {
    "id": "m-hip-circles",
    "name": "Hip Circles",
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
      "hip rotations",
      "standing hip circles"
    ],
    "tags": [
      "mobility",
      "bodyweight"
    ],
    "movement": "mobility"
  },
  {
    "id": "m-thoracic-rotation",
    "name": "Thoracic Rotation",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "t-spine rotation",
      "open book stretch"
    ],
    "tags": [
      "mobility",
      "bodyweight"
    ],
    "movement": "mobility"
  },
  {
    "id": "s-hamstring",
    "name": "Hamstring Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "standing hamstring stretch",
      "seated hamstring stretch",
      "toe touch"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight",
      "posture"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-quad",
    "name": "Quad Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "standing quad stretch",
      "quad pull"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-calf",
    "name": "Calf Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "CALVES"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "wall calf stretch",
      "standing calf stretch"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-glute",
    "name": "Glute Stretch",
    "defaultUnit": "sec",
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
      "pigeon stretch",
      "figure four stretch",
      "seated glute stretch"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-pigeon",
    "name": "Pigeon Pose",
    "defaultUnit": "sec",
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
      "pigeon stretch",
      "sleeping pigeon"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-lat",
    "name": "Lat Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "overhead lat stretch",
      "doorway lat stretch",
      "side lat stretch"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight",
      "posture"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-shoulder-cross",
    "name": "Cross-Body Shoulder Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "POSTERIOR_DELT"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "cross body stretch",
      "rear delt stretch",
      "shoulder stretch"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-tricep-overhead",
    "name": "Overhead Tricep Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "TRICEPS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "tricep stretch",
      "behind head stretch"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-bicep-wall",
    "name": "Wall Bicep Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BICEPS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "bicep stretch",
      "doorway bicep stretch"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-neck-tilt",
    "name": "Neck Side Tilt Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "neck stretch",
      "lateral neck stretch",
      "neck tilt"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-neck-rotation",
    "name": "Neck Rotation Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "neck rotation",
      "neck turn"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-wrist-flexor",
    "name": "Wrist Flexor Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "wrist stretch",
      "forearm flexor stretch"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-wrist-extensor",
    "name": "Wrist Extensor Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "FOREARMS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "reverse wrist stretch",
      "forearm extensor stretch"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-it-band",
    "name": "IT Band Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "iliotibial band stretch",
      "it band foam roll"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-butterfly",
    "name": "Butterfly Stretch",
    "defaultUnit": "sec",
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
      "groin stretch",
      "adductor stretch",
      "seated butterfly"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-straddle",
    "name": "Straddle Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "HAMSTRINGS",
        "GLUTES"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "wide leg stretch",
      "seated straddle",
      "middle split"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-frog",
    "name": "Frog Stretch",
    "defaultUnit": "sec",
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
      "frog pose",
      "groin stretch frog"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-cobra",
    "name": "Cobra Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "cobra pose",
      "bhujangasana",
      "upward facing dog"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-puppy-pose",
    "name": "Puppy Pose",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK",
        "CHEST"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "extended puppy pose",
      "melting heart pose"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-thread-needle",
    "name": "Thread the Needle",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "thread needle stretch",
      "thoracic rotation stretch"
    ],
    "tags": [
      "stretch",
      "mobility",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-seated-twist",
    "name": "Seated Spinal Twist",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK",
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "spinal twist",
      "seated twist",
      "supine twist"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-scorpion",
    "name": "Scorpion Stretch",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS",
        "QUADS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "prone scorpion",
      "scorpion twist"
    ],
    "tags": [
      "stretch",
      "mobility",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-sleeper",
    "name": "Sleeper Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "POSTERIOR_DELT"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "sleeper stretch shoulder",
      "internal rotation stretch"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-banded-shoulder",
    "name": "Banded Shoulder Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ANTERIOR_DELT",
        "CHEST"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "band shoulder stretch",
      "resistance band stretch"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-downward-dog",
    "name": "Downward Dog",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "HAMSTRINGS",
        "CALVES",
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "down dog",
      "adho mukha svanasana"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-upward-dog",
    "name": "Upward Dog",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "ABS",
        "CHEST"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "up dog",
      "urdhva mukha svanasana"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-standing-pike",
    "name": "Standing Pike Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "HAMSTRINGS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "forward fold",
      "standing forward bend",
      "uttanasana"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-pancake",
    "name": "Pancake Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "HAMSTRINGS",
        "GLUTES"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "pancake fold",
      "wide straddle forward fold"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-chest-doorway",
    "name": "Doorway Chest Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "CHEST",
        "ANTERIOR_DELT"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "pec stretch",
      "doorway stretch",
      "chest opener"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight",
      "posture",
      "kyphosis"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-thoracic-ext",
    "name": "Thoracic Extension",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "foam roller"
    ],
    "aliases": [
      "thoracic spine extension",
      "upper back extension",
      "foam roller thoracic"
    ],
    "tags": [
      "stretch",
      "isometric",
      "posture",
      "kyphosis",
      "mobility"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-cat-cow",
    "name": "Cat-Cow Stretch",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK",
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "cat cow",
      "cat camel",
      "spinal flexion extension"
    ],
    "tags": [
      "stretch",
      "mobility",
      "bodyweight",
      "posture",
      "kyphosis"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-chin-tuck",
    "name": "Chin Tucks",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "chin tuck",
      "neck retraction",
      "cervical retraction"
    ],
    "tags": [
      "stretch",
      "posture",
      "bodyweight",
      "kyphosis"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-wall-angel",
    "name": "Wall Angels",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "POSTERIOR_DELT",
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "wall slide",
      "wall angel",
      "scapular wall slide"
    ],
    "tags": [
      "stretch",
      "mobility",
      "bodyweight",
      "posture",
      "kyphosis"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-prone-y-raise",
    "name": "Prone Y Raise",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "BACK",
        "POSTERIOR_DELT"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "y raise",
      "floor y raise",
      "prone y"
    ],
    "tags": [
      "stretch",
      "mobility",
      "bodyweight",
      "posture",
      "kyphosis"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-hip-flexor",
    "name": "Hip Flexor Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "kneeling hip flexor stretch",
      "psoas stretch",
      "lunge stretch"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight",
      "posture",
      "apt"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-couch",
    "name": "Couch Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "QUADS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "wall quad stretch",
      "elevated hip flexor stretch",
      "rear foot elevated stretch"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight",
      "posture",
      "apt"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-childs-pose",
    "name": "Child's Pose",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "child's pose",
      "resting pose",
      "balasana"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight",
      "posture",
      "apt"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-knee-to-chest",
    "name": "Knee to Chest Stretch",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "GLUTES",
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "single knee to chest",
      "double knee to chest",
      "low back stretch"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight",
      "posture",
      "apt"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-pelvic-tilt",
    "name": "Posterior Pelvic Tilts",
    "defaultUnit": "reps",
    "muscles": {
      "primary": [
        "ABS",
        "GLUTES"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "pelvic tilt",
      "supine pelvic tilt",
      "lying pelvic tilt"
    ],
    "tags": [
      "stretch",
      "mobility",
      "bodyweight",
      "posture",
      "apt"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-glute-bridge",
    "name": "Glute Bridge Hold",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "GLUTES",
        "HAMSTRINGS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "bridge hold",
      "hip bridge hold",
      "glute bridge"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight",
      "posture",
      "apt"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-dead-hang",
    "name": "Dead Hang",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK"
      ],
      "secondary": []
    },
    "equipment": [
      "pull-up bar"
    ],
    "aliases": [
      "bar hang",
      "passive hang",
      "spinal decompression"
    ],
    "tags": [
      "stretch",
      "isometric",
      "posture",
      "apt",
      "kyphosis"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-happy-baby",
    "name": "Happy Baby",
    "defaultUnit": "sec",
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
      "happy baby pose",
      "ananda balasana"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  },
  {
    "id": "s-supine-twist",
    "name": "Supine Twist",
    "defaultUnit": "sec",
    "muscles": {
      "primary": [
        "BACK",
        "ABS"
      ],
      "secondary": []
    },
    "equipment": [
      "bodyweight"
    ],
    "aliases": [
      "lying twist",
      "supine spinal twist"
    ],
    "tags": [
      "stretch",
      "isometric",
      "bodyweight"
    ],
    "movement": "stretch"
  }
];
