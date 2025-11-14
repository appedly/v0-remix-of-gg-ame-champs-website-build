-- Fix RLS backend issues for tournaments, users, access codes, and waitlist
-- This addresses:
-- 1. Admin can't create tournaments (RLS violation)
-- 2. Tournaments don't open (null display_name error)
-- 3. Admin can't see users in waitlist/users panels
-- 4. Access codes visibility issues

-- ============================================================================
-- 1. FIX TOURNAMENTS TABLE - Remove recursive RLS check
-- ============================================================================
DROP POLICY IF EXISTS "tournaments_insert_admin" ON public.tournaments;
DROP POLICY IF EXISTS "tournaments_update_admin" ON public.tournaments;
DROP POLICY IF EXISTS "tournaments_delete_admin" ON public.tournaments;

-- Use JWT claim to check admin role (non-recursive)
CREATE POLICY "tournaments_insert_admin"
  ON public.tournaments FOR INSERT
  WITH CHECK (
    -- Check if user has admin role in JWT or is an admin in users table
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

CREATE POLICY "tournaments_update_admin"
  ON public.tournaments FOR UPDATE
  USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

CREATE POLICY "tournaments_delete_admin"
  ON public.tournaments FOR DELETE
  USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- ============================================================================
-- 2. FIX USERS TABLE - Remove all recursive policies, allow public read
-- ============================================================================
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_update_admin" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_service_role_all" ON public.users;

-- Anyone can view all users (no recursion)
CREATE POLICY "users_select_all"
  ON public.users FOR SELECT
  USING (true);

-- Users can insert their own profiles
CREATE POLICY "users_insert_own"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profiles
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can update any user (use JWT claim first to avoid recursion)
CREATE POLICY "users_update_admin"
  ON public.users FOR UPDATE
  USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- ============================================================================
-- 3. FIX WAITLIST TABLE - Allow admin access via JWT claim
-- ============================================================================
DROP POLICY IF EXISTS "waitlist_select_admin" ON public.waitlist;
DROP POLICY IF EXISTS "waitlist_update_admin" ON public.waitlist;
DROP POLICY IF EXISTS "waitlist_delete_admin" ON public.waitlist;

-- Admins can view waitlist (use JWT claim first)
CREATE POLICY "waitlist_select_admin"
  ON public.waitlist FOR SELECT
  USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Admins can update waitlist
CREATE POLICY "waitlist_update_admin"
  ON public.waitlist FOR UPDATE
  USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Admins can delete from waitlist
CREATE POLICY "waitlist_delete_admin"
  ON public.waitlist FOR DELETE
  USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- ============================================================================
-- 4. FIX ACCESS CODES TABLE - Remove conflicting policies, restrict properly
-- ============================================================================
DROP POLICY IF EXISTS "access_codes_select_admin" ON public.access_codes;
DROP POLICY IF EXISTS "access_codes_check_validity" ON public.access_codes;
DROP POLICY IF EXISTS "access_codes_check_referral_validity" ON public.access_codes;
DROP POLICY IF EXISTS "access_codes_insert_admin" ON public.access_codes;
DROP POLICY IF EXISTS "access_codes_update_admin" ON public.access_codes;
DROP POLICY IF EXISTS "access_codes_delete_admin" ON public.access_codes;

-- Only admins can select all access codes
CREATE POLICY "access_codes_select_admin"
  ON public.access_codes FOR SELECT
  USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Only admins can insert access codes
CREATE POLICY "access_codes_insert_admin"
  ON public.access_codes FOR INSERT
  WITH CHECK (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Only admins can update access codes
CREATE POLICY "access_codes_update_admin"
  ON public.access_codes FOR UPDATE
  USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Only admins can delete access codes
CREATE POLICY "access_codes_delete_admin"
  ON public.access_codes FOR DELETE
  USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- ============================================================================
-- 5. FIX SUBMISSIONS TABLE - Ensure RLS policies are correct
-- ============================================================================
DROP POLICY IF EXISTS "submissions_select_all" ON public.submissions;
DROP POLICY IF EXISTS "submissions_insert_own" ON public.submissions;
DROP POLICY IF EXISTS "submissions_insert_authenticated" ON public.submissions;
DROP POLICY IF EXISTS "submissions_update_own" ON public.submissions;
DROP POLICY IF EXISTS "submissions_update_admin" ON public.submissions;
DROP POLICY IF EXISTS "submissions_delete_own" ON public.submissions;
DROP POLICY IF EXISTS "submissions_delete_admin" ON public.submissions;

-- Everyone can view all submissions (both approved and pending for their own)
CREATE POLICY "submissions_select_all"
  ON public.submissions FOR SELECT
  USING (true);

-- Authenticated users can insert their own submissions
CREATE POLICY "submissions_insert_own"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own submissions
CREATE POLICY "submissions_update_own"
  ON public.submissions FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can update any submission (use JWT claim first to avoid recursion)
CREATE POLICY "submissions_update_admin"
  ON public.submissions FOR UPDATE
  USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Users can delete their own submissions
CREATE POLICY "submissions_delete_own"
  ON public.submissions FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can delete any submission
CREATE POLICY "submissions_delete_admin"
  ON public.submissions FOR DELETE
  USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- ============================================================================
-- 6. FIX VOTES AND LIKES TABLES
-- ============================================================================
DROP POLICY IF EXISTS "votes_select_all" ON public.votes;
DROP POLICY IF EXISTS "votes_insert_authenticated" ON public.votes;

-- Everyone can view votes
CREATE POLICY "votes_select_all"
  ON public.votes FOR SELECT
  USING (true);

-- Authenticated users can insert votes
CREATE POLICY "votes_insert_authenticated"
  ON public.votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "votes_delete_own"
  ON public.votes FOR DELETE
  USING (auth.uid() = user_id);

-- Update votes (users can update their own)
CREATE POLICY "votes_update_own"
  ON public.votes FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "likes_select_all" ON public.likes;
DROP POLICY IF EXISTS "likes_insert_authenticated" ON public.likes;

-- Everyone can view likes
CREATE POLICY "likes_select_all"
  ON public.likes FOR SELECT
  USING (true);

-- Authenticated users can insert likes
CREATE POLICY "likes_insert_authenticated"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "likes_delete_own"
  ON public.likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 7. FIX ANALYTICS TABLES - Remove recursive queries
-- ============================================================================
DROP POLICY IF EXISTS "analytics_select_admin" ON public.analytics_events;
DROP POLICY IF EXISTS "email_events_select_admin" ON public.email_events;

-- Only admins can view analytics events (use JWT claim first)
CREATE POLICY "analytics_select_admin"
  ON public.analytics_events FOR SELECT
  USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Only admins can view email events (use JWT claim first)
CREATE POLICY "email_events_select_admin"
  ON public.email_events FOR SELECT
  USING (
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- ============================================================================
-- 8. FIX USER LOCATIONS TABLE - Remove recursive query
-- ============================================================================
DROP POLICY IF EXISTS "user_locations_select_own" ON public.user_locations;

-- Users can view their own location, admins can view all
CREATE POLICY "user_locations_select_own"
  ON public.user_locations FOR SELECT
  USING (
    auth.uid() = user_id OR
    COALESCE(auth.jwt() ->> 'role', '') = 'admin' OR
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );
