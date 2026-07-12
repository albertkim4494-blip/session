// Tests for progressCharts.js — plain Node.js test script

const { epley1RM, buildStrengthSeries, buildRepsSeries, buildWeeklyVolumeSeries, weekStartOf, computePRs } = await import("./progressCharts.js");

let passed = 0;
let failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; }
  else { failed++; console.error("FAIL:", msg); }
}
function approx(a, b, eps = 0.001) { return Math.abs(a - b) < eps; }

// --- epley1RM ---
assert(approx(epley1RM(100, 1), 100 * (1 + 1 / 30)), "epley: 100x1");
assert(approx(epley1RM(100, 5), 100 * (1 + 5 / 30)), "epley: 100x5");
assert(epley1RM(0, 5) === 0, "epley: zero weight → 0");
assert(epley1RM(100, 0) === 0, "epley: zero reps → 0");
assert(epley1RM(-50, 5) === 0, "epley: negative weight → 0");

// A completed set helper — mirrors what isSetCompleted expects (explicit flag).
const done = (weight, reps) => ({ weight, reps, completed: true });
const notDone = (weight, reps) => ({ weight, reps, completed: false });

// --- buildStrengthSeries: basic ---
const logs = {
  "2026-01-01": { bench: { sets: [done(100, 5), done(105, 5)] } },
  "2026-01-08": { bench: { sets: [done(110, 5), done(110, 3)] } },
  "2026-01-15": { bench: { sets: [done(115, 5)] } },
};
const s = buildStrengthSeries(logs, ["bench"]);
assert(s.length === 3, `series has 3 sessions (got ${s.length})`);
assert(s[0].date === "2026-01-01" && s[2].date === "2026-01-15", "series ascending by date");
assert(s[0].topWeight === 105, `session 1 topWeight = 105 (got ${s[0].topWeight})`);
assert(s[0].volume === 100 * 5 + 105 * 5, `session 1 volume (got ${s[0].volume})`);
assert(s[0].e1rm === Math.round(105 * (1 + 5 / 30)), `session 1 e1rm (got ${s[0].e1rm})`);
assert(s[2].topWeight === 115, "session 3 topWeight = 115");

// --- only completed sets count ---
const logs2 = { "2026-02-01": { squat: { sets: [notDone(200, 5), done(150, 5)] } } };
const s2 = buildStrengthSeries(logs2, ["squat"]);
assert(s2.length === 1 && s2[0].topWeight === 150, "ignores incomplete sets");

// --- BW / blank weight skipped; day with only BW yields no data point ---
const logs3 = {
  "2026-03-01": { pullup: { sets: [done("BW", 10), done("", 8)] } },
  "2026-03-02": { pullup: { sets: [done(25, 5)] } },
};
const s3 = buildStrengthSeries(logs3, ["pullup"]);
assert(s3.length === 1 && s3[0].date === "2026-03-02", "BW-only day produces no strength point");
assert(s3[0].topWeight === 25, "weighted pullup counted");

// --- multiple ids merge (swapped/re-added variants) ---
const logs4 = {
  "2026-04-01": { benchA: { sets: [done(100, 5)] } },
  "2026-04-08": { benchB: { sets: [done(120, 5)] } },
};
const s4 = buildStrengthSeries(logs4, ["benchA", "benchB"]);
assert(s4.length === 2 && s4[1].topWeight === 120, "merges multiple ids by day");

// --- date range filtering ---
const s5 = buildStrengthSeries(logs, ["bench"], "2026-01-05", "2026-01-12");
assert(s5.length === 1 && s5[0].date === "2026-01-08", "range filter inclusive");

// --- edge cases ---
assert(buildStrengthSeries(null, ["x"]).length === 0, "null logs → []");
assert(buildStrengthSeries(logs, []).length === 0, "empty ids → []");
assert(buildStrengthSeries(logs, "bench").length === 3, "accepts single id string");
assert(buildStrengthSeries({ "not-a-date": { bench: { sets: [done(100, 5)] } } }, ["bench"]).length === 0, "ignores non-date keys");

// --- buildRepsSeries ---
const bwLogs = {
  "2026-05-01": { pushup: { sets: [done("BW", 20), done("BW", 18), done("BW", 15)] } },
  "2026-05-08": { pushup: { sets: [done("BW", 22), done("BW", 20)] } },
};
const bw = buildRepsSeries(bwLogs, ["pushup"]);
assert(bw.length === 2, `reps series has 2 sessions (got ${bw.length})`);
assert(bw[0].maxReps === 20, `session 1 maxReps = 20 (got ${bw[0].maxReps})`);
assert(bw[0].totalReps === 53, `session 1 totalReps = 53 (got ${bw[0].totalReps})`);
assert(bw[0].sets === 3, "session 1 counts 3 sets");
assert(bw[1].maxReps === 22, "session 2 maxReps = 22");

// counts reps regardless of weight (weighted pullups still have a rep count)
const mixed = { "2026-05-01": { pullup: { sets: [done(25, 5), done("BW", 10)] } } };
const mixedReps = buildRepsSeries(mixed, ["pullup"]);
assert(mixedReps[0].maxReps === 10 && mixedReps[0].totalReps === 15, "reps counted across weighted + BW sets");

// incomplete sets ignored; sets without a rep number ignored
const bw2 = { "2026-05-01": { pushup: { sets: [notDone("BW", 30), done("BW", "x"), done("BW", 12)] } } };
const bw2r = buildRepsSeries(bw2, ["pushup"]);
assert(bw2r.length === 1 && bw2r[0].maxReps === 12 && bw2r[0].sets === 1, "reps: skips incomplete + non-numeric reps");

assert(buildRepsSeries(null, ["x"]).length === 0, "reps: null logs → []");
assert(buildRepsSeries(bwLogs, []).length === 0, "reps: empty ids → []");

// --- weekStartOf ---
// 2026-01-15 is a Thursday. Sunday-start week → 2026-01-11; Monday-start → 2026-01-12.
assert(weekStartOf("2026-01-15", 0) === "2026-01-11", `weekStartOf Sun (got ${weekStartOf("2026-01-15", 0)})`);
assert(weekStartOf("2026-01-15", 1) === "2026-01-12", `weekStartOf Mon (got ${weekStartOf("2026-01-15", 1)})`);

// --- buildWeeklyVolumeSeries ---
const volLogs = {
  // week of 2026-01-11 (Sun-start): bench 100x5 + squat 200x5
  "2026-01-12": { bench: { sets: [done(100, 5)] } },
  "2026-01-14": { squat: { sets: [done(200, 5)] } },
  // (skip a week — should appear as a zero bar)
  // week of 2026-01-25: deadlift 300x3
  "2026-01-26": { deadlift: { sets: [done(300, 3)] } },
};
const vol = buildWeeklyVolumeSeries(volLogs, null, null, 0);
assert(vol.length === 3, `weekly volume fills gap weeks (got ${vol.length})`);
assert(vol[0].weekStart === "2026-01-11" && vol[0].volume === 500 + 1000, `week 1 volume (got ${vol[0].volume})`);
assert(vol[1].volume === 0 && vol[1].weekStart === "2026-01-18", "gap week is a zero bar");
assert(vol[2].volume === 900 && vol[2].weekStart === "2026-01-25", `week 3 volume (got ${vol[2].volume})`);
// BW-only sets contribute no volume
assert(buildWeeklyVolumeSeries({ "2026-02-01": { pushup: { sets: [done("BW", 20)] } } }).length === 0, "BW-only → no volume weeks");
assert(buildWeeklyVolumeSeries(null).length === 0, "weekly volume: null → []");

// --- computePRs ---
const prLogs = {
  "2026-01-01": { bench: { sets: [done(100, 5)] } },
  "2026-01-08": { bench: { sets: [done(120, 3), done(110, 8)] } }, // heaviest 120; best e1rm from 110x8
  "2026-01-15": { bench: { sets: [done(115, 5)] } },
};
const prs = computePRs(prLogs, ["bench"]);
assert(prs.topWeight.value === 120 && prs.topWeight.date === "2026-01-08", `PR topWeight 120 on 01-08 (got ${prs.topWeight.value}/${prs.topWeight.date})`);
// e1rm: 120x3=132, 110x8=139.3→139, 115x5=134.2→134 ⇒ best 139 on 01-08
assert(prs.e1rm.value === 139 && prs.e1rm.date === "2026-01-08", `PR e1rm 139 on 01-08 (got ${prs.e1rm.value}/${prs.e1rm.date})`);
assert(prs.maxReps.value === 8 && prs.maxReps.date === "2026-01-08", `PR maxReps 8 (got ${prs.maxReps.value})`);

// excludeKey → prior best ignores that day (used for new-PR detection)
const priorPR = computePRs(prLogs, ["bench"], "2026-01-08");
assert(priorPR.topWeight.value === 115, `prior topWeight excl 01-08 = 115 (got ${priorPR.topWeight.value})`);

// bodyweight: only reps PR, no weight PR
const bwPR = computePRs({ "2026-05-01": { pushup: { sets: [done("BW", 25)] } } }, ["pushup"]);
assert(bwPR.maxReps.value === 25 && bwPR.topWeight === null, "BW: reps PR only, no weight PR");

// earliest date kept on ties
const tiePR = computePRs({ "2026-06-01": { x: { sets: [done(100, 5)] } }, "2026-06-08": { x: { sets: [done(100, 5)] } } }, ["x"]);
assert(tiePR.topWeight.date === "2026-06-01", "PR keeps earliest date on tie");

assert(computePRs(null, ["x"]).topWeight === null, "computePRs: null → nulls");

// keys inserted OUT of chronological order — PR date must still be the earliest
// occurrence, not whichever key was inserted first.
const outOfOrder = {};
outOfOrder["2026-07-10"] = { x: { sets: [done(100, 5)] } }; // later date inserted first
outOfOrder["2026-07-01"] = { x: { sets: [done(100, 5)] } }; // earlier date inserted second
const oo = computePRs(outOfOrder, ["x"]);
assert(oo.topWeight.date === "2026-07-01", `PR date is earliest despite insertion order (got ${oo.topWeight.date})`);

// --- Done ---
console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
