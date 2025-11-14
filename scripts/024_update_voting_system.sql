-- Update voting system for ranked voting (1st, 2nd, 3rd place)
-- 1st place = 3 points, 2nd place = 2 points, 3rd place = 1 point

-- Drop the old trigger and function
DROP TRIGGER IF EXISTS votes_update_score ON public.votes;
DROP FUNCTION IF EXISTS public.update_submission_score();

-- Create new function that handles rank-based scoring
CREATE OR REPLACE FUNCTION public.update_submission_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  points_value INTEGER;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Calculate points based on rank (1st=3, 2nd=2, 3rd=1)
    points_value := CASE 
      WHEN NEW.rank = 1 THEN 3
      WHEN NEW.rank = 2 THEN 2
      WHEN NEW.rank = 3 THEN 1
      ELSE 0
    END;
    
    UPDATE public.submissions
    SET score = score + points_value
    WHERE id = NEW.submission_id;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Calculate points based on rank
    points_value := CASE 
      WHEN OLD.rank = 1 THEN 3
      WHEN OLD.rank = 2 THEN 2
      WHEN OLD.rank = 3 THEN 1
      ELSE 0
    END;
    
    UPDATE public.submissions
    SET score = score - points_value
    WHERE id = OLD.submission_id;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle rank changes
    DECLARE
      old_points INTEGER;
      new_points INTEGER;
    BEGIN
      old_points := CASE 
        WHEN OLD.rank = 1 THEN 3
        WHEN OLD.rank = 2 THEN 2
        WHEN OLD.rank = 3 THEN 1
        ELSE 0
      END;
      
      new_points := CASE 
        WHEN NEW.rank = 1 THEN 3
        WHEN NEW.rank = 2 THEN 2
        WHEN NEW.rank = 3 THEN 1
        ELSE 0
      END;
      
      UPDATE public.submissions
      SET score = score - old_points + new_points
      WHERE id = NEW.submission_id;
    END;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create the trigger
CREATE TRIGGER votes_update_score
  AFTER INSERT OR UPDATE OR DELETE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_submission_score();

-- Note: We'll handle the constraint at the application level
-- The constraint we want is: each user can vote once per rank per tournament
-- This is checked in the frontend code

-- Drop the old unique constraint if it exists
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_submission_id_user_id_key;
