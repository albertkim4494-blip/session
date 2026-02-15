/**
 * Client-side animation fetching with 4-tier cache:
 *   1. In-memory Map (instant)
 *   2. localStorage (wt_anim_cache)
 *   3. Supabase Storage (pre-generated JSON files)
 *   4. Edge function (generate on-demand via AI)
 */
import { supabase } from "./supabase";
import { getCachedAnimation, setCachedAnimation } from "./animationData";

const LS_KEY = "wt_anim_cache";
const STORAGE_BUCKET = "exercise-animations";
const EDGE_FN = "ai-exercise-animation";

// ── localStorage cache helpers ─────────────────────────────────────────────
function loadLSCache() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveLSCache(cache) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(cache));
  } catch {
    // Storage full — evict oldest entries
    try {
      const entries = Object.entries(cache);
      if (entries.length > 20) {
        const trimmed = Object.fromEntries(entries.slice(-20));
        localStorage.setItem(LS_KEY, JSON.stringify(trimmed));
      }
    } catch {
      // Give up on localStorage
    }
  }
}

function getLSAnimation(exerciseId) {
  const cache = loadLSCache();
  return cache[exerciseId] || null;
}

function setLSAnimation(exerciseId, data) {
  const cache = loadLSCache();
  cache[exerciseId] = data;
  saveLSCache(cache);
}

// ── Supabase Storage fetch ─────────────────────────────────────────────────
async function fetchFromStorage(exerciseId) {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(`${exerciseId}.json`);
    if (error || !data) return null;
    const text = await data.text();
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// ── Edge function (AI generation) ──────────────────────────────────────────
async function generateAnimation(exerciseId, name, meta) {
  try {
    const body = {
      exerciseId,
      exerciseName: name,
      muscles: meta?.muscles,
      equipment: meta?.equipment,
      movement: meta?.movement,
    };

    const { data, error } = await supabase.functions.invoke(EDGE_FN, { body });
    if (error) {
      console.error("Animation generation error:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Animation generation failed:", err);
    return null;
  }
}

// ── In-flight dedup ────────────────────────────────────────────────────────
const _inflight = new Map();

/**
 * Fetch animation data for an exercise with 4-tier caching.
 *
 * @param {string} exerciseId - Catalog ID or custom exercise ID
 * @param {string} name - Exercise display name (for AI generation)
 * @param {object} [meta] - { muscles, equipment, movement } for AI context
 * @returns {Promise<object|null>} Animation data or null if unavailable
 */
export async function fetchAnimation(exerciseId, name, meta) {
  if (!exerciseId) return null;

  // Tier 1: In-memory
  const memCached = getCachedAnimation(exerciseId);
  if (memCached) return memCached;

  // Tier 2: localStorage
  const lsCached = getLSAnimation(exerciseId);
  if (lsCached) {
    setCachedAnimation(exerciseId, lsCached);
    return lsCached;
  }

  // Dedup concurrent requests for the same exercise
  if (_inflight.has(exerciseId)) {
    return _inflight.get(exerciseId);
  }

  const promise = (async () => {
    // Tier 3: Supabase Storage
    let anim = await fetchFromStorage(exerciseId);
    if (anim) {
      setCachedAnimation(exerciseId, anim);
      setLSAnimation(exerciseId, anim);
      return anim;
    }

    // Tier 4: AI generation
    anim = await generateAnimation(exerciseId, name, meta);
    if (anim) {
      setCachedAnimation(exerciseId, anim);
      setLSAnimation(exerciseId, anim);
      return anim;
    }

    return null;
  })();

  _inflight.set(exerciseId, promise);
  try {
    return await promise;
  } finally {
    _inflight.delete(exerciseId);
  }
}

/**
 * Preload animation data for an exercise (fire-and-forget).
 */
export function preloadAnimation(exerciseId, name, meta) {
  if (!exerciseId || getCachedAnimation(exerciseId)) return;
  fetchAnimation(exerciseId, name, meta).catch(() => {});
}
