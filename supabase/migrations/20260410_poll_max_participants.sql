-- Add max_participants column to group_polls for capacity limits
ALTER TABLE group_polls ADD COLUMN IF NOT EXISTS max_participants INT DEFAULT NULL;
