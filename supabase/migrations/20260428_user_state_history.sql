-- user_state_history: durable rolling backup of every user_state write
-- Reason: user_state is a single mutable JSONB row per user. Any data-loss bug
-- (sync logic, schema migration, accidental client overwrite) is permanent
-- without a versioned log to roll back from.

-- ============================================================================
-- 1. user_state_history table
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_state_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  state JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_state_history_user_created
  ON user_state_history(user_id, created_at DESC);

-- ============================================================================
-- 2. RLS — users may read their own history; only the trigger writes
-- ============================================================================
ALTER TABLE user_state_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_state_history select own" ON user_state_history;
CREATE POLICY "user_state_history select own"
  ON user_state_history FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies — trigger uses SECURITY DEFINER to bypass RLS

-- ============================================================================
-- 3. Snapshot + prune trigger
-- ============================================================================
CREATE OR REPLACE FUNCTION snapshot_user_state()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Skip no-op updates where the state didn't actually change
  IF TG_OP = 'UPDATE' AND OLD.state IS NOT DISTINCT FROM NEW.state THEN
    RETURN NEW;
  END IF;

  INSERT INTO user_state_history (user_id, state)
  VALUES (NEW.user_id, NEW.state);

  -- Retention: keep last 50 snapshots per user
  DELETE FROM user_state_history
  WHERE id IN (
    SELECT id FROM user_state_history
    WHERE user_id = NEW.user_id
    ORDER BY created_at DESC
    OFFSET 50
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_snapshot_user_state ON user_state;
CREATE TRIGGER trg_snapshot_user_state
  AFTER INSERT OR UPDATE OF state ON user_state
  FOR EACH ROW
  EXECUTE FUNCTION snapshot_user_state();
