-- Fix submissions visibility - users should see submissions from other users
-- Issue: Users cannot see submissions by other users because the users table
-- has a restrictive RLS policy that only allows users to see their own record
-- Solution: Ensure users can see all other users' profiles (needed for submission creator display)

-- ============================================================================
-- FIX: Users table - Allow everyone to see all user profiles
-- ============================================================================

-- Drop any restrictive policies that limit visibility to own records
DROP POLICY IF EXISTS "users_select_own" ON public.users;

-- Ensure the permissive policy exists that allows everyone to see all users
-- This is needed for submission creator information to be visible
DROP POLICY IF EXISTS "users_select_all" ON public.users;

CREATE POLICY "users_select_all"
  ON public.users FOR SELECT
  USING (true);

-- ============================================================================
-- VERIFY: Submissions table policies allow full visibility
-- ============================================================================

-- Ensure submissions can be viewed by everyone
DROP POLICY IF EXISTS "submissions_select_all" ON public.submissions;

CREATE POLICY "submissions_select_all"
  ON public.submissions FOR SELECT
  USING (true);

-- ============================================================================
-- Test Query: This should now work for regular users
-- ============================================================================
-- SELECT s.id, s.title, s.user_id, u.display_name, u.id
-- FROM submissions s
-- LEFT JOIN users u ON s.user_id = u.id
-- WHERE s.tournament_id = 'some-id' AND s.status = 'approved'
-- ORDER BY s.score DESC;
