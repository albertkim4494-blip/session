const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Calls the ai-exercise-enrichment edge function to classify a custom exercise.
 * Uses anon key auth (function doesn't need user-specific data).
 * Returns { muscles, equipment, tags, movement, defaultUnit } or throws.
 */
export async function enrichExercise(name) {
  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/ai-exercise-enrichment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ name }),
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Enrichment HTTP error:", res.status, text);
    throw new Error(`Enrichment failed (${res.status})`);
  }

  const data = await res.json();

  if (data.error) {
    console.error("Enrichment API error:", data.error);
    throw new Error(data.error);
  }

  return {
    muscles: data.muscles || { primary: [] },
    equipment: data.equipment || [],
    tags: data.tags || [],
    movement: data.movement || "push",
    defaultUnit: data.defaultUnit || "reps",
  };
}
