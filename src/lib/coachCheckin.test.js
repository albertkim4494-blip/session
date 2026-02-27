// Tests for coachCheckin.js — plain Node.js test script

// Minimal localStorage mock for Node.js
const store = {};
globalThis.localStorage = {
  getItem: (k) => store[k] ?? null,
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
};

const {
  loadCheckins, saveCheckin, getTodayCheckin,
  loadCoachNotes, saveCoachNotes, mergeCoachNotes,
  buildMoodPatternAnalysis,
  CHECKIN_KEY, NOTES_KEY,
} = await import("./coachCheckin.js");

let passed = 0;
let failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; }
  else { failed++; console.error("FAIL:", msg); }
}

// Clean slate
delete store[CHECKIN_KEY];
delete store[NOTES_KEY];

// --- saveCheckin + loadCheckins roundtrip ---
saveCheckin("2026-02-20", { mood: 1, sleep: "okay", pain: [] });
saveCheckin("2026-02-21", { mood: -1, sleep: "poor", pain: [{ area: "Shoulders", severity: "mild" }] });
const all = loadCheckins();
assert(all["2026-02-20"]?.mood === 1, "roundtrip: mood saved");
assert(all["2026-02-21"]?.sleep === "poor", "roundtrip: sleep saved");
assert(all["2026-02-21"]?.pain?.[0]?.area === "Shoulders", "roundtrip: pain saved");
assert(typeof all["2026-02-20"]?.submittedAt === "string", "roundtrip: submittedAt auto-filled");

// --- prune keeps only last 30 days ---
delete store[CHECKIN_KEY];
for (let i = 0; i < 35; i++) {
  const d = `2026-01-${String(i + 1).padStart(2, "0")}`;
  saveCheckin(d, { mood: 0, sleep: "okay", pain: [] });
}
const pruned = loadCheckins();
const prunedKeys = Object.keys(pruned);
assert(prunedKeys.length === 30, `prune: expected 30 entries, got ${prunedKeys.length}`);
// Should keep the latest dates
assert(!pruned["2026-01-01"], "prune: oldest removed");
assert(pruned["2026-01-06"], "prune: 6th day kept");

// --- getTodayCheckin ---
delete store[CHECKIN_KEY];
saveCheckin("2026-02-26", { mood: 2, sleep: "great", pain: [] });
assert(getTodayCheckin("2026-02-26")?.mood === 2, "getTodayCheckin: returns today's data");
assert(getTodayCheckin("2026-02-25") === null, "getTodayCheckin: returns null for missing date");

// --- mergeCoachNotes ---
const existing = { version: 1, notes: [
  { topic: "mood_pattern", detail: "old observation", date: "2026-02-20" },
  { topic: "shoulder_recurring", detail: "shoulder note", date: "2026-02-20" },
]};
const newNotes = [
  { topic: "mood_pattern", detail: "updated observation", date: "2026-02-26" },
  { topic: "sleep_quality", detail: "sleeps poorly on mondays", date: "2026-02-26" },
];
const merged = mergeCoachNotes(existing, newNotes);
assert(merged.notes.length === 3, `merge: expected 3 notes, got ${merged.notes.length}`);
const moodNote = merged.notes.find((n) => n.topic === "mood_pattern");
assert(moodNote?.detail === "updated observation", "merge: newer wins for same topic");
assert(merged.notes.find((n) => n.topic === "sleep_quality"), "merge: new topic added");
assert(merged.notes.find((n) => n.topic === "shoulder_recurring"), "merge: unrelated topic kept");

// --- saveCoachNotes + loadCoachNotes ---
delete store[NOTES_KEY];
saveCoachNotes(merged);
const loaded = loadCoachNotes();
assert(loaded.notes.length === 3, "save/load: notes roundtrip");
assert(loaded.version === 1, "save/load: version preserved");

// --- buildMoodPatternAnalysis ---
const checkins = {
  "2026-02-20": { mood: -1 },
  "2026-02-21": { mood: -2 },
  "2026-02-22": { mood: 0 },
  "2026-02-23": { mood: -1 },
  "2026-02-24": { mood: 1 },
};
const logsByDate = {
  "2026-02-20": { ex1: { mood: 1, sets: [] } },
  "2026-02-21": { ex1: { mood: 1, sets: [] } },
  "2026-02-22": { ex1: { mood: 0, sets: [] } },
  "2026-02-23": { ex1: { mood: 2, sets: [] } },
  "2026-02-24": { ex1: { mood: 1, sets: [] } },
};
const pattern = buildMoodPatternAnalysis(checkins, logsByDate);
assert(pattern !== null, "moodPattern: returns non-null with 5 data points");
assert(pattern.includes("Pre vs post workout mood"), "moodPattern: contains header");
assert(pattern.includes("/5"), "moodPattern: references total sessions");

// --- buildMoodPatternAnalysis returns null with <3 data points ---
const sparseCheckins = {
  "2026-02-20": { mood: -1 },
  "2026-02-21": { mood: 0 },
};
const sparseLogs = {
  "2026-02-20": { ex1: { mood: 1, sets: [] } },
  "2026-02-21": { ex1: { mood: 1, sets: [] } },
};
const sparsePattern = buildMoodPatternAnalysis(sparseCheckins, sparseLogs);
assert(sparsePattern === null, "moodPattern: returns null with <3 data points");

// --- Summary ---
console.log(`\ncoachCheckin tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
