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

  // Fetch member counts + facepile avatars for each group
  if (groups.length > 0) {
    const groupIds = groups.map(g => g.id);
    const { data: allMembers } = await supabase
      .from("group_members")
      .select("group_id, user_id, role, profile:profiles!group_members_user_id_fkey(avatar_url, username)")
      .in("group_id", groupIds)
      .eq("status", "accepted");

    const byGroup = {};
    for (const m of allMembers || []) {
      if (!byGroup[m.group_id]) byGroup[m.group_id] = [];
      byGroup[m.group_id].push(m);
    }
    for (const g of groups) {
      const members = byGroup[g.id] || [];
      g.member_count = members.length;
      g.facepile = members.slice(0, 4).map(m => ({
        avatar_url: m.profile?.avatar_url || null,
        username: m.profile?.username || "?",
        isAdmin: m.role === "admin",
      }));
    }
  }

  return { data: groups, error };
}

// ============================================================================
// Group Detail
// ============================================================================

export async function getGroupDetail(groupId) {
  const [groupRes, membersRes, workoutsRes, pollsRes, announcementsRes, duesRes, customFieldsRes] = await Promise.all([
    supabase
      .from("groups")
      .select("id, name, description, created_by, venmo_username, created_at")
      .eq("id", groupId)
      .single(),
    supabase
      .from("group_members")
      .select(`
        id, user_id, role, status, joined_at, created_at,
        profile:profiles!group_members_user_id_fkey(id, username, display_name, avatar_url)
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
    supabase
      .from("group_polls")
      .select(`
        id, group_id, created_by, title, description, event_date, event_time, event_end_time,
        deadline, allow_self_checkin, closed, created_at,
        created_by_profile:profiles!group_polls_created_by_fkey(id, username, display_name, avatar_url),
        poll_responses(id, poll_id, user_id, response, attended, responded_at, attendance_marked_at)
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("group_announcements")
      .select(`
        id, group_id, author_id, body, pinned, created_at,
        author_profile:profiles!group_announcements_author_id_fkey(id, username, display_name, avatar_url),
        announcement_reactions(id, announcement_id, user_id, emoji, created_at)
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("group_dues")
      .select(`
        id, group_id, created_by, title, amount_cents, description, due_date, closed, created_at,
        created_by_profile:profiles!group_dues_created_by_fkey(id, username, display_name, avatar_url),
        dues_payments(id, dues_id, user_id, marked_by, paid_at)
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("group_custom_fields")
      .select("id, group_id, field_name, field_type, required, options, sort_order, preset_key, created_at")
      .eq("group_id", groupId)
      .order("sort_order", { ascending: true }),
  ]);

  const error = groupRes.error || membersRes.error || workoutsRes.error;
  return {
    data: {
      group: groupRes.data,
      members: membersRes.data || [],
      workouts: workoutsRes.data || [],
      polls: pollsRes.data || [],
      announcements: announcementsRes.data || [],
      dues: duesRes.data || [],
      customFields: customFieldsRes.data || [],
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

export async function getPollDetail(pollId) {
  const { data, error } = await supabase
    .from("group_polls")
    .select(`
      id, group_id, created_by, title, description, event_date, event_time, event_end_time,
      deadline, allow_self_checkin, closed, created_at,
      created_by_profile:profiles!group_polls_created_by_fkey(id, username, display_name, avatar_url),
      poll_responses(id, poll_id, user_id, response, attended, responded_at, attendance_marked_at)
    `)
    .eq("id", pollId)
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

// ============================================================================
// Polls
// ============================================================================

export async function createPoll(groupId, { title, description, eventDate, eventTime, eventEndTime, deadline, allowSelfCheckin }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("group_polls")
    .insert({
      group_id: groupId,
      created_by: user.id,
      title,
      description: description || null,
      event_date: eventDate || null,
      event_time: eventTime || null,
      event_end_time: eventEndTime || null,
      deadline: deadline || null,
      allow_self_checkin: allowSelfCheckin || false,
    })
    .select()
    .single();

  return { data, error };
}

export async function closePoll(pollId) {
  const { data, error } = await supabase
    .from("group_polls")
    .update({ closed: true })
    .eq("id", pollId)
    .select()
    .single();
  return { data, error };
}

export async function reopenPoll(pollId) {
  const { data, error } = await supabase
    .from("group_polls")
    .update({ closed: false })
    .eq("id", pollId)
    .select()
    .single();
  return { data, error };
}

export async function deletePoll(pollId) {
  const { error } = await supabase
    .from("group_polls")
    .delete()
    .eq("id", pollId);
  return { data: null, error };
}

export async function respondToPoll(pollId, response) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("poll_responses")
    .upsert(
      { poll_id: pollId, user_id: user.id, response, responded_at: new Date().toISOString() },
      { onConflict: "poll_id,user_id" }
    )
    .select()
    .single();

  return { data, error };
}

export async function removeResponse(pollId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  const { error } = await supabase
    .from("poll_responses")
    .delete()
    .eq("poll_id", pollId)
    .eq("user_id", user.id);

  return { data: null, error };
}

export async function markAttendance(pollId, userId, attended) {
  // Upsert: if no response row exists, auto-create with response: 'yes'
  const { data, error } = await supabase
    .from("poll_responses")
    .upsert(
      {
        poll_id: pollId,
        user_id: userId,
        response: "yes",
        attended,
        attendance_marked_at: new Date().toISOString(),
      },
      { onConflict: "poll_id,user_id", ignoreDuplicates: false }
    )
    .select()
    .single();

  return { data, error };
}

export async function bulkMarkAttendance(pollId, attendanceMap) {
  const results = [];
  for (const [userId, attended] of Object.entries(attendanceMap)) {
    const res = await markAttendance(pollId, userId, attended);
    results.push(res);
  }
  const firstError = results.find((r) => r.error);
  return { data: results.map((r) => r.data), error: firstError?.error || null };
}

// ============================================================================
// Announcements
// ============================================================================

export async function createAnnouncement(groupId, body) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("group_announcements")
    .insert({ group_id: groupId, author_id: user.id, body })
    .select()
    .single();

  return { data, error };
}

export async function deleteAnnouncement(announcementId) {
  const { error } = await supabase
    .from("group_announcements")
    .delete()
    .eq("id", announcementId);
  return { data: null, error };
}

export async function pinAnnouncement(announcementId, pinned) {
  const { data, error } = await supabase
    .from("group_announcements")
    .update({ pinned })
    .eq("id", announcementId)
    .select()
    .single();
  return { data, error };
}

export async function toggleReaction(announcementId, emoji) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  // Check if already reacted
  const { data: existing } = await supabase
    .from("announcement_reactions")
    .select("id")
    .eq("announcement_id", announcementId)
    .eq("user_id", user.id)
    .eq("emoji", emoji)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("announcement_reactions")
      .delete()
      .eq("id", existing.id);
    return { data: null, error, removed: true };
  } else {
    const { data, error } = await supabase
      .from("announcement_reactions")
      .insert({ announcement_id: announcementId, user_id: user.id, emoji })
      .select()
      .single();
    return { data, error, removed: false };
  }
}

// ============================================================================
// Dues
// ============================================================================

export async function createDues(groupId, { title, amountCents, description, dueDate }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("group_dues")
    .insert({
      group_id: groupId,
      created_by: user.id,
      title,
      amount_cents: amountCents,
      description: description || null,
      due_date: dueDate || null,
    })
    .select()
    .single();

  return { data, error };
}

export async function closeDues(duesId) {
  const { data, error } = await supabase
    .from("group_dues")
    .update({ closed: true })
    .eq("id", duesId)
    .select()
    .single();
  return { data, error };
}

export async function deleteDues(duesId) {
  const { error } = await supabase
    .from("group_dues")
    .delete()
    .eq("id", duesId);
  return { data: null, error };
}

export async function markPaid(duesId, userId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("dues_payments")
    .insert({ dues_id: duesId, user_id: userId, marked_by: user.id })
    .select()
    .single();
  return { data, error };
}

export async function unmarkPaid(duesId, userId) {
  const { error } = await supabase
    .from("dues_payments")
    .delete()
    .eq("dues_id", duesId)
    .eq("user_id", userId);
  return { data: null, error };
}

// ============================================================================
// Group Settings
// ============================================================================

export async function updateGroupSettings(groupId, { venmoUsername }) {
  const updates = {};
  if (venmoUsername !== undefined) updates.venmo_username = venmoUsername || null;

  const { data, error } = await supabase
    .from("groups")
    .update(updates)
    .eq("id", groupId)
    .select()
    .single();
  return { data, error };
}

// ============================================================================
// Custom Fields
// ============================================================================

export const PRESET_FIELDS = [
  { key: "age", name: "Age", type: "number", required: false },
  { key: "gender", name: "Gender", type: "select", required: false, options: ["Male", "Female", "Non-binary", "Prefer not to say"] },
  { key: "emergency_contact", name: "Emergency Contact", type: "text", required: false },
  { key: "membership_id", name: "Membership ID", type: "text", required: false },
  { key: "phone", name: "Phone Number", type: "text", required: false },
];

export async function getGroupCustomFields(groupId) {
  const { data, error } = await supabase
    .from("group_custom_fields")
    .select("id, group_id, field_name, field_type, required, options, sort_order, preset_key, created_at")
    .eq("group_id", groupId)
    .order("sort_order", { ascending: true });
  return { data: data || [], error };
}

export async function createCustomField(groupId, { fieldName, fieldType, required, options, presetKey }) {
  // Get next sort_order
  const { data: existing } = await supabase
    .from("group_custom_fields")
    .select("sort_order")
    .eq("group_id", groupId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextSort = (existing?.[0]?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("group_custom_fields")
    .insert({
      group_id: groupId,
      field_name: fieldName,
      field_type: fieldType || "text",
      required: required || false,
      options: options || null,
      sort_order: nextSort,
      preset_key: presetKey || null,
    })
    .select()
    .single();
  return { data, error };
}

export async function updateCustomField(fieldId, updates) {
  const payload = {};
  if (updates.fieldName !== undefined) payload.field_name = updates.fieldName;
  if (updates.fieldType !== undefined) payload.field_type = updates.fieldType;
  if (updates.required !== undefined) payload.required = updates.required;
  if (updates.options !== undefined) payload.options = updates.options;
  if (updates.sortOrder !== undefined) payload.sort_order = updates.sortOrder;

  const { data, error } = await supabase
    .from("group_custom_fields")
    .update(payload)
    .eq("id", fieldId)
    .select()
    .single();
  return { data, error };
}

export async function deleteCustomField(fieldId) {
  const { error } = await supabase
    .from("group_custom_fields")
    .delete()
    .eq("id", fieldId);
  return { data: null, error };
}

export async function getGroupMemberFieldValues(groupId) {
  // Fetch all field values for all members in this group
  const { data, error } = await supabase
    .from("group_member_field_values")
    .select(`
      id, field_id, user_id, value, updated_at,
      field:group_custom_fields!group_member_field_values_field_id_fkey(id, group_id, field_name, field_type)
    `)
    .eq("field.group_id", groupId);
  return { data: (data || []).filter((v) => v.field), error };
}

export async function getMyFieldValues(groupId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { message: "Not authenticated" } };

  const { data: fields } = await supabase
    .from("group_custom_fields")
    .select("id")
    .eq("group_id", groupId);

  if (!fields?.length) return { data: [], error: null };

  const fieldIds = fields.map((f) => f.id);
  const { data, error } = await supabase
    .from("group_member_field_values")
    .select("id, field_id, value, updated_at")
    .eq("user_id", user.id)
    .in("field_id", fieldIds);

  return { data: data || [], error };
}

export async function setFieldValue(fieldId, value) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "Not authenticated" } };

  const { data, error } = await supabase
    .from("group_member_field_values")
    .upsert(
      {
        field_id: fieldId,
        user_id: user.id,
        value: value ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "field_id,user_id" }
    )
    .select()
    .single();
  return { data, error };
}

// ============================================================================
// Pending Polls
// ============================================================================

export async function getPendingPollCount() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: 0, error: null };

  // Get all open polls in user's groups that user hasn't responded to
  const { data: polls, error: pollsErr } = await supabase
    .from("group_polls")
    .select("id, closed, deadline")
    .eq("closed", false);

  if (pollsErr) return { data: 0, error: pollsErr };

  // Filter to actually open polls (deadline not passed)
  const now = Date.now();
  const openPolls = (polls || []).filter((p) => {
    if (p.closed) return false;
    if (p.deadline && new Date(p.deadline).getTime() <= now) return false;
    return true;
  });

  if (openPolls.length === 0) return { data: 0, error: null };

  // Get user's existing responses
  const { data: responses, error: respErr } = await supabase
    .from("poll_responses")
    .select("poll_id")
    .eq("user_id", user.id);

  if (respErr) return { data: 0, error: respErr };

  const respondedPollIds = new Set((responses || []).map((r) => r.poll_id));
  const pending = openPolls.filter((p) => !respondedPollIds.has(p.id)).length;

  return { data: pending, error: null };
}

/**
 * Fetch active polls across all of the user's groups (open, deadline not passed).
 */
export async function getActivePolls() {
  const { data, error } = await supabase
    .from("group_polls")
    .select(`
      id, group_id, created_by, title, description, event_date, event_time, event_end_time,
      deadline, allow_self_checkin, closed, created_at,
      created_by_profile:profiles!group_polls_created_by_fkey(id, username, display_name, avatar_url),
      poll_responses(id, poll_id, user_id, response, attended, responded_at),
      group:groups!group_polls_group_id_fkey(id, name)
    `)
    .eq("closed", false)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return { data: [], error };

  // Filter out polls with passed deadlines
  const now = Date.now();
  const active = (data || []).filter(p => !p.deadline || new Date(p.deadline).getTime() > now);
  return { data: active, error: null };
}

/**
 * Fetch recent announcements across all of the user's groups.
 */
export async function getRecentAnnouncements() {
  const { data, error } = await supabase
    .from("group_announcements")
    .select(`
      id, group_id, author_id, body, pinned, created_at,
      author_profile:profiles!group_announcements_author_id_fkey(id, username, display_name, avatar_url),
      announcement_reactions(id, announcement_id, user_id, emoji, created_at),
      group:groups!group_announcements_group_id_fkey(id, name)
    `)
    .order("created_at", { ascending: false })
    .limit(10);

  return { data: data || [], error };
}
