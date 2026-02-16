/**
 * Exercise catalog search and utility helpers.
 * Pure functions, no React dependency.
 */

import { getMusclesForUiGroup } from "./muscleGroups.js";

/**
 * Normalize a search query — lowercase, trim, collapse whitespace.
 */
export function normalizeQuery(str) {
  return (str || "").toLowerCase().trim().replace(/[-_]/g, " ").replace(/\s+/g, " ");
}

/**
 * Stem a query by stripping common English suffixes.
 * planks→plank, curling→curl, presses→press
 */
export function stemQuery(q) {
  if (q.length > 5 && q.endsWith("ing")) return q.slice(0, -3);
  if (q.length > 4 && q.endsWith("es")) return q.slice(0, -2);
  if (q.length > 3 && q.endsWith("s")) return q.slice(0, -1);
  return q;
}

/**
 * Levenshtein distance with early bail when distance exceeds maxDist.
 * Only useful for short words (3–10 chars).
 */
export function levenshtein(a, b, maxDist = 2) {
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > maxDist) return maxDist + 1;

  const prev = Array.from({ length: lb + 1 }, (_, i) => i);
  const curr = new Array(lb + 1);

  for (let i = 1; i <= la; i++) {
    curr[0] = i;
    let rowMin = i;
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > maxDist) return maxDist + 1;
    for (let j = 0; j <= lb; j++) prev[j] = curr[j];
  }
  return prev[lb];
}

/**
 * Build a Map<catalogId, entry> for O(1) lookups.
 */
export function buildCatalogMap(catalog) {
  const map = new Map();
  for (const entry of catalog) {
    map.set(entry.id, entry);
  }
  return map;
}

/**
 * Ranked search across name, aliases, muscles, equipment, and tags.
 *
 * Ranking tiers (lower = better):
 *   1. Name starts with query
 *   2. Name contains query
 *   3. Alias starts with query
 *   4. Alias contains query
 *   5. Muscle group match
 *   6. Equipment / tag match
 *
 * @param {Array} catalog - EXERCISE_CATALOG array
 * @param {string} query - raw user input
 * @param {object} [opts]
 * @param {number} [opts.limit=20]
 * @param {string} [opts.equipment] - filter to a specific equipment string
 * @param {string} [opts.movement] - filter to a specific movement category
 * @returns {Array} matching catalog entries, sorted by relevance
 */
export function catalogSearch(catalog, query, opts = {}) {
  const q = normalizeQuery(query);
  const limit = opts.limit ?? 20;

  if (!q) {
    // No query — return all (filtered), sorted alphabetically, up to limit
    let results = [...catalog];
    if (opts.equipment) results = results.filter((e) => (e.equipment || []).includes(opts.equipment));
    if (opts.movement) results = results.filter((e) => e.movement === opts.movement);
    results.sort((a, b) => a.name.localeCompare(b.name));
    return results.slice(0, limit);
  }

  const stemmed = stemQuery(q);
  const hasStem = stemmed !== q;
  // Compact form (spaces removed) for matching "pushup" ↔ "push up"
  const qCompact = q.replace(/\s+/g, "");
  const stemCompact = hasStem ? stemmed.replace(/\s+/g, "") : "";
  const scored = [];

  for (const entry of catalog) {
    // Apply filters first
    if (opts.equipment && !(entry.equipment || []).includes(opts.equipment)) continue;
    if (opts.movement && entry.movement !== opts.movement) continue;

    const nameLower = entry.name.toLowerCase().replace(/[-_]/g, " ");
    const nameCompact = nameLower.replace(/\s+/g, "");
    let rank = Infinity;

    // Tier 1: name prefix (spaced or compact)
    if (nameLower.startsWith(q) || nameCompact.startsWith(qCompact) ||
        (hasStem && (nameLower.startsWith(stemmed) || nameCompact.startsWith(stemCompact)))) {
      rank = 1;
    }
    // Tier 2: name contains (spaced or compact)
    else if (nameLower.includes(q) || nameCompact.includes(qCompact) ||
             (hasStem && (nameLower.includes(stemmed) || nameCompact.includes(stemCompact)))) {
      rank = 2;
    }
    // Tier 3/4: alias match (spaced or compact)
    else if (entry.aliases) {
      for (const alias of entry.aliases) {
        const a = alias.toLowerCase().replace(/[-_]/g, " ");
        const ac = a.replace(/\s+/g, "");
        if (a.startsWith(q) || ac.startsWith(qCompact) ||
            (hasStem && (a.startsWith(stemmed) || ac.startsWith(stemCompact)))) {
          rank = Math.min(rank, 3);
          break;
        } else if (a.includes(q) || ac.includes(qCompact) ||
                   (hasStem && (a.includes(stemmed) || ac.includes(stemCompact)))) {
          rank = 4;
          break;
        }
      }
    }

    // Tier 5: muscle group match
    if (rank === Infinity && entry.muscles?.primary) {
      for (const m of entry.muscles.primary) {
        if (m.toLowerCase().includes(q) || q.includes(m.toLowerCase().replace(/_/g, " "))) {
          rank = 5;
          break;
        }
      }
    }

    // Tier 6: equipment / tag match
    if (rank === Infinity) {
      const haystack = [...(entry.equipment || []), ...(entry.tags || [])].join(" ").toLowerCase();
      if (haystack.includes(q)) {
        rank = 6;
      }
    }

    // Tier 7: Levenshtein fuzzy match
    if (rank === Infinity && q.length >= 3 && q.length <= 10) {
      const threshold = q.length <= 5 ? 1 : 2;
      const nameWords = nameLower.split(/\s+/);
      for (const w of nameWords) {
        if (levenshtein(q, w, threshold) <= threshold) {
          rank = 7;
          break;
        }
      }
      if (rank === Infinity && entry.aliases) {
        outer: for (const alias of entry.aliases) {
          const aliasWords = alias.toLowerCase().split(/\s+/);
          for (const w of aliasWords) {
            if (levenshtein(q, w, threshold) <= threshold) {
              rank = 7;
              break outer;
            }
          }
        }
      }
    }

    if (rank < Infinity) {
      scored.push({ entry, rank });
    }
  }

  scored.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.entry.name.localeCompare(b.entry.name);
  });

  return scored.slice(0, limit).map((s) => s.entry);
}

/**
 * Get exercises the user has used most recently.
 * Returns array of { exerciseId, name, unit, date }.
 */
export function getRecentExercises({ logsByDate, workouts, limit = 10 }) {
  // Build exercise id → info map
  const idToInfo = new Map();
  for (const w of workouts || []) {
    for (const ex of w.exercises || []) {
      idToInfo.set(ex.id, { name: ex.name, unit: ex.unit || "reps" });
    }
  }

  const seen = new Set();
  const results = [];

  // Walk dates in reverse chronological order
  const dates = Object.keys(logsByDate || {}).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().reverse();

  for (const date of dates) {
    const dayLogs = logsByDate[date];
    if (!dayLogs || typeof dayLogs !== "object") continue;
    for (const exerciseId of Object.keys(dayLogs)) {
      if (seen.has(exerciseId)) continue;
      seen.add(exerciseId);
      const info = idToInfo.get(exerciseId);
      if (info) {
        results.push({ exerciseId, name: info.name, unit: info.unit, date });
      }
      if (results.length >= limit) return results;
    }
  }

  return results;
}

/**
 * Get most-used exercises within a rolling window.
 * Returns array of { exerciseId, name, unit, count } sorted by count desc.
 */
export function getFrequentExercises({ logsByDate, workouts, windowDays = 30, limit = 10 }) {
  const idToInfo = new Map();
  for (const w of workouts || []) {
    for (const ex of w.exercises || []) {
      idToInfo.set(ex.id, { name: ex.name, unit: ex.unit || "reps" });
    }
  }

  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - windowDays);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const counts = new Map();

  for (const [date, dayLogs] of Object.entries(logsByDate || {})) {
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    if (date < cutoffStr) continue;
    if (!dayLogs || typeof dayLogs !== "object") continue;
    for (const exerciseId of Object.keys(dayLogs)) {
      counts.set(exerciseId, (counts.get(exerciseId) || 0) + 1);
    }
  }

  const results = [];
  for (const [exerciseId, count] of counts.entries()) {
    const info = idToInfo.get(exerciseId);
    if (info) {
      results.push({ exerciseId, name: info.name, unit: info.unit, count });
    }
  }

  results.sort((a, b) => b.count - a.count);
  return results.slice(0, limit);
}

/**
 * Returns true if the catalog entry has equipment: ["bodyweight"] only.
 * Exercises with additional equipment (e.g. pull-up bar) are NOT auto-bodyweight.
 */
export function isBodyweightOnly(entry) {
  if (!entry?.equipment || !Array.isArray(entry.equipment)) return false;
  return entry.equipment.length === 1 && entry.equipment[0] === "bodyweight";
}

/**
 * Resolve catalog metadata for an exercise.
 * Returns the catalog entry if the exercise has a catalogId, else null.
 */
export function resolveExerciseDisplay(exercise, catalogMap) {
  if (!exercise?.catalogId || !catalogMap) return null;
  return catalogMap.get(exercise.catalogId) || null;
}

/**
 * Pre-filter catalog by structured criteria (muscle group, equipment, type, sport).
 * Separated from `catalogSearch` which handles text matching.
 *
 * @param {Array} catalog - EXERCISE_CATALOG array
 * @param {object} [filters]
 * @param {string} [filters.uiMuscleGroup] - single UI muscle group key ("CHEST", "LEGS", etc.)
 * @param {string[]} [filters.uiMuscleGroups] - multiple UI muscle group keys (union / OR)
 * @param {Set} [filters.equipment] - equipment strings to require (entry must have at least one)
 * @param {"exercise"|"stretch"|"sport"} [filters.typeFilter] - filter by exercise type
 * @param {string} [filters.sportId] - specific catalog entry id for a sport
 * @returns {Array} filtered catalog entries
 */
export function filterCatalog(catalog, { uiMuscleGroup, uiMuscleGroups, equipment, typeFilter, sportId } = {}) {
  // Build combined target muscle set from single group or array of groups
  let targetMuscles = null;
  if (uiMuscleGroups?.length > 0) {
    targetMuscles = new Set();
    for (const g of uiMuscleGroups) for (const m of getMusclesForUiGroup(g)) targetMuscles.add(m);
  } else if (uiMuscleGroup) {
    targetMuscles = new Set(getMusclesForUiGroup(uiMuscleGroup));
  }
  return catalog.filter((entry) => {
    if (sportId && entry.id !== sportId) return false;
    // Type filter: "exercise" excludes sport+stretch+custom, "stretch" only stretch, "sport" only sport, "custom" only custom
    if (typeFilter === "exercise" && (entry.movement === "sport" || entry.movement === "stretch" || entry.custom)) return false;
    if (typeFilter === "stretch" && entry.movement !== "stretch") return false;
    if (typeFilter === "sport" && entry.movement !== "sport") return false;
    if (typeFilter === "custom" && !entry.custom) return false;
    if (targetMuscles) {
      // Sport entries have no muscles — let them through when typeFilter=sport
      if (typeFilter !== "sport") {
        const all = [...(entry.muscles?.primary || []), ...(entry.muscles?.secondary || [])];
        if (!all.some(m => targetMuscles.has(m))) return false;
      }
    }
    if (equipment?.size > 0 && !(entry.equipment || []).some(e => equipment.has(e))) return false;
    return true;
  });
}

/**
 * Get muscle groups for an exercise using catalog data first, falling back
 * to the keyword-based classifyExerciseMuscles from coachNormalize.
 */
export function getMuscleGroups(exercise, catalogMap, keywordFallback) {
  if (exercise?.catalogId && catalogMap) {
    const entry = catalogMap.get(exercise.catalogId);
    if (entry?.muscles?.primary?.length > 0) {
      // Return combined primary + secondary for full muscle coverage
      const all = [...entry.muscles.primary, ...(entry.muscles.secondary || [])];
      return [...new Set(all)];
    }
  }
  // Fall back to keyword-based classification
  if (keywordFallback) {
    return keywordFallback(exercise?.name || "");
  }
  return ["UNCLASSIFIED"];
}
