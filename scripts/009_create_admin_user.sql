-- Create admin user account
-- This creates a Supabase auth user and sets their role to admin

-- First, we need to insert into auth.users (this is done via Supabase signup)
-- But we can update the public.users table to set admin role for the admin email

-- Set admin role for the admin user
-- The admin should sign up with email: admin@ggamechamps.com
UPDATE public.users
SET role = 'admin', display_name = 'Admin'
WHERE email = 'admin@ggamechamps.com';

-- Also set admin role for ggiscool if they sign up
UPDATE public.users
SET role = 'admin', display_name = 'GG Admin'
WHERE email LIKE '%ggiscool%' OR display_name LIKE '%ggiscool%';

-- Verify admin users
SELECT id, email, display_name, role, created_at
FROM public.users
WHERE role = 'admin';
