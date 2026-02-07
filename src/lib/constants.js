export const LS_KEY = "workout_tracker_v2";
export const LS_BACKUP_KEY = "workout_tracker_v2_backup";

export const REP_UNITS = [
  // Count
  { key: "reps", label: "Reps", abbr: "reps", allowDecimal: false },
  // Distance (imperial)
  { key: "miles", label: "Miles", abbr: "mi", allowDecimal: true },
  { key: "yards", label: "Yards", abbr: "yd", allowDecimal: false },
  { key: "laps", label: "Laps", abbr: "laps", allowDecimal: false },
  { key: "steps", label: "Steps", abbr: "steps", allowDecimal: false },
  // Time
  { key: "sec", label: "Seconds", abbr: "sec", allowDecimal: true },
  { key: "min", label: "Minutes", abbr: "min", allowDecimal: true },
  { key: "hrs", label: "Hours", abbr: "hrs", allowDecimal: true },
];

export function getUnit(key, exercise) {
  if (key === "custom" && exercise) {
    return {
      key: "custom",
      label: exercise.customUnitAbbr || "custom",
      abbr: exercise.customUnitAbbr || "custom",
      allowDecimal: exercise.customUnitAllowDecimal ?? false,
    };
  }
  return REP_UNITS.find((u) => u.key === key) || REP_UNITS[0];
}
