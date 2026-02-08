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
