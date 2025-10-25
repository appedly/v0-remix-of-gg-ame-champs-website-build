-- Update leaderboard function to calculate points based on vote ranks
-- 1st place = 3 points, 2nd place = 2 points, 3rd place = 1 point
CREATE OR REPLACE FUNCTION get_leaderboard()
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  total_points BIGINT,
  total_votes BIGINT,
  submission_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as user_id,
    u.display_name,
    COALESCE(SUM(CASE 
      WHEN v.rank = 1 THEN 3
      WHEN v.rank = 2 THEN 2
      WHEN v.rank = 3 THEN 1
      ELSE 0
    END), 0) as total_points,
    COUNT(DISTINCT v.id) as total_votes,
    COUNT(DISTINCT s.id) as submission_count
  FROM users u
  LEFT JOIN submissions s ON s.user_id = u.id AND s.status = 'approved'
  LEFT JOIN votes v ON v.submission_id = s.id
  WHERE u.role = 'user'
  GROUP BY u.id, u.display_name
  HAVING COUNT(DISTINCT s.id) > 0
  ORDER BY total_points DESC, total_votes DESC, submission_count DESC
  LIMIT 100;
END;
$$ LANGUAGE plpgsql;
