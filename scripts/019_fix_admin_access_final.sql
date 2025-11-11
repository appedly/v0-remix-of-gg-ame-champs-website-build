-- Clean up all conflicting policies
DROP POLICY IF EXISTS "users_select_all" ON public.users;
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_update_admin" ON public.users;
DROP POLICY IF EXISTS "users_all_for_service_role" ON public.users;

-- Create clean, non-conflicting policies for admin access verification
-- Service role can do everything (needed for admin login verification)
CREATE POLICY "service_role_all"
  ON public.users
  FOR ALL
  USING (auth.role() = 'service_role');

-- Users can view their own record
CREATE POLICY "users_select_own"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own record (during signup)
CREATE POLICY "users_insert_own"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own record
CREATE POLICY "users_update_own"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);
