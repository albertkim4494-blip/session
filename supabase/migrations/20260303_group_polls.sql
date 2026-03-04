-- Group Polls: event scheduling with RSVP and attendance tracking
-- Run against Supabase project via Dashboard > SQL Editor

-- ============================================================================
-- 1. group_polls table
-- ============================================================================
CREATE TABLE IF NOT EXISTS group_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  description TEXT CHECK (char_length(description) <= 500),
  event_date DATE,
  event_time TIME,
  deadline TIMESTAMPTZ,
  allow_self_checkin BOOLEAN NOT NULL DEFAULT false,
  closed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. poll_responses table
-- ============================================================================
CREATE TABLE IF NOT EXISTS poll_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES group_polls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  response TEXT NOT NULL CHECK (response IN ('yes', 'no', 'maybe')),
  attended BOOLEAN,
  responded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  attendance_marked_at TIMESTAMPTZ,
  UNIQUE(poll_id, user_id)
);

-- ============================================================================
-- 3. Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_gp_group_created ON group_polls(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pr_poll ON poll_responses(poll_id);
CREATE INDEX IF NOT EXISTS idx_pr_user ON poll_responses(user_id, poll_id);

-- ============================================================================
-- 4. Enable RLS
-- ============================================================================
ALTER TABLE group_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_responses ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. RLS Policies — group_polls
-- ============================================================================

-- SELECT: accepted members of the group
CREATE POLICY "accepted_members_can_view_polls" ON group_polls
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_polls.group_id
        AND group_members.user_id = auth.uid()
        AND group_members.status = 'accepted'
    )
  );

-- INSERT: admins of the group
CREATE POLICY "admins_can_create_polls" ON group_polls
  FOR INSERT WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_polls.group_id
        AND group_members.user_id = auth.uid()
        AND group_members.role = 'admin'
        AND group_members.status = 'accepted'
    )
  );

-- UPDATE: admins of the group (close/reopen)
CREATE POLICY "admins_can_update_polls" ON group_polls
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_polls.group_id
        AND group_members.user_id = auth.uid()
        AND group_members.role = 'admin'
        AND group_members.status = 'accepted'
    )
  );

-- DELETE: admins of the group
CREATE POLICY "admins_can_delete_polls" ON group_polls
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_polls.group_id
        AND group_members.user_id = auth.uid()
        AND group_members.role = 'admin'
        AND group_members.status = 'accepted'
    )
  );

-- ============================================================================
-- 6. RLS Policies — poll_responses
-- ============================================================================

-- SELECT: accepted members of the poll's group
CREATE POLICY "accepted_members_can_view_responses" ON poll_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_polls
      JOIN group_members ON group_members.group_id = group_polls.group_id
      WHERE group_polls.id = poll_responses.poll_id
        AND group_members.user_id = auth.uid()
        AND group_members.status = 'accepted'
    )
  );

-- INSERT: accepted members can respond to open polls (own row only)
CREATE POLICY "members_can_respond_to_polls" ON poll_responses
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM group_polls
      JOIN group_members ON group_members.group_id = group_polls.group_id
      WHERE group_polls.id = poll_responses.poll_id
        AND group_members.user_id = auth.uid()
        AND group_members.status = 'accepted'
        AND group_polls.closed = false
    )
  );

-- UPDATE: self can update own response (poll open) OR admin can update any (for attendance)
CREATE POLICY "self_or_admin_can_update_response" ON poll_responses
  FOR UPDATE USING (
    -- Self update on open poll
    (
      user_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM group_polls
        WHERE group_polls.id = poll_responses.poll_id
          AND group_polls.closed = false
      )
    )
    OR
    -- Admin of the group can always update (attendance marking)
    EXISTS (
      SELECT 1 FROM group_polls
      JOIN group_members ON group_members.group_id = group_polls.group_id
      WHERE group_polls.id = poll_responses.poll_id
        AND group_members.user_id = auth.uid()
        AND group_members.role = 'admin'
        AND group_members.status = 'accepted'
    )
  );

-- DELETE: self can delete own response
CREATE POLICY "self_can_delete_response" ON poll_responses
  FOR DELETE USING (user_id = auth.uid());
