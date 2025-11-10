-- Only add approved column if it doesn't exist, remove conflicting policies that already exist
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;

-- Drop existing policies before recreating to avoid conflicts
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_update_admin" ON public.users;

-- Recreate policies with proper naming
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_update_admin" ON public.users
  FOR UPDATE USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');
