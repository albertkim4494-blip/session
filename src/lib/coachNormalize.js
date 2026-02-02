/**
 * Unit-aware classification and normalization helpers for the AI Coach.
 * Pure functions, no dependencies.
 */

// --- Constants ---

/** Conversion factors to minutes */
export const DURATION_UNITS = { sec: 1 / 60, min: 1, hrs: 60 };

export const DISTANCE_UNITS = new Set(["miles", "yards", "laps", "steps"]);

export const SPORT_KEYWORDS = [
  "polo", "soccer", "basketball", "football", "baseball", "softball",
  "hockey", "lacrosse", "rugby", "volleyball", "tennis", "badminton",
  "cricket", "wrestling", "boxing", "mma", "martial", "fencing",
  "handball", "rowing crew", "ultimate",
];

export const CARDIO_KEYWORDS = [
  "run", "jog", "bike", "cycling", "swim", "elliptical", "stair",
  "walk", "hike", "sprint", "cardio", "rowing", "jump rope", "ski",
];

export const UNIT_ABBR_MAP = {
  reps: "reps",
  miles: "mi",
  yards: "yd",
  laps: "laps",
  steps: "steps",
  sec: "sec",
  min: "min",
  hrs: "hrs",
};

const MUSCLE_GROUPS = {
  ANTERIOR_DELT: ['front delt', 'anterior delt', 'overhead press', 'military press', 'shoulder press'],
  LATERAL_DELT: ['side delt', 'lateral delt', 'lateral raise'],
  POSTERIOR_DELT: ['rear delt', 'posterior delt', 'face pull', 'reverse fly', 'reverse flye'],
  CHEST: ['chest', 'bench press', 'bench', 'push up', 'pushup', 'dip', 'fly', 'flye', 'pec'],
  TRICEPS: ['tricep', 'triceps', 'extension', 'skullcrusher', 'pushdown'],
  BACK: ['back', 'row', 'pull up', 'pullup', 'chin up', 'chinup', 'lat', 'pulldown', 'pull down', 'deadlift'],
  BICEPS: ['bicep', 'biceps', 'curl'],
  QUADS: ['quad', 'squat', 'leg press', 'lunge'],
  HAMSTRINGS: ['hamstring', 'leg curl', 'rdl', 'romanian'],
  GLUTES: ['glute', 'hip thrust'],
  CALVES: ['calf', 'calves', 'raise'],
  ABS: ['ab', 'abs', 'core', 'plank', 'crunch', 'sit up', 'situp'],
};

function classifyExerciseMuscles(exerciseName) {
  const lower = exerciseName.toLowerCase();
  const matches = [];
  for (const [group, keywords] of Object.entries(MUSCLE_GROUPS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        matches.push(group);
        break;
      }
    }
  }
  return matches.length > 0 ? matches : ['UNCLASSIFIED'];
}

function getSuggestionsForMuscleGroup(group) {
  const suggestions = {
    POSTERIOR_DELT: [
      { exercise: 'Face Pulls', muscleGroup: 'POSTERIOR_DELT' },
      { exercise: 'Reverse Flyes', muscleGroup: 'POSTERIOR_DELT' },
    ],
    BACK: [
      { exercise: 'Pull Ups', muscleGroup: 'BACK' },
      { exercise: 'Barbell Rows', muscleGroup: 'BACK' },
      { exercise: 'Lat Pulldowns', muscleGroup: 'BACK' },
    ],
    BICEPS: [
      { exercise: 'Barbell Curls', muscleGroup: 'BICEPS' },
      { exercise: 'Hammer Curls', muscleGroup: 'BICEPS' },
    ],
    HAMSTRINGS: [
      { exercise: 'Romanian Deadlifts', muscleGroup: 'HAMSTRINGS' },
      { exercise: 'Leg Curls', muscleGroup: 'HAMSTRINGS' },
    ],
  };
  return suggestions[group] || [];
}

// --- Exports ---

/**
 * Classify an activity by its name and unit.
 * @param {string} name - Exercise/activity name
 * @param {string} unitKey - Unit key (e.g. "reps", "hrs", "miles")
 * @returns {"strength"|"cardio"|"sport"|"duration"}
 */
export function classifyActivity(name, unitKey) {
  const lower = (name || "").toLowerCase();
  const unit = (unitKey || "reps").toLowerCase();
  const isDuration = unit in DURATION_UNITS;
  const isDistance = DISTANCE_UNITS.has(unit);

  // Sport keyword + duration unit → sport
  if (isDuration && SPORT_KEYWORDS.some((kw) => lower.includes(kw))) {
    return "sport";
  }

  // Duration unit (no sport keyword) → duration
  if (isDuration) {
    return "duration";
  }

  // Distance unit → cardio
  if (isDistance) {
    return "cardio";
  }

  // Cardio keyword even with reps unit → cardio
  if (CARDIO_KEYWORDS.some((kw) => lower.includes(kw))) {
    return "cardio";
  }

  // Default → strength
  return "strength";
}

/**
 * Convert a value to minutes using the unit's conversion factor.
 * Returns null for non-duration units.
 */
export function normalizeToMinutes(value, unitKey) {
  const unit = (unitKey || "").toLowerCase();
  const factor = DURATION_UNITS[unit];
  if (factor == null) return null;
  return (Number(value) || 0) * factor;
}

/**
 * Get a display abbreviation for a unit key.
 * @param {string} unitKey
 * @param {string} [customAbbr] - User-defined abbreviation override
 * @returns {string}
 */
export function getUnitAbbr(unitKey, customAbbr) {
  if (customAbbr) return customAbbr;
  const key = (unitKey || "reps").toLowerCase();
  return UNIT_ABBR_MAP[key] || key;
}

/**
 * Build a normalized analysis from workout definitions and logs.
 * @param {Array} workouts - state.program.workouts
 * @param {Object} logsByDate - state.logsByDate
 * @param {Object} dateRange - { start, end }
 * @returns {{ muscleGroupVolume, durationByActivity, sportFrequency, totalStrengthReps }}
 */
export function buildNormalizedAnalysis(workouts, logsByDate, dateRange) {
  const muscleGroupVolume = {};
  const durationByActivity = {};
  const sportFrequency = {};
  let totalStrengthReps = 0;

  // Build exercise ID → info map
  const exerciseIdToInfo = new Map();
  for (const workout of workouts || []) {
    for (const ex of workout.exercises || []) {
      exerciseIdToInfo.set(ex.id, {
        name: ex.name,
        unit: ex.unit || "reps",
        customUnitAbbr: ex.customUnitAbbr,
      });
    }
  }

  for (const dateKey of Object.keys(logsByDate || {})) {
    if (typeof dateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) continue;
    if (dateKey < dateRange.start || dateKey > dateRange.end) continue;

    const dayLogs = logsByDate[dateKey];
    if (!dayLogs || typeof dayLogs !== "object") continue;

    for (const [exerciseId, log] of Object.entries(dayLogs)) {
      const info = exerciseIdToInfo.get(exerciseId);
      if (!info) continue;
      if (!log || !Array.isArray(log.sets)) continue;

      const { name, unit } = info;
      const activity = classifyActivity(name, unit);

      const totalValue = log.sets.reduce(
        (sum, set) => sum + (Number(set.reps) || 0),
        0
      );

      if (activity === "strength") {
        // Strength: accumulate muscle group volume in reps
        const groups = classifyExerciseMuscles(name);
        for (const group of groups) {
          muscleGroupVolume[group] = (muscleGroupVolume[group] || 0) + totalValue;
        }
        totalStrengthReps += totalValue;
      } else if (activity === "sport") {
        // Sport: convert to minutes, track frequency
        const minutes = normalizeToMinutes(totalValue, unit) || totalValue;
        durationByActivity[name] = (durationByActivity[name] || 0) + minutes;
        sportFrequency[name] = (sportFrequency[name] || 0) + 1;
      } else if (activity === "duration") {
        // Duration activity: convert to minutes
        const minutes = normalizeToMinutes(totalValue, unit) || totalValue;
        durationByActivity[name] = (durationByActivity[name] || 0) + minutes;
      } else if (activity === "cardio") {
        // Cardio: keep in original units but track as duration-style
        durationByActivity[name] = (durationByActivity[name] || 0) + totalValue;
      }
    }
  }

  return { muscleGroupVolume, durationByActivity, sportFrequency, totalStrengthReps };
}

/**
 * Detect imbalances using normalized analysis data.
 * Only uses strength reps for thresholds (not inflated by duration values).
 * Skips variety warnings for entries in sportFrequency.
 */
export function detectImbalancesNormalized(analysis) {
  const insights = [];
  const muscleGroupVolume = analysis?.muscleGroupVolume ?? {};
  const sportFrequency = analysis?.sportFrequency ?? {};
  const totalStrengthReps = analysis?.totalStrengthReps ?? 0;

  // Only use strength reps for threshold
  if (totalStrengthReps < 50) return [];

  // Check push/pull ratio
  const pushVolume =
    (muscleGroupVolume.CHEST || 0) +
    (muscleGroupVolume.ANTERIOR_DELT || 0) +
    (muscleGroupVolume.TRICEPS || 0);

  const pullVolume =
    (muscleGroupVolume.BACK || 0) +
    (muscleGroupVolume.POSTERIOR_DELT || 0) +
    (muscleGroupVolume.BICEPS || 0);

  if (pushVolume > pullVolume * 1.5 && pullVolume > 0) {
    const ratio = (pushVolume / pullVolume).toFixed(1);
    insights.push({
      type: 'IMBALANCE',
      severity: 'HIGH',
      title: '⚠️ Push/Pull Imbalance Detected',
      message: `You're doing ${ratio}x more pushing than pulling. This can lead to shoulder issues and poor posture.`,
      suggestions: [
        { exercise: 'Barbell Rows', muscleGroup: 'BACK' },
        { exercise: 'Pull Ups', muscleGroup: 'BACK' },
        { exercise: 'Face Pulls', muscleGroup: 'POSTERIOR_DELT' },
      ]
    });
  }

  // Check posterior delt neglect
  const anteriorDelt = muscleGroupVolume.ANTERIOR_DELT || 0;
  const posteriorDelt = muscleGroupVolume.POSTERIOR_DELT || 0;

  if (anteriorDelt > posteriorDelt * 2 && anteriorDelt > 30) {
    insights.push({
      type: 'IMBALANCE',
      severity: 'MEDIUM',
      title: '💡 Rear Delt Neglect',
      message: 'Your front delts are getting way more work than rear delts. Add rear delt work for balanced shoulders.',
      suggestions: getSuggestionsForMuscleGroup('POSTERIOR_DELT')
    });
  }

  // Check neglected groups (skip groups that match sport names)
  const sportNamesLower = Object.keys(sportFrequency).map((n) => n.toLowerCase());
  const importantGroups = ['BACK', 'HAMSTRINGS', 'POSTERIOR_DELT'];

  for (const group of importantGroups) {
    const volume = muscleGroupVolume[group] || 0;
    const percentage = (volume / totalStrengthReps) * 100;

    if (percentage < 5 && totalStrengthReps > 100 && insights.length < 2) {
      const groupName = group.replace(/_/g, ' ').toLowerCase();
      // Skip if this group name appears in a sport name
      if (sportNamesLower.some((sn) => sn.includes(groupName))) continue;
      insights.push({
        type: 'NEGLECTED',
        severity: 'LOW',
        title: `📊 ${groupName} volume is low`,
        message: `You've barely trained ${groupName} recently. Consider adding some direct work.`,
        suggestions: getSuggestionsForMuscleGroup(group)
      });
    }
  }

  // Positive feedback
  if (insights.length === 0 && totalStrengthReps > 100) {
    insights.push({
      type: 'POSITIVE',
      severity: 'INFO',
      title: '✅ Training looks balanced!',
      message: 'Your workout volume is well-distributed. Keep up the great work!',
      suggestions: []
    });
  }

  return insights.slice(0, 3);
}
