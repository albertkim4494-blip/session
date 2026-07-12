// muscleBalance.js — pure helper aggregating completed sets into the 6 UI
// muscle groups for the Progress-tab balance view. No React/DOM.

import { isSetCompleted } from "./setHelpers.js";
import { muscleToUiGroup, UI_GROUP_CONFIG, UI_MUSCLE_GROUPS } from "./muscleGroups.js";

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;
const SECONDARY_WEIGHT = 0.5;

/**
 * Sets-per-muscle-group over a date range, aggregated into the 6 UI groups.
 *
 * A strength exercise contributes its completed-set count to each *primary* UI
 * group it trains (deduped) and half that to each *secondary* group not already
 * primary — mirroring the coach's effective-set weighting. Muscles resolve from
 * the catalog (by catalogId) and fall back to keyword classification by name.
 * Non-strength units (time/distance) are ignored.
 *
 * @param {object} logsByDate
 * @param {object[]} workouts - exercise universe (for id → {name,unit,catalogId})
 * @param {string|null} startKey
 * @param {string|null} endKey
 * @param {Map} [catalogMap] - catalogId → entry with muscles.primary/secondary
 * @param {(name:string)=>string[]} [classifyFn] - keyword fallback → muscle enums
 * @returns {Array<{group:string, label:string, sets:number}>} all 6 groups, in
 *   canonical order, with rounded set counts (0 for untrained groups).
 */
export function buildMuscleBalance(logsByDate, workouts, startKey = null, endKey = null, catalogMap = null, classifyFn = null) {
  const totals = {};
  for (const g of UI_MUSCLE_GROUPS) totals[g] = 0;

  if (!logsByDate) return finalize(totals);

  // exId → { name, unit, catalogId }
  const infoById = {};
  for (const w of workouts || []) {
    for (const ex of w.exercises || []) {
      infoById[ex.id] = { name: ex.name, unit: ex.unit || "reps", catalogId: ex.catalogId };
    }
  }

  for (const dk of Object.keys(logsByDate)) {
    if (!DATE_KEY_RE.test(dk)) continue;
    if (startKey && dk < startKey) continue;
    if (endKey && dk > endKey) continue;
    const day = logsByDate[dk];
    if (!day || typeof day !== "object") continue;

    for (const exId of Object.keys(day)) {
      const info = infoById[exId];
      if (!info || info.unit !== "reps") continue;
      const log = day[exId];
      if (!log || !Array.isArray(log.sets)) continue;
      const workingSets = log.sets.filter((s) => isSetCompleted(s)).length;
      if (workingSets === 0) continue;

      // Resolve primary / secondary internal muscles.
      let primary = [];
      let secondary = [];
      if (info.catalogId && catalogMap) {
        const entry = catalogMap.get(info.catalogId);
        if (entry?.muscles?.primary?.length > 0) {
          primary = entry.muscles.primary;
          secondary = entry.muscles.secondary || [];
        }
      }
      if (primary.length === 0 && classifyFn) {
        const kw = classifyFn(info.name);
        if (kw.length > 0 && kw[0] !== "UNCLASSIFIED") primary = kw;
      }
      if (primary.length === 0) continue;

      const primGroups = new Set(primary.map((m) => muscleToUiGroup[m]).filter(Boolean));
      const secGroups = new Set(secondary.map((m) => muscleToUiGroup[m]).filter(Boolean));
      for (const g of primGroups) totals[g] += workingSets;
      for (const g of secGroups) {
        if (!primGroups.has(g)) totals[g] += workingSets * SECONDARY_WEIGHT;
      }
    }
  }

  return finalize(totals);
}

function finalize(totals) {
  return UI_MUSCLE_GROUPS.map((g) => ({
    group: g,
    label: UI_GROUP_CONFIG[g].label,
    sets: Math.round((totals[g] || 0) * 10) / 10,
  }));
}
