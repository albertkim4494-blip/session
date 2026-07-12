// Tests for units.js — plain Node.js test script

const { toLbs, fromLbs } = await import("./units.js");

let passed = 0;
let failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; }
  else { failed++; console.error("FAIL:", msg); }
}

// imperial = identity
assert(toLbs(170, "imperial") === 170, "toLbs imperial identity");
assert(fromLbs(170, "imperial") === 170, "fromLbs imperial identity");

// metric conversions
assert(toLbs(77, "metric") === 169.8, `77kg → 169.8lb (got ${toLbs(77, "metric")})`);
assert(fromLbs(169.8, "metric") === 77, `169.8lb → 77kg (got ${fromLbs(169.8, "metric")})`);

// round-trip stays stable
const rt = fromLbs(toLbs(80, "metric"), "metric");
assert(Math.abs(rt - 80) < 0.1, `round-trip 80kg stable (got ${rt})`);

// bad input → null
assert(toLbs("", "metric") === null, "empty → null");
assert(fromLbs(null, "imperial") === null, "null → null");
assert(toLbs("abc", "imperial") === null, "non-numeric → null");

console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
