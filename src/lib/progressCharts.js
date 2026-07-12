// progressCharts.js — pure data helpers for the Progress-tab charts (Phase 1).
// No React/DOM here so these stay unit-testable as plain Node scripts.

import { isSetCompleted } from "./setHelpers.js";

/**
 * Epley estimated 1-rep-max: 1RM = weight × (1 + reps/30).
 * Mirrors the formula in coachApi.js (computeEstimated1RMTrends).
 * @returns {number} estimated 1RM, or 0 if inputs are non-positive.
 */
export function epley1RM(weight, reps) {
  if (!(weight > 0) || !(reps > 0)) return 0;
  return weight * (1 + reps / 30);
}

function toNum(v) {
  const n = parseFloat(String(v ?? "").trim());
  return Number.isFinite(n) ? n : null;
}

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** ISO date key of the week-start containing `dk`, given weekStartsOn (0=Sun..6=Sat). */
export function weekStartOf(dk, weekStartsOn = 0) {
  const [y, m, d] = dk.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const diff = (dt.getUTCDay() - weekStartsOn + 7) % 7;
  dt.setUTCDate(dt.getUTCDate() - diff);
  return dt.toISOString().slice(0, 10);
}

/** Add `days` to an ISO date key (UTC-safe). */
function addDaysKey(dk, days) {
  const [y, m, d] = dk.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

/**
 * Build a per-session strength time series for one exercise.
 *
 * Exercises are matched by a set of ids (swapped/re-added variants of the same
 * movement share a name but differ by id — pass all of them). Only *completed*
 * sets with a numeric weight contribute; bodyweight ("BW") and blank-weight sets
 * are skipped for the strength chart (a known limitation tracked in the roadmap).
 *
 * @param {object} logsByDate - state.logsByDate
 * @param {string[]|string} ids - exercise id(s) to match
 * @param {string|null} startKey - inclusive ISO date lower bound (or null)
 * @param {string|null} endKey - inclusive ISO date upper bound (or null)
 * @returns {Array<{date:string, topWeight:number, e1rm:number, volume:number, sets:number}>}
 *   ascending by date; one entry per day that had ≥1 completed weighted set.
 */
export function buildStrengthSeries(logsByDate, ids, startKey = null, endKey = null) {
  if (!logsByDate || !ids) return [];
  const idList = Array.isArray(ids) ? ids : [ids];
  if (idList.length === 0) return [];

  const dates = Object.keys(logsByDate).filter((dk) => DATE_KEY_RE.test(dk)).sort();
  const out = [];

  for (const dk of dates) {
    if (startKey && dk < startKey) continue;
    if (endKey && dk > endKey) continue;

    let topWeight = 0;
    let bestE1rm = 0;
    let volume = 0;
    let setCount = 0;
    let sawNumeric = false;

    for (const id of idList) {
      const exLog = logsByDate[dk]?.[id];
      if (!exLog || !Array.isArray(exLog.sets)) continue;
      for (const s of exLog.sets) {
        if (!isSetCompleted(s)) continue;
        const w = toNum(s.weight);
        if (w == null) continue; // BW / blank — not a strength data point
        const reps = toNum(s.reps) ?? 0;
        sawNumeric = true;
        setCount++;
        if (w > topWeight) topWeight = w;
        if (reps > 0) volume += w * reps;
        const e = epley1RM(w, reps);
        if (e > bestE1rm) bestE1rm = e;
      }
    }

    if (sawNumeric) {
      out.push({
        date: dk,
        topWeight,
        e1rm: Math.round(bestE1rm),
        volume: Math.round(volume),
        sets: setCount,
      });
    }
  }

  return out;
}

/**
 * Build a per-session reps time series for a bodyweight exercise (pushups,
 * pullups, etc.), where progress means more reps rather than more load.
 * Counts every completed set with a finite rep count, regardless of weight.
 *
 * @returns {Array<{date:string, maxReps:number, totalReps:number, sets:number}>}
 *   ascending by date; one entry per day with ≥1 completed rep-based set.
 */
export function buildRepsSeries(logsByDate, ids, startKey = null, endKey = null) {
  if (!logsByDate || !ids) return [];
  const idList = Array.isArray(ids) ? ids : [ids];
  if (idList.length === 0) return [];

  const dates = Object.keys(logsByDate).filter((dk) => DATE_KEY_RE.test(dk)).sort();
  const out = [];

  for (const dk of dates) {
    if (startKey && dk < startKey) continue;
    if (endKey && dk > endKey) continue;

    let maxReps = 0;
    let totalReps = 0;
    let setCount = 0;

    for (const id of idList) {
      const exLog = logsByDate[dk]?.[id];
      if (!exLog || !Array.isArray(exLog.sets)) continue;
      for (const s of exLog.sets) {
        if (!isSetCompleted(s)) continue;
        const reps = toNum(s.reps);
        if (reps == null) continue;
        setCount++;
        totalReps += reps;
        if (reps > maxReps) maxReps = reps;
      }
    }

    if (setCount > 0) {
      out.push({ date: dk, maxReps, totalReps, sets: setCount });
    }
  }

  return out;
}

/**
 * Build a week-over-week total-volume series across ALL exercises (weighted
 * sets only; volume = weight × reps). Weeks with no volume between the first
 * and last active week are included as zeros so the trend reads honestly.
 *
 * @returns {Array<{weekStart:string, volume:number, sets:number}>} ascending.
 */
export function buildWeeklyVolumeSeries(logsByDate, startKey = null, endKey = null, weekStartsOn = 0) {
  if (!logsByDate) return [];
  const buckets = new Map(); // weekStart → { volume, sets }

  for (const dk of Object.keys(logsByDate)) {
    if (!DATE_KEY_RE.test(dk)) continue;
    if (startKey && dk < startKey) continue;
    if (endKey && dk > endKey) continue;

    const day = logsByDate[dk];
    if (!day || typeof day !== "object") continue;

    let dayVol = 0;
    let daySets = 0;
    for (const exId of Object.keys(day)) {
      const exLog = day[exId];
      if (!exLog || !Array.isArray(exLog.sets)) continue;
      for (const s of exLog.sets) {
        if (!isSetCompleted(s)) continue;
        const w = toNum(s.weight);
        const reps = toNum(s.reps) ?? 0;
        if (w == null || !(reps > 0)) continue;
        dayVol += w * reps;
        daySets++;
      }
    }

    if (daySets > 0) {
      const wk = weekStartOf(dk, weekStartsOn);
      const b = buckets.get(wk) || { volume: 0, sets: 0 };
      b.volume += dayVol;
      b.sets += daySets;
      buckets.set(wk, b);
    }
  }

  if (buckets.size === 0) return [];

  const weeks = [...buckets.keys()].sort();
  const first = weeks[0];
  const last = weeks[weeks.length - 1];
  const out = [];
  for (let wk = first; wk <= last; wk = addDaysKey(wk, 7)) {
    const b = buckets.get(wk);
    out.push({ weekStart: wk, volume: b ? Math.round(b.volume) : 0, sets: b ? b.sets : 0 });
  }
  return out;
}

/**
 * All-time personal records for an exercise (across the given ids). Each record
 * is the earliest date the best value was reached, or null if never.
 *
 * @param {string} [excludeKey] - a date key to skip (used to compute the prior
 *   best when detecting whether *today's* log is a new PR).
 * @returns {{topWeight:{value,date}|null, e1rm:{value,date}|null, maxReps:{value,date}|null}}
 */
export function computePRs(logsByDate, ids, excludeKey = null) {
  const idList = Array.isArray(ids) ? ids : [ids];
  const res = { topWeight: null, e1rm: null, maxReps: null };
  if (!logsByDate || idList.length === 0) return res;

  for (const dk of Object.keys(logsByDate)) {
    if (!DATE_KEY_RE.test(dk)) continue;
    if (excludeKey && dk === excludeKey) continue;
    for (const id of idList) {
      const exLog = logsByDate[dk]?.[id];
      if (!exLog || !Array.isArray(exLog.sets)) continue;
      for (const s of exLog.sets) {
        if (!isSetCompleted(s)) continue;
        const reps = toNum(s.reps);
        if (reps != null && reps > 0 && (!res.maxReps || reps > res.maxReps.value)) {
          res.maxReps = { value: reps, date: dk };
        }
        const w = toNum(s.weight);
        if (w != null) {
          if (!res.topWeight || w > res.topWeight.value) res.topWeight = { value: w, date: dk };
          const e = Math.round(epley1RM(w, reps ?? 0));
          if (e > 0 && (!res.e1rm || e > res.e1rm.value)) res.e1rm = { value: e, date: dk };
        }
      }
    }
  }
  return res;
}
