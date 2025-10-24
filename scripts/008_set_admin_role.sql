-- Updated to set admin role for the provided email
UPDATE public.users
SET role = 'admin'
WHERE email = 'arjanchaudharyy@gmail.com';

-- Verify the update
SELECT id, email, display_name, role
FROM public.users
WHERE email = 'arjanchaudharyy@gmail.com';
