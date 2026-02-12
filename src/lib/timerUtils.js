/**
 * Returns true if the exercise unit supports a built-in timer.
 */
export function isTimerEligible(unitKey) {
  return unitKey === "sec";
}

/**
 * Format seconds into a human-readable timer display.
 * "45" | "1:30" | "1:05:30"
 */
export function formatTimerDisplay(totalSec) {
  const s = Math.max(0, Math.round(totalSec));
  if (s < 60) return String(s);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  if (mins < 60) return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  const hrs = Math.floor(mins / 60);
  const m = mins % 60;
  return `${hrs}:${m < 10 ? "0" : ""}${m}:${secs < 10 ? "0" : ""}${secs}`;
}

/**
 * Exponential moving average for learned rest times.
 * @param {number|undefined} current - current average (undefined if first observation)
 * @param {number} observed - new observation in seconds
 * @param {number} alpha - smoothing factor (0-1), higher = more weight on new observation
 * @returns {number} updated average, rounded to nearest second
 */
export function updateRestAverage(current, observed, alpha = 0.3) {
  if (current == null || current <= 0) return Math.round(observed);
  return Math.round(current * (1 - alpha) + observed * alpha);
}
