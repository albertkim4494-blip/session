// Tests for splitTemplates.js — plain Node.js test script

const { getSplitOptions, suggestNextSlot, focusGuidance, FOCUS_MUSCLES, SOMETHING_ELSE_SLOT } =
  await import("./splitTemplates.js");

let passed = 0;
let failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; }
  else { failed++; console.error("FAIL:", msg); }
}

// --- getSplitOptions ---
for (let d = 1; d <= 7; d++) {
  const opts = getSplitOptions(d);
  assert(Array.isArray(opts) && opts.length >= 1, `getSplitOptions(${d}) returns options`);
  for (const o of opts) {
    assert(o.id && o.label && Array.isArray(o.slots), `option ${o.id} has id/label/slots`);
    assert(o.slots.length === d, `option ${o.id} has ${d} slots`);
    assert(o.slots.every((s) => s.focus && s.label && s.id), `option ${o.id} slots well-formed`);
  }
}
// Out-of-range days clamp
assert(getSplitOptions(0).length >= 1, "getSplitOptions(0) clamps up");
assert(getSplitOptions(99)[0].slots.length === 7, "getSplitOptions(99) clamps to 7 days");
assert(getSplitOptions(undefined).length >= 1, "getSplitOptions(undefined) defaults");

// Repeated-focus slots get A/B labels
const ul4 = getSplitOptions(4).find((o) => o.id === "ul_4");
assert(ul4 && ul4.slots[0].label === "Upper A" && ul4.slots[2].label === "Upper B", "repeated focus → A/B labels");

// --- suggestNextSlot ---
const plan = { slots: getSplitOptions(4).find((o) => o.id === "ul_4").slots }; // [Upper A, Lower A, Upper B, Lower B]
assert(suggestNextSlot(plan, []).focus === "upper", "nothing done → first slot (upper)");
assert(suggestNextSlot(plan, ["upper"]).focus === "lower", "one upper done → next is lower");
assert(suggestNextSlot(plan, ["upper", "lower"]).focus === "upper", "upper+lower done → second upper");
assert(suggestNextSlot(plan, ["upper", "lower", "upper", "lower"]).extra === true, "all done → extra full body");
assert(suggestNextSlot(plan, ["full_body", "full_body"]).focus === "upper", "unmatched done focuses don't cover slots");
assert(suggestNextSlot(null, []) === null, "no plan → null");
assert(suggestNextSlot({ slots: [] }, []) === null, "empty slots → null");

// --- focusGuidance / constants ---
assert(typeof focusGuidance("pull") === "string" && focusGuidance("pull").length > 0, "focusGuidance(pull) non-empty");
assert(focusGuidance("nonsense").length > 0, "focusGuidance falls back gracefully");
assert(FOCUS_MUSCLES.full_body && FOCUS_MUSCLES.upper && FOCUS_MUSCLES.pull, "FOCUS_MUSCLES covers core focuses");
assert(SOMETHING_ELSE_SLOT.focus === "full_body" && SOMETHING_ELSE_SLOT.extra === true, "something-else slot is full-body extra");

// --- Done ---
console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
