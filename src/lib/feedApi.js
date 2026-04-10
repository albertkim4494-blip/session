import { supabase } from "./supabase";

// ============================================================================
// Feed API — activity feed for friend workout completions & PRs
// ============================================================================

export const FEED_REACTIONS = ["fist", "fire", "heart", "clap", "100"];

export const FEED_EMOJI_MAP = {
  fist: "\u{1F44A}",
  fire: "\u{1F525}",
  heart: "\u2764\uFE0F",
  clap: "\u{1F44F}",
  100: "\u{1F4AF}",
};

/**
 * Fetch paginated friend feed via RPC.
 * Returns { data: [...items], error }
 */
export async function getFeed(cursor = null, pageSize = 30) {
  const { data, error } = await supabase.rpc("get_friend_feed", {
    page_size: pageSize,
    before_cursor: cursor,
  });
  return { data: data || [], error };
}

/**
 * Publish a workout completion event.
 * payload: { workoutName, category, exerciseCount, totalSets, totalVolume, exercises, measurementSystem }
 */
export async function publishWorkoutCompletion(payload, eventDate) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("feed_events")
    .upsert({
      user_id: user.id,
      event_type: "workout_complete",
      payload,
      event_date: eventDate,
    }, { onConflict: "user_id,event_type,event_date" })
    .select()
    .single();

  return { data, error };
}

/**
 * Publish a PR event.
 * payload: { exerciseName, prType, value, unit, previousValue }
 */
export async function publishPR(payload, eventDate) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("feed_events")
    .upsert({
      user_id: user.id,
      event_type: "pr",
      payload,
      event_date: eventDate,
    }, { onConflict: "user_id,event_type,event_date" })
    .select()
    .single();

  return { data, error };
}

/**
 * Toggle a reaction on a feed event (add or remove).
 */
export async function toggleFeedReaction(feedEventId, emoji) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  const { data: existing } = await supabase
    .from("feed_reactions")
    .select("id")
    .eq("feed_event_id", feedEventId)
    .eq("user_id", user.id)
    .eq("emoji", emoji)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("feed_reactions")
      .delete()
      .eq("id", existing.id);
    return { data: null, error, removed: true };
  } else {
    const { data, error } = await supabase
      .from("feed_reactions")
      .insert({ feed_event_id: feedEventId, user_id: user.id, emoji })
      .select()
      .single();
    return { data, error, removed: false };
  }
}

/**
 * Delete your own feed event.
 */
export async function deleteFeedEvent(eventId) {
  return supabase
    .from("feed_events")
    .delete()
    .eq("id", eventId);
}
