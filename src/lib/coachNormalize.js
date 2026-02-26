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
  FOREARMS: ['forearm', 'wrist curl', 'wrist', 'grip', 'farmer'],
  QUADS: ['quad', 'squat', 'leg press', 'lunge'],
  HAMSTRINGS: ['hamstring', 'leg curl', 'rdl', 'romanian'],
  GLUTES: ['glute', 'hip thrust'],
  CALVES: ['calf', 'calves', 'calf raise'],
  ABS: ['ab', 'abs', 'core', 'plank', 'crunch', 'sit up', 'situp'],
  OBLIQUES: ['oblique', 'russian twist', 'woodchop', 'wood chop', 'side bend', 'pallof'],
};

// --- Coach signal helpers ---

const SECONDARY_SET_WEIGHT = 0.5;

const PAIN_KEYWORDS = /\b(pain|hurt|injury|injured|sore|soreness|tight|tightness|strain|strained|pull|pulled|tweak|tweaked|snap|popped|swollen|inflamed|numb|tingling|doctor|physio|PT|rehab|surgery|tear|torn)\b/i;
const FATIGUE_KEYWORDS = /\b(tired|exhausted|fatigued|drained|wiped|burned\s*out|burnout|worn\s*out|sluggish|flat|heavy\s*legs|no\s*energy|low\s*energy|overtrained|run\s*down)\b/i;

function extractNoteSignals(text) {
  if (!text || typeof text !== "string") return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  const pain = PAIN_KEYWORDS.test(trimmed);
  const fatigue = FATIGUE_KEYWORDS.test(trimmed);
  if (!pain && !fatigue) return null;
  return {
    pain,
    fatigue,
    painConfidence: pain ? (trimmed.length > 30 ? "high" : "med") : null,
    fatigueConfidence: fatigue ? (trimmed.length > 30 ? "high" : "med") : null,
  };
}

function buildCoachSignals(moodEntries, rpeEntries, intensityEntries, painMentions, fatigueMentions) {
  let mood = { avg: null, trend: "unknown", count: 0 };
  if (moodEntries.length > 0) {
    const avg = moodEntries.reduce((s, e) => s + e.value, 0) / moodEntries.length;
    let trend = "unknown";
    if (moodEntries.length >= 4) {
      const sorted = [...moodEntries].sort((a, b) => a.date.localeCompare(b.date));
      const mid = Math.floor(sorted.length / 2);
      const firstHalf = sorted.slice(0, mid).reduce((s, e) => s + e.value, 0) / mid;
      const secondHalf = sorted.slice(mid).reduce((s, e) => s + e.value, 0) / (sorted.length - mid);
      const diff = secondHalf - firstHalf;
      trend = diff > 0.5 ? "up" : diff < -0.5 ? "down" : "flat";
    } else if (moodEntries.length >= 2) {
      trend = "flat";
    }
    mood = { avg: Math.round(avg * 10) / 10, trend, count: moodEntries.length };
  }

  const effort = {};
  if (rpeEntries.length > 0) {
    effort.avgRpe = Math.round(rpeEntries.reduce((s, e) => s + e.value, 0) / rpeEntries.length * 10) / 10;
    effort.rpeCount = rpeEntries.length;
  }
  if (intensityEntries.length > 0) {
    effort.avgIntensity = Math.round(intensityEntries.reduce((s, e) => s + e.value, 0) / intensityEntries.length * 10) / 10;
    effort.intensityCount = intensityEntries.length;
    const peak = intensityEntries.reduce((best, e) => e.value > (best?.value || 0) ? e : best, null);
    if (peak) effort.peakIntensity = { date: peak.date, activity: peak.activity, value: peak.value };
  }

  return {
    mood,
    effort,
    notesSignals: { painMentions, fatigueMentions },
  };
}

export function classifyExerciseMuscles(exerciseName) {
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

const FALLBACK_SUGGESTIONS = {
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

function getSuggestionsForMuscleGroup(group, catalog, userExerciseNames) {
  if (!catalog) return FALLBACK_SUGGESTIONS[group] || [];

  const userNamesLower = new Set(
    (userExerciseNames || []).map((n) => n.toLowerCase())
  );

  const matches = catalog
    .filter((entry) => {
      const hasMuscle = entry.muscles?.primary?.includes(group) ||
        entry.muscles?.secondary?.includes(group);
      return hasMuscle && !userNamesLower.has(entry.name.toLowerCase());
    })
    .slice(0, 3)
    .map((entry) => ({ catalogId: entry.id, exercise: entry.name, muscleGroup: group }));

  return matches.length > 0 ? matches : (FALLBACK_SUGGESTIONS[group] || []);
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
export function buildNormalizedAnalysis(workouts, logsByDate, dateRange, catalogMap) {
  const muscleGroupVolume = {};
  const muscleGroupSets = {};   // Primary-only working set counts
  const durationByActivity = {};
  const sportFrequency = {};
  let totalStrengthReps = 0;
  let totalStrengthSets = 0;
  const muscleGroupSetsEffective = {};
  // Coach signal collectors
  const moodEntries = [];
  const rpeEntries = [];
  const intensityEntries = [];
  const painMentions = [];
  const fatigueMentions = [];

  // Build exercise ID → info map
  const exerciseIdToInfo = new Map();
  for (const workout of workouts || []) {
    for (const ex of workout.exercises || []) {
      exerciseIdToInfo.set(ex.id, {
        name: ex.name,
        unit: ex.unit || "reps",
        customUnitAbbr: ex.customUnitAbbr,
        catalogId: ex.catalogId,
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

      // Only count completed sets (prevents prefilled/empty rows from inflating data)
      const completedSets = log.sets.filter(s =>
        s.completed !== undefined ? s.completed : Number(s.reps) > 0
      );
      if (completedSets.length === 0) continue;

      // Collect coach signal data from this log entry
      if (log.mood != null) {
        moodEntries.push({ date: dateKey, value: Number(log.mood) });
      }
      const noteSignals = extractNoteSignals(log.notes);
      if (noteSignals) {
        if (noteSignals.pain) painMentions.push({ date: dateKey, text: log.notes.trim().slice(0, 100), confidence: noteSignals.painConfidence });
        if (noteSignals.fatigue) fatigueMentions.push({ date: dateKey, text: log.notes.trim().slice(0, 100), confidence: noteSignals.fatigueConfidence });
      }
      for (const s of completedSets) {
        if (s.targetRpe) {
          const rpe = Number(s.targetRpe);
          if (rpe > 0) rpeEntries.push({ date: dateKey, value: rpe, activity: name });
        }
        if (s.targetIntensity) {
          const intensity = Number(s.targetIntensity);
          if (intensity > 0) intensityEntries.push({ date: dateKey, value: intensity, activity: name });
        }
      }

      const totalValue = completedSets.reduce(
        (sum, set) => sum + (Number(set.reps) || 0),
        0
      );

      if (activity === "strength") {
        // Strength: accumulate muscle group volume in reps
        // Prefer catalog muscle data when available, fall back to keyword matching
        let primaryGroups;
        let secondaryGroups = [];
        if (info.catalogId && catalogMap) {
          const catalogEntry = catalogMap.get(info.catalogId);
          if (catalogEntry?.muscles?.primary?.length > 0) {
            primaryGroups = catalogEntry.muscles.primary;
            secondaryGroups = catalogEntry.muscles.secondary || [];
          }
        }
        if (!primaryGroups) {
          primaryGroups = classifyExerciseMuscles(name);
        }
        // Primary muscles get full volume credit
        for (const group of primaryGroups) {
          muscleGroupVolume[group] = (muscleGroupVolume[group] || 0) + totalValue;
        }
        // Secondary muscles get half volume credit
        for (const group of secondaryGroups) {
          muscleGroupVolume[group] = (muscleGroupVolume[group] || 0) + Math.round(totalValue * 0.5);
        }
        totalStrengthReps += totalValue;

        // Track working sets per PRIMARY muscle only (no secondary inflation)
        const workingSets = completedSets.filter(s => (Number(s.reps) || 0) > 0).length;
        totalStrengthSets += workingSets;
        for (const group of primaryGroups) {
          muscleGroupSets[group] = (muscleGroupSets[group] || 0) + workingSets;
        }
        // Effective sets: primary gets full credit, secondary gets partial
        for (const group of primaryGroups) {
          muscleGroupSetsEffective[group] = (muscleGroupSetsEffective[group] || 0) + workingSets;
        }
        for (const group of secondaryGroups) {
          muscleGroupSetsEffective[group] = (muscleGroupSetsEffective[group] || 0) + workingSets * SECONDARY_SET_WEIGHT;
        }
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

  const coachSignals = buildCoachSignals(moodEntries, rpeEntries, intensityEntries, painMentions, fatigueMentions);

  return { muscleGroupVolume, muscleGroupSets, muscleGroupSetsEffective, durationByActivity, sportFrequency, totalStrengthReps, totalStrengthSets, coachSignals };
}

/**
 * Detect imbalances using normalized analysis data.
 * Only uses strength reps for thresholds (not inflated by duration values).
 * Skips variety warnings for entries in sportFrequency.
 * @param {Object} analysis
 * @param {Object} [opts]
 * @param {Array}  [opts.catalog] - EXERCISE_CATALOG array for smarter suggestions
 * @param {Array}  [opts.userExerciseNames] - names of exercises already in user's program
 */
export function detectImbalancesNormalized(analysis, opts) {
  const catalog = opts?.catalog;
  const userExerciseNames = opts?.userExerciseNames;
  const insights = [];
  const sets = analysis?.muscleGroupSets ?? {};
  const sportFrequency = analysis?.sportFrequency ?? {};
  const totalSets = analysis?.totalStrengthSets ?? 0;

  // Need enough training data to analyze (roughly 2+ sessions)
  if (totalSets < 6) return [];

  // Check push/pull ratio using primary-only sets
  const pushSets =
    (sets.CHEST || 0) +
    (sets.ANTERIOR_DELT || 0) +
    (sets.TRICEPS || 0);

  const pullSets =
    (sets.BACK || 0) +
    (sets.POSTERIOR_DELT || 0) +
    (sets.BICEPS || 0);

  if (pushSets > pullSets * 1.5 && pullSets > 0) {
    const ratio = (pushSets / pullSets).toFixed(1);
    insights.push({
      type: 'IMBALANCE',
      severity: 'HIGH',
      title: '⚠️ Push/Pull Imbalance Detected',
      message: `You've done ${pushSets} push sets vs ${pullSets} pull sets (${ratio}:1 ratio). Adding more pulling work helps balance shoulders and posture.`,
      suggestions: [
        ...getSuggestionsForMuscleGroup('BACK', catalog, userExerciseNames).slice(0, 2),
        ...getSuggestionsForMuscleGroup('POSTERIOR_DELT', catalog, userExerciseNames).slice(0, 1),
      ]
    });
  }

  // Check posterior delt neglect
  const anteriorDeltSets = sets.ANTERIOR_DELT || 0;
  const posteriorDeltSets = sets.POSTERIOR_DELT || 0;

  if (anteriorDeltSets > posteriorDeltSets * 2 && anteriorDeltSets > 4) {
    insights.push({
      type: 'IMBALANCE',
      severity: 'MEDIUM',
      title: '💡 Rear Delt Neglect',
      message: `${anteriorDeltSets} sets of front delt work but ${posteriorDeltSets || 'zero'} for rear delts. Add rear delt work for balanced shoulders.`,
      suggestions: getSuggestionsForMuscleGroup('POSTERIOR_DELT', catalog, userExerciseNames)
    });
  }

  // Check neglected groups (skip groups that match sport names)
  const sportNamesLower = Object.keys(sportFrequency).map((n) => n.toLowerCase());
  const importantGroups = ['BACK', 'HAMSTRINGS', 'POSTERIOR_DELT'];

  for (const group of importantGroups) {
    const groupSets = sets[group] || 0;
    const percentage = totalSets > 0 ? (groupSets / totalSets) * 100 : 0;

    if (percentage < 5 && totalSets > 12 && insights.length < 2) {
      const groupName = group.replace(/_/g, ' ').toLowerCase();
      // Skip if this group name appears in a sport name
      if (sportNamesLower.some((sn) => sn.includes(groupName))) continue;
      insights.push({
        type: 'NEGLECTED',
        severity: 'LOW',
        title: `📊 ${groupName} needs attention`,
        message: groupSets === 0
          ? `No direct ${groupName} sets logged this period. Consider adding some targeted work.`
          : `Only ${groupSets} direct ${groupName} set${groupSets !== 1 ? 's' : ''} out of ${totalSets} total — that's ${Math.round(percentage)}%. Consider adding more.`,
        suggestions: getSuggestionsForMuscleGroup(group, catalog, userExerciseNames)
      });
    }
  }

  // --- Sport/fatigue-aware insights ---
  const signals = analysis?.coachSignals;
  if (signals) {
    const durationByActivity = analysis?.durationByActivity ?? {};

    // Sport load (total minutes for sport-classified activities)
    const sportMinutes = Object.entries(sportFrequency).reduce(
      (sum, [name]) => sum + (durationByActivity[name] || 0), 0
    );

    // Pain mentions → recovery insight
    const recentPain = (signals.notesSignals?.painMentions || [])
      .filter((p) => p.confidence === "high" || p.confidence === "med");
    if (recentPain.length > 0 && insights.length < 3) {
      insights.push({
        type: "RECOVERY",
        severity: recentPain.some((p) => p.confidence === "high") ? "HIGH" : "MEDIUM",
        title: "⚠️ Pain signals detected",
        message: `Recent notes mention pain or discomfort (${recentPain.map((p) => p.date).join(", ")}). Consider modifying exercises that aggravate the area and prioritizing recovery.`,
        suggestions: [],
      });
    }

    // Mood trending down + high load → recovery insight
    if (
      signals.mood.trend === "down" &&
      signals.mood.count >= 4 &&
      (sportMinutes > 180 || totalSets > 20 || (signals.effort.avgRpe && signals.effort.avgRpe >= 7.5)) &&
      insights.length < 3
    ) {
      insights.push({
        type: "RECOVERY",
        severity: "MEDIUM",
        title: "😴 Recovery may be needed",
        message: "Your mood has been trending down while training load remains high. Consider a lighter week or extra rest day to recover.",
        suggestions: [],
      });
    }
  }

  // Positive feedback
  if (insights.length === 0 && totalSets > 12) {
    insights.push({
      type: 'POSITIVE',
      severity: 'INFO',
      title: '✅ Training looks balanced!',
      message: `${totalSets} sets well-distributed across muscle groups. Keep it up!`,
      suggestions: []
    });
  }

  return insights.slice(0, 3);
}

// ---------------------------------------------------------------------------
// Insight normalization for UI
// ---------------------------------------------------------------------------

const SEVERITY_RANK = { HIGH: 3, MEDIUM: 2, LOW: 1, INFO: 0 };

/**
 * Normalize a raw insight into a UI-friendly shape.
 * { title, message, severity, suggestions[] } → { headline, detail, severity, cta? }
 */
export function normalizeInsight(insight) {
  if (!insight) return null;
  const cta =
    Array.isArray(insight.suggestions) && insight.suggestions.length > 0
      ? insight.suggestions[0]
      : null;
  return {
    headline: (insight.title || "Insight").replace(/^[\u2600-\u27BF\uFE00-\uFE0F\u{1F000}-\u{1FFFF}]\s*/u, ""),
    detail: insight.message || "",
    severity: insight.severity || "INFO",
    cta,
    _raw: insight,
  };
}

/**
 * Select the single most important insight from an array.
 * Priority: showAsHero flag → salience score → severity rank → array order.
 */
export function selectTopInsight(insights) {
  if (!Array.isArray(insights) || insights.length === 0) return null;
  const hero = insights.find((i) => i.showAsHero);
  if (hero) return hero;
  const withSalience = insights.filter((i) => typeof i.salience === "number");
  if (withSalience.length > 0) {
    return withSalience.reduce((a, b) => (b.salience > a.salience ? b : a));
  }
  return [...insights].sort(
    (a, b) => (SEVERITY_RANK[b.severity] || 0) - (SEVERITY_RANK[a.severity] || 0)
  )[0];
}
