-- Fix infinite recursion in users table policies
-- Drop problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_update_admin" ON public.users;

-- Keep only non-recursive policies
-- Anyone can view all users
CREATE POLICY "users_select_all"
  ON public.users
  FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "users_update_own"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Admins can update any user (use Supabase JWT to check admin role)
CREATE POLICY "users_update_admin"
  ON public.users
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );
