// Tests for activityCalendar.js — plain Node.js test script

const { buildDayActivity, buildCalendarWeeks, activityLevel } = await import("./activityCalendar.js");

let passed = 0;
let failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; }
  else { failed++; console.error("FAIL:", msg); }
}
const done = (reps) => ({ weight: "BW", reps, completed: true });
const notDone = (reps) => ({ weight: "BW", reps, completed: false });

// --- buildDayActivity ---
const logs = {
  "2026-01-05": { a: { sets: [done(5), done(5)] }, b: { sets: [done(8)] } }, // 3 completed
  "2026-01-06": { a: { sets: [notDone(5)] } },                                // 0 completed → excluded
  "2026-01-07": { a: { sets: [done(5), done(5), done(5), done(5)] } },        // 4
  "bad-key": { a: { sets: [done(5)] } },                                      // ignored
};
const act = buildDayActivity(logs);
assert(act["2026-01-05"] === 3, `Jan 5 → 3 sets (got ${act["2026-01-05"]})`);
assert(!("2026-01-06" in act), "Jan 6 excluded (no completed sets)");
assert(act["2026-01-07"] === 4, "Jan 7 → 4 sets");
assert(!("bad-key" in act), "non-date key ignored");

// range filter
const ranged = buildDayActivity(logs, "2026-01-06", "2026-01-31");
assert(!("2026-01-05" in ranged) && ranged["2026-01-07"] === 4, "range filter applied");

assert(Object.keys(buildDayActivity(null)).length === 0, "null logs → {}");

// --- activityLevel ---
assert(activityLevel(0) === 0, "level 0 for none");
assert(activityLevel(2) === 1, "level 1 for 1-3");
assert(activityLevel(5) === 2, "level 2 for 4-6");
assert(activityLevel(9) === 3, "level 3 for 7-10");
assert(activityLevel(15) === 4, "level 4 for 11+");

// --- buildCalendarWeeks ---
// Sunday-start. 2026-01-05 is a Monday; week starts Sun 2026-01-04.
const weeks = buildCalendarWeeks(act, "2026-01-05", "2026-01-18", 0);
assert(weeks.length >= 2, `spans multiple week columns (got ${weeks.length})`);
assert(weeks[0][0].date === "2026-01-04", `first cell = week start Sun 01-04 (got ${weeks[0][0].date})`);
assert(weeks[0][0].inRange === false, "01-04 is before start → out of range");
assert(weeks[0][1].date === "2026-01-05" && weeks[0][1].inRange === true, "01-05 in range");
const mon5 = weeks[0][1];
assert(mon5.sets === 3, `01-05 carries its set count (got ${mon5.sets})`);
assert(weeks[0].length === 7, "each week has 7 cells");

// Monday-start alignment
const weeksMon = buildCalendarWeeks(act, "2026-01-05", "2026-01-18", 1);
assert(weeksMon[0][0].date === "2026-01-05", `Mon-start: first cell = 01-05 (got ${weeksMon[0][0].date})`);

// edge cases
assert(buildCalendarWeeks(act, null, "2026-01-18").length === 0, "missing start → []");
assert(buildCalendarWeeks(act, "2026-02-01", "2026-01-01").length === 0, "start>end → []");

// --- Done ---
console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
