import { supabase } from "./supabase";

// ============================================================================
// Group CRUD
// ============================================================================

export async function createGroup(name, description) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  // Insert group
  const { data: group, error: groupErr } = await supabase
    .from("groups")
    .insert({ name, description: description || null, created_by: user.id })
    .select()
    .single();

  if (groupErr) return { data: null, error: groupErr };

  // Insert creator as admin (accepted)
  const { error: memberErr } = await supabase
    .from("group_members")
    .insert({
      group_id: group.id,
      user_id: user.id,
      role: "admin",
      status: "accepted",
      joined_at: new Date().toISOString(),
    });

  if (memberErr) return { data: group, error: memberErr };

  return { data: group, error: null };
}

export async function deleteGroup(groupId) {
  const { error } = await supabase
    .from("groups")
    .delete()
    .eq("id", groupId);
  return { data: null, error };
}

// ============================================================================
// My Groups
// ============================================================================

export async function getMyGroups() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("group_members")
    .select(`
      id, role, status, joined_at,
      group:groups(id, name, description, created_by, created_at)
    `)
    .eq("user_id", user.id)
    .eq("status", "accepted");

  const groups = (data || [])
    .filter((m) => m.group)
    .map((m) => ({
      membershipId: m.id,
      role: m.role,
      joinedAt: m.joined_at,
      ...m.group,
    }));

  return { data: groups, error };
}

// ============================================================================
// Group Detail
// ============================================================================

export async function getGroupDetail(groupId) {
  const [groupRes, membersRes, workoutsRes] = await Promise.all([
    supabase
      .from("groups")
      .select("id, name, description, created_by, created_at")
      .eq("id", groupId)
      .single(),
    supabase
      .from("group_members")
      .select(`
        id, user_id, role, status, joined_at, created_at,
        profile:profiles(id, username, display_name, avatar_url)
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: true }),
    supabase
      .from("group_workouts")
      .select(`
        id, group_id, shared_by, workout_snapshot, message, created_at,
        shared_by_profile:profiles!group_workouts_shared_by_fkey(id, username, display_name, avatar_url)
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const error = groupRes.error || membersRes.error || workoutsRes.error;
  return {
    data: {
      group: groupRes.data,
      members: membersRes.data || [],
      workouts: workoutsRes.data || [],
    },
    error,
  };
}

// ============================================================================
// Invitations
// ============================================================================

export async function inviteToGroup(groupId, userId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("group_members")
    .insert({
      group_id: groupId,
      user_id: userId,
      role: "member",
      status: "pending",
      invited_by: user.id,
    })
    .select()
    .single();

  return { data, error };
}

export async function getGroupInvites() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("group_members")
    .select(`
      id, group_id, status, created_at,
      group:groups(id, name, description),
      inviter:profiles!group_members_invited_by_fkey(id, username, display_name, avatar_url)
    `)
    .eq("user_id", user.id)
    .eq("status", "pending");

  return { data: data || [], error };
}

export async function acceptGroupInvite(membershipId) {
  const { data, error } = await supabase
    .from("group_members")
    .update({ status: "accepted", joined_at: new Date().toISOString() })
    .eq("id", membershipId)
    .select()
    .single();
  return { data, error };
}

export async function declineGroupInvite(membershipId) {
  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("id", membershipId);
  return { data: null, error };
}

export async function getGroupInviteCount() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: 0, error: null };

  const { count, error } = await supabase
    .from("group_members")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "pending");

  return { data: count || 0, error };
}

// ============================================================================
// Member Management
// ============================================================================

export async function removeMember(membershipId) {
  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("id", membershipId);
  return { data: null, error };
}

export async function promoteMember(membershipId) {
  const { data, error } = await supabase
    .from("group_members")
    .update({ role: "admin" })
    .eq("id", membershipId)
    .select()
    .single();
  return { data, error };
}

export async function leaveGroup(groupId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", user.id);
  return { data: null, error };
}

// ============================================================================
// Workout Sharing
// ============================================================================

export async function shareWorkoutToGroup(groupId, workout, message) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  const snapshot = JSON.parse(JSON.stringify(workout));

  const { data, error } = await supabase
    .from("group_workouts")
    .insert({
      group_id: groupId,
      shared_by: user.id,
      workout_snapshot: snapshot,
      message: message || null,
    })
    .select()
    .single();

  return { data, error };
}

export async function deleteGroupWorkout(workoutId) {
  const { error } = await supabase
    .from("group_workouts")
    .delete()
    .eq("id", workoutId);
  return { data: null, error };
}
