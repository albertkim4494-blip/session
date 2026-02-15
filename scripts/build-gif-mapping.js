/**
 * Build a static mapping from catalog exercise IDs to ExerciseDB GIF URLs.
 * Uses pre-downloaded ExerciseDB data (exercisedb_*.json) for local matching.
 *
 * Usage: node scripts/build-gif-mapping.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { EXERCISE_CATALOG } from "../src/lib/exerciseCatalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Load all ExerciseDB data (batches of 100)
const allExercises = [];
for (let i = 0; i < 15; i++) {
  const f = path.join(root, `exercisedb_${i}.json`);
  if (!fs.existsSync(f)) break;
  const data = JSON.parse(fs.readFileSync(f, "utf8"));
  if (data.data) allExercises.push(...data.data);
}
console.log(`Loaded ${allExercises.length} ExerciseDB exercises\n`);

// Normalize text for matching
const norm = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Build word set
const wordSet = (s) => new Set(norm(s).split(" ").filter(Boolean));

// Equipment normalization map
const equipNorm = {
  bodyweight: "body weight",
  "pull-up bar": "body weight",
  "dip bar": "body weight",
  dumbbell: "dumbbell",
  barbell: "barbell",
  cable: "cable",
  machine: "leverage machine",
  kettlebell: "kettlebell",
  bench: "bench",
  "ez bar": "ez barbell",
  "ab wheel": "roller",
  band: "band",
  "resistance band": "band",
};

// Score how well an ExerciseDB entry matches a catalog entry
function scoreMatch(catalogEntry, dbEntry) {
  const cName = norm(catalogEntry.name);
  const dName = norm(dbEntry.name);

  let score = 0;

  // Exact name match
  if (cName === dName) {
    score += 100;
  } else {
    // Word overlap scoring
    const cWords = wordSet(catalogEntry.name);
    const dWords = wordSet(dbEntry.name);
    let overlap = 0;
    for (const w of cWords) {
      if (dWords.has(w)) overlap++;
    }
    const ratio = overlap / Math.max(cWords.size, 1);
    score += Math.round(ratio * 60);

    // Substring match
    if (dName.includes(cName) || cName.includes(dName)) {
      score += 20;
    }
  }

  // Alias matching
  for (const alias of catalogEntry.aliases || []) {
    const na = norm(alias);
    if (na === dName) {
      score += 80;
      break;
    }
    if (dName.includes(na) || na.includes(dName)) {
      score += 30;
      break;
    }
  }

  // Equipment overlap
  const cEquip = (catalogEntry.equipment || []).map((e) => equipNorm[e] || e);
  const dEquip = (dbEntry.equipments || []).map((e) => norm(e));
  for (const e of cEquip) {
    if (dEquip.some((d) => d.includes(e) || e.includes(d))) {
      score += 10;
    }
  }

  // Muscle overlap
  const cMuscles = (catalogEntry.muscles?.primary || []).map((m) =>
    norm(m.replace(/_/g, " "))
  );
  const dMuscles = [
    ...(dbEntry.targetMuscles || []),
    ...(dbEntry.secondaryMuscles || []),
  ].map((m) => norm(m));

  for (const m of cMuscles) {
    if (dMuscles.some((d) => d.includes(m) || m.includes(d))) {
      score += 5;
    }
  }

  // Penalize if equipment is very different
  if (cEquip.length > 0 && dEquip.length > 0) {
    const anyMatch = cEquip.some((e) =>
      dEquip.some((d) => d.includes(e) || e.includes(d))
    );
    if (!anyMatch) score -= 15;
  }

  return score;
}

// Skip sport/cardio/mobility/stretch exercises
const skipMovements = new Set(["cardio", "sport", "mobility", "stretch"]);
const toSearch = EXERCISE_CATALOG.filter(
  (e) => !skipMovements.has(e.movement)
);
const skipped = EXERCISE_CATALOG.length - toSearch.length;

console.log(`Catalog: ${EXERCISE_CATALOG.length} total`);
console.log(`Searching: ${toSearch.length} exercises`);
console.log(`Skipping: ${skipped} (sport/cardio/mobility/stretch)\n`);

const mapping = {};
let matched = 0;
let unmatched = 0;

for (const entry of toSearch) {
  let bestScore = 0;
  let bestMatch = null;

  for (const dbEntry of allExercises) {
    const s = scoreMatch(entry, dbEntry);
    if (s > bestScore) {
      bestScore = s;
      bestMatch = dbEntry;
    }
  }

  if (bestMatch && bestScore >= 25) {
    mapping[entry.id] = {
      gifUrl: bestMatch.gifUrl,
      dbName: bestMatch.name,
      score: bestScore,
    };
    matched++;
    console.log(
      `[${matched + unmatched}/${toSearch.length}] ${entry.name} -> "${bestMatch.name}" (score: ${bestScore})`
    );
  } else {
    mapping[entry.id] = null;
    unmatched++;
    console.log(
      `[${matched + unmatched}/${toSearch.length}] ${entry.name} -> NO MATCH${bestMatch ? ` (best: "${bestMatch.name}" score: ${bestScore})` : ""}`
    );
  }
}

// Write output
const lines = [
  "// Auto-generated mapping from catalog exercise IDs to ExerciseDB GIF URLs",
  `// Generated on ${new Date().toISOString().split("T")[0]}`,
  `// Matched: ${matched}, Unmatched: ${unmatched}, Skipped: ${skipped}`,
  "",
  "export const EXERCISE_GIF_MAP = {",
];

for (const entry of toSearch) {
  const m = mapping[entry.id];
  if (m) {
    lines.push(`  "${entry.id}": "${m.gifUrl}", // ${m.dbName} (${m.score})`);
  } else {
    lines.push(`  "${entry.id}": null, // no match`);
  }
}

lines.push("};", "");

const outPath = path.join(root, "src", "lib", "exerciseGifMap.js");
fs.writeFileSync(outPath, lines.join("\n"));
console.log(`\nResults: ${matched} matched, ${unmatched} unmatched, ${skipped} skipped`);
console.log(`Written to ${outPath}`);
