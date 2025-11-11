-- Add bonus_points column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bonus_points INTEGER DEFAULT 0;

-- Create badges table
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('founding_member', 'early_bird_50', 'referral_master', 'submissions_hero', 'voting_champion')),
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_type)
);

CREATE INDEX idx_badges_user_id ON public.badges(user_id);
CREATE INDEX idx_badges_badge_type ON public.badges(badge_type);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- Badge policies
CREATE POLICY "badges_select_all"
  ON public.badges FOR SELECT
  USING (true);

CREATE POLICY "badges_insert_admin"
  ON public.badges FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "badges_delete_admin"
  ON public.badges FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create early bird bonuses tracking table
CREATE TABLE IF NOT EXISTS public.early_bird_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  bonus_tier INTEGER CHECK (bonus_tier IN (1, 2, 3)),
  points_awarded INTEGER DEFAULT 0,
  tournament_access BOOLEAN DEFAULT false,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_early_bird_bonuses_user_id ON public.early_bird_bonuses(user_id);
CREATE INDEX idx_early_bird_bonuses_bonus_tier ON public.early_bird_bonuses(bonus_tier);

ALTER TABLE public.early_bird_bonuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "early_bird_bonuses_select_own"
  ON public.early_bird_bonuses FOR SELECT
  USING (auth.uid() = user_id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Function to auto-assign founding member badge to first 50 users
CREATE OR REPLACE FUNCTION assign_founding_member_badges()
RETURNS void AS $$
BEGIN
  WITH first_50_users AS (
    SELECT id FROM public.users
    WHERE founding_member = true
    AND id NOT IN (SELECT user_id FROM public.badges WHERE badge_type = 'founding_member')
    ORDER BY created_at ASC
    LIMIT 50
  )
  INSERT INTO public.badges (user_id, badge_type, name, description)
  SELECT id, 'founding_member', 'Founding Member', 'One of the first 50 users on GGameChamps'
  FROM first_50_users
  ON CONFLICT (user_id, badge_type) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to assign early bird bonuses
CREATE OR REPLACE FUNCTION assign_early_bird_bonus()
RETURNS void AS $$
BEGIN
  -- Tier 1: First 20 users get 500 bonus points
  WITH tier_1 AS (
    SELECT id FROM public.users
    WHERE id NOT IN (SELECT user_id FROM public.early_bird_bonuses)
    ORDER BY created_at ASC
    LIMIT 20
  )
  INSERT INTO public.early_bird_bonuses (user_id, bonus_tier, points_awarded, tournament_access)
  SELECT id, 1, 500, true FROM tier_1
  ON CONFLICT (user_id) DO NOTHING;

  -- Tier 2: Next 30 users get 250 bonus points
  WITH tier_2 AS (
    SELECT id FROM public.users
    WHERE id NOT IN (SELECT user_id FROM public.early_bird_bonuses)
    ORDER BY created_at ASC
    LIMIT 30
  )
  INSERT INTO public.early_bird_bonuses (user_id, bonus_tier, points_awarded, tournament_access)
  SELECT id, 2, 250, true FROM tier_2
  ON CONFLICT (user_id) DO NOTHING;

  -- Tier 3: Next 50 users get 100 bonus points
  WITH tier_3 AS (
    SELECT id FROM public.users
    WHERE id NOT IN (SELECT user_id FROM public.early_bird_bonuses)
    ORDER BY created_at ASC
    LIMIT 50
  )
  INSERT INTO public.early_bird_bonuses (user_id, bonus_tier, points_awarded)
  SELECT id, 3, 100 FROM tier_3
  ON CONFLICT (user_id) DO NOTHING;

  -- Update user bonus_points
  UPDATE public.users u
  SET bonus_points = COALESCE(e.points_awarded, 0)
  FROM public.early_bird_bonuses e
  WHERE u.id = e.user_id;
END;
$$ LANGUAGE plpgsql;

-- Run the functions
SELECT assign_founding_member_badges();
SELECT assign_early_bird_bonus();
