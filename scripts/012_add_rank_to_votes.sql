-- Add rank column to votes table for tracking 1st/2nd/3rd place votes
ALTER TABLE votes ADD COLUMN rank INTEGER CHECK (rank IN (1, 2, 3));

-- Create index for faster queries
CREATE INDEX idx_votes_rank ON votes(rank);
