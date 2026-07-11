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
