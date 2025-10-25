-- Set admin role for the user who signed up
UPDATE public.users
SET role = 'admin'
WHERE email = 'arjanchaudharyy@gmail.com';

-- Verify the update
SELECT id, email, display_name, role
FROM public.users
WHERE email = 'arjanchaudharyy@gmail.com';
