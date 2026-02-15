/**
 * Download all exercises from ExerciseDB API.
 * Paginates through all results and saves to exercisedb_all.json.
 *
 * Usage: node scripts/download-exercisedb.js
 */
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_BASE = "https://exercisedb-api.vercel.app/api/v1/exercises";
const LIMIT = 100;
const DELAY_MS = 6000;
const OUTPUT = resolve(__dirname, "..", "exercisedb_all.json");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function downloadAll() {
  let all = [];
  let offset = 0;
  let batch = 0;

  while (true) {
    batch++;
    const url = `${API_BASE}?offset=${offset}&limit=${LIMIT}`;
    console.log(`Batch ${batch}: fetching offset=${offset} ...`);

    const res = await fetch(url);
    if (!res.ok) {
      console.error(`HTTP ${res.status} — stopping.`);
      break;
    }

    const json = await res.json();
    const exercises = json.data?.exercises || json.data || [];

    if (!Array.isArray(exercises) || exercises.length === 0) {
      console.log("No more exercises. Done.");
      break;
    }

    all.push(...exercises);
    console.log(`  Got ${exercises.length} exercises (total: ${all.length})`);

    if (exercises.length < LIMIT) {
      console.log("Last batch (partial). Done.");
      break;
    }

    offset += LIMIT;
    console.log(`  Waiting ${DELAY_MS / 1000}s before next batch...`);
    await sleep(DELAY_MS);
  }

  writeFileSync(OUTPUT, JSON.stringify(all, null, 2));
  console.log(`\nSaved ${all.length} exercises to ${OUTPUT}`);
}

downloadAll().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
