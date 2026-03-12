/**
 * Tests for import/export utilities.
 * Run: node src/lib/importExport.test.js
 */

import { parseCSV, toCSV } from "./csvUtils.js";
import {
  stateToCSV,
  parseStrongCSV,
  parseHevyCSV,
  detectCSVFormat,
  buildImportState,
  mergeImportedData,
} from "./importExport.js";

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  FAIL: ${msg}`);
  }
}

function section(name) {
  console.log(`\n=== ${name} ===`);
}

// ============================================================================
// csvUtils
// ============================================================================

section("parseCSV");

{
  const { headers, rows } = parseCSV("a,b,c\n1,2,3\n4,5,6");
  assert(headers.length === 3, "parseCSV: 3 headers");
  assert(headers[0] === "a" && headers[2] === "c", "parseCSV: correct headers");
  assert(rows.length === 2, "parseCSV: 2 rows");
  assert(rows[0][0] === "1" && rows[1][2] === "6", "parseCSV: correct values");
}

{
  const { headers, rows } = parseCSV('a,b\n"hello, world","line1\nline2"');
  assert(rows[0][0] === "hello, world", "parseCSV: handles commas in quotes");
  assert(rows[0][1] === "line1\nline2", "parseCSV: handles newlines in quotes");
}

{
  const { rows } = parseCSV('a,b\n"say ""hi""",ok');
  assert(rows[0][0] === 'say "hi"', "parseCSV: handles escaped quotes");
}

{
  const { headers, rows } = parseCSV("");
  assert(headers.length === 0, "parseCSV: empty string → no headers");
  assert(rows.length === 0, "parseCSV: empty string → no rows");
}

{
  const { rows } = parseCSV("a,b,c\r\n1,2,3\r\n4,5,6");
  assert(rows.length === 2, "parseCSV: handles CRLF");
  assert(rows[0][0] === "1" && rows[1][2] === "6", "parseCSV: CRLF values correct");
}

{
  // BOM handling
  const { headers } = parseCSV("\uFEFFDate,Name\n2024-01-01,Test");
  assert(headers[0] === "Date", "parseCSV: strips UTF-8 BOM from first header");
}

{
  // Trailing newlines don't create phantom rows
  const { rows } = parseCSV("a,b\n1,2\n");
  assert(rows.length === 1, "parseCSV: trailing newline → no phantom row");
}

{
  const { rows } = parseCSV("a,b\n1,2\n\n");
  assert(rows.length === 1, "parseCSV: double trailing newline → no phantom row");
}

{
  // Short rows get padded to header length
  const { headers, rows } = parseCSV("a,b,c\n1,2\n4");
  assert(rows[0].length === 3, "parseCSV: short row padded to header length");
  assert(rows[0][2] === "", "parseCSV: padded field is empty string");
  assert(rows[1].length === 3, "parseCSV: very short row also padded");
}

section("toCSV");

{
  const csv = toCSV(["a", "b"], [["1", "2"], ["3", "4"]]);
  assert(csv === "a,b\n1,2\n3,4", "toCSV: basic output");
}

{
  const csv = toCSV(["x"], [['say "hi"'], ["a,b"], ["line\nnewline"]]);
  assert(csv.includes('"say ""hi"""'), "toCSV: escapes quotes");
  assert(csv.includes('"a,b"'), "toCSV: quotes commas");
  assert(csv.includes('"line\nnewline"'), "toCSV: quotes newlines");
}

{
  const csv = toCSV(["x"], [[null], [undefined], [""]]);
  const lines = csv.split("\n");
  assert(lines[1] === "" && lines[2] === "" && lines[3] === "", "toCSV: handles null/undefined/empty");
}

// ============================================================================
// detectCSVFormat
// ============================================================================

section("detectCSVFormat");

{
  assert(detectCSVFormat("Date,Workout Name,Duration,Exercise Name,Set Order") === "strong", "detect Strong");
  assert(detectCSVFormat("title,start_time,end_time,description,exercise_title,superset_id,exercise_notes,set_index") === "hevy", "detect Hevy");
  assert(detectCSVFormat("col1,col2,col3") === "unknown", "detect unknown");
  assert(detectCSVFormat("date,WORKOUT NAME,exercise name,set order") === "strong", "detect Strong case-insensitive");
}

// ============================================================================
// stateToCSV
// ============================================================================

section("stateToCSV");

{
  // Empty state
  const csv = stateToCSV({ program: { workouts: [] }, logsByDate: {} });
  const lines = csv.split("\n");
  assert(lines.length === 1, "stateToCSV: empty state → header only");
  assert(lines[0].startsWith("Date,"), "stateToCSV: has header row");
}

{
  // Single session
  const state = {
    program: {
      workouts: [
        {
          id: "w1",
          name: "Push",
          exercises: [
            { id: "ex1", name: "Bench Press", unit: "reps" },
            { id: "ex2", name: "Tricep Dips", unit: "reps" },
          ],
        },
      ],
    },
    logsByDate: {
      "2024-03-15": {
        ex1: {
          sets: [
            { reps: 8, weight: "135", completed: true },
            { reps: 6, weight: "155", completed: true },
          ],
          notes: "Felt strong",
        },
        ex2: {
          sets: [{ reps: 12, weight: "BW", completed: true }],
        },
      },
    },
  };

  const csv = stateToCSV(state);
  const lines = csv.split("\n");
  assert(lines.length === 4, "stateToCSV: 1 header + 3 data rows");

  // Parse it back to verify structure
  const { rows } = parseCSV(csv);
  assert(rows[0][0] === "2024-03-15", "stateToCSV: correct date");
  assert(rows[0][1] === "Push", "stateToCSV: correct workout name");
  assert(rows[0][2] === "Bench Press", "stateToCSV: correct exercise name");
  assert(rows[0][3] === "1", "stateToCSV: set order starts at 1");
  assert(rows[0][4] === "135", "stateToCSV: weight");
  assert(rows[0][5] === "8", "stateToCSV: reps");
  assert(rows[0][9] === "Felt strong", "stateToCSV: notes on first set");
  assert(rows[1][9] === "", "stateToCSV: no notes on second set");
}

{
  // Multi-day
  const state = {
    program: {
      workouts: [
        { id: "w1", name: "A", exercises: [{ id: "ex1", name: "Squat", unit: "reps" }] },
      ],
    },
    logsByDate: {
      "2024-01-01": {
        ex1: { sets: [{ reps: 5, weight: "225", completed: true }] },
      },
      "2024-01-03": {
        ex1: { sets: [{ reps: 5, weight: "230", completed: true }] },
      },
    },
  };

  const { rows } = parseCSV(stateToCSV(state));
  assert(rows.length === 2, "stateToCSV: multi-day → 2 rows");
  // Should be sorted date desc
  assert(rows[0][0] === "2024-01-03", "stateToCSV: sorted date desc");
}

{
  // Special characters in notes
  const state = {
    program: {
      workouts: [
        { id: "w1", name: "Test", exercises: [{ id: "ex1", name: "Curl", unit: "reps" }] },
      ],
    },
    logsByDate: {
      "2024-01-01": {
        ex1: {
          sets: [{ reps: 10, weight: "30", completed: true }],
          notes: 'Had a "great" workout, really pumped',
        },
      },
    },
  };

  const csv = stateToCSV(state);
  // Should be parseable back
  const { rows } = parseCSV(csv);
  assert(rows[0][9] === 'Had a "great" workout, really pumped', "stateToCSV: special chars round-trip");
}

{
  // Duration and distance exercises export to correct columns
  const state = {
    program: {
      workouts: [
        {
          id: "w1",
          name: "Mixed",
          exercises: [
            { id: "ex1", name: "Plank", unit: "sec" },
            { id: "ex2", name: "Running", unit: "miles" },
            { id: "ex3", name: "Bench Press", unit: "reps" },
          ],
        },
      ],
    },
    logsByDate: {
      "2024-03-15": {
        ex1: { sets: [{ reps: 60, weight: "", completed: true }] },
        ex2: { sets: [{ reps: 3.1, weight: "", completed: true }] },
        ex3: { sets: [{ reps: 10, weight: "135", completed: true }] },
      },
    },
  };

  const csv = stateToCSV(state);
  const { headers, rows } = parseCSV(csv);

  // Verify headers include Distance and Seconds
  assert(headers[6] === "Distance", "stateToCSV: Distance column exists");
  assert(headers[7] === "Seconds", "stateToCSV: Seconds column exists");

  // Find each exercise row
  const plankRow = rows.find((r) => r[2] === "Plank");
  const runRow = rows.find((r) => r[2] === "Running");
  const benchRow = rows.find((r) => r[2] === "Bench Press");

  // Plank: seconds column should have 60, reps should be empty
  assert(plankRow[5] === "", "stateToCSV: plank reps empty");
  assert(plankRow[7] === "60", "stateToCSV: plank seconds = 60");

  // Running: distance column should have 3.1, reps should be empty
  assert(runRow[5] === "", "stateToCSV: running reps empty");
  assert(runRow[6] === "3.1", "stateToCSV: running distance = 3.1");

  // Bench: reps column should have 10, distance/seconds empty
  assert(benchRow[5] === "10", "stateToCSV: bench reps = 10");
  assert(benchRow[6] === "", "stateToCSV: bench distance empty");
  assert(benchRow[7] === "", "stateToCSV: bench seconds empty");
}

{
  // Minutes unit converts to seconds in export
  const state = {
    program: {
      workouts: [
        { id: "w1", name: "Yoga", exercises: [{ id: "ex1", name: "Hold", unit: "min" }] },
      ],
    },
    logsByDate: {
      "2024-01-01": {
        ex1: { sets: [{ reps: 2, weight: "", completed: true }] },
      },
    },
  };

  const { rows } = parseCSV(stateToCSV(state));
  assert(rows[0][7] === "120", "stateToCSV: min→seconds conversion (2 min = 120 sec)");
}

// ============================================================================
// parseStrongCSV
// ============================================================================

section("parseStrongCSV");

{
  const csv = `Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE
2024-03-15,Morning Push,45:00,Bench Press,1,135,8,,,Felt good,,7
2024-03-15,Morning Push,45:00,Bench Press,2,155,6,,,,,,
2024-03-15,Morning Push,45:00,Overhead Press,1,95,10,,,,,8`;

  const { sessions, errors } = parseStrongCSV(csv);
  assert(errors.length === 0, "parseStrongCSV: no errors on valid input");
  assert(sessions.length === 1, "parseStrongCSV: 1 session");
  assert(sessions[0].date === "2024-03-15", "parseStrongCSV: correct date");
  assert(sessions[0].workoutName === "Morning Push", "parseStrongCSV: correct workout name");
  assert(sessions[0].exercises.length === 2, "parseStrongCSV: 2 exercises");
  assert(sessions[0].exercises[0].name === "Bench Press", "parseStrongCSV: first exercise");
  assert(sessions[0].exercises[0].sets.length === 2, "parseStrongCSV: 2 sets for bench");
  assert(sessions[0].exercises[0].sets[0].weight === "135", "parseStrongCSV: weight");
  assert(sessions[0].exercises[0].sets[0].reps === 8, "parseStrongCSV: reps");
  assert(sessions[0].exercises[0].sets[0].rpe === 7, "parseStrongCSV: rpe");
  assert(sessions[0].exercises[0].sets[0].notes === "Felt good", "parseStrongCSV: notes");
}

{
  // Missing columns
  const csv = `Date,Exercise Name
2024-01-01,Squat`;

  const { sessions, errors } = parseStrongCSV(csv);
  assert(errors.length === 0, "parseStrongCSV: works with minimal columns");
  assert(sessions.length === 1, "parseStrongCSV: 1 session with minimal cols");
  assert(sessions[0].exercises[0].sets[0].reps === null, "parseStrongCSV: missing reps → null");
  assert(sessions[0].exercises[0].sets[0].weight === null, "parseStrongCSV: missing weight → null");
}

{
  // Malformed rows
  const csv = `Date,Workout Name,Exercise Name,Set Order,Weight,Reps
,Push,Bench Press,1,135,8
2024-01-01,,,,`;

  const { sessions, errors } = parseStrongCSV(csv);
  assert(errors.length >= 1, "parseStrongCSV: reports errors for bad rows");
}

{
  // US date format
  const csv = `Date,Workout Name,Exercise Name,Set Order,Weight,Reps
3/15/2024,Push,Bench Press,1,135,8`;

  const { sessions } = parseStrongCSV(csv);
  assert(sessions.length === 1, "parseStrongCSV: US date format parsed");
  assert(sessions[0].date === "2024-03-15", "parseStrongCSV: US date → ISO");
}

{
  // Duration and distance columns
  const csv = `Date,Workout Name,Exercise Name,Set Order,Weight,Reps,Distance,Seconds
2024-01-01,Cardio,Plank,1,,,, 60
2024-01-01,Cardio,Running,1,,,3.1,`;

  const { sessions } = parseStrongCSV(csv);
  const plank = sessions[0].exercises.find((e) => e.name === "Plank");
  const running = sessions[0].exercises.find((e) => e.name === "Running");
  assert(plank.sets[0].seconds === 60, "parseStrongCSV: seconds parsed");
  assert(running.sets[0].distance === 3.1, "parseStrongCSV: distance parsed");
}

// ============================================================================
// parseHevyCSV
// ============================================================================

section("parseHevyCSV");

{
  const csv = `title,start_time,end_time,description,exercise_title,superset_id,exercise_notes,set_index,set_type,weight_lbs,reps,distance_miles,duration_seconds,rpe
Morning Workout,2024-03-15 08:30:00,2024-03-15 09:15:00,,Bench Press (Barbell),,Good pump,0,normal,135,8,,,7
Morning Workout,2024-03-15 08:30:00,2024-03-15 09:15:00,,Bench Press (Barbell),,,1,normal,155,6,,,,
Morning Workout,2024-03-15 08:30:00,2024-03-15 09:15:00,,Lateral Raise (Dumbbell),,,0,normal,20,12,,,`;

  const { sessions, errors } = parseHevyCSV(csv);
  assert(errors.length === 0, "parseHevyCSV: no errors");
  assert(sessions.length === 1, "parseHevyCSV: 1 session");
  assert(sessions[0].date === "2024-03-15", "parseHevyCSV: date extracted from datetime");
  assert(sessions[0].exercises.length === 2, "parseHevyCSV: 2 exercises");
  assert(sessions[0].exercises[0].sets.length === 2, "parseHevyCSV: 2 sets for bench");
  assert(sessions[0].exercises[0].sets[0].weight === "135", "parseHevyCSV: weight");
  assert(sessions[0].exercises[0].sets[0].reps === 8, "parseHevyCSV: reps");
  assert(sessions[0].exercises[0].sets[0].rpe === 7, "parseHevyCSV: rpe");
}

{
  // weight_kg column
  const csv = `title,start_time,exercise_title,set_index,set_type,weight_kg,reps
Push,2024-01-01 10:00:00,Squat,0,normal,100,5`;

  const { sessions } = parseHevyCSV(csv);
  assert(sessions[0].exercises[0].sets[0].weight === "100", "parseHevyCSV: weight_kg fallback");
}

{
  // duration_sec and distance_miles (real Hevy headers)
  const csv = `title,start_time,exercise_title,set_index,set_type,weight_lbs,reps,distance_miles,duration_sec,rpe
Core,2024-01-01 10:00:00,Plank,0,normal,,,, 90,
Core,2024-01-01 10:00:00,Running,0,normal,,,5.0,,`;

  const { sessions } = parseHevyCSV(csv);
  const plank = sessions[0].exercises.find((e) => e.name === "Plank");
  const running = sessions[0].exercises.find((e) => e.name === "Running");
  assert(plank.sets[0].seconds === 90, "parseHevyCSV: duration_sec parsed");
  assert(running.sets[0].distance === 5.0, "parseHevyCSV: distance_miles parsed");
}

{
  // duration_seconds alternate header (also supported)
  const csv = `title,start_time,exercise_title,set_index,set_type,weight_lbs,reps,distance_miles,duration_seconds,rpe
Core,2024-01-01 10:00:00,Plank,0,normal,,,,45,`;

  const { sessions } = parseHevyCSV(csv);
  assert(sessions[0].exercises[0].sets[0].seconds === 45, "parseHevyCSV: duration_seconds also works");
}

// ============================================================================
// buildImportState
// ============================================================================

section("buildImportState");

{
  const sessions = [
    {
      date: "2024-03-15",
      workoutName: "Push Day",
      exercises: [
        { name: "Bench Press", sets: [{ reps: 8, weight: "135", rpe: 7, notes: "" }] },
        { name: "Tricep Dips", sets: [{ reps: 12, weight: "BW", rpe: null, notes: "" }] },
      ],
    },
    {
      date: "2024-03-17",
      workoutName: "Push Day",
      exercises: [
        { name: "Bench Press", sets: [{ reps: 10, weight: "140", rpe: null, notes: "" }] },
      ],
    },
  ];

  // Use a minimal catalog for testing
  const catalog = [
    {
      id: "bench_press_barbell",
      name: "Bench Press (Barbell)",
      defaultUnit: "reps",
      muscles: { primary: ["CHEST", "TRICEPS"] },
      equipment: ["barbell"],
      tags: ["compound"],
      movement: "push",
      aliases: ["bench press", "flat bench"],
    },
  ];

  const result = buildImportState(sessions, catalog);

  assert(result.workouts.length === 1, "buildImportState: 1 unique workout");
  assert(result.workouts[0].name === "Push Day", "buildImportState: correct workout name");
  assert(result.workouts[0].exercises.length === 2, "buildImportState: 2 exercises");

  // Bench Press should have catalog match
  const bench = result.workouts[0].exercises.find((e) => e.name === "Bench Press");
  assert(bench.catalogId === "bench_press_barbell", "buildImportState: catalog match");
  assert(bench.muscles?.primary?.includes("CHEST"), "buildImportState: muscles from catalog");

  // Tricep Dips — no catalog match
  const dips = result.workouts[0].exercises.find((e) => e.name === "Tricep Dips");
  assert(!dips.catalogId, "buildImportState: no catalog match → no catalogId");

  // Log entries
  assert(Object.keys(result.logsByDate).length === 2, "buildImportState: 2 dates in logs");
  const log = Object.values(result.logsByDate["2024-03-15"])[0];
  assert(log.sets[0].completed === true, "buildImportState: sets marked completed");
  assert(log.sets[0].reps === 8, "buildImportState: reps preserved");

  // Stats
  assert(result.stats.sessionCount === 2, "buildImportState: session count");
  assert(result.stats.exerciseCount === 2, "buildImportState: exercise count");
  assert(result.stats.dateRange.from === "2024-03-15", "buildImportState: date range from");
  assert(result.stats.dateRange.to === "2024-03-17", "buildImportState: date range to");
}

{
  // Empty sessions
  const result = buildImportState([], []);
  assert(result.workouts.length === 0, "buildImportState: empty → no workouts");
  assert(Object.keys(result.logsByDate).length === 0, "buildImportState: empty → no logs");
  assert(result.stats.sessionCount === 0, "buildImportState: empty → 0 sessions");
}

{
  // Duration and distance exercises get correct unit + reps value
  const sessions = [
    {
      date: "2024-01-01",
      workoutName: "Mixed",
      exercises: [
        { name: "Plank", sets: [{ reps: null, weight: null, rpe: null, notes: "", seconds: 60, distance: null }] },
        { name: "Running", sets: [{ reps: null, weight: null, rpe: null, notes: "", seconds: null, distance: 3.1 }] },
        { name: "Bench Press", sets: [{ reps: 10, weight: "135", rpe: null, notes: "", seconds: null, distance: null }] },
      ],
    },
  ];

  const result = buildImportState(sessions, []);

  const plank = result.workouts[0].exercises.find((e) => e.name === "Plank");
  const running = result.workouts[0].exercises.find((e) => e.name === "Running");
  const bench = result.workouts[0].exercises.find((e) => e.name === "Bench Press");

  assert(plank.unit === "sec", "buildImportState: plank inferred as sec");
  assert(running.unit === "miles", "buildImportState: running inferred as miles");
  assert(bench.unit === "reps", "buildImportState: bench stays reps");

  // Log reps field holds the correct value
  const plankLog = Object.values(result.logsByDate["2024-01-01"]).find((_, i) =>
    result.workouts[0].exercises[i]?.name === "Plank"
  );
  // Find by exercise id
  const plankId = plank.id;
  const runningId = running.id;
  assert(result.logsByDate["2024-01-01"][plankId].sets[0].reps === 60, "buildImportState: plank reps = 60 (seconds)");
  assert(result.logsByDate["2024-01-01"][runningId].sets[0].reps === 3.1, "buildImportState: running reps = 3.1 (miles)");
}

// ============================================================================
// mergeImportedData
// ============================================================================

section("mergeImportedData");

{
  const currentState = {
    program: {
      workouts: [
        { id: "w1", name: "Push", exercises: [{ id: "ex1", name: "Bench", unit: "reps" }] },
      ],
    },
    logsByDate: {
      "2024-01-01": {
        ex1: { sets: [{ reps: 8, weight: "135", completed: true }] },
      },
    },
    meta: { updatedAt: 1000 },
  };

  const importedData = {
    workouts: [
      { id: "w2", name: "Pull", exercises: [{ id: "ex2", name: "Row", unit: "reps" }] },
      { id: "w3", name: "Push", exercises: [] }, // Duplicate name — should be skipped
    ],
    logsByDate: {
      "2024-01-01": {
        ex2: { sets: [{ reps: 10, weight: "95", completed: true }] }, // New exercise on existing date
        ex1: { sets: [{ reps: 5, weight: "100", completed: true }] }, // Existing exercise — should NOT overwrite
      },
      "2024-01-02": {
        ex2: { sets: [{ reps: 12, weight: "100", completed: true }] }, // New date entirely
      },
    },
  };

  const merged = mergeImportedData(currentState, importedData);

  // Workouts
  assert(merged.program.workouts.length === 2, "merge: 2 workouts (Push + Pull)");
  assert(merged.program.workouts[0].name === "Push", "merge: original Push preserved");
  assert(merged.program.workouts[1].name === "Pull", "merge: Pull appended");

  // Logs — existing date, existing exercise NOT overwritten
  assert(merged.logsByDate["2024-01-01"].ex1.sets[0].weight === "135", "merge: existing log NOT overwritten");
  assert(merged.logsByDate["2024-01-01"].ex1.sets[0].reps === 8, "merge: existing reps preserved");

  // Logs — existing date, new exercise merged in
  assert(merged.logsByDate["2024-01-01"].ex2.sets[0].reps === 10, "merge: new exercise merged into existing date");

  // Logs — new date
  assert(merged.logsByDate["2024-01-02"].ex2.sets[0].reps === 12, "merge: new date added");

  // Meta updated
  assert(merged.meta.updatedAt > 1000, "merge: meta.updatedAt updated");

  // Original state not mutated
  assert(currentState.program.workouts.length === 1, "merge: original state not mutated (workouts)");
  assert(!currentState.logsByDate["2024-01-02"], "merge: original state not mutated (logs)");
}

{
  // No conflicts
  const current = { program: { workouts: [] }, logsByDate: {}, meta: {} };
  const imported = {
    workouts: [{ id: "w1", name: "A", exercises: [] }],
    logsByDate: { "2024-01-01": { ex1: { sets: [] } } },
  };

  const merged = mergeImportedData(current, imported);
  assert(merged.program.workouts.length === 1, "merge (no conflict): workout added");
  assert(merged.logsByDate["2024-01-01"], "merge (no conflict): date added");
}

// ============================================================================
// Round-trip: export → parse → build
// ============================================================================

section("Round-trip");

{
  const state = {
    program: {
      workouts: [
        {
          id: "w1",
          name: "Upper",
          exercises: [
            { id: "ex1", name: "Bench Press", unit: "reps" },
            { id: "ex2", name: "Row", unit: "reps" },
          ],
        },
      ],
    },
    logsByDate: {
      "2024-03-15": {
        ex1: {
          sets: [
            { reps: 8, weight: "135", completed: true, rpe: 7 },
            { reps: 6, weight: "155", completed: true },
          ],
          notes: "Good session",
        },
        ex2: {
          sets: [{ reps: 10, weight: "95", completed: true }],
        },
      },
    },
  };

  // Export
  const csv = stateToCSV(state);

  // Our format is detected as Strong (same column names)
  assert(detectCSVFormat(csv) === "strong", "round-trip: export detected as Strong format");

  // Re-import
  const { sessions } = parseStrongCSV(csv);
  assert(sessions.length === 1, "round-trip: 1 session");
  assert(sessions[0].exercises.length === 2, "round-trip: 2 exercises");

  const benchSets = sessions[0].exercises.find((e) => e.name === "Bench Press")?.sets;
  assert(benchSets?.length === 2, "round-trip: 2 bench sets");
  assert(benchSets[0].reps === 8 && benchSets[0].weight === "135", "round-trip: bench set 1 data");
  assert(benchSets[0].rpe === 7, "round-trip: RPE preserved");
  assert(benchSets[0].notes === "Good session", "round-trip: notes preserved");
}

// ============================================================================
// Edge cases
// ============================================================================

section("Edge cases");

{
  // Invalid dates should be rejected
  const csv = `Date,Exercise Name
2024-13-45,Squat
2024-02-30,Deadlift
2024-01-15,Bench Press`;

  const { sessions, errors } = parseStrongCSV(csv);
  assert(sessions.length === 1, "edge: invalid dates rejected, only valid row kept");
  assert(sessions[0].date === "2024-01-15", "edge: valid date preserved");
  assert(errors.length === 2, "edge: 2 error messages for invalid dates");
}

{
  // Same exercise, same date, two sessions should merge sets (not overwrite)
  const sessions = [
    {
      date: "2024-01-01",
      workoutName: "Push",
      exercises: [
        { name: "Bench Press", sets: [
          { reps: 8, weight: "135", rpe: null, notes: "", seconds: null, distance: null },
        ]},
      ],
    },
    {
      date: "2024-01-01",
      workoutName: "Push",
      exercises: [
        { name: "Bench Press", sets: [
          { reps: 5, weight: "185", rpe: null, notes: "", seconds: null, distance: null },
        ]},
      ],
    },
  ];

  const result = buildImportState(sessions, []);
  const benchId = result.workouts[0].exercises[0].id;
  const logSets = result.logsByDate["2024-01-01"][benchId].sets;
  assert(logSets.length === 2, "edge: same-date same-exercise sets merged (2 total)");
  assert(logSets[0].weight === "135" && logSets[1].weight === "185", "edge: both session sets present");
}

{
  // Empty exercise name should be skipped
  const sessions = [
    {
      date: "2024-01-01",
      workoutName: "Test",
      exercises: [
        { name: "", sets: [{ reps: 10, weight: "100", rpe: null, notes: "", seconds: null, distance: null }] },
        { name: "Squat", sets: [{ reps: 5, weight: "200", rpe: null, notes: "", seconds: null, distance: null }] },
      ],
    },
  ];

  const result = buildImportState(sessions, []);
  assert(result.workouts[0].exercises.length === 1, "edge: empty exercise name skipped");
  assert(result.workouts[0].exercises[0].name === "Squat", "edge: valid exercise preserved");
}

{
  // Double-import with merge should not create duplicates when workout name matches
  const currentState = {
    program: {
      workouts: [
        { id: "w1", name: "Push", exercises: [{ id: "existing_ex1", name: "Bench Press", unit: "reps" }] },
      ],
    },
    logsByDate: {
      "2024-01-01": {
        existing_ex1: { sets: [{ reps: 8, weight: "135", completed: true }] },
      },
    },
    meta: {},
  };

  const importedData = {
    workouts: [
      { id: "w_new", name: "Push", exercises: [{ id: "imported_ex1", name: "Bench Press", unit: "reps" }] },
    ],
    logsByDate: {
      "2024-01-02": {
        imported_ex1: { sets: [{ reps: 10, weight: "140", completed: true }] },
      },
    },
  };

  const merged = mergeImportedData(currentState, importedData);

  // Workout should NOT be duplicated
  assert(merged.program.workouts.length === 1, "edge: duplicate workout not added");

  // New date's log should use existing exercise ID (remapped)
  assert(merged.logsByDate["2024-01-02"].existing_ex1, "edge: imported log remapped to existing exercise ID");
  assert(!merged.logsByDate["2024-01-02"].imported_ex1, "edge: imported exercise ID not used (remapped)");
}

{
  // BOM in CSV should not break Strong detection
  const csv = "\uFEFFDate,Workout Name,Exercise Name,Set Order,Weight,Reps\n2024-01-01,Push,Bench Press,1,135,8";
  assert(detectCSVFormat(csv) === "strong", "edge: BOM does not break format detection");
  const { sessions, errors } = parseStrongCSV(csv);
  assert(sessions.length === 1, "edge: BOM CSV parses successfully");
  assert(errors.length === 0, "edge: no errors with BOM CSV");
}

{
  // DD/MM/YYYY date format (day > 12 triggers DD/MM heuristic)
  const csv = `Date,Exercise Name,Reps,Weight
15/03/2024,Squat,5,225`;

  const { sessions } = parseStrongCSV(csv);
  assert(sessions.length === 1, "edge: DD/MM/YYYY date parsed");
  assert(sessions[0].date === "2024-03-15", "edge: DD/MM/YYYY → ISO correct");
}

{
  // dailyWorkouts export
  const state = {
    program: {
      workouts: [
        { id: "w1", name: "Push", exercises: [{ id: "ex1", name: "Bench Press", unit: "reps" }] },
      ],
    },
    dailyWorkouts: {
      "2024-03-20": [
        {
          id: "dw1",
          name: "Quick Cardio",
          source: "generate_today",
          exercises: [{ id: "dex1", name: "Burpees", unit: "reps" }],
        },
      ],
    },
    logsByDate: {
      "2024-03-15": {
        ex1: { sets: [{ reps: 8, weight: "135", completed: true }] },
      },
      "2024-03-20": {
        dex1: { sets: [{ reps: 15, weight: "", completed: true }] },
      },
    },
  };

  const csv = stateToCSV(state);
  const { rows } = parseCSV(csv);

  // Should contain both program and daily workout entries
  assert(rows.length === 2, "edge: dailyWorkouts export → 2 data rows");
  const burpeeRow = rows.find((r) => r[2] === "Burpees");
  const benchRow = rows.find((r) => r[2] === "Bench Press");
  assert(burpeeRow, "edge: dailyWorkout exercise included in export");
  assert(burpeeRow[1] === "Quick Cardio", "edge: dailyWorkout name exported");
  assert(benchRow, "edge: program workout also included");
}

{
  // Ambiguous date: 01/02/2024 could be Jan 2 (US) or Feb 1 (EU)
  // When first number <= 12, US MM/DD is assumed
  const csv = `Date,Exercise Name,Reps,Weight
01/02/2024,Squat,5,225`;

  const { sessions } = parseStrongCSV(csv);
  assert(sessions.length === 1, "edge: ambiguous date parsed");
  assert(sessions[0].date === "2024-01-02", "edge: MM/DD assumed when first number <= 12");
}

// ============================================================================
// Summary
// ============================================================================

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
