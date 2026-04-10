-- Activity Feed: feed events + reactions for friend activity
-- Run against Supabase project via Dashboard > SQL Editor

-- ============================================================================
-- 1. Helper: check if two users are friends
-- ============================================================================
CREATE OR REPLACE FUNCTION is_friend_of(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM friendships
    WHERE status = 'accepted'
      AND user_a = LEAST(auth.uid(), target_user_id)
      AND user_b = GREATEST(auth.uid(), target_user_id)
  );
$$;

-- ============================================================================
-- 2. feed_events table
-- ============================================================================
CREATE TABLE IF NOT EXISTS feed_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('workout_complete', 'pr')),
  payload JSONB NOT NULL DEFAULT '{}',
  event_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feed_events_user_created ON feed_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feed_events_date ON feed_events(user_id, event_date);

-- RLS
ALTER TABLE feed_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own and friends' feed events"
  ON feed_events FOR SELECT
  USING (user_id = auth.uid() OR is_friend_of(user_id));

CREATE POLICY "Users can insert own feed events"
  ON feed_events FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own feed events"
  ON feed_events FOR DELETE
  USING (user_id = auth.uid());

-- Prevent duplicate posts for same day + type
CREATE UNIQUE INDEX IF NOT EXISTS idx_feed_events_dedup
  ON feed_events(user_id, event_type, event_date);

-- ============================================================================
-- 3. feed_reactions table
-- ============================================================================
CREATE TABLE IF NOT EXISTS feed_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_event_id UUID NOT NULL REFERENCES feed_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL CHECK (emoji IN ('fist', 'fire', 'heart', 'clap', '100')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(feed_event_id, user_id, emoji)
);

CREATE INDEX IF NOT EXISTS idx_feed_reactions_event ON feed_reactions(feed_event_id);

-- RLS
ALTER TABLE feed_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reactions on visible feed events"
  ON feed_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM feed_events fe
      WHERE fe.id = feed_event_id
        AND (fe.user_id = auth.uid() OR is_friend_of(fe.user_id))
    )
  );

CREATE POLICY "Users can insert reactions on visible feed events"
  ON feed_reactions FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM feed_events fe
      WHERE fe.id = feed_event_id
        AND (fe.user_id = auth.uid() OR is_friend_of(fe.user_id))
    )
  );

CREATE POLICY "Users can delete own reactions"
  ON feed_reactions FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- 4. RPC: get_friend_feed (paginated, with profiles + aggregated reactions)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_friend_feed(
  page_size INT DEFAULT 30,
  before_cursor TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  event_type TEXT,
  payload JSONB,
  event_date DATE,
  created_at TIMESTAMPTZ,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  reactions JSONB
)
LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT
    fe.id,
    fe.user_id,
    fe.event_type,
    fe.payload,
    fe.event_date,
    fe.created_at,
    p.username,
    p.display_name,
    p.avatar_url,
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
        'id', fr.id,
        'user_id', fr.user_id,
        'emoji', fr.emoji
      ))
      FROM feed_reactions fr WHERE fr.feed_event_id = fe.id),
      '[]'::jsonb
    ) AS reactions
  FROM feed_events fe
  JOIN profiles p ON p.id = fe.user_id
  WHERE (
    fe.user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM friendships f
      WHERE f.status = 'accepted'
        AND f.user_a = LEAST(auth.uid(), fe.user_id)
        AND f.user_b = GREATEST(auth.uid(), fe.user_id)
    )
  )
  AND (before_cursor IS NULL OR fe.created_at < before_cursor)
  ORDER BY fe.created_at DESC
  LIMIT page_size;
$$;
