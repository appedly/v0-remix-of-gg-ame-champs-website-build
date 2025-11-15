# Fix: Users Cannot See Submissions by Other Users

## Problem Description

Users are unable to see submissions created by other users in tournaments. When viewing a tournament detail page (`/tournaments/[id]`), the submissions list either shows no submissions or shows submissions with missing creator information.

## Root Cause

The issue is caused by conflicting RLS (Row Level Security) policies on the `users` table:

1. **Restrictive Policy (script 018):**
   ```sql
   CREATE POLICY "users_select_own"
     ON public.users
     FOR SELECT
     USING (auth.uid() = id);
   ```
   This policy only allows users to see their own user record.

2. **Later, permissive policies were added (scripts 025, 017):**
   ```sql
   CREATE POLICY "users_select_all"
     ON public.users FOR SELECT
     USING (true);
   ```
   These policies were meant to allow everyone to see all users.

## Why This Breaks Submissions Visibility

When the tournament detail page fetches submissions:

```typescript
const { data: submissionsData } = await supabase
    .from("submissions")
    .select(
      `
      *,
      user:users(display_name, id)  // <-- This joins with users table
    `,
    )
    .eq("tournament_id", tournament.id)
    .eq("status", "approved")
    .order("score", { ascending: false })
```

The join with the `users` table to get `display_name` and `id` fails because the RLS policy on `users` restricts access. In Supabase, when a join fails due to RLS, it returns NULL for the related data instead of the full row.

The code then filters these out:
```typescript
const submissions = submissionsData?.filter(s => s.user !== null) || []
```

Result: No submissions are shown to users!

## Solution

This fix updates the RLS policies to:

1. **Allow everyone to see all users** - removes the restrictive policy
2. **Ensures the permissive policy is in place** - allows the join to work correctly

### SQL Changes (in script 026_fix_submissions_visibility.sql):

```sql
-- Drop the restrictive policy that only allows seeing own record
DROP POLICY IF EXISTS "users_select_own" ON public.users;

-- Create permissive policy that allows everyone to see all users
CREATE POLICY "users_select_all"
  ON public.users FOR SELECT
  USING (true);

-- Also ensure submissions can be viewed by everyone
CREATE POLICY "submissions_select_all"
  ON public.submissions FOR SELECT
  USING (true);
```

## Files Affected

- `scripts/026_fix_submissions_visibility.sql` - New migration to fix RLS policies
- No code changes required - this is purely a database policy fix

## How to Apply

1. **In Supabase Dashboard:**
   - Go to SQL Editor
   - Copy and run the contents of `scripts/026_fix_submissions_visibility.sql`

2. **Or use migration system:**
   - If you have a migration runner, apply migration 026

## Verification

After applying the fix:

1. **Test in Supabase SQL Editor:**
   ```sql
   -- This query should now work without NULL values for user
   SELECT s.id, s.title, s.user_id, u.display_name, u.id
   FROM submissions s
   LEFT JOIN users u ON s.user_id = u.id
   WHERE s.status = 'approved'
   LIMIT 5;
   ```
   You should see all rows with user data populated.

2. **Test in the application:**
   - Go to any tournament detail page
   - You should now see all approved submissions with creator names
   - User profiles at `/profile/[userId]` should be accessible

## RLS Policy Hierarchy

After this fix, the RLS policies will be:

**Users Table:**
- ✅ Everyone can SELECT all users (permissive policy)
- ✅ Users can INSERT their own record
- ✅ Users can UPDATE their own record
- ✅ Admins can UPDATE any user

**Submissions Table:**
- ✅ Everyone can SELECT all submissions (permissive policy)
- ✅ Users can INSERT their own submissions
- ✅ Users can UPDATE their own submissions
- ✅ Admins can UPDATE any submission

This ensures:
1. All users can be seen by everyone (enabling joins and profile views)
2. All submissions are visible to everyone (including non-approved ones for the creator)
3. User-specific operations (insert/update) are still restricted
4. Admin operations work correctly

## Prevention

To prevent this in the future:

1. Use consistent naming for policies across migrations
2. Always verify that joins with other tables will work with your RLS policies
3. Test joins explicitly in Supabase SQL Editor before deploying
4. Consider making profile/user data accessible to everyone (very common pattern)

## Related Issues This Fixes

- Users cannot see submissions by other users
- Tournament submission lists show no submissions
- User profile pages return 404 for other users' profiles
- Display names don't appear next to submissions
- Leaderboard might show incomplete data if it relies on user joins
