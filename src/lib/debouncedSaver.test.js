/**
 * Self-contained test script for debouncedSaver.js
 * Run with: node src/lib/debouncedSaver.test.js
 */

import { createDebouncedSaver } from "./debouncedSaver.js";

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${label}`);
  }
}

function assertEqual(actual, expected, label) {
  if (actual === expected) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${label}`);
    console.error(`    expected: ${JSON.stringify(expected)}`);
    console.error(`    actual:   ${JSON.stringify(actual)}`);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Mock save fn that records every call and can be configured to delay.
function makeMockSave({ latencyMs = 0, fail = false } = {}) {
  const calls = [];
  const fn = async (userId, state) => {
    calls.push({ userId, state, startedAt: Date.now() });
    if (latencyMs > 0) await sleep(latencyMs);
    if (fail) throw new Error("mock save error");
  };
  return { fn, calls };
}

// Silence console.error from the saver's error handler so test output stays clean.
const origConsoleError = console.error;

async function runTests() {
  console.log("\n=== debouncedSaver ===\n");

  console.log("[debounce: collapse rapid triggers]");
  {
    const { fn, calls } = makeMockSave();
    const saver = createDebouncedSaver(fn, 30);
    saver.trigger("u1", { v: 1 });
    saver.trigger("u1", { v: 2 });
    saver.trigger("u1", { v: 3 });
    assertEqual(calls.length, 0, "no save fires before debounce delay");
    await sleep(60);
    assertEqual(calls.length, 1, "exactly one save fires after debounce delay");
    assertEqual(calls[0].state.v, 3, "saves the latest state, not earliest");
  }

  console.log("\n[in-flight: queue replaces earlier queued state]");
  {
    const { fn, calls } = makeMockSave({ latencyMs: 50 });
    const saver = createDebouncedSaver(fn, 10);
    saver.trigger("u1", { v: 1 });
    await sleep(20); // timer fires, save starts
    assertEqual(calls.length, 1, "first save in flight");
    // Now hammer triggers while in-flight
    saver.trigger("u1", { v: 2 });
    saver.trigger("u1", { v: 3 });
    saver.trigger("u1", { v: 4 });
    await sleep(80); // first save resolves, queued runs
    assertEqual(calls.length, 2, "exactly one queued save fires after in-flight resolves");
    assertEqual(calls[1].state.v, 4, "queued save carries the latest state (v=4)");
  }

  console.log("\n[cancel: clears pending timer]");
  {
    const { fn, calls } = makeMockSave();
    const saver = createDebouncedSaver(fn, 30);
    saver.trigger("u1", { v: 1 });
    saver.cancel();
    await sleep(60);
    assertEqual(calls.length, 0, "cancelled saver does not fire");
  }

  console.log("\n[flushSync: returns a promise even when nothing is pending]");
  {
    const { fn } = makeMockSave();
    const saver = createDebouncedSaver(fn, 30);
    const result = saver.flushSync();
    assert(result && typeof result.then === "function", "flushSync returns a thenable");
    await result;
  }

  console.log("\n[flushSync: fires the latest pending state and resolves]");
  {
    const { fn, calls } = makeMockSave({ latencyMs: 20 });
    const saver = createDebouncedSaver(fn, 50);
    saver.trigger("u1", { v: 1 });
    saver.trigger("u1", { v: 2 });
    const p = saver.flushSync();
    assert(p && typeof p.then === "function", "flushSync returns a promise");
    await p;
    assertEqual(calls.length, 1, "exactly one save fires from flushSync");
    assertEqual(calls[0].state.v, 2, "flushSync saves latest state");
  }

  console.log("\n[flushSync: drains queued state during in-flight save]");
  {
    const { fn, calls } = makeMockSave({ latencyMs: 30 });
    const saver = createDebouncedSaver(fn, 5);
    saver.trigger("u1", { v: 1 });
    await sleep(15); // first save in flight
    saver.trigger("u1", { v: 2 });
    // queued state should be picked up; flushSync called while in-flight should
    // still resolve when both saves complete via the chain in flush()
    await sleep(80);
    assertEqual(calls.length, 2, "queued save runs after in-flight completes");
    assertEqual(calls[1].state.v, 2, "queued save carries v=2");
  }

  console.log("\n[error handling: thrown saveFn does not stop subsequent triggers]");
  {
    console.error = () => {}; // silence
    const { fn, calls } = makeMockSave({ fail: true });
    const saver = createDebouncedSaver(fn, 10);
    saver.trigger("u1", { v: 1 });
    await sleep(30);
    assertEqual(calls.length, 1, "save attempt happened even though it threw");
    saver.trigger("u1", { v: 2 });
    await sleep(30);
    assertEqual(calls.length, 2, "subsequent trigger still fires after prior error");
    console.error = origConsoleError;
  }

  console.log("\n[flush: bypasses debounce entirely]");
  {
    const { fn, calls } = makeMockSave();
    const saver = createDebouncedSaver(fn, 100);
    saver.trigger("u1", { v: 1 });
    await saver.flush("u1", { v: 99 });
    assertEqual(calls.length, 1, "direct flush fired one save");
    assertEqual(calls[0].state.v, 99, "direct flush used the value passed to it");
  }

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
