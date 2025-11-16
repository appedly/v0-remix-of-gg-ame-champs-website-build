-- Add image_url column to tournaments table
-- This allows admins to upload custom tournament images

ALTER TABLE tournaments 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment to document the column
COMMENT ON COLUMN tournaments.image_url IS 'Custom tournament image URL uploaded by admin. Falls back to game-specific default image if null.';