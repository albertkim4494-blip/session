-- Phase 4: Event sessions, custom member fields, Venmo integration
-- Run against Supabase project via Dashboard > SQL Editor

-- ============================================================================
-- 1. Add event_end_time to group_polls
-- ============================================================================
ALTER TABLE group_polls ADD COLUMN IF NOT EXISTS event_end_time TIME;

-- ============================================================================
-- 2. Add venmo_username to groups
-- ============================================================================
ALTER TABLE groups ADD COLUMN IF NOT EXISTS venmo_username TEXT CHECK (char_length(venmo_username) <= 40);

-- ============================================================================
-- 3. group_custom_fields table — field definitions per group
-- ============================================================================
CREATE TABLE IF NOT EXISTS group_custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL CHECK (char_length(field_name) BETWEEN 1 AND 100),
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'number', 'date', 'select')),
  required BOOLEAN NOT NULL DEFAULT false,
  options JSONB, -- for select type: ["Option A", "Option B"]
  sort_order INTEGER NOT NULL DEFAULT 0,
  preset_key TEXT, -- nullable; e.g. "age", "gender", "emergency_contact", "membership_id", "phone"
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. group_member_field_values table — per-member values
-- ============================================================================
CREATE TABLE IF NOT EXISTS group_member_field_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID NOT NULL REFERENCES group_custom_fields(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(field_id, user_id)
);

-- ============================================================================
-- 5. Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_gcf_group_sort ON group_custom_fields(group_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_gmfv_field ON group_member_field_values(field_id);
CREATE INDEX IF NOT EXISTS idx_gmfv_user ON group_member_field_values(user_id);

-- ============================================================================
-- 6. Enable RLS
-- ============================================================================
ALTER TABLE group_custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_member_field_values ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 7. RLS Policies — group_custom_fields
-- ============================================================================

-- SELECT: accepted members can view field definitions
CREATE POLICY "accepted_members_can_view_custom_fields" ON group_custom_fields
  FOR SELECT USING (is_accepted_group_member(group_id));

-- INSERT: admins only
CREATE POLICY "admins_can_create_custom_fields" ON group_custom_fields
  FOR INSERT WITH CHECK (is_group_admin(group_id));

-- UPDATE: admins only
CREATE POLICY "admins_can_update_custom_fields" ON group_custom_fields
  FOR UPDATE USING (is_group_admin(group_id));

-- DELETE: admins only
CREATE POLICY "admins_can_delete_custom_fields" ON group_custom_fields
  FOR DELETE USING (is_group_admin(group_id));

-- ============================================================================
-- 8. RLS Policies — group_member_field_values
-- ============================================================================

-- SELECT: accepted members of the field's group
CREATE POLICY "accepted_members_can_view_field_values" ON group_member_field_values
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_custom_fields
      WHERE group_custom_fields.id = group_member_field_values.field_id
        AND is_accepted_group_member(group_custom_fields.group_id)
    )
  );

-- INSERT: own rows only (must be accepted member of the field's group)
CREATE POLICY "members_can_set_own_field_values" ON group_member_field_values
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM group_custom_fields
      WHERE group_custom_fields.id = group_member_field_values.field_id
        AND is_accepted_group_member(group_custom_fields.group_id)
    )
  );

-- UPDATE: own rows or admin of the field's group
CREATE POLICY "self_or_admin_can_update_field_values" ON group_member_field_values
  FOR UPDATE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM group_custom_fields
      WHERE group_custom_fields.id = group_member_field_values.field_id
        AND is_group_admin(group_custom_fields.group_id)
    )
  );

-- DELETE: own rows or admin of the field's group
CREATE POLICY "self_or_admin_can_delete_field_values" ON group_member_field_values
  FOR DELETE USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM group_custom_fields
      WHERE group_custom_fields.id = group_member_field_values.field_id
        AND is_group_admin(group_custom_fields.group_id)
    )
  );
