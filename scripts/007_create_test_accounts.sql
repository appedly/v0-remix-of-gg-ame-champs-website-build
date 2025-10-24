-- Create test user accounts
-- Note: Passwords are hashed by Supabase Auth, these are for documentation only

-- Test User Account
-- Email: testuser@ggamechamps.com
-- Password: TestUser123!
-- This will be created via the signup form or Supabase dashboard

-- Test Admin Account  
-- Email: admin@ggamechamps.com
-- Password: Admin123!
-- This will be created via the signup form or Supabase dashboard

-- Insert user profiles after accounts are created via Supabase Auth
-- The auth.users table is managed by Supabase and cannot be directly inserted into

-- Create a function to set user roles
CREATE OR REPLACE FUNCTION set_user_role(user_email TEXT, user_role TEXT)
RETURNS void AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    to_jsonb(user_role)
  )
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: After creating accounts through signup, run these commands in Supabase SQL Editor:
-- SELECT set_user_role('admin@ggamechamps.com', 'admin');
-- SELECT set_user_role('testuser@ggamechamps.com', 'user');
