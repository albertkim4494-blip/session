-- Phase 3: Announcements, Reactions & Payment Tracking
-- Run against Supabase project via Dashboard > SQL Editor

-- ============================================================================
-- 1. group_announcements table
-- ============================================================================
CREATE TABLE IF NOT EXISTS group_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. announcement_reactions table
-- ============================================================================
CREATE TABLE IF NOT EXISTS announcement_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES group_announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  emoji TEXT NOT NULL CHECK (emoji IN ('thumbsup', 'fire', 'heart', 'clap', '100')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(announcement_id, user_id, emoji)
);

-- ============================================================================
-- 3. group_dues table
-- ============================================================================
CREATE TABLE IF NOT EXISTS group_dues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  description TEXT CHECK (char_length(description) <= 500),
  due_date DATE,
  closed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. dues_payments table
-- ============================================================================
CREATE TABLE IF NOT EXISTS dues_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dues_id UUID NOT NULL REFERENCES group_dues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  marked_by UUID NOT NULL REFERENCES profiles(id),
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(dues_id, user_id)
);

-- ============================================================================
-- 5. Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_ga_group_created ON group_announcements(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ar_announcement ON announcement_reactions(announcement_id);
CREATE INDEX IF NOT EXISTS idx_gd_group_created ON group_dues(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dp_dues ON dues_payments(dues_id);

-- ============================================================================
-- 6. Enable RLS
-- ============================================================================
ALTER TABLE group_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_dues ENABLE ROW LEVEL SECURITY;
ALTER TABLE dues_payments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 7. RLS Policies — group_announcements
-- ============================================================================

-- SELECT: accepted members
CREATE POLICY "accepted_members_can_view_announcements" ON group_announcements
  FOR SELECT USING (is_accepted_group_member(group_id));

-- INSERT: accepted members can post (own row)
CREATE POLICY "accepted_members_can_create_announcements" ON group_announcements
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND is_accepted_group_member(group_id)
  );

-- UPDATE: author or admin (for pinning)
CREATE POLICY "author_or_admin_can_update_announcement" ON group_announcements
  FOR UPDATE USING (
    author_id = auth.uid()
    OR is_group_admin(group_id)
  );

-- DELETE: author or admin
CREATE POLICY "author_or_admin_can_delete_announcement" ON group_announcements
  FOR DELETE USING (
    author_id = auth.uid()
    OR is_group_admin(group_id)
  );

-- ============================================================================
-- 8. RLS Policies — announcement_reactions
-- ============================================================================

-- SELECT: accepted members of the announcement's group
CREATE POLICY "accepted_members_can_view_reactions" ON announcement_reactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_announcements
      WHERE group_announcements.id = announcement_reactions.announcement_id
        AND is_accepted_group_member(group_announcements.group_id)
    )
  );

-- INSERT: accepted members (own row)
CREATE POLICY "accepted_members_can_add_reactions" ON announcement_reactions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM group_announcements
      WHERE group_announcements.id = announcement_reactions.announcement_id
        AND is_accepted_group_member(group_announcements.group_id)
    )
  );

-- DELETE: own row only
CREATE POLICY "users_can_remove_own_reactions" ON announcement_reactions
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- 9. RLS Policies — group_dues
-- ============================================================================

-- SELECT: accepted members
CREATE POLICY "accepted_members_can_view_dues" ON group_dues
  FOR SELECT USING (is_accepted_group_member(group_id));

-- INSERT: admins only
CREATE POLICY "admins_can_create_dues" ON group_dues
  FOR INSERT WITH CHECK (
    auth.uid() = created_by
    AND is_group_admin(group_id)
  );

-- UPDATE: admins only
CREATE POLICY "admins_can_update_dues" ON group_dues
  FOR UPDATE USING (is_group_admin(group_id));

-- DELETE: admins only
CREATE POLICY "admins_can_delete_dues" ON group_dues
  FOR DELETE USING (is_group_admin(group_id));

-- ============================================================================
-- 10. RLS Policies — dues_payments
-- ============================================================================

-- SELECT: accepted members of the dues' group
CREATE POLICY "accepted_members_can_view_payments" ON dues_payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_dues
      WHERE group_dues.id = dues_payments.dues_id
        AND is_accepted_group_member(group_dues.group_id)
    )
  );

-- INSERT: admins of the dues' group
CREATE POLICY "admins_can_mark_payments" ON dues_payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_dues
      WHERE group_dues.id = dues_payments.dues_id
        AND is_group_admin(group_dues.group_id)
    )
  );

-- DELETE: admins of the dues' group
CREATE POLICY "admins_can_unmark_payments" ON dues_payments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM group_dues
      WHERE group_dues.id = dues_payments.dues_id
        AND is_group_admin(group_dues.group_id)
    )
  );
