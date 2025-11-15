# How to Apply the Submissions Visibility Fix

## Quick Fix (2 minutes)

The issue preventing users from seeing other users' submissions is due to restrictive RLS policies in Supabase. You need to run a database migration to fix it.

### Step 1: Go to Supabase Dashboard

1. Open your Supabase project: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the Migration SQL

1. Click **+ New Query** button
2. Copy the entire SQL from below
3. Paste it into the SQL editor
4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

```sql
-- Fix submissions visibility - users should see submissions from other users
-- Issue: Users cannot see submissions by other users because the users table
-- has a restrictive RLS policy that only allows users to see their own record
-- Solution: Ensure users can see all other users' profiles (needed for submission creator display)

-- ============================================================================
-- FIX: Users table - Allow everyone to see all user profiles
-- ============================================================================

-- Drop any restrictive policies that limit visibility to own records
DROP POLICY IF EXISTS "users_select_own" ON public.users;

-- Ensure the permissive policy exists that allows everyone to see all users
-- This is needed for submission creator information to be visible
DROP POLICY IF EXISTS "users_select_all" ON public.users;

CREATE POLICY "users_select_all"
  ON public.users FOR SELECT
  USING (true);

-- ============================================================================
-- VERIFY: Submissions table policies allow full visibility
-- ============================================================================

-- Ensure submissions can be viewed by everyone
DROP POLICY IF EXISTS "submissions_select_all" ON public.submissions;

CREATE POLICY "submissions_select_all"
  ON public.submissions FOR SELECT
  USING (true);
```

### Step 3: Verify Success

You should see a message like:
```
Query executed successfully. Rows returned: 0
```

If you see an error, check:
- Did you copy the entire SQL?
- Are you in the correct Supabase project?
- Check your RLS policies exist

## How to Verify the Fix Works

### Test in SQL Editor
Run this query in Supabase SQL Editor to verify the policies are correct:

```sql
SELECT schemaname, tablename, policyname, qual
FROM pg_policies
WHERE tablename IN ('users', 'submissions')
AND policyname IN ('users_select_all', 'submissions_select_all')
ORDER BY tablename, policyname;
```

You should see 2 rows with `USING true` policies.

### Test in Your Application
1. Go to any tournament page: `/tournaments/[id]`
2. You should now see all approved submissions with creator names
3. The submissions should NOT be filtered out
4. Click on a user profile to verify you can view other users

## What Was Fixed

**Before:**
- Users could only see their own profile information
- Submission joins returned NULL for other users
- Submissions were filtered out (no submissions visible)

**After:**
- Everyone can see all user profiles
- Submission joins work correctly
- All approved submissions are visible with creator names

## If You Still Have Issues

### Check the Application Code
The tournament page already handles the fix correctly. Look at `/app/tournaments/[id]/page.tsx`:

```typescript
// Submissions are now visible because the RLS policy allows the join
const { data: submissionsData } = await supabase
    .from("submissions")
    .select(`
      *,
      user:users(display_name, id)
    `)
    .eq("tournament_id", tournament.id)
    .eq("status", "approved")
    .order("score", { ascending: false })

// This filter no longer removes submissions
const submissions = submissionsData?.filter(s => s.user !== null) || []
```

### Debug Steps
1. Clear browser cache and cookies
2. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
3. Check browser console for errors
4. Check Supabase logs for RLS violations

### Contact Support
If you're still having issues:
1. Check Supabase Dashboard → Logs
2. Look for RLS policy errors
3. Verify you ran the SQL migration in the correct project

## Related Documentation

See `SUBMISSION_VISIBILITY_FIX.md` for detailed technical information about:
- The root cause of the issue
- Why RLS policies affect joins
- How the fix prevents similar issues
