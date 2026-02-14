import { supabase } from "./supabase";

/**
 * Calls the ai-exercise-enrichment edge function to classify a custom exercise.
 * Returns { muscles, equipment, tags, movement, defaultUnit } or throws.
 */
export async function enrichExercise(name) {
  // Ensure fresh auth session before calling edge function
  await supabase.auth.getSession();

  const { data, error } = await supabase.functions.invoke(
    "ai-exercise-enrichment",
    { body: { name } }
  );

  if (error) throw new Error(error.message || "Enrichment failed");
  if (!data || data.error) throw new Error(data?.error || "No data returned");

  return {
    muscles: data.muscles || { primary: [] },
    equipment: data.equipment || [],
    tags: data.tags || [],
    movement: data.movement || "push",
    defaultUnit: data.defaultUnit || "reps",
  };
}
