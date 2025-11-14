# Supabase Configuration Required

## 🔧 Database Functions to Update

Run these SQL commands in your Supabase SQL Editor to fix the referral code issues and other database problems:

### 1. Fix the Referral Code Generation Function

```sql
-- Drop and recreate the function with fixed column ambiguity
DROP FUNCTION IF EXISTS create_user_access_code(UUID);

CREATE OR REPLACE FUNCTION create_user_access_code(user_id UUID)
RETURNS TABLE(code TEXT, id UUID) AS $$
DECLARE
  admin_id UUID;
BEGIN
  -- Check user exists and is approved
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE users.id = user_id AND approved = true) THEN
    RAISE EXCEPTION 'User not found or not approved';
  END IF;

  -- Get an admin user ID
  SELECT users.id INTO admin_id FROM public.users WHERE role = 'admin' LIMIT 1;

  -- Generate new access code
  RETURN QUERY
  INSERT INTO public.access_codes (code, created_by, is_used, is_referral_code, generated_by, expires_at)
  VALUES (
    UPPER(substring(md5(user_id::text || now()::text || random()::text), 1, 10)),
    admin_id,
    false,
    true,
    user_id,
    now() + interval '30 days'
  )
  RETURNING access_codes.code, access_codes.id;
END;
$$ LANGUAGE plpgsql;
```

### 2. Fix the Bonus Access Code Function

```sql
-- Drop and recreate the bonus function
DROP FUNCTION IF EXISTS award_bonus_access_code(UUID);

CREATE OR REPLACE FUNCTION award_bonus_access_code(referrer_id UUID)
RETURNS void AS $$
DECLARE
  admin_id UUID;
BEGIN
  -- Get an admin user ID
  SELECT users.id INTO admin_id FROM public.users WHERE role = 'admin' LIMIT 1;

  -- Create bonus access code for the referrer
  INSERT INTO public.access_codes (code, created_by, is_used, is_referral_code, generated_by, expires_at)
  VALUES (
    UPPER(substring(md5(referrer_id::text || now()::text || random()::text), 1, 10)),
    admin_id,
    false,
    true,
    referrer_id,
    now() + interval '30 days'
  );
END;
$$ LANGUAGE plpgsql;
```

### 3. Ensure is_used Trigger Works Properly

```sql
-- Verify the trigger exists and update it if needed
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

-- Recreate the trigger
DROP TRIGGER IF EXISTS track_referral_on_code_use_trigger ON public.access_codes;

CREATE TRIGGER track_referral_on_code_use_trigger
AFTER UPDATE ON public.access_codes
FOR EACH ROW
WHEN (NEW.is_used = true AND OLD.is_used = false)
EXECUTE FUNCTION track_referral_on_code_use();
```

---

## 📧 Email Verification Setup

### In Supabase Dashboard:

1. Go to **Authentication** → **Settings** → **Auth Providers**
2. Under **Email**, enable **Confirm email**
3. Configure email templates:
   - Go to **Authentication** → **Email Templates**
   - Customize the "Confirm signup" template if needed

### Email Template Configuration

**Confirm Signup Template:**
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email address</a></p>
```

**Change the Confirmation URL to:**
```
{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email&next=/waitlist-confirmation
```

This ensures users are redirected properly after confirming their email.

---

## 🔐 OAuth Configuration

### Google OAuth Setup:

1. Go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Add these redirect URLs:
   - `https://your-domain.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)
4. In Google Cloud Console:
   - Add the same URLs to your OAuth 2.0 Client
   - Add `https://your-project-ref.supabase.co/auth/v1/callback`

### Handle Multiple Auth Providers for Same Email:

Currently, if a user signs up with email/password and then tries to sign in with Google (same email), they can't link accounts. To fix this:

**Option 1: Manual Account Linking (Recommended for now)**
- Users should use the same method they signed up with
- Add a message on login page: "Please use the same method you signed up with"

**Option 2: Enable Automatic Account Linking (Supabase Setting)**
1. Go to **Authentication** → **Settings**
2. Under **Security and Protection**
3. Find "Enable Automatic Account Linking" (if available)
4. This allows linking accounts with the same email

---

## 🗄️ Database Indexes for Performance

Add these indexes to improve query performance:

```sql
-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_access_codes_is_used ON public.access_codes(is_used);
CREATE INDEX IF NOT EXISTS idx_access_codes_generated_by ON public.access_codes(generated_by);
CREATE INDEX IF NOT EXISTS idx_waitlist_user_id ON public.waitlist(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_approved ON public.users(approved);
```

---

## 🔍 Verify Setup

Run these queries to check everything is working:

### Check if functions exist:
```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('create_user_access_code', 'award_bonus_access_code', 'track_referral_on_code_use');
```

### Check if triggers exist:
```sql
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name = 'track_referral_on_code_use_trigger';
```

### Check access codes structure:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'access_codes'
AND column_name IN ('is_used', 'is_referral_code', 'generated_by', 'referral_count');
```

### Check waitlist structure:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'waitlist'
AND column_name = 'user_id';
```

---

## 🧪 Test Your Configuration

### Test Email Verification:
1. Sign up with a new email address
2. Check your email for confirmation link
3. Click the link
4. Should redirect to `/waitlist-confirmation`
5. Check if user appears in admin waitlist

### Test Referral Codes:
1. Log in as an approved user
2. Go to `/dashboard/referral-codes`
3. Click "Generate Access Code"
4. Should generate without errors
5. Copy the code and share it
6. Sign up with the code
7. Check if code appears in "Used Codes" in admin panel

### Test OAuth:
1. Try signing up with Google
2. Should redirect to `/waitlist-confirmation`
3. Should appear in admin waitlist
4. Admin approves user
5. Log in again with Google
6. Should redirect to `/dashboard`

---

## 📝 Environment Variables

Make sure these are set in your environment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

For local development:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚨 Common Issues & Solutions

### Issue: "column reference 'id' is ambiguous"
**Solution:** Run the fixed SQL functions above

### Issue: OAuth users don't appear in waitlist
**Solution:** The latest code fixes this. Make sure the `user_id` column exists in waitlist table:
```sql
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;
```

### Issue: Used codes still show as active
**Solution:** Make sure `is_used` is being set to `true` when codes are redeemed (fixed in latest code)

### Issue: Admin leaderboard/users only shows 1 entry
**Solution:** Check RLS policies. Run as admin to verify:
```sql
-- Test RLS by selecting as authenticated user
SELECT * FROM public.users;
SELECT * FROM public.waitlist;
```

If you only see 1 result, there might be an RLS policy issue. Check:
```sql
-- View all policies
SELECT * FROM pg_policies WHERE tablename IN ('users', 'waitlist', 'access_codes');
```

### Issue: No email verification
**Solution:** Enable email confirmation in Supabase Authentication settings (see above)

---

## 🔄 Migration Order

If you're setting up from scratch, run migrations in this order:

1. `001_create_users_table.sql`
2. `002_create_tournaments_table.sql`
3. `003_create_submissions_table.sql`
4. `004_create_votes_table.sql`
5. `005_create_feature_flags_table.sql`
6. `006_create_waitlist_table.sql`
7. `010_create_access_codes_table.sql`
8. `011_update_users_table_for_access_codes.sql`
9. `016_add_approved_to_users.sql`
10. `022_create_referral_system.sql` (use the fixed version from this document)
11. All remaining migration files in order

---

## ✅ Final Checklist

- [ ] Run fixed SQL functions for referral codes
- [ ] Enable email confirmation in Supabase
- [ ] Configure Google OAuth with correct redirect URLs
- [ ] Add performance indexes
- [ ] Verify all environment variables
- [ ] Test email signup with verification
- [ ] Test OAuth signup and login
- [ ] Test referral code generation
- [ ] Test access code redemption
- [ ] Test admin approval flow
- [ ] Check that waitlist shows all users
- [ ] Check that leaderboard shows all users
- [ ] Check that used codes appear in "Used" section

---

## 📞 Need Help?

If issues persist after following this guide:
1. Check Supabase logs (Dashboard → Logs)
2. Check browser console for errors
3. Check network tab for failed requests
4. Verify RLS policies are not too restrictive
