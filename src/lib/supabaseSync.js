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
 * Creates a debounced saver that collapses rapid state changes into a single
 * Supabase write. If a save is already in-flight when the timer fires, the
 * pending save is queued and executed after the current one finishes.
 */
export function createDebouncedSaver(delayMs = 2000) {
  let timerId = null;
  let inFlight = false;
  let queued = null; // { userId, state }
  let lastUserId = null;
  let lastState = null;

  async function flush(userId, state) {
    inFlight = true;
    try {
      await saveCloudState(userId, state);
    } catch (err) {
      console.error("Cloud save failed (localStorage is the safety net):", err);
    } finally {
      inFlight = false;
    }

    // If another save was queued while we were in-flight, run it now
    if (queued) {
      const next = queued;
      queued = null;
      await flush(next.userId, next.state);
    }
  }

  function trigger(userId, state) {
    lastUserId = userId;
    lastState = state;

    if (timerId) clearTimeout(timerId);

    if (inFlight) {
      // A save is already running; queue the latest state
      queued = { userId, state };
      return;
    }

    timerId = setTimeout(() => {
      timerId = null;
      flush(userId, state);
    }, delayMs);
  }

  /**
   * Immediately flush any pending debounced save (best-effort, for beforeunload).
   * Cancels the pending timer and fires the save with the latest known state.
   */
  function flushSync() {
    if (!timerId && !queued) return; // nothing pending
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    const pending = queued || (lastUserId && lastState ? { userId: lastUserId, state: lastState } : null);
    queued = null;
    if (pending) {
      flush(pending.userId, pending.state);
    }
  }

  function cancel() {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    queued = null;
  }

  return { trigger, cancel, flush, flushSync };
}
