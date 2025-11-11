-- Create referral system table
CREATE TABLE IF NOT EXISTS public.user_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  access_code_id UUID REFERENCES public.access_codes(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(referrer_id, referred_user_id)
);

CREATE INDEX idx_user_referrals_referrer_id ON public.user_referrals(referrer_id);
CREATE INDEX idx_user_referrals_referred_user_id ON public.user_referrals(referred_user_id);
CREATE INDEX idx_user_referrals_referral_code ON public.user_referrals(referral_code);

ALTER TABLE public.user_referrals ENABLE ROW LEVEL SECURITY;

-- Referral policies
CREATE POLICY "user_referrals_select_own"
  ON public.user_referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "user_referrals_insert_authenticated"
  ON public.user_referrals FOR INSERT
  WITH CHECK (true);

-- Add referral columns to access_codes table
ALTER TABLE public.access_codes ADD COLUMN IF NOT EXISTS is_referral_code BOOLEAN DEFAULT false;
ALTER TABLE public.access_codes ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

-- Add generated_by column to access_codes to track user-generated codes
ALTER TABLE public.access_codes ADD COLUMN IF NOT EXISTS generated_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- Function to generate user referral codes
CREATE OR REPLACE FUNCTION generate_referral_code(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
BEGIN
  -- Generate unique 8-character code
  new_code := substring(md5(user_id::text || now()::text), 1, 8);
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Function to create user-generated access codes
CREATE OR REPLACE FUNCTION create_user_access_code(user_id UUID)
RETURNS TABLE(code TEXT, id UUID) AS $$
BEGIN
  -- Check user exists and is approved
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = user_id AND approved = true) THEN
    RAISE EXCEPTION 'User not found or not approved';
  END IF;

  -- Generate new access code
  RETURN QUERY
  INSERT INTO public.access_codes (code, created_by, is_used, is_referral_code, generated_by, expires_at)
  VALUES (
    substring(md5(user_id::text || now()::text || random()::text), 1, 10),
    (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1),
    false,
    true,
    user_id,
    now() + interval '30 days'
  )
  RETURNING access_codes.code, access_codes.id;
END;
$$ LANGUAGE plpgsql;

-- Function to track referral when access code is redeemed
CREATE OR REPLACE FUNCTION track_referral_on_code_use()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a referral code, create referral record
  IF NEW.is_referral_code = true AND NEW.generated_by IS NOT NULL AND NEW.used_by IS NOT NULL THEN
    INSERT INTO public.user_referrals (referrer_id, referred_user_id, referral_code, access_code_id, redeemed_at)
    VALUES (NEW.generated_by, NEW.used_by, NEW.code, NEW.id, now())
    ON CONFLICT (referrer_id, referred_user_id) DO NOTHING;

    -- Increment referral count
    UPDATE public.access_codes
    SET referral_count = referral_count + 1
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_referral_on_code_use_trigger
AFTER UPDATE ON public.access_codes
FOR EACH ROW
WHEN (NEW.is_used = true AND OLD.is_used = false)
EXECUTE FUNCTION track_referral_on_code_use();

-- Function to award bonus access code when user approves referral
CREATE OR REPLACE FUNCTION award_bonus_access_code(referrer_id UUID)
RETURNS void AS $$
BEGIN
  -- Create bonus access code for the referrer
  INSERT INTO public.access_codes (code, created_by, is_used, is_referral_code, generated_by, expires_at)
  VALUES (
    substring(md5(referrer_id::text || now()::text || random()::text), 1, 10),
    (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1),
    false,
    true,
    referrer_id,
    now() + interval '30 days'
  );
END;
$$ LANGUAGE plpgsql;
