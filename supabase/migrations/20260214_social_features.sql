-- Social Features: friendships, shared workouts, user discoverability
-- Run against Supabase project via Dashboard > SQL Editor

-- ============================================================================
-- 1. profiles.is_searchable column
-- ============================================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_searchable BOOLEAN DEFAULT true;

-- ============================================================================
-- 2. friendships table
-- ============================================================================
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a UUID NOT NULL REFERENCES profiles(id),
  user_b UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'blocked')),
  initiated_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  UNIQUE (user_a, user_b),
  CHECK (user_a < user_b)
);

CREATE INDEX IF NOT EXISTS idx_friendships_user_a_status ON friendships (user_a, status);
CREATE INDEX IF NOT EXISTS idx_friendships_user_b_status ON friendships (user_b, status);

-- ============================================================================
-- 3. shared_workouts table
-- ============================================================================
CREATE TABLE IF NOT EXISTS shared_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES profiles(id),
  to_user_id UUID NOT NULL REFERENCES profiles(id),
  workout_snapshot JSONB NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  read_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_shared_workouts_inbox
  ON shared_workouts (to_user_id, status, created_at DESC);

-- ============================================================================
-- 4. Enable RLS
-- ============================================================================
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_workouts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. RLS Policies — friendships
-- ============================================================================
CREATE POLICY "users_see_own_friendships" ON friendships
  FOR SELECT USING (auth.uid() IN (user_a, user_b));

CREATE POLICY "users_can_request" ON friendships
  FOR INSERT WITH CHECK (auth.uid() = initiated_by);

CREATE POLICY "users_can_update_friendship" ON friendships
  FOR UPDATE USING (auth.uid() IN (user_a, user_b));

CREATE POLICY "users_can_delete_friendship" ON friendships
  FOR DELETE USING (auth.uid() IN (user_a, user_b));

-- ============================================================================
-- 6. RLS Policies — shared_workouts
-- ============================================================================
CREATE POLICY "users_see_shared_workouts" ON shared_workouts
  FOR SELECT USING (auth.uid() IN (from_user_id, to_user_id));

CREATE POLICY "users_can_share" ON shared_workouts
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "receiver_can_update" ON shared_workouts
  FOR UPDATE USING (auth.uid() = to_user_id);

-- ============================================================================
-- 7. RLS Policies — profiles (add search policy)
-- ============================================================================
-- Note: This policy may need to be adjusted if existing profile policies
-- already cover SELECT. If so, modify the existing one instead.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'search_profiles'
  ) THEN
    CREATE POLICY "search_profiles" ON profiles
      FOR SELECT USING (
        auth.uid() = id
        OR is_searchable = true
      );
  END IF;
END $$;

-- ============================================================================
-- 8. RPC — search_users
-- ============================================================================
CREATE OR REPLACE FUNCTION search_users(search_query TEXT)
RETURNS TABLE (
  id UUID,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  friendship_status TEXT,
  friendship_id UUID
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    f.status AS friendship_status,
    f.id AS friendship_id
  FROM profiles p
  LEFT JOIN friendships f ON (
    LEAST(auth.uid(), p.id) = f.user_a
    AND GREATEST(auth.uid(), p.id) = f.user_b
  )
  WHERE p.id != auth.uid()
    AND p.is_searchable = true
    AND (
      p.username ILIKE '%' || search_query || '%'
      OR p.display_name ILIKE '%' || search_query || '%'
    )
  ORDER BY
    CASE
      WHEN p.username = search_query THEN 0
      WHEN p.username ILIKE search_query || '%' THEN 1
      ELSE 2
    END,
    p.username
  LIMIT 20;
END;
$$;
