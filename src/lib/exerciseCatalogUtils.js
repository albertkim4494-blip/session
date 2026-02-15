/**
 * Exercise catalog search and utility helpers.
 * Pure functions, no React dependency.
 */

/**
 * Normalize a search query — lowercase, trim, collapse whitespace.
 */
export function normalizeQuery(str) {
  return (str || "").toLowerCase().trim().replace(/\s+/g, " ");
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
    // No query — return all (filtered), up to limit
    let results = catalog;
    if (opts.equipment) results = results.filter((e) => e.equipment.includes(opts.equipment));
    if (opts.movement) results = results.filter((e) => e.movement === opts.movement);
    return results.slice(0, limit);
  }

  const scored = [];

  for (const entry of catalog) {
    // Apply filters first
    if (opts.equipment && !entry.equipment.includes(opts.equipment)) continue;
    if (opts.movement && entry.movement !== opts.movement) continue;

    const nameLower = entry.name.toLowerCase();
    let rank = Infinity;

    // Tier 1: name prefix
    if (nameLower.startsWith(q)) {
      rank = 1;
    }
    // Tier 2: name contains
    else if (nameLower.includes(q)) {
      rank = 2;
    }
    // Tier 3/4: alias match
    else if (entry.aliases) {
      for (const alias of entry.aliases) {
        const a = alias.toLowerCase();
        if (a.startsWith(q)) {
          rank = Math.min(rank, 3);
          break;
        } else if (a.includes(q)) {
          rank = Math.min(rank, 4);
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
