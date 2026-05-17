import { supabase } from "./supabase";

/**
 * Fetch the cloud state for a given user.
 * Returns the parsed state object, or null if no row exists yet.
 */
export async function fetchCloudState(userId) {
  const { data, error } = await supabase
    .from("user_state")
    .select("state")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data ? data.state : null;
}

/**
 * Upsert the full app state for a given user.
 */
export async function saveCloudState(userId, state) {
  const { error } = await supabase.from("user_state").upsert(
    {
      user_id: userId,
      state,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) throw error;
}

/**
 * Fetch the rolling history of state snapshots for the current user.
 * The snapshots are written by a Postgres trigger on user_state and
 * pruned to the last 50 versions per user.
 * Returns rows ordered newest-first.
 */
export async function fetchHistorySnapshots(userId) {
  const { data, error } = await supabase
    .from("user_state_history")
    .select("id, created_at, state")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// createDebouncedSaver lives in ./debouncedSaver — bind it to saveCloudState here
// so callers get a Supabase-flavored saver without needing to wire the dep themselves.
import { createDebouncedSaver as createGenericSaver } from "./debouncedSaver";

export function createDebouncedSaver(delayMs = 2000) {
  return createGenericSaver(saveCloudState, delayMs);
}
