-- Fix: infinite recursion in group_members RLS policies
-- The original policies self-referenced group_members in their own SELECT policy,
-- causing "infinite recursion detected in policy for relation group_members".
-- Solution: SECURITY DEFINER helper functions that bypass RLS for membership checks.

-- ============================================================================
-- 1. Helper functions (SECURITY DEFINER = bypasses RLS)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_group_member(gid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = gid AND user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_group_admin(gid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = gid
      AND user_id = auth.uid()
      AND role = 'admin'
      AND status = 'accepted'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_accepted_group_member(gid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = gid
      AND user_id = auth.uid()
      AND status = 'accepted'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================================
-- 2. Fix group_members policies (was self-referencing)
-- ============================================================================

DROP POLICY IF EXISTS "members_can_view_group_members" ON group_members;
DROP POLICY IF EXISTS "admins_or_creator_can_add_members" ON group_members;
DROP POLICY IF EXISTS "self_or_admin_can_update_member" ON group_members;
DROP POLICY IF EXISTS "self_or_admin_can_delete_member" ON group_members;

CREATE POLICY "members_can_view_group_members" ON group_members
  FOR SELECT USING (is_group_member(group_id));

CREATE POLICY "admins_or_creator_can_add_members" ON group_members
  FOR INSERT WITH CHECK (
    (user_id = auth.uid() AND role = 'admin')
    OR is_group_admin(group_id)
  );

CREATE POLICY "self_or_admin_can_update_member" ON group_members
  FOR UPDATE USING (
    user_id = auth.uid()
    OR is_group_admin(group_id)
  );

CREATE POLICY "self_or_admin_can_delete_member" ON group_members
  FOR DELETE USING (
    user_id = auth.uid()
    OR is_group_admin(group_id)
  );

-- ============================================================================
-- 3. Fix groups table policies
-- ============================================================================

DROP POLICY IF EXISTS "group_members_can_view_group" ON groups;
DROP POLICY IF EXISTS "admins_can_update_group" ON groups;
DROP POLICY IF EXISTS "admins_can_delete_group" ON groups;

CREATE POLICY "group_members_can_view_group" ON groups
  FOR SELECT USING (is_group_member(id) OR created_by = auth.uid());

CREATE POLICY "admins_can_update_group" ON groups
  FOR UPDATE USING (is_group_admin(id));

CREATE POLICY "admins_can_delete_group" ON groups
  FOR DELETE USING (is_group_admin(id));

-- ============================================================================
-- 4. Fix group_workouts table policies
-- ============================================================================

DROP POLICY IF EXISTS "accepted_members_can_view_workouts" ON group_workouts;
DROP POLICY IF EXISTS "admins_can_share_workouts" ON group_workouts;
DROP POLICY IF EXISTS "admins_can_delete_workouts" ON group_workouts;

CREATE POLICY "accepted_members_can_view_workouts" ON group_workouts
  FOR SELECT USING (is_accepted_group_member(group_id));

CREATE POLICY "admins_can_share_workouts" ON group_workouts
  FOR INSERT WITH CHECK (
    auth.uid() = shared_by
    AND is_group_admin(group_id)
  );

CREATE POLICY "admins_can_delete_workouts" ON group_workouts
  FOR DELETE USING (is_group_admin(group_id));

-- ============================================================================
-- 5. Fix group_polls table policies
-- ============================================================================

DROP POLICY IF EXISTS "accepted_members_can_view_polls" ON group_polls;
DROP POLICY IF EXISTS "admins_can_create_polls" ON group_polls;
DROP POLICY IF EXISTS "admins_can_update_polls" ON group_polls;
DROP POLICY IF EXISTS "admins_can_delete_polls" ON group_polls;

CREATE POLICY "accepted_members_can_view_polls" ON group_polls
  FOR SELECT USING (is_accepted_group_member(group_id));

CREATE POLICY "admins_can_create_polls" ON group_polls
  FOR INSERT WITH CHECK (
    auth.uid() = created_by
    AND is_group_admin(group_id)
  );

CREATE POLICY "admins_can_update_polls" ON group_polls
  FOR UPDATE USING (is_group_admin(group_id));

CREATE POLICY "admins_can_delete_polls" ON group_polls
  FOR DELETE USING (is_group_admin(group_id));

-- ============================================================================
-- 6. Fix poll_responses table policies
-- ============================================================================

DROP POLICY IF EXISTS "accepted_members_can_view_responses" ON poll_responses;
DROP POLICY IF EXISTS "members_can_respond_to_polls" ON poll_responses;
DROP POLICY IF EXISTS "self_or_admin_can_update_response" ON poll_responses;

CREATE POLICY "accepted_members_can_view_responses" ON poll_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_polls
      WHERE group_polls.id = poll_responses.poll_id
        AND is_accepted_group_member(group_polls.group_id)
    )
  );

CREATE POLICY "members_can_respond_to_polls" ON poll_responses
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM group_polls
      WHERE group_polls.id = poll_responses.poll_id
        AND is_accepted_group_member(group_polls.group_id)
        AND group_polls.closed = false
    )
  );

CREATE POLICY "self_or_admin_can_update_response" ON poll_responses
  FOR UPDATE USING (
    (
      user_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM group_polls
        WHERE group_polls.id = poll_responses.poll_id
          AND group_polls.closed = false
      )
    )
    OR
    EXISTS (
      SELECT 1 FROM group_polls
      WHERE group_polls.id = poll_responses.poll_id
        AND is_group_admin(group_polls.group_id)
    )
  );
