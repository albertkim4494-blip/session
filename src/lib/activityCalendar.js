// activityCalendar.js — pure helpers for the Progress-tab consistency heatmap.

import { isSetCompleted } from "./setHelpers.js";
import { weekStartOf, addDaysKey } from "./progressCharts.js";

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Completed-set count per day within a range.
 * @returns {Record<string, number>} dateKey → completed sets (only days with ≥1).
 */
export function buildDayActivity(logsByDate, startKey = null, endKey = null) {
  const map = {};
  if (!logsByDate) return map;
  for (const dk of Object.keys(logsByDate)) {
    if (!DATE_KEY_RE.test(dk)) continue;
    if (startKey && dk < startKey) continue;
    if (endKey && dk > endKey) continue;
    const day = logsByDate[dk];
    if (!day || typeof day !== "object") continue;
    let sets = 0;
    for (const exId of Object.keys(day)) {
      const log = day[exId];
      if (Array.isArray(log?.sets)) sets += log.sets.filter(isSetCompleted).length;
    }
    if (sets > 0) map[dk] = sets;
  }
  return map;
}

/**
 * Lay out a date range as GitHub-style week columns (each a 7-day array from the
 * configured week-start). Cells outside [startKey,endKey] are marked inRange:false.
 *
 * @returns {Array<Array<{date:string, sets:number, inRange:boolean}>>}
 */
export function buildCalendarWeeks(activityMap, startKey, endKey, weekStartsOn = 0) {
  if (!startKey || !endKey || startKey > endKey) return [];
  const weeks = [];
  let cur = weekStartOf(startKey, weekStartsOn);
  let guard = 0;
  while (cur <= endKey && guard < 520) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = addDaysKey(cur, i);
      week.push({ date: d, sets: (activityMap && activityMap[d]) || 0, inRange: d >= startKey && d <= endKey });
    }
    weeks.push(week);
    cur = addDaysKey(cur, 7);
    guard++;
  }
  return weeks;
}

/**
 * Bucket a completed-set count into an intensity level 0..4 for coloring.
 */
export function activityLevel(sets) {
  if (!sets || sets <= 0) return 0;
  if (sets <= 3) return 1;
  if (sets <= 6) return 2;
  if (sets <= 10) return 3;
  return 4;
}
