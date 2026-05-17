-- Drop all Groups, Polls, Announcements, Dues, Custom Fields, and Activity Feed tables.
-- The Community section now keeps only the Inbox (friends + shared workouts).
-- The friendships and shared_workouts tables from 20260214_social_features.sql remain.

-- Feed (20260410)
DROP TABLE IF EXISTS feed_reactions CASCADE;
DROP TABLE IF EXISTS feed_events CASCADE;

-- Phase 4 custom fields (20260312)
DROP TABLE IF EXISTS group_member_field_values CASCADE;
DROP TABLE IF EXISTS group_custom_fields CASCADE;

-- Phase 3 announcements + dues (20260304)
DROP TABLE IF EXISTS dues_payments CASCADE;
DROP TABLE IF EXISTS group_dues CASCADE;
DROP TABLE IF EXISTS announcement_reactions CASCADE;
DROP TABLE IF EXISTS group_announcements CASCADE;

-- Polls (20260303)
DROP TABLE IF EXISTS poll_responses CASCADE;
DROP TABLE IF EXISTS group_polls CASCADE;

-- Core groups (20260302)
DROP TABLE IF EXISTS group_workouts CASCADE;
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
