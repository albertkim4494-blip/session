/**
 * splitTemplates.js — curated weekly-split templates for the Generate Today
 * weekly-plan layer. Pure/unit-testable (no React/DOM).
 *
 * A "split" is a POOL of day-slots the user picks from each day (a soft scaffold,
 * not a fixed schedule). Each slot has a `focus` (a canonical training focus) that
 * drives which muscles the AI targets that day. The split is only a suggestion —
 * the daily flow always offers a "Something else" free-focus escape hatch.
 */

// Canonical focus keys → short display label.
export const FOCUS_LABELS = {
  full_body: "Full Body",
  upper: "Upper",
  lower: "Lower",
  push: "Push",
  pull: "Pull",
  legs: "Legs",
  arms: "Arms",
  core: "Core",
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  chest_tri: "Chest & Triceps",
  back_bi: "Back & Biceps",
};

// Canonical focus → target-muscle guidance for the generation prompt.
export const FOCUS_MUSCLES = {
  full_body: "a balanced full-body session — hit legs, a push, a pull, and some core",
  upper: "the upper body — chest, back, shoulders, and arms",
  lower: "the lower body — quads, hamstrings, glutes, and calves",
  push: "the pushing muscles — chest, shoulders, and triceps",
  pull: "the pulling muscles — back, biceps, and rear delts",
  legs: "the legs — quads, hamstrings, glutes, and calves",
  arms: "the arms — biceps, triceps, and forearms (with some shoulder work)",
  core: "the core and midsection — abs, obliques, and lower back",
  chest: "the chest — plus supporting triceps and front delts",
  back: "the back — lats and upper back, plus some biceps",
  shoulders: "the shoulders — all three delt heads, plus some traps",
  chest_tri: "chest and triceps — horizontal pressing and pushing",
  back_bi: "back and biceps — pulling and rows",
};

/** One-line coaching guidance for a focus, for the prompt. Falls back gracefully. */
export function focusGuidance(focus) {
  return FOCUS_MUSCLES[focus] || "a balanced session appropriate to the user's recent training";
}

// Curated split options per day-count (1–7). Each option is a POOL of focuses.
// Kept intentionally simple and proven — the daily generation adds the exercises.
const TEMPLATES = {
  1: [
    { id: "full_1", label: "Full Body", focuses: ["full_body"], blurb: "One solid whole-body session." },
  ],
  2: [
    { id: "full_2", label: "Full Body ×2", focuses: ["full_body", "full_body"], blurb: "Two balanced whole-body days — simple and effective." },
    { id: "ul_2", label: "Upper / Lower", focuses: ["upper", "lower"], blurb: "One upper day, one lower day." },
  ],
  3: [
    { id: "full_3", label: "Full Body ×3", focuses: ["full_body", "full_body", "full_body"], blurb: "Three whole-body sessions — great for consistency." },
    { id: "ppl_3", label: "Push · Pull · Legs", focuses: ["push", "pull", "legs"], blurb: "The classic split — one push, one pull, one legs day." },
  ],
  4: [
    { id: "ul_4", label: "Upper / Lower ×2", focuses: ["upper", "lower", "upper", "lower"], blurb: "Two upper and two lower days — balanced and popular." },
    { id: "bodypart_4", label: "Chest & Tri · Back & Bi · Shoulders · Lower", focuses: ["chest_tri", "back_bi", "shoulders", "legs"], blurb: "A body-part split — push, pull, shoulders, and lower." },
    { id: "full_4", label: "Full Body ×4", focuses: ["full_body", "full_body", "full_body", "full_body"], blurb: "Four whole-body days — high frequency, low fuss." },
  ],
  5: [
    { id: "bro_5", label: "Bro Split — Chest · Back · Shoulders · Arms · Legs", focuses: ["chest", "back", "shoulders", "arms", "legs"], blurb: "The classic bodybuilder split — one body part per day." },
    { id: "ppl_ul_5", label: "Push · Pull · Legs + Upper / Lower", focuses: ["push", "pull", "legs", "upper", "lower"], blurb: "PPL plus an extra upper and lower — solid volume." },
    { id: "full_5", label: "Full Body ×5", focuses: ["full_body", "full_body", "full_body", "full_body", "full_body"], blurb: "Five whole-body days — max frequency." },
  ],
  6: [
    { id: "ppl_6", label: "Push · Pull · Legs ×2", focuses: ["push", "pull", "legs", "push", "pull", "legs"], blurb: "PPL run twice — high-volume classic." },
    { id: "ul_6", label: "Upper / Lower ×3", focuses: ["upper", "lower", "upper", "lower", "upper", "lower"], blurb: "Three upper and three lower days." },
  ],
  7: [
    { id: "ppl_full_7", label: "Push · Pull · Legs ×2 + Full Body", focuses: ["push", "pull", "legs", "push", "pull", "legs", "full_body"], blurb: "PPL twice plus a full-body day — for the very consistent." },
  ],
};

/**
 * Build display slots from a focus list, adding A/B suffixes to repeated focuses.
 * @returns {Array<{id, focus, label}>}
 */
function buildSlots(focuses) {
  const total = {};
  for (const f of focuses) total[f] = (total[f] || 0) + 1;
  const seen = {};
  return focuses.map((focus, i) => {
    seen[focus] = (seen[focus] || 0) + 1;
    const base = FOCUS_LABELS[focus] || focus;
    const label = total[focus] > 1 ? `${base} ${String.fromCharCode(64 + seen[focus])}` : base; // A, B, C…
    return { id: `${focus}_${i}`, focus, label };
  });
}

/**
 * Curated split options for a given number of days per week.
 * @param {number} daysPerWeek 1–7
 * @returns {Array<{id, label, blurb, slots: Array<{id, focus, label}>}>}
 */
export function getSplitOptions(daysPerWeek) {
  const days = Math.max(1, Math.min(7, Math.round(Number(daysPerWeek) || 3)));
  const opts = TEMPLATES[days] || TEMPLATES[3];
  return opts.map((o) => ({
    id: o.id,
    label: o.label,
    blurb: o.blurb,
    slots: buildSlots(o.focuses),
  }));
}

/**
 * Suggest the next slot to train, given the plan and the focuses already done this
 * week (in any order). Returns the first plan slot not yet covered by a completed
 * session; when the whole pool is done, returns a synthetic "extra" full-body slot.
 * @returns {{id, focus, label, extra?: boolean} | null}
 */
export function suggestNextSlot(weeklyPlan, doneFocuses) {
  if (!weeklyPlan?.slots?.length) return null;
  const remaining = {};
  for (const f of doneFocuses || []) remaining[f] = (remaining[f] || 0) + 1;
  for (const slot of weeklyPlan.slots) {
    if (remaining[slot.focus] > 0) {
      remaining[slot.focus] -= 1; // this slot is already covered by a done session
      continue;
    }
    return slot;
  }
  return { id: "extra_full", focus: "full_body", label: "Extra — Full Body", extra: true };
}

/** A always-available free-focus option for the "Something else" escape hatch. */
export const SOMETHING_ELSE_SLOT = { id: "something_else", focus: "full_body", label: "Quick Full Body", extra: true };
