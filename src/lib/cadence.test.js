// Tests for cadence.js — plain Node.js test script

const {
  CADENCE_MODES,
  SPLIT_MODES,
  defaultCadence,
  normalizeCadence,
  ensureCadence,
  dayOfWeek,
  isAnchorScheduledFor,
  isWeeklyPreferredFor,
  weekStartKey,
  defaultSplit,
  normalizeSplit,
  getScheduledForDate,
} = await import("./cadence.js");

let passed = 0;
let failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; }
  else { failed++; console.error("FAIL:", msg); }
}

// --- defaultCadence ---
assert(defaultCadence().mode === CADENCE_MODES.WHENEVER, "default is whenever");

// --- normalizeCadence ---
assert(normalizeCadence(null).mode === CADENCE_MODES.WHENEVER, "normalize null → whenever");
assert(normalizeCadence(undefined).mode === CADENCE_MODES.WHENEVER, "normalize undefined → whenever");
assert(normalizeCadence({ mode: "garbage" }).mode === CADENCE_MODES.WHENEVER, "normalize unknown mode → whenever");

// Anchor normalization
const anchorOk = normalizeCadence({ mode: "anchor", days: [3, 1, 1, 8, -1, "x"] });
assert(anchorOk.mode === "anchor", "anchor: mode preserved");
assert(JSON.stringify(anchorOk.days) === "[1,3]", `anchor: days deduped/filtered/sorted (got ${JSON.stringify(anchorOk.days)})`);

const anchorEmpty = normalizeCadence({ mode: "anchor" });
assert(JSON.stringify(anchorEmpty.days) === "[]", "anchor: missing days → []");

// Weekly normalization
const weekOk = normalizeCadence({ mode: "weekly", perWeek: 3, preferredDays: [1, 5], skipIfMissed: false });
assert(weekOk.mode === "weekly", "weekly: mode preserved");
assert(weekOk.perWeek === 3, "weekly: perWeek preserved");
assert(JSON.stringify(weekOk.preferredDays) === "[1,5]", "weekly: preferredDays preserved");
assert(weekOk.skipIfMissed === false, "weekly: explicit false preserved");

const weekDefaults = normalizeCadence({ mode: "weekly" });
assert(weekDefaults.perWeek === 1, "weekly: missing perWeek → 1");
assert(weekDefaults.skipIfMissed === true, "weekly: missing skipIfMissed → true");
assert(JSON.stringify(weekDefaults.preferredDays) === "[]", "weekly: missing preferredDays → []");

const weekClamp = normalizeCadence({ mode: "weekly", perWeek: 99 });
assert(weekClamp.perWeek === 1, "weekly: perWeek out of range → 1");

const weekRound = normalizeCadence({ mode: "weekly", perWeek: 2.7 });
assert(weekRound.perWeek === 3, "weekly: perWeek rounded");

// Continuous
assert(normalizeCadence({ mode: "continuous" }).mode === "continuous", "continuous: mode preserved");

// --- ensureCadence ---
const w1 = { id: "w1", name: "Test" };
ensureCadence(w1);
assert(w1.cadence?.mode === CADENCE_MODES.WHENEVER, "ensureCadence: stamps default on missing");

const w2 = { id: "w2", name: "Test", cadence: { mode: "anchor", days: [1] } };
ensureCadence(w2);
assert(w2.cadence?.mode === "anchor", "ensureCadence: preserves valid existing");
assert(JSON.stringify(w2.cadence.days) === "[1]", "ensureCadence: preserves days");

const w3 = { id: "w3", name: "Test", cadence: { mode: "garbage" } };
ensureCadence(w3);
assert(w3.cadence?.mode === CADENCE_MODES.WHENEVER, "ensureCadence: invalid mode reset to whenever");

// --- dayOfWeek ---
// 2026-05-04 was a Monday
assert(dayOfWeek("2026-05-04") === 1, `dayOfWeek("2026-05-04") → Mon (1), got ${dayOfWeek("2026-05-04")}`);
// 2026-05-10 was a Sunday
assert(dayOfWeek("2026-05-10") === 0, `dayOfWeek("2026-05-10") → Sun (0), got ${dayOfWeek("2026-05-10")}`);
// 2026-05-09 was a Saturday
assert(dayOfWeek("2026-05-09") === 6, `dayOfWeek("2026-05-09") → Sat (6), got ${dayOfWeek("2026-05-09")}`);

// --- isAnchorScheduledFor ---
const anchorMW = { mode: "anchor", days: [1, 3] };
assert(isAnchorScheduledFor(anchorMW, "2026-05-04") === true, "anchor M/W: true on Monday");
assert(isAnchorScheduledFor(anchorMW, "2026-05-06") === true, "anchor M/W: true on Wednesday");
assert(isAnchorScheduledFor(anchorMW, "2026-05-05") === false, "anchor M/W: false on Tuesday");
assert(isAnchorScheduledFor({ mode: "anchor", days: [] }, "2026-05-04") === false, "anchor empty: always false");
assert(isAnchorScheduledFor({ mode: "weekly", perWeek: 3 }, "2026-05-04") === false, "weekly cadence is not an anchor");
assert(isAnchorScheduledFor(null, "2026-05-04") === false, "null cadence: false");

// --- isWeeklyPreferredFor ---
const weeklyTSat = { mode: "weekly", perWeek: 2, preferredDays: [2, 6], skipIfMissed: true };
assert(isWeeklyPreferredFor(weeklyTSat, "2026-05-05") === true, "weekly preferred: Tue ✓");
assert(isWeeklyPreferredFor(weeklyTSat, "2026-05-09") === true, "weekly preferred: Sat ✓");
assert(isWeeklyPreferredFor(weeklyTSat, "2026-05-04") === false, "weekly preferred: Mon ✗");
assert(isWeeklyPreferredFor({ mode: "weekly", perWeek: 3 }, "2026-05-04") === false, "weekly with no preferredDays: always false");
assert(isWeeklyPreferredFor({ mode: "anchor", days: [1] }, "2026-05-04") === false, "anchor cadence is not weekly preferred");

// --- weekStartKey (ISO week, Monday-start) ---
assert(weekStartKey("2026-05-04") === "2026-05-04", "weekStart: Monday → itself");
assert(weekStartKey("2026-05-06") === "2026-05-04", "weekStart: Wednesday → previous Monday");
assert(weekStartKey("2026-05-10") === "2026-05-04", "weekStart: Sunday → previous Monday");
assert(weekStartKey("2026-05-11") === "2026-05-11", "weekStart: next Monday → itself");

// --- defaultSplit ---
const split = defaultSplit({ id: "s1", name: "PPL", mode: SPLIT_MODES.CONTINUOUS });
assert(split.id === "s1", "defaultSplit: id");
assert(split.name === "PPL", "defaultSplit: name");
assert(split.mode === "continuous", "defaultSplit: mode");
assert(Array.isArray(split.members) && split.members.length === 0, "defaultSplit: empty members");
assert(split.queuePosition === 0, "defaultSplit: queuePosition starts at 0");

let threw = false;
try { defaultSplit({ name: "no id" }); } catch { threw = true; }
assert(threw, "defaultSplit: throws without id");

// --- normalizeSplit ---
assert(normalizeSplit(null) === null, "normalizeSplit: null → null");
assert(normalizeSplit({ name: "no id" }) === null, "normalizeSplit: missing id → null");
assert(normalizeSplit({ id: "x" }) === null, "normalizeSplit: missing name → null");

const splitOk = normalizeSplit({
  id: "s1",
  name: "PPL",
  mode: "continuous",
  members: [
    { workoutId: "w3", order: 2 },
    { workoutId: "w1", order: 0 },
    { workoutId: "w2", order: 1 },
    { workoutId: null }, // dropped — no workoutId
  ],
  restPattern: { type: "afterCount", count: 6 },
  queuePosition: 1,
});
assert(splitOk.id === "s1" && splitOk.name === "PPL" && splitOk.mode === "continuous", "normalizeSplit: basic fields");
assert(splitOk.members.length === 3, `normalizeSplit: drops invalid members (got ${splitOk.members.length})`);
assert(splitOk.members[0].workoutId === "w1" && splitOk.members[1].workoutId === "w2" && splitOk.members[2].workoutId === "w3", "normalizeSplit: members sorted by order");
assert(splitOk.queuePosition === 1, "normalizeSplit: queuePosition preserved");
assert(splitOk.restPattern?.count === 6, "normalizeSplit: restPattern preserved");

const splitBadMode = normalizeSplit({ id: "s1", name: "X", mode: "garbage" });
assert(splitBadMode.mode === SPLIT_MODES.WEEKLY, "normalizeSplit: unknown mode → weekly");

const splitWeekly = normalizeSplit({
  id: "s1",
  name: "U/L",
  mode: "weekly",
  members: [
    { workoutId: "w1", order: 0, days: [1, 4, 9, "x"] },
    { workoutId: "w2", order: 1, days: [2, 5] },
  ],
});
assert(JSON.stringify(splitWeekly.members[0].days) === "[1,4]", `normalizeSplit: filters bad days (got ${JSON.stringify(splitWeekly.members[0].days)})`);

// --- getScheduledForDate ---
const sampleWorkouts = [
  { id: "w1", name: "Water polo", cadence: { mode: "anchor", days: [1, 3] } },     // Mon + Wed
  { id: "w2", name: "A", cadence: { mode: "weekly", perWeek: 1, preferredDays: [6] } }, // Sat
  { id: "w3", name: "B", cadence: { mode: "weekly", perWeek: 1, preferredDays: [0] } }, // Sun
  { id: "w4", name: "Baseline", cadence: { mode: "weekly", perWeek: 3, preferredDays: [] } }, // none — no auto
  { id: "w5", name: "Random", cadence: { mode: "whenever" } },
  { id: "w6", name: "PPL Push", cadence: { mode: "continuous" } }, // skipped here
];

// Monday 2026-05-04
const monSched = getScheduledForDate(sampleWorkouts, "2026-05-04");
assert(monSched.length === 1 && monSched[0].id === "w1", `Mon: water polo only (got ${monSched.map((x) => x.id).join(",")})`);

// Saturday 2026-05-09
const satSched = getScheduledForDate(sampleWorkouts, "2026-05-09");
assert(satSched.length === 1 && satSched[0].id === "w2", `Sat: A only (got ${satSched.map((x) => x.id).join(",")})`);

// Sunday 2026-05-10
const sunSched = getScheduledForDate(sampleWorkouts, "2026-05-10");
assert(sunSched.length === 1 && sunSched[0].id === "w3", `Sun: B only (got ${sunSched.map((x) => x.id).join(",")})`);

// Tuesday 2026-05-05 — nothing scheduled
const tueSched = getScheduledForDate(sampleWorkouts, "2026-05-05");
assert(tueSched.length === 0, `Tue: nothing (got ${tueSched.map((x) => x.id).join(",")})`);

// Empty input
assert(getScheduledForDate(null, "2026-05-04").length === 0, "null input → []");
assert(getScheduledForDate([], "2026-05-04").length === 0, "empty input → []");

// --- Done ---
console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
