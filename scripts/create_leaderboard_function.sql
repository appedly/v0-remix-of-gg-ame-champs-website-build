-- Create a function to get leaderboard data
CREATE OR REPLACE FUNCTION get_leaderboard()
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  total_votes BIGINT,
  submission_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as user_id,
    u.display_name,
    COUNT(DISTINCT v.id) as total_votes,
    COUNT(DISTINCT s.id) as submission_count
  FROM users u
  LEFT JOIN submissions s ON s.user_id = u.id AND s.status = 'approved'
  LEFT JOIN votes v ON v.submission_id = s.id
  WHERE u.role = 'user'
  GROUP BY u.id, u.display_name
  HAVING COUNT(DISTINCT s.id) > 0
  ORDER BY total_votes DESC, submission_count DESC
  LIMIT 100;
END;
$$ LANGUAGE plpgsql;
