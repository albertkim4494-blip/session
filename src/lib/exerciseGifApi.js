/**
 * Exercise GIF API — resolves exercise demonstration GIFs.
 *
 * 1. Static map (exerciseGifMap.js) — pre-matched catalog exercises, instant
 * 2. API search fallback — for custom/unmapped exercises, cached in localStorage
 *
 * API: https://exercisedb-api.vercel.app
 * GIF CDN: https://static.exercisedb.dev/media/{id}.gif
 */
import { EXERCISE_GIF_MAP } from "./exerciseGifMap";

const API_BASE = "https://exercisedb-api.vercel.app/api/v1/exercises";
const CACHE_KEY = "wt_exercise_gifs_v3";

function getCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function setCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

/**
 * Get exercise GIF URL.
 * @param {string} exerciseName - display name of the exercise
 * @param {string} [catalogId] - optional catalog ID for static map lookup
 * Returns { gifUrl, name } or null if not found.
 */
export async function getExerciseGif(exerciseName, catalogId) {
  if (!exerciseName) return null;

  // 1. Static map lookup by catalogId (instant, most accurate)
  if (catalogId && EXERCISE_GIF_MAP[catalogId]) {
    return { gifUrl: EXERCISE_GIF_MAP[catalogId], name: exerciseName };
  }

  // 2. Check localStorage cache for custom exercises
  const key = exerciseName.toLowerCase().trim();
  const cache = getCache();
  if (key in cache) return cache[key];

  // 3. API search fallback
  try {
    const encoded = encodeURIComponent(key);
    const res = await fetch(`${API_BASE}?search=${encoded}&limit=5`);

    if (!res.ok) {
      cache[key] = null;
      setCache(cache);
      return null;
    }

    const json = await res.json();
    const exercises = json.data;

    if (!Array.isArray(exercises) || exercises.length === 0) {
      cache[key] = null;
      setCache(cache);
      return null;
    }

    // Prefer exact name match, fall back to first result
    const exact = exercises.find((e) => e.name?.toLowerCase() === key);
    const best = exact || exercises[0];

    const result = { gifUrl: best.gifUrl, name: best.name };
    cache[key] = result;
    setCache(cache);
    return result;
  } catch {
    // Network error — don't cache, allow retry
    return null;
  }
}

/** Clear the GIF cache (useful if data updates). */
export function clearGifCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {}
}
