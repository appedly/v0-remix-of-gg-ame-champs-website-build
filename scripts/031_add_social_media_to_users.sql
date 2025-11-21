-- Add social media fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS twitter_url TEXT,
ADD COLUMN IF NOT EXISTS discord_username TEXT,
ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.users.twitter_url IS 'Twitter/X profile URL';
COMMENT ON COLUMN public.users.discord_username IS 'Discord username or URL';
COMMENT ON COLUMN public.users.youtube_url IS 'YouTube channel URL';
