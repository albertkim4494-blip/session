import { supabase } from "./supabase";

// Normalize user pair so user_a < user_b (UUID string comparison)
function orderedPair(id1, id2) {
  return id1 < id2 ? { user_a: id1, user_b: id2 } : { user_a: id2, user_b: id1 };
}

// ============================================================================
// User Search
// ============================================================================

export async function searchUsers(query) {
  if (!query || query.trim().length < 2) return { data: [], error: null };
  const { data, error } = await supabase.rpc("search_users", {
    search_query: query.trim(),
  });
  return { data: data || [], error };
}

// ============================================================================
// Friend Requests
// ============================================================================

export async function sendFriendRequest(userId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  const pair = orderedPair(user.id, userId);
  const { data, error } = await supabase.from("friendships").insert({
    ...pair,
    initiated_by: user.id,
    status: "pending",
  }).select().single();
  return { data, error };
}

export async function acceptFriendRequest(friendshipId) {
  const { data, error } = await supabase
    .from("friendships")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", friendshipId)
    .select()
    .single();
  return { data, error };
}

export async function declineFriendRequest(friendshipId) {
  const { error } = await supabase
    .from("friendships")
    .delete()
    .eq("id", friendshipId);
  return { data: null, error };
}

// ============================================================================
// Friend Management
// ============================================================================

export async function removeFriend(friendshipId) {
  const { error } = await supabase
    .from("friendships")
    .delete()
    .eq("id", friendshipId);
  return { data: null, error };
}

export async function blockUser(friendshipId) {
  const { data, error } = await supabase
    .from("friendships")
    .update({ status: "blocked" })
    .eq("id", friendshipId)
    .select()
    .single();
  return { data, error };
}

export async function unblockUser(friendshipId) {
  const { error } = await supabase
    .from("friendships")
    .delete()
    .eq("id", friendshipId);
  return { data: null, error };
}

// ============================================================================
// Friend Lists
// ============================================================================

export async function getFriends() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("friendships")
    .select(`
      id, status, created_at, accepted_at, initiated_by, user_a, user_b,
      profile_a:profiles!friendships_user_a_fkey(id, username, display_name, avatar_url),
      profile_b:profiles!friendships_user_b_fkey(id, username, display_name, avatar_url)
    `)
    .eq("status", "accepted")
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);

  // Flatten: extract the "other" user's profile
  const friends = (data || []).map((f) => {
    const isA = f.user_a === user.id;
    const friendProfile = isA ? f.profile_b : f.profile_a;
    return {
      friendshipId: f.id,
      ...friendProfile,
    };
  });
  return { data: friends, error };
}

export async function getPendingRequests() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("friendships")
    .select(`
      id, status, created_at, initiated_by, user_a, user_b,
      profile_a:profiles!friendships_user_a_fkey(id, username, display_name, avatar_url),
      profile_b:profiles!friendships_user_b_fkey(id, username, display_name, avatar_url)
    `)
    .eq("status", "pending")
    .neq("initiated_by", user.id)
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);

  const requests = (data || []).map((f) => {
    const isA = f.user_a === user.id;
    const fromProfile = isA ? f.profile_b : f.profile_a;
    return {
      friendshipId: f.id,
      ...fromProfile,
      created_at: f.created_at,
    };
  });
  return { data: requests, error };
}

export async function getSentRequests() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("friendships")
    .select(`
      id, status, created_at, initiated_by, user_a, user_b,
      profile_a:profiles!friendships_user_a_fkey(id, username, display_name, avatar_url),
      profile_b:profiles!friendships_user_b_fkey(id, username, display_name, avatar_url)
    `)
    .eq("status", "pending")
    .eq("initiated_by", user.id);

  const sent = (data || []).map((f) => {
    const isA = f.user_a === user.id;
    const toProfile = isA ? f.profile_b : f.profile_a;
    return {
      friendshipId: f.id,
      ...toProfile,
      created_at: f.created_at,
    };
  });
  return { data: sent, error };
}

// ============================================================================
// Workout Sharing
// ============================================================================

export async function shareWorkout(toUserId, workout, message) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  // Deep copy the workout as a snapshot
  const snapshot = JSON.parse(JSON.stringify(workout));

  const { data, error } = await supabase.from("shared_workouts").insert({
    from_user_id: user.id,
    to_user_id: toUserId,
    workout_snapshot: snapshot,
    message: message || null,
    status: "pending",
  }).select().single();
  return { data, error };
}

export async function getInbox() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("shared_workouts")
    .select(`
      id, workout_snapshot, message, status, created_at, read_at,
      from_profile:profiles!shared_workouts_from_user_id_fkey(id, username, display_name, avatar_url)
    `)
    .eq("to_user_id", user.id)
    .order("created_at", { ascending: false });

  return { data: data || [], error };
}

export async function acceptSharedWorkout(id) {
  const { data, error } = await supabase
    .from("shared_workouts")
    .update({ status: "accepted", read_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  return { data, error };
}

export async function dismissSharedWorkout(id) {
  const { data, error } = await supabase
    .from("shared_workouts")
    .update({ status: "dismissed", read_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  return { data, error };
}

// ============================================================================
// Unread Count (badge)
// ============================================================================

export async function getUnreadCount() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: 0, error: null };

  // Pending friend requests addressed to me
  const { count: pendingCount, error: e1 } = await supabase
    .from("friendships")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending")
    .neq("initiated_by", user.id)
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);

  // Unread shared workouts
  const { count: inboxCount, error: e2 } = await supabase
    .from("shared_workouts")
    .select("id", { count: "exact", head: true })
    .eq("to_user_id", user.id)
    .eq("status", "pending");

  const error = e1 || e2;
  return { data: (pendingCount || 0) + (inboxCount || 0), error };
}

// ============================================================================
// Profile discoverability
// ============================================================================

export async function updateSearchable(isSearchable) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("profiles")
    .update({ is_searchable: isSearchable })
    .eq("id", user.id)
    .select()
    .single();
  return { data, error };
}
