/**
 * Exercise GIF API — fetches exercise demonstration GIFs from the
 * open-source ExerciseDB v1 API (no API key needed).
 * Results are cached in localStorage so each exercise only needs one lookup ever.
 *
 * API: https://exercisedb-api.vercel.app
 * GIF CDN: https://static.exercisedb.dev/media/{id}.gif
 */

const API_BASE = "https://exercisedb-api.vercel.app/api/v1/exercises";
const CACHE_KEY = "wt_exercise_gifs_v2";

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
 * Get exercise GIF URL by name.
 * Returns { gifUrl, name } or null if not found.
 */
export async function getExerciseGif(exerciseName) {
  if (!exerciseName) return null;

  const key = exerciseName.toLowerCase().trim();
  const cache = getCache();

  // Return cached result (including null = "not found" sentinel)
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
