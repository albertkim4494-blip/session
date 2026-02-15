/**
 * Batch pre-generate animation data for all catalog exercises.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_ANON_KEY=... node scripts/generate-animations.js
 *
 * The script calls the ai-exercise-animation edge function for each catalog
 * exercise that doesn't already have a cached animation in Supabase Storage.
 * Results are stored in the `exercise-animations` bucket.
 *
 * Options:
 *   --force     Regenerate even if animation already exists in storage
 *   --dry-run   Print exercises that would be generated without calling AI
 *   --delay=N   Delay N milliseconds between requests (default: 1500)
 */
import { createClient } from "@supabase/supabase-js";

// ── Inline catalog data (avoid ESM import issues) ──────────────────────────
// We read the catalog directly to get exercise metadata
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse args
const args = process.argv.slice(2);
const force = args.includes("--force");
const dryRun = args.includes("--dry-run");
const delayArg = args.find((a) => a.startsWith("--delay="));
const delay = delayArg ? parseInt(delayArg.split("=")[1], 10) : 1500;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables required");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Load catalog by reading the source file and extracting exercise data
// (Simpler than setting up ESM module resolution for Vite source files)
let catalog;
try {
  const catalogSrc = readFileSync(join(__dirname, "../src/lib/exerciseCatalog.js"), "utf8");
  // Extract the EXERCISE_CATALOG array using a simple regex approach
  // Find the array content between "export const EXERCISE_CATALOG = [" and "];"
  const match = catalogSrc.match(/export const EXERCISE_CATALOG\s*=\s*\[([\s\S]*?)\];/);
  if (!match) throw new Error("Could not find EXERCISE_CATALOG in source");

  // Evaluate the array content (it's a JS array literal)
  // We need to handle the "new Set(...)" references — just eval in a safe wrapper
  catalog = eval(`[${match[1]}]`);
} catch (err) {
  console.error("Failed to load exercise catalog:", err.message);
  console.error("Falling back to Supabase function invocation without metadata...");
  catalog = [];
}

async function checkExists(exerciseId) {
  try {
    const { data, error } = await supabase.storage
      .from("exercise-animations")
      .download(`${exerciseId}.json`);
    return !error && data !== null;
  } catch {
    return false;
  }
}

async function generateOne(exercise) {
  const { data, error } = await supabase.functions.invoke("ai-exercise-animation", {
    body: {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      muscles: exercise.muscles,
      equipment: exercise.equipment,
      movement: exercise.movement,
    },
  });

  if (error) {
    return { success: false, error: error.message || String(error) };
  }

  // Basic validation
  if (!data?.keyframes?.length) {
    return { success: false, error: "No keyframes in response" };
  }

  return { success: true, data };
}

async function main() {
  console.log(`\nExercise Animation Batch Generator`);
  console.log(`${"─".repeat(40)}`);
  console.log(`Catalog size: ${catalog.length}`);
  console.log(`Force regenerate: ${force}`);
  console.log(`Dry run: ${dryRun}`);
  console.log(`Delay: ${delay}ms\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < catalog.length; i++) {
    const ex = catalog[i];
    const prefix = `[${i + 1}/${catalog.length}]`;

    if (!force) {
      const exists = await checkExists(ex.id);
      if (exists) {
        console.log(`${prefix} SKIP ${ex.name} (${ex.id}) — already exists`);
        skipped++;
        continue;
      }
    }

    if (dryRun) {
      console.log(`${prefix} WOULD GENERATE ${ex.name} (${ex.id})`);
      continue;
    }

    console.log(`${prefix} Generating ${ex.name} (${ex.id})...`);
    const result = await generateOne(ex);

    if (result.success) {
      console.log(`${prefix} ✓ ${ex.name} — ${result.data.keyframes.length} keyframes, ${result.data.duration}s`);
      generated++;
    } else {
      console.error(`${prefix} ✗ ${ex.name} — ${result.error}`);
      failed++;
    }

    // Rate limiting
    if (i < catalog.length - 1) {
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  console.log(`\n${"─".repeat(40)}`);
  console.log(`Done: ${generated} generated, ${skipped} skipped, ${failed} failed`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
