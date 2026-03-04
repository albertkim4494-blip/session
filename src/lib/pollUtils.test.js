import { isPollOpen, getPollCounts, getAttendanceSummary, formatDeadline, formatEventDateTime } from "./pollUtils.js";
import assert from "node:assert";

// ============================================================================
// isPollOpen
// ============================================================================
assert.strictEqual(isPollOpen(null), false, "null poll is not open");
assert.strictEqual(isPollOpen({ closed: true }), false, "closed poll is not open");
assert.strictEqual(isPollOpen({ closed: false }), true, "open poll with no deadline is open");

// With future deadline
assert.strictEqual(
  isPollOpen({ closed: false, deadline: new Date(Date.now() + 3600000).toISOString() }),
  true,
  "open poll with future deadline is open"
);

// With past deadline
assert.strictEqual(
  isPollOpen({ closed: false, deadline: new Date(Date.now() - 1000).toISOString() }),
  false,
  "open poll with past deadline is closed"
);

// ============================================================================
// getPollCounts
// ============================================================================
{
  const responses = [
    { response: "yes" },
    { response: "yes" },
    { response: "no" },
    { response: "maybe" },
  ];
  const counts = getPollCounts(responses, 10);
  assert.deepStrictEqual(counts, { yes: 2, no: 1, maybe: 1, noResponse: 6 });
}

{
  const counts = getPollCounts([], 5);
  assert.deepStrictEqual(counts, { yes: 0, no: 0, maybe: 0, noResponse: 5 });
}

{
  const counts = getPollCounts(null, 0);
  assert.deepStrictEqual(counts, { yes: 0, no: 0, maybe: 0, noResponse: 0 });
}

// ============================================================================
// getAttendanceSummary
// ============================================================================
{
  const responses = [
    { response: "yes", attended: true },
    { response: "yes", attended: false },
    { response: "no", attended: null },
    { response: "maybe", attended: true },
  ];
  const summary = getAttendanceSummary(responses);
  assert.deepStrictEqual(summary, { attended: 2, absent: 1, untracked: 1, saidYes: 2 });
}

{
  const summary = getAttendanceSummary([]);
  assert.deepStrictEqual(summary, { attended: 0, absent: 0, untracked: 0, saidYes: 0 });
}

// ============================================================================
// formatDeadline
// ============================================================================
assert.strictEqual(formatDeadline(null), null, "null deadline returns null");
assert.strictEqual(
  formatDeadline(new Date(Date.now() - 1000).toISOString()),
  "Closed",
  "past deadline returns Closed"
);

{
  const deadline = new Date(Date.now() + 30 * 60000).toISOString(); // 30 min from now
  const result = formatDeadline(deadline);
  assert.ok(result.startsWith("Closes in ") && result.endsWith("m"), `Expected minutes format, got: ${result}`);
}

{
  const deadline = new Date(Date.now() + 3 * 3600000).toISOString(); // 3 hours from now
  const result = formatDeadline(deadline);
  assert.strictEqual(result, "Closes in 3h");
}

{
  const deadline = new Date(Date.now() + 2 * 86400000).toISOString(); // 2 days from now
  const result = formatDeadline(deadline);
  assert.strictEqual(result, "Closes in 2d");
}

// ============================================================================
// formatEventDateTime
// ============================================================================
assert.strictEqual(formatEventDateTime(null, null), null, "null date returns null");

{
  const result = formatEventDateTime("2026-03-10", null);
  assert.strictEqual(result, "Tue, Mar 10");
}

{
  const result = formatEventDateTime("2026-03-10", "19:30");
  assert.strictEqual(result, "Tue, Mar 10 at 7:30 PM");
}

{
  const result = formatEventDateTime("2026-03-10", "09:00");
  assert.strictEqual(result, "Tue, Mar 10 at 9:00 AM");
}

{
  const result = formatEventDateTime("2026-03-10", "00:15");
  assert.strictEqual(result, "Tue, Mar 10 at 12:15 AM");
}

{
  const result = formatEventDateTime("2026-03-10", "12:00");
  assert.strictEqual(result, "Tue, Mar 10 at 12:00 PM");
}

console.log("pollUtils tests passed");
