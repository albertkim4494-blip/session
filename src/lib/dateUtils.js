export function yyyyMmDd(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function isValidDateKey(s) {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export function addDays(dateKey, delta) {
  const d = new Date(dateKey + "T00:00:00");
  d.setDate(d.getDate() + delta);
  return yyyyMmDd(d);
}

export function formatDateLabel(dateKey) {
  return new Date(dateKey + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function monthKeyFromDate(dateKey) {
  return dateKey.slice(0, 7);
}

export function daysInMonth(year, monthIndex0) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

export function weekdayMonday0(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  return (d.getDay() + 6) % 7;
}

export function weekdaySunday0(dateKey) {
  return new Date(dateKey + "T00:00:00").getDay();
}

// 0..6 offset from the user's chosen first day of week.
// weekStartsOn: 0=Sun, 1=Mon, ..., 6=Sat (matches JS Date#getDay)
export function weekdayIndex(dateKey, weekStartsOn = 0) {
  const dow = new Date(dateKey + "T00:00:00").getDay();
  return (dow - weekStartsOn + 7) % 7;
}

export function shiftMonth(monthKey, deltaMonths) {
  const [yy, mm] = monthKey.split("-").map(Number);
  const d = new Date(yy, mm - 1, 1);
  d.setMonth(d.getMonth() + deltaMonths);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonthLabel(monthKey) {
  const [yy, mm] = monthKey.split("-").map(Number);
  const d = new Date(yy, mm - 1, 1);
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

export function startOfWeekMonday(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  const day = d.getDay();
  const diffToMonday = (day + 6) % 7;
  d.setDate(d.getDate() - diffToMonday);
  return yyyyMmDd(d);
}

export function startOfWeekSunday(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  d.setDate(d.getDate() - d.getDay());
  return yyyyMmDd(d);
}

// Generalized — week begins on weekStartsOn (0=Sun, 1=Mon, ..., 6=Sat).
export function startOfWeek(dateKey, weekStartsOn = 0) {
  const d = new Date(dateKey + "T00:00:00");
  const offset = (d.getDay() - weekStartsOn + 7) % 7;
  d.setDate(d.getDate() - offset);
  return yyyyMmDd(d);
}

export function endOfWeek(dateKey, weekStartsOn = 0) {
  return addDays(startOfWeek(dateKey, weekStartsOn), 6);
}

export function startOfMonth(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  d.setDate(1);
  return yyyyMmDd(d);
}

export function startOfYear(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  d.setMonth(0, 1);
  return yyyyMmDd(d);
}

export function endOfWeekSunday(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  d.setDate(d.getDate() + (6 - d.getDay()));
  return yyyyMmDd(d);
}

export function endOfMonth(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  d.setMonth(d.getMonth() + 1, 0);
  return yyyyMmDd(d);
}

export function endOfYear(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  d.setFullYear(d.getFullYear(), 11, 31);
  return yyyyMmDd(d);
}

// String comparison works for YYYY-MM-DD format (lexicographic === chronological)
export function inRangeInclusive(dateKey, startKey, endKey) {
  return dateKey >= startKey && dateKey <= endKey;
}

// Day labels indexed by JS Date#getDay (0=Sun .. 6=Sat).
export const DAY_LABELS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_LABELS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Returns JS day-of-week values in display order starting from weekStartsOn.
// e.g. weekStartsOn=1 → [1,2,3,4,5,6,0]
export function orderedDayValues(weekStartsOn = 0) {
  return [0, 1, 2, 3, 4, 5, 6].map((i) => (weekStartsOn + i) % 7);
}
