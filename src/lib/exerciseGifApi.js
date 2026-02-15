/**
 * Exercise GIF API — fallback search for custom/user exercises not in the catalog.
 *
 * Catalog exercises now have gifUrl directly on their entries.
 * This module is only used for custom exercises typed by users.
 *
 * API: https://exercisedb-api.vercel.app
 */

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
 * Search for a GIF for a custom exercise by name.
 * Returns { gifUrl, name } or null if not found.
 */
export async function getExerciseGif(exerciseName) {
  if (!exerciseName) return null;

  const key = exerciseName.toLowerCase().trim();
  const cache = getCache();
  if (key in cache) return cache[key];

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

    const exact = exercises.find((e) => e.name?.toLowerCase() === key);
    const best = exact || exercises[0];

    const result = { gifUrl: best.gifUrl, name: best.name };
    cache[key] = result;
    setCache(cache);
    return result;
  } catch {
    return null;
  }
}

/** Clear the GIF cache. */
export function clearGifCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {}
}
