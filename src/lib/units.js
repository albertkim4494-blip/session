// units.js — canonical body-weight unit conversion.
//
// Body weight is stored canonically in POUNDS (the `weight_lbs` column). The UI
// lets metric users enter/read kilograms, so convert at the storage boundary:
//   toLbs()   — display value (kg for metric) → stored pounds
//   fromLbs() — stored pounds → display value (kg for metric)
// Imperial is the identity in both directions.

const LB_PER_KG = 2.20462262;

function num(value) {
  // Treat null/undefined/blank as "no value" (Number("") would coerce to 0).
  if (value == null || (typeof value === "string" && value.trim() === "")) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Convert a user-entered weight in their display unit to canonical pounds. */
export function toLbs(value, system) {
  const n = num(value);
  if (n == null) return null;
  const lbs = system === "metric" ? n * LB_PER_KG : n;
  return Math.round(lbs * 10) / 10;
}

/** Convert canonical pounds to the user's display unit (kg for metric). */
export function fromLbs(lbs, system) {
  const n = num(lbs);
  if (n == null) return null;
  const out = system === "metric" ? n / LB_PER_KG : n;
  return Math.round(out * 10) / 10;
}
