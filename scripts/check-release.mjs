// Release gate: fails if legal pages still contain unresolved [PLACEHOLDER]
// tokens. Run before building a store release: `npm run check:release`.
// (Placeholders are expected during development, so this is NOT part of `build`.)

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const PUBLIC_DIR = "public";
const PLACEHOLDER_RE = /\[[A-Z0-9_ /]{3,}\]/g; // e.g. [SUPPORT_EMAIL], [YOUR STATE/COUNTRY]

let problems = 0;
for (const file of readdirSync(PUBLIC_DIR)) {
  if (!file.endsWith(".html")) continue;
  const text = readFileSync(join(PUBLIC_DIR, file), "utf8");
  const matches = [...new Set(text.match(PLACEHOLDER_RE) || [])];
  if (matches.length) {
    problems++;
    console.error(`✗ ${file} has unresolved placeholders: ${matches.join(", ")}`);
  }
}

if (problems > 0) {
  console.error("\nRelease check FAILED — fill the placeholders above before shipping.");
  process.exit(1);
}
console.log("✓ Release check passed — no unresolved legal placeholders.");
