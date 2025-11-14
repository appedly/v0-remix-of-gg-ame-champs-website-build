-- Add founding_member column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS founding_member BOOLEAN DEFAULT FALSE;

-- Create a function to mark first 50 users as founding members
CREATE OR REPLACE FUNCTION mark_founding_members()
RETURNS void AS $
BEGIN
  UPDATE public.users
  SET founding_member = TRUE
  WHERE id IN (
    SELECT id FROM public.users
    ORDER BY created_at ASC
    LIMIT 50
  );
END;
$ LANGUAGE plpgsql;

-- Execute the function to mark first 50 users
SELECT mark_founding_members();
