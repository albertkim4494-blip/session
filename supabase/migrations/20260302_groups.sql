-- Groups: team/club containers for coach-style workout sharing
-- Run against Supabase project via Dashboard > SQL Editor

-- ============================================================================
-- 1. groups table
-- ============================================================================
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  description TEXT CHECK (char_length(description) <= 300),
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. group_members table (M:N with roles + invite status)
-- ============================================================================
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  invited_by UUID REFERENCES profiles(id),
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- ============================================================================
-- 3. group_workouts table (admin-shared workout prescriptions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS group_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES profiles(id),
  workout_snapshot JSONB NOT NULL,
  message TEXT CHECK (char_length(message) <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_gm_user_status ON group_members(user_id, status);
CREATE INDEX IF NOT EXISTS idx_gm_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_gw_group_created ON group_workouts(group_id, created_at DESC);

-- ============================================================================
-- 5. Enable RLS
-- ============================================================================
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_workouts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. RLS Policies — groups
-- ============================================================================

-- SELECT: user is a member of the group (any status)
CREATE POLICY "group_members_can_view_group" ON groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
        AND group_members.user_id = auth.uid()
    )
  );

-- INSERT: creator is the authenticated user
CREATE POLICY "users_can_create_groups" ON groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- UPDATE: user is an admin member of the group
CREATE POLICY "admins_can_update_group" ON groups
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
        AND group_members.user_id = auth.uid()
        AND group_members.role = 'admin'
        AND group_members.status = 'accepted'
    )
  );

-- DELETE: user is an admin member of the group
CREATE POLICY "admins_can_delete_group" ON groups
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
        AND group_members.user_id = auth.uid()
        AND group_members.role = 'admin'
        AND group_members.status = 'accepted'
    )
  );

-- ============================================================================
-- 7. RLS Policies — group_members
-- ============================================================================

-- SELECT: user is a member of the same group
CREATE POLICY "members_can_view_group_members" ON group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members AS gm
      WHERE gm.group_id = group_members.group_id
        AND gm.user_id = auth.uid()
    )
  );

-- INSERT: user is admin of the group, OR user is inserting self as admin (group creation)
CREATE POLICY "admins_or_creator_can_add_members" ON group_members
  FOR INSERT WITH CHECK (
    -- Self-insert as admin (group creation flow)
    (user_id = auth.uid() AND role = 'admin')
    OR
    -- Admin of the group can invite others
    EXISTS (
      SELECT 1 FROM group_members AS gm
      WHERE gm.group_id = group_members.group_id
        AND gm.user_id = auth.uid()
        AND gm.role = 'admin'
        AND gm.status = 'accepted'
    )
  );

-- UPDATE: user is updating own row (accept invite) OR user is admin
CREATE POLICY "self_or_admin_can_update_member" ON group_members
  FOR UPDATE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM group_members AS gm
      WHERE gm.group_id = group_members.group_id
        AND gm.user_id = auth.uid()
        AND gm.role = 'admin'
        AND gm.status = 'accepted'
    )
  );

-- DELETE: user deleting own row (leave) OR admin removing someone
CREATE POLICY "self_or_admin_can_delete_member" ON group_members
  FOR DELETE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM group_members AS gm
      WHERE gm.group_id = group_members.group_id
        AND gm.user_id = auth.uid()
        AND gm.role = 'admin'
        AND gm.status = 'accepted'
    )
  );

-- ============================================================================
-- 8. RLS Policies — group_workouts
-- ============================================================================

-- SELECT: user is an accepted member of the group
CREATE POLICY "accepted_members_can_view_workouts" ON group_workouts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_workouts.group_id
        AND group_members.user_id = auth.uid()
        AND group_members.status = 'accepted'
    )
  );

-- INSERT: user is the sharer AND is an admin of the group
CREATE POLICY "admins_can_share_workouts" ON group_workouts
  FOR INSERT WITH CHECK (
    auth.uid() = shared_by
    AND EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_workouts.group_id
        AND group_members.user_id = auth.uid()
        AND group_members.role = 'admin'
        AND group_members.status = 'accepted'
    )
  );

-- DELETE: user is admin of the group
CREATE POLICY "admins_can_delete_workouts" ON group_workouts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_workouts.group_id
        AND group_members.user_id = auth.uid()
        AND group_members.role = 'admin'
        AND group_members.status = 'accepted'
    )
  );
