-- Drop problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "users_select_all" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_update_admin" ON public.users;

-- Create new policies without recursive subqueries
-- Users can view their own record
CREATE POLICY "users_select_own"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_update_own"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow service role to bypass RLS (for admin operations)
CREATE POLICY "users_all_for_service_role"
  ON public.users
  FOR ALL
  USING (auth.role() = 'service_role');
