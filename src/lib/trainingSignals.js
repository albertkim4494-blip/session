/**
 * trainingSignals.js — pure training-signal builders shared by the AI Coach and
 * the workout generator ("Generate Today").
 *
 * These were originally private helpers inside coachApi.js. They were extracted
 * here so the generator can reuse the exact same math the Coach uses — strength/
 * volume trends, muscle-volume detail, sport trait vectors, and coaching-insight
 * memory — without duplicating logic or importing the whole coach module.
 *
 * Everything here is pure (no network, no React). The only external deps are the
 * pure classifiers in coachNormalize.js.
 */
import { inferSportTraits, classifyExerciseMuscles } from "./coachNormalize";

// localStorage key for the Coach's rolling insight history (v3).
export const LAST_INSIGHTS_KEY = "wt_coach_last_insights";

// ---------------------------------------------------------------------------
// Sport traits (profile free-text → movement-pattern trait vector)
// ---------------------------------------------------------------------------

/**
 * Parse profile.sports free text into structured entries with inferred traits.
 * e.g., "Water Polo 3x/week, running" → [{ name, freqPerWeek, traits }, ...]
 */
export function parseSportText(sportsText) {
  if (!sportsText || typeof sportsText !== "string") return [];
  const parts = sportsText.split(/[,;]\s*|\s+and\s+/i).map((s) => s.trim()).filter(Boolean);
  const result = [];
  for (const part of parts) {
    const freqMatch = part.match(/(\d+)\s*x?\s*(?:\/|\s*(?:per|a)\s*)\s*(?:week|wk)/i);
    const daily = /\bdaily\b/i.test(part);
    let freqPerWeek = null;
    if (freqMatch) freqPerWeek = parseInt(freqMatch[1], 10);
    else if (daily) freqPerWeek = 7;
    const name = part
      .replace(/\d+\s*x?\s*(?:\/|\s*(?:per|a)\s*)\s*(?:week|wk)/i, "")
      .replace(/\bdaily\b/i, "")
      .trim();
    if (!name) continue;
    result.push({ name, freqPerWeek, traits: inferSportTraits(name) });
  }
  return result;
}

/**
 * Merge logged sport traits (from analysis) with profile-declared sports.
 * Logged data takes precedence. Profile-only sports are added if not already
 * covered by logged data (fuzzy name matching).
 */
export function mergeSportTraits(loggedSportTraits, profileSportsText) {
  const profileSports = parseSportText(profileSportsText);
  if (!loggedSportTraits && profileSports.length === 0) return null;

  // If no logged trait data, build from profile declarations
  if (!loggedSportTraits) {
    const withTraits = profileSports.filter((s) => s.traits);
    if (withTraits.length === 0) return null;
    const perSport = {};
    const TRAIT_KEYS = Object.keys(withTraits[0].traits);
    const aggregated = {};
    for (const k of TRAIT_KEYS) aggregated[k] = 0;
    let totalWeight = 0;
    for (const { name, freqPerWeek, traits } of withTraits) {
      const w = freqPerWeek || 2;
      const estMinutes = w * 60;
      perSport[name] = { ...traits, sessions: w, minutes: estMinutes, source: "profile" };
      totalWeight += w;
    }
    for (const entry of Object.values(perSport)) {
      const w = (entry.sessions || 1) / (totalWeight || 1);
      for (const k of TRAIT_KEYS) aggregated[k] += (entry[k] || 0) * w;
    }
    for (const k of TRAIT_KEYS) aggregated[k] = Math.round(aggregated[k] * 100) / 100;
    return { perSport, aggregated, totalSportMinutes: 0, totalSportSessions: 0 };
  }

  // If we have logged data, supplement with profile-only sports not in logs
  if (profileSports.length === 0) return loggedSportTraits;

  const loggedNamesLower = new Set(Object.keys(loggedSportTraits.perSport).map((n) => n.toLowerCase()));
  let added = false;
  const perSport = { ...loggedSportTraits.perSport };

  for (const { name, freqPerWeek, traits } of profileSports) {
    if (!traits) continue;
    const nameLower = name.toLowerCase();
    // Skip if already covered by a logged sport (fuzzy substring match)
    const isLogged = [...loggedNamesLower].some((ln) => ln.includes(nameLower) || nameLower.includes(ln));
    if (isLogged) continue;
    const w = freqPerWeek || 2;
    perSport[name] = { ...traits, sessions: w, minutes: w * 60, source: "profile" };
    added = true;
  }

  if (!added) return loggedSportTraits;

  // Re-aggregate with the new entries
  const TRAIT_KEYS = ["upperPush", "upperPull", "legLoad", "coreRotation", "gripLoad", "impactStress", "explosiveness", "cardioLoad"];
  const totalMinutes = Object.values(perSport).reduce((s, e) => s + (e.minutes || 0), 0) || 1;
  const aggregated = {};
  for (const k of TRAIT_KEYS) aggregated[k] = 0;
  for (const entry of Object.values(perSport)) {
    const w = (entry.minutes || 1) / totalMinutes;
    for (const k of TRAIT_KEYS) aggregated[k] += (entry[k] || 0) * w;
  }
  for (const k of TRAIT_KEYS) aggregated[k] = Math.round(aggregated[k] * 100) / 100;

  return { ...loggedSportTraits, perSport, aggregated };
}

// ---------------------------------------------------------------------------
// Coaching-insight memory (rolling history + follow-up detection)
// ---------------------------------------------------------------------------

export function simpleHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return hash;
}

/**
 * Load insight history from localStorage. Auto-migrates v1 → v2 → v3.
 * v3 stores full insight data (message, severity, suggestions, evidence, contextSnapshot).
 */
export function loadInsightHistory() {
  try {
    const raw = localStorage.getItem(LAST_INSIGHTS_KEY);
    if (!raw) return { version: 3, history: [], fetchCounter: 0 };
    const parsed = JSON.parse(raw);

    // Already v3
    if (parsed.version === 3 && Array.isArray(parsed.history)) return parsed;

    // Migrate v2 → v3: existing entries keep their fields, new fields will be null
    if (parsed.version === 2 && Array.isArray(parsed.history)) {
      return { version: 3, history: parsed.history.slice(0, 15), fetchCounter: parsed.fetchCounter || 0 };
    }

    // Migrate v1: { titles: [...], types: [...] }
    if (Array.isArray(parsed.titles) && parsed.titles.length > 0) {
      const now = new Date().toISOString().slice(0, 10);
      const history = parsed.titles.map((title, i) => ({
        titleHash: simpleHash(title),
        title,
        type: parsed.types?.[i] || "INFO",
        firstShown: now,
        lastShown: now,
        shownCount: 1,
        fetchIndex: 0,
      }));
      return { version: 3, history: history.slice(0, 15), fetchCounter: 1 };
    }

    return { version: 3, history: [], fetchCounter: 0 };
  } catch {
    return { version: 3, history: [], fetchCounter: 0 };
  }
}

/**
 * Save insights to rolling history with full data + context snapshot.
 * Upserts by titleHash, trims to 15 entries.
 */
export function saveInsightHistory(insights, historyState, contextData) {
  try {
    const fetchIndex = (historyState.fetchCounter || 0) + 1;
    const now = new Date().toISOString().slice(0, 10);
    const history = [...historyState.history];

    // Build context snapshot from currently-available data
    const contextSnapshot = {};
    if (contextData?.muscleSetsSummary) {
      contextSnapshot.muscleSets = contextData.muscleSetsSummary;
    }
    if (Array.isArray(contextData?.progressionTrends)) {
      const topWeights = {};
      for (const t of contextData.progressionTrends) {
        const match = t.match(/^(.+?):\s.*?→\s*([\d.]+)/);
        if (match) topWeights[match[1].trim()] = parseFloat(match[2]);
      }
      if (Object.keys(topWeights).length > 0) contextSnapshot.topWeights = topWeights;
    }
    if (contextData?.adherence) {
      contextSnapshot.adherencePerWeek = contextData.adherence.sessionsPerWeek ?? null;
    }

    for (const insight of insights) {
      const hash = simpleHash(insight.title);
      const existing = history.find((h) => h.titleHash === hash);
      if (existing) {
        existing.lastShown = now;
        existing.shownCount += 1;
        existing.fetchIndex = fetchIndex;
        existing.message = insight.message || existing.message;
        existing.severity = insight.severity || existing.severity;
        existing.suggestions = insight.suggestions?.length > 0 ? insight.suggestions : existing.suggestions;
        existing.evidence = insight.evidence || existing.evidence;
        existing.expected_outcome = insight.expected_outcome || existing.expected_outcome;
        existing.contextSnapshot = contextSnapshot;
      } else {
        history.push({
          titleHash: hash,
          title: insight.title,
          type: insight.type || "INFO",
          severity: insight.severity || "LOW",
          message: insight.message || "",
          suggestions: Array.isArray(insight.suggestions) ? insight.suggestions : [],
          evidence: insight.evidence || "",
          expected_outcome: insight.expected_outcome || "",
          contextSnapshot,
          firstShown: now,
          lastShown: now,
          shownCount: 1,
          fetchIndex,
        });
      }
    }

    // Sort by most recent first, trim to 15
    history.sort((a, b) => b.fetchIndex - a.fetchIndex);
    const trimmed = history.slice(0, 15);

    localStorage.setItem(
      LAST_INSIGHTS_KEY,
      JSON.stringify({ version: 3, history: trimmed, fetchCounter: fetchIndex })
    );

    return { version: 3, history: trimmed, fetchCounter: fetchIndex };
  } catch {
    return historyState;
  }
}

/**
 * Build follow-up context by comparing past coaching insights to current data.
 * Checks whether the user acted on suggestions and whether metrics changed.
 */
export function buildFollowUpContext(historyState, currentData) {
  const { history } = historyState;
  if (!history || history.length === 0) return null;

  const { muscleSetsSummary, progressionTrends, activeExerciseNames } = currentData;

  // Parse current top weights from progression trend strings
  const currentTopWeights = {};
  if (Array.isArray(progressionTrends)) {
    for (const t of progressionTrends) {
      const match = t.match(/^(.+?):\s.*?→\s*([\d.]+)/);
      if (match) currentTopWeights[match[1].trim()] = parseFloat(match[2]);
    }
  }

  const activeNames = new Set((activeExerciseNames || []).map((n) => n.toLowerCase()));

  const followUps = [];
  for (const entry of history) {
    if (!entry.suggestions?.length && !entry.contextSnapshot) continue;

    const parts = [];

    // Check suggestion follow-through
    if (entry.suggestions?.length > 0) {
      for (const sug of entry.suggestions) {
        const sugName = sug.exercise?.toLowerCase();
        if (!sugName) continue;
        if (activeNames.has(sugName)) {
          parts.push(`User added ${sug.exercise}. ✓ Acted on advice.`);
        } else {
          parts.push(`User has not added ${sug.exercise} yet.`);
        }
      }
    }

    // Check metric changes from past snapshot
    if (entry.contextSnapshot) {
      const snap = entry.contextSnapshot;
      if (snap.muscleSets && muscleSetsSummary) {
        for (const [muscle, pastSets] of Object.entries(snap.muscleSets)) {
          const currentSets = muscleSetsSummary[muscle];
          if (currentSets != null && pastSets != null && currentSets !== pastSets) {
            const label = muscle.replace(/_/g, " ").toLowerCase();
            parts.push(`${label} volume: ${pastSets} → ${currentSets} sets. ${currentSets > pastSets ? "↑ Improved." : "↓ Decreased."}`);
          }
        }
      }
      if (snap.topWeights) {
        for (const [exercise, pastWeight] of Object.entries(snap.topWeights)) {
          const currentWeight = currentTopWeights[exercise];
          if (currentWeight != null && currentWeight !== pastWeight) {
            parts.push(`${exercise}: ${pastWeight} → ${currentWeight}. ${currentWeight > pastWeight ? "↑ Progressing." : "↓ Regressed."}`);
          } else if (currentWeight === pastWeight) {
            parts.push(`${exercise}: still at ${currentWeight}. → No change.`);
          }
        }
      }
    }

    if (parts.length > 0) {
      followUps.push({
        date: entry.lastShown,
        title: entry.title,
        type: entry.type,
        shownCount: entry.shownCount,
        followUp: parts,
      });
    }
  }

  return followUps.length > 0 ? followUps : null;
}

/**
 * Build coaching history payload for the edge function.
 * Includes full insight data + follow-up context for coaching continuity.
 */
export function buildCoachingHistoryPayload(historyState, followUpContext) {
  const { history } = historyState;
  if (!history || history.length === 0) return null;

  return {
    entries: history.slice(0, 5).map((h) => ({
      title: h.title,
      type: h.type,
      severity: h.severity || "LOW",
      message: (h.message || "").slice(0, 150),
      suggestions: h.suggestions || [],
      shownCount: h.shownCount,
      lastShown: h.lastShown,
    })),
    followUps: (followUpContext || []).slice(0, 3),
  };
}

// ---------------------------------------------------------------------------
// Strength / volume trends
// ---------------------------------------------------------------------------

/**
 * Max-weight progression per strength exercise (2+ sessions), first vs last.
 */
export function computeProgressionTrends(recentLogs, allWorkouts, weightLabel = "lb") {
  const exerciseMap = {};
  for (const w of allWorkouts || []) {
    for (const ex of w.exercises || []) {
      exerciseMap[ex.id] = { name: ex.name, unit: ex.unit || "reps" };
    }
  }

  // Collect per-exercise: array of { date, maxWeight }
  const byExercise = {};
  for (const [dateKey, dayLogs] of Object.entries(recentLogs || {})) {
    if (!dayLogs || typeof dayLogs !== "object") continue;
    for (const [exId, log] of Object.entries(dayLogs)) {
      const info = exerciseMap[exId];
      if (!info || info.unit !== "reps") continue; // Only strength exercises
      if (!log?.sets || !Array.isArray(log.sets)) continue;
      const maxWeight = Math.max(...log.sets.map((s) => Number(s.weight) || 0), 0);
      if (maxWeight <= 0) continue;
      if (!byExercise[exId]) byExercise[exId] = { name: info.name, entries: [] };
      byExercise[exId].entries.push({ date: dateKey, maxWeight });
    }
  }

  const trends = [];
  for (const { name, entries } of Object.values(byExercise)) {
    if (entries.length < 2) continue;
    entries.sort((a, b) => a.date.localeCompare(b.date));
    const first = entries[0].maxWeight;
    const last = entries[entries.length - 1].maxWeight;
    if (last > first) {
      trends.push(`${name}: ${first} → ${last} ${weightLabel} (UP)`);
    } else if (last < first) {
      trends.push(`${name}: ${first} → ${last} ${weightLabel} (DOWN)`);
    } else {
      trends.push(`${name}: ${last} ${weightLabel} (FLAT)`);
    }
  }

  return trends.length > 0 ? trends : null;
}

/**
 * Volume-load trends: sum(reps × weight) per session for strength exercises with
 * 2+ sessions. Compares first vs last session volume-load.
 */
export function computeVolumeLoadTrends(recentLogs, allWorkouts, weightLabel = "lb") {
  const exerciseMap = {};
  for (const w of allWorkouts || []) {
    for (const ex of w.exercises || []) {
      exerciseMap[ex.id] = { name: ex.name, unit: ex.unit || "reps" };
    }
  }

  // Collect per-exercise: array of { date, volumeLoad }
  const byExercise = {};
  for (const [dateKey, dayLogs] of Object.entries(recentLogs || {})) {
    if (!dayLogs || typeof dayLogs !== "object") continue;
    for (const [exId, log] of Object.entries(dayLogs)) {
      const info = exerciseMap[exId];
      if (!info || info.unit !== "reps") continue;
      if (!log?.sets || !Array.isArray(log.sets)) continue;
      const volumeLoad = log.sets.reduce(
        (sum, s) => sum + (Number(s.reps) || 0) * (Number(s.weight) || 0),
        0
      );
      if (volumeLoad <= 0) continue;
      if (!byExercise[exId]) byExercise[exId] = { name: info.name, entries: [] };
      byExercise[exId].entries.push({ date: dateKey, volumeLoad });
    }
  }

  const trends = [];
  for (const { name, entries } of Object.values(byExercise)) {
    if (entries.length < 2) continue;
    entries.sort((a, b) => a.date.localeCompare(b.date));
    const first = entries[0].volumeLoad;
    const last = entries[entries.length - 1].volumeLoad;
    const dir = last > first ? "UP" : last < first ? "DOWN" : "FLAT";
    trends.push(`${name}: ${first} → ${last} ${weightLabel}-reps (${dir})`);
  }

  return trends.length > 0 ? trends : null;
}

/**
 * Estimated 1RM trends using Epley: 1RM = weight × (1 + reps/30). Uses the
 * heaviest working set per session. Compares first vs last for 2+ sessions.
 */
export function computeEstimated1RMTrends(recentLogs, allWorkouts, weightLabel = "lb") {
  const exerciseMap = {};
  for (const w of allWorkouts || []) {
    for (const ex of w.exercises || []) {
      exerciseMap[ex.id] = { name: ex.name, unit: ex.unit || "reps" };
    }
  }

  // Collect per-exercise: array of { date, e1rm }
  const byExercise = {};
  for (const [dateKey, dayLogs] of Object.entries(recentLogs || {})) {
    if (!dayLogs || typeof dayLogs !== "object") continue;
    for (const [exId, log] of Object.entries(dayLogs)) {
      const info = exerciseMap[exId];
      if (!info || info.unit !== "reps") continue;
      if (!log?.sets || !Array.isArray(log.sets)) continue;

      // Find heaviest working set (highest weight where reps > 0)
      let bestE1rm = 0;
      for (const s of log.sets) {
        const w = Number(s.weight) || 0;
        const r = Number(s.reps) || 0;
        if (w <= 0 || r <= 0) continue;
        const e1rm = Math.round(w * (1 + r / 30));
        if (e1rm > bestE1rm) bestE1rm = e1rm;
      }
      if (bestE1rm <= 0) continue;
      if (!byExercise[exId]) byExercise[exId] = { name: info.name, entries: [] };
      byExercise[exId].entries.push({ date: dateKey, e1rm: bestE1rm });
    }
  }

  const trends = [];
  for (const { name, entries } of Object.values(byExercise)) {
    if (entries.length < 2) continue;
    entries.sort((a, b) => a.date.localeCompare(b.date));
    const first = entries[0].e1rm;
    const last = entries[entries.length - 1].e1rm;
    const dir = last > first ? "up" : last < first ? "down" : "flat";
    trends.push(`${name}: estimated max ${first} to ${last} ${weightLabel} (${dir})`);
  }

  return trends.length > 0 ? trends : null;
}

/**
 * Per-muscle-group set breakdown with exercise names + dates (secondary muscles
 * credited at 0.5×). Returns a plain-language multi-line string, or null.
 */
export function buildMuscleVolumeDetail(recentLogs, allWorkouts, dateRange, catalogMap) {
  // Build exercise ID → info map
  const exerciseIdToInfo = {};
  for (const w of allWorkouts || []) {
    for (const ex of w.exercises || []) {
      exerciseIdToInfo[ex.id] = {
        name: ex.name,
        unit: ex.unit || "reps",
        catalogId: ex.catalogId,
      };
    }
  }

  // Accumulate: muscleGroup → [ { name, sets, date } ]
  const muscleExercises = {};
  for (const [dateKey, dayLogs] of Object.entries(recentLogs || {})) {
    if (!dayLogs || typeof dayLogs !== "object") continue;
    if (dateKey < dateRange.start || dateKey > dateRange.end) continue;
    for (const [exId, log] of Object.entries(dayLogs)) {
      const info = exerciseIdToInfo[exId];
      if (!info) continue;
      if (!log?.sets || !Array.isArray(log.sets)) continue;
      // Only strength exercises (reps unit)
      if (info.unit !== "reps") continue;
      const workingSets = log.sets.filter((s) => (Number(s.reps) || 0) > 0).length;
      if (workingSets === 0) continue;

      // Look up primary + secondary muscles from catalog, fall back to keyword classification
      let primaryGroups = null;
      let secondaryGroups = [];
      if (info.catalogId && catalogMap) {
        const entry = catalogMap.get(info.catalogId);
        if (entry?.muscles?.primary?.length > 0) {
          primaryGroups = entry.muscles.primary;
          secondaryGroups = entry.muscles.secondary || [];
        }
      }
      if (!primaryGroups) {
        const keywordGroups = classifyExerciseMuscles(info.name);
        if (keywordGroups.length > 0 && keywordGroups[0] !== "UNCLASSIFIED") {
          primaryGroups = keywordGroups;
        }
      }
      if (!primaryGroups) continue; // Skip truly unclassifiable exercises

      for (const group of primaryGroups) {
        if (!muscleExercises[group]) muscleExercises[group] = [];
        muscleExercises[group].push({ name: info.name, sets: workingSets, date: dateKey, secondary: false });
      }
      for (const group of secondaryGroups) {
        if (!muscleExercises[group]) muscleExercises[group] = [];
        muscleExercises[group].push({ name: info.name, sets: workingSets * 0.5, date: dateKey, secondary: true });
      }
    }
  }

  // Format each muscle group with plain-language workload detail.
  const lines = [];
  const sortedGroups = Object.entries(muscleExercises).sort(
    ([, a], [, b]) => b.reduce((s, e) => s + e.sets, 0) - a.reduce((s, e) => s + e.sets, 0)
  );
  const grandTotalSets = sortedGroups.reduce(
    (sum, [, entries]) => sum + entries.reduce((s, e) => s + e.sets, 0), 0
  );
  for (const [group, entries] of sortedGroups) {
    const totalSets = entries.reduce((s, e) => s + e.sets, 0);
    // Merge same-exercise entries across dates
    const byName = {};
    for (const e of entries) {
      if (!byName[e.name]) byName[e.name] = { sets: 0, dates: [] };
      byName[e.name].sets += e.sets;
      const shortDate = e.date.slice(5); // "02-12" from "2026-02-12"
      if (!byName[e.name].dates.includes(shortDate)) byName[e.name].dates.push(shortDate);
    }
    const parts = Object.entries(byName).map(
      ([name, d]) => `${name} x${d.sets} (${d.dates.join(", ")})`
    );
    lines.push(`  ${group.replace(/_/g, " ").toLowerCase()}: ${totalSets} sets - ${parts.join(", ")}`);
  }

  return lines.length > 0 ? `Total: ${grandTotalSets} effective sets (incl. secondary at 0.5x)\n${lines.join("\n")}` : null;
}

// ---------------------------------------------------------------------------
// Model routing
// ---------------------------------------------------------------------------

/**
 * Compute a complexity score (0-7) to decide model routing.
 * Score >= 4 → gpt-4o (complex analysis), else → gpt-4o-mini (cheaper).
 *
 * Scoring factors:
 *   +1 if logged days in range >= 5
 *   +1 if unique exercises >= 8
 *   +1 if progression trends >= 4
 *   +1 if muscle groups >= 5
 *   +1 if user has sports
 *   +1 if tiered history present (recentHistory or olderHistory)
 *   +1 if previous insights >= 5 (anti-repetition harder → needs smarter model)
 */
export function computeComplexityScore({
  loggedDays = 0,
  exerciseCount = 0,
  trendCount = 0,
  muscleGroupCount = 0,
  hasSports = false,
  hasHistory = false,
  previousInsightCount = 0,
}) {
  let score = 0;
  if (loggedDays >= 5) score++;
  if (exerciseCount >= 8) score++;
  if (trendCount >= 4) score++;
  if (muscleGroupCount >= 5) score++;
  if (hasSports) score++;
  if (hasHistory) score++;
  if (previousInsightCount >= 5) score++;
  return score;
}
