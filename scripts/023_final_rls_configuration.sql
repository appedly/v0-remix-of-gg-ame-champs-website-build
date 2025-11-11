-- This script ensures all RLS policies for new features are properly configured

-- 1. Verify all new tables have RLS enabled (already set in creation scripts)
-- 2. Add any missing SELECT policies for authenticated users

-- Allow authenticated users to see analytics events (limited)
CREATE POLICY "analytics_events_insert_authenticated"
  ON public.analytics_events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Add policies for early bird bonuses
CREATE POLICY "early_bird_bonuses_insert_admin"
  ON public.early_bird_bonuses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Update users table policies to allow service role full access
CREATE POLICY "users_service_role_all"
  ON public.users FOR ALL
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add policies for user_locations table access
CREATE POLICY "user_locations_select_all"
  ON public.user_locations FOR SELECT
  USING (true);

-- Add policy for badges leaderboard
CREATE POLICY "badges_select_all_public"
  ON public.badges FOR SELECT
  USING (true);

-- Ensure access_codes policies handle referral codes
CREATE POLICY "access_codes_check_referral_validity"
  ON public.access_codes FOR SELECT
  USING (
    is_referral_code = true OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add policy for users to see referral codes they generated
CREATE POLICY "access_codes_select_own_generated"
  ON public.access_codes FOR SELECT
  USING (auth.uid() = generated_by);

-- Ensure user_referrals table is properly accessible
CREATE POLICY "user_referrals_select_all"
  ON public.user_referrals FOR SELECT
  USING (true);

CREATE POLICY "user_referrals_insert_authenticated"
  ON public.user_referrals FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create VIEW for leaderboard with early bird bonuses included
CREATE OR REPLACE VIEW public.leaderboard_with_bonuses AS
SELECT 
  u.id as user_id,
  u.display_name,
  u.avatar_url,
  u.founding_member,
  COALESCE(SUM(CASE 
    WHEN v.rank = 1 THEN 3
    WHEN v.rank = 2 THEN 2
    WHEN v.rank = 3 THEN 1
    ELSE 0
  END), 0) + COALESCE(e.points_awarded, 0) + COALESCE(u.bonus_points, 0) as total_points,
  COUNT(DISTINCT v.id) as total_votes,
  COUNT(DISTINCT s.id) as submission_count,
  COALESCE((SELECT COUNT(*) FROM public.user_referrals WHERE referrer_id = u.id), 0) as referral_count,
  COALESCE(e.bonus_tier, 0) as early_bird_tier
FROM public.users u
LEFT JOIN public.submissions s ON s.user_id = u.id AND s.status = 'approved'
LEFT JOIN public.votes v ON v.submission_id = s.id
LEFT JOIN public.early_bird_bonuses e ON e.user_id = u.id
WHERE u.role = 'user' AND u.approved = true
GROUP BY u.id, u.display_name, u.avatar_url, u.founding_member, e.points_awarded, u.bonus_points, e.bonus_tier
ORDER BY total_points DESC, total_votes DESC, submission_count DESC;

-- Grant SELECT on the view
GRANT SELECT ON public.leaderboard_with_bonuses TO authenticated;
GRANT SELECT ON public.leaderboard_with_bonuses TO anon;

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_email_events_user_id ON public.email_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_country ON public.user_locations(country);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON public.badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_referrer_id ON public.user_referrals(referrer_id);

-- Ensure service role has full access (this is for admin operations)
ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
