/**
 * Self-contained test script for workoutTransform.js
 * Run with: node src/lib/workoutTransform.test.js
 */

import { EXERCISE_CATALOG, buildAllowedEquipment } from "./exerciseCatalog.js";
import { buildCatalogMap } from "./exerciseCatalogUtils.js";
import { transformExercises } from "./workoutTransform.js";

let passed = 0;
let failed = 0;
function assert(condition, label) {
  if (condition) { passed++; console.log(`  ✓ ${label}`); }
  else { failed++; console.error(`  ✗ FAIL: ${label}`); }
}

const catalog = EXERCISE_CATALOG;
const catalogMap = buildCatalogMap(catalog);
const dumbbellOnly = buildAllowedEquipment(["dumbbell"]); // Set { bodyweight, dumbbell }
const fullGym = buildAllowedEquipment(["full_gym"]);      // null

const BARBELL_BENCH = "edb-EIeI8Vf";  // CHEST, barbell, push, reps
const DUMBBELL_BENCH = "edb-SpYC0Kp";  // CHEST, dumbbell, push, reps
const fits = (ex) => (catalogMap.get(ex.catalogId)?.equipment || []).some((e) => dumbbellOnly.has(e));

// --- equipment mismatch is substituted ---
console.log("\ntransformExercises — equipment substitution:");
{
  const { exercises, diagnostics } = transformExercises(
    [{ catalogId: BARBELL_BENCH, scheme: "3x8" }],
    catalogMap,
    { catalog, allowedEquipment: dumbbellOnly }
  );
  assert(exercises.length === 1, "produces one exercise");
  assert(exercises[0].catalogId !== BARBELL_BENCH, "barbell exercise was swapped out");
  assert(fits(exercises[0]), "substitute is doable with available equipment");
  assert(diagnostics.substituted === 1 && diagnostics.dropped === 0, "counted as substituted, not dropped");
  assert(exercises[0].scheme === "3x8", "the AI scheme is carried over to the substitute");
}

// --- already-available exercise is left alone ---
console.log("\ntransformExercises — no substitution when it fits:");
{
  const { exercises, diagnostics } = transformExercises(
    [{ catalogId: DUMBBELL_BENCH, scheme: "3x10" }],
    catalogMap,
    { catalog, allowedEquipment: dumbbellOnly }
  );
  assert(exercises[0].catalogId === DUMBBELL_BENCH, "dumbbell exercise kept as-is");
  assert(diagnostics.substituted === 0, "nothing substituted");
}

// --- full gym leaves everything as-is ---
console.log("\ntransformExercises — full gym:");
{
  const { exercises, diagnostics } = transformExercises(
    [{ catalogId: BARBELL_BENCH, scheme: "5x5" }],
    catalogMap,
    { catalog, allowedEquipment: fullGym }
  );
  assert(exercises[0].catalogId === BARBELL_BENCH, "barbell kept at full gym");
  assert(diagnostics.substituted === 0 && diagnostics.dropped === 0, "no substitution/drop at full gym");
}

// --- not-in-catalog exercise is salvaged via name when classifiable ---
console.log("\ntransformExercises — salvage unknown by name:");
{
  const { exercises, diagnostics } = transformExercises(
    [{ catalogId: "bogus-id-123", name: "Mystery Bench Movement", scheme: "4x6" }],
    catalogMap,
    { catalog, allowedEquipment: dumbbellOnly }
  );
  assert(exercises.length === 1, "salvaged into one exercise");
  assert(catalogMap.get(exercises[0].catalogId)?.muscles?.primary?.includes("CHEST"),
    "salvaged to a CHEST exercise (classified from the name 'bench')");
  assert(fits(exercises[0]), "salvaged substitute respects equipment");
  assert(diagnostics.substituted === 1 && diagnostics.dropped === 0, "counted as substituted, not dropped");
}

// --- truly unclassifiable exercise is dropped ---
console.log("\ntransformExercises — unclassifiable is dropped:");
{
  const { exercises, diagnostics } = transformExercises(
    [{ catalogId: "bogus-id-999", name: "Zxqyt Wibble", scheme: "3x10" }],
    catalogMap,
    { catalog, allowedEquipment: dumbbellOnly }
  );
  assert(exercises.length === 0, "no exercise produced");
  assert(diagnostics.dropped === 1 && diagnostics.substituted === 0, "counted as dropped");
}

// --- name recovery still works (exact catalog name, bad id) ---
console.log("\ntransformExercises — name recovery:");
{
  const { exercises } = transformExercises(
    [{ catalogId: "wrong", name: "Dumbbell Bench Press", scheme: "3x10" }],
    catalogMap,
    { catalog, allowedEquipment: dumbbellOnly }
  );
  assert(exercises[0]?.catalogId === DUMBBELL_BENCH, "recovered exact catalog name despite bad id");
}

// --- duplicates are de-duped ---
console.log("\ntransformExercises — de-dupe:");
{
  const { exercises } = transformExercises(
    [{ catalogId: DUMBBELL_BENCH }, { catalogId: DUMBBELL_BENCH }],
    catalogMap,
    { catalog, allowedEquipment: dumbbellOnly }
  );
  assert(exercises.length === 1, "duplicate catalogId collapsed to one");
}

// --- non-array input ---
console.log("\ntransformExercises — bad input:");
{
  const { exercises } = transformExercises(null, catalogMap, { catalog, allowedEquipment: dumbbellOnly });
  assert(exercises.length === 0, "non-array input yields empty list");
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
