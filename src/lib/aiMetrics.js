/**
 * Lightweight localStorage-based AI quality metrics tracker.
 * Tracks success/failure rates for coach, program, and today generation.
 */

const STORAGE_KEY = "wt_ai_metrics";
const MAX_ENTRIES = 100;

/**
 * Record an AI event for observability.
 * @param {"ai_success"|"ai_parse_fail"|"ai_schema_fail"|"ai_fallback_used"|"ai_empty_workout"|"ai_repair_success"} event
 * @param {"coach"|"program"|"today"} feature
 * @param {Record<string, unknown>} [meta] - Optional metadata (error message, token counts, etc.)
 */
export function recordAiEvent(event, feature, meta) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const entries = raw ? JSON.parse(raw) : [];
    entries.push({
      event,
      feature,
      timestamp: new Date().toISOString(),
      ...(meta ? { meta } : {}),
    });
    // Keep only the most recent entries
    const trimmed = entries.slice(-MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get aggregated AI metrics from stored events.
 * @returns {{ total: number, byEvent: Record<string, number>, byFeature: Record<string, number>, last10: Array }}
 */
// ---------------------------------------------------------------------------
// Daily refresh rate limiting
// ---------------------------------------------------------------------------

const DAILY_REFRESH_KEY = "wt_coach_daily_refreshes";

/**
 * Get the number of manual coach refreshes used today.
 * Resets automatically when the date changes.
 */
export function getDailyRefreshCount() {
  try {
    const raw = localStorage.getItem(DAILY_REFRESH_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    if (parsed.date !== today) return 0;
    return parsed.count || 0;
  } catch {
    return 0;
  }
}

/**
 * Increment the daily refresh counter. Returns the new count.
 */
export function incrementDailyRefresh() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem(DAILY_REFRESH_KEY);
    let count = 0;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === today) count = parsed.count || 0;
    }
    count++;
    localStorage.setItem(DAILY_REFRESH_KEY, JSON.stringify({ date: today, count }));
    return count;
  } catch {
    return 1;
  }
}

export function getAiMetrics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const entries = raw ? JSON.parse(raw) : [];
    const byEvent = {};
    const byFeature = {};
    for (const e of entries) {
      byEvent[e.event] = (byEvent[e.event] || 0) + 1;
      byFeature[e.feature] = (byFeature[e.feature] || 0) + 1;
    }
    return {
      total: entries.length,
      byEvent,
      byFeature,
      last10: entries.slice(-10),
    };
  } catch {
    return { total: 0, byEvent: {}, byFeature: {}, last10: [] };
  }
}
