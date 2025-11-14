# Supabase Setup Guide - Voting System

This guide will walk you through setting up the new ranked voting system in your Supabase database.

## Prerequisites

- Access to your Supabase Dashboard
- Admin access to your Supabase project

## Step-by-Step Setup

### Step 1: Access Supabase SQL Editor

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (GGameChamps or whatever you named it)
4. In the left sidebar, click on **"SQL Editor"**

### Step 2: Verify Existing Tables

Before running the new scripts, let's verify your database has the required tables:

1. In the SQL Editor, run this query:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'submissions', 'votes', 'likes', 'tournaments');
```

2. You should see all 5 tables listed. If any are missing, you need to run the initial setup scripts first.

### Step 3: Update the Voting System

#### A. Run the Voting System Update Script

1. In the SQL Editor, click **"+ New query"**
2. Copy and paste the entire contents of `scripts/024_update_voting_system.sql`:

```sql
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

-- Add constraint to ensure user can only vote once per tournament (with ranks)
-- First drop the old unique constraint
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_submission_id_user_id_key;
```

3. Click **"Run"** or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
4. You should see a success message at the bottom

**Note:** The last part with the unique index might fail - that's okay, we'll handle it differently.

### Step 4: Add Founding Member Column (Optional but Recommended)

1. In the SQL Editor, click **"+ New query"**
2. Copy and paste this query:

```sql
-- Add founding_member column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS founding_member BOOLEAN DEFAULT FALSE;

-- Create a function to mark first 50 users as founding members
CREATE OR REPLACE FUNCTION mark_founding_members()
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET founding_member = TRUE
  WHERE id IN (
    SELECT id FROM public.users
    ORDER BY created_at ASC
    LIMIT 50
  );
END;
$$ LANGUAGE plpgsql;

-- Execute the function to mark first 50 users
SELECT mark_founding_members();
```

3. Click **"Run"**
4. You should see "Success. No rows returned" - this is correct!

### Step 5: Verify the Changes

#### Verify the votes table has rank column:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'votes' AND column_name = 'rank';
```

You should see the `rank` column with type `integer`.

#### Verify the founding_member column:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'founding_member';
```

You should see the `founding_member` column with type `boolean`.

#### Verify the trigger exists:

```sql
SELECT trigger_name, event_manipulation 
FROM information_schema.triggers 
WHERE trigger_name = 'votes_update_score';
```

You should see the trigger with INSERT, UPDATE, DELETE events.

### Step 6: Check Row-Level Security (RLS) Policies

The voting system needs proper RLS policies. Verify they exist:

1. Go to **"Authentication"** → **"Policies"** in the left sidebar
2. Find the **"votes"** table
3. You should see these policies:
   - `votes_select_all` - allows everyone to view votes
   - `votes_insert_own` - allows users to insert their own votes
   - `votes_delete_own` - allows users to delete their own votes

If any are missing, run these:

```sql
-- Enable RLS on votes table
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view votes
CREATE POLICY "votes_select_all"
  ON public.votes FOR SELECT
  USING (true);

-- Allow users to insert their own votes
CREATE POLICY "votes_insert_own"
  ON public.votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own votes
CREATE POLICY "votes_delete_own"
  ON public.votes FOR DELETE
  USING (auth.uid() = user_id);

-- Allow users to update their own votes (for changing rank)
CREATE POLICY "votes_update_own"
  ON public.votes FOR UPDATE
  USING (auth.uid() = user_id);
```

### Step 7: Verify Likes Table

Check if the likes table exists and has proper policies:

```sql
-- Check if likes table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'likes'
);
```

If it returns `false`, create the likes table:

```sql
-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(submission_id, user_id)
);

-- Create indexes
CREATE INDEX idx_likes_submission_id ON likes(submission_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view likes"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);
```

## Testing the Setup

### Test 1: Create Test Votes

1. In SQL Editor, run:

```sql
-- Get a submission ID and user ID
SELECT s.id as submission_id, u.id as user_id, s.title
FROM submissions s
CROSS JOIN users u
WHERE s.user_id != u.id -- Different users
LIMIT 1;
```

2. Use the IDs from above to test voting:

```sql
-- Insert a test vote (replace with actual IDs)
INSERT INTO votes (submission_id, user_id, rank)
VALUES ('YOUR_SUBMISSION_ID', 'YOUR_USER_ID', 1);

-- Check if score was updated
SELECT id, title, score 
FROM submissions 
WHERE id = 'YOUR_SUBMISSION_ID';
```

The score should have increased by 3 points!

### Test 2: Check Founding Members

```sql
-- See which users are founding members
SELECT id, display_name, email, founding_member, created_at
FROM users
WHERE founding_member = true
ORDER BY created_at ASC;
```

You should see up to 50 users marked as founding members.

## Troubleshooting

### Issue: "function update_submission_score() does not exist"

**Solution:** Run the function creation script again from Step 3.

### Issue: "column rank does not exist"

**Solution:** The rank column wasn't added. Run this:

```sql
-- Add rank column to votes table
ALTER TABLE votes ADD COLUMN IF NOT EXISTS rank INTEGER CHECK (rank IN (1, 2, 3));

-- Create index
CREATE INDEX IF NOT EXISTS idx_votes_rank ON votes(rank);
```

### Issue: "relation likes does not exist"

**Solution:** Run the likes table creation script from Step 7.

### Issue: Can't vote in the UI

**Checklist:**
1. User must have an **approved** submission in the same tournament
2. User cannot vote on their own submission
3. Check browser console for errors (F12)
4. Verify RLS policies are set correctly

### Issue: Votes not updating score

**Solution:** Verify the trigger exists and is enabled:

```sql
-- Check trigger status
SELECT * FROM pg_trigger WHERE tgname = 'votes_update_score';

-- If it doesn't exist, re-run the trigger creation from Step 3
```

## Deploying Code Changes

After setting up the database:

1. **Push code to your repository:**
   ```bash
   git add .
   git commit -m "Add ranked voting system and founding member badges"
   git push
   ```

2. **Redeploy on Vercel:**
   - Go to your Vercel dashboard
   - Your project should auto-deploy
   - Or manually trigger a redeploy

3. **Clear browser cache:**
   - Press `Ctrl+Shift+Delete` (Windows/Linux) or `Cmd+Shift+Delete` (Mac)
   - Clear cached images and files
   - Or do a hard refresh: `Ctrl+F5` or `Cmd+Shift+R`

## What Users Will See

### Users with Approved Submissions
- Can vote on other submissions (1st, 2nd, 3rd place buttons)
- Can like any submission
- Cannot vote on their own submission
- See "Your Clip" badge on their submission

### Users without Approved Submissions
- Can only like submissions
- See message: "Submit an approved clip to vote"
- Can view all vote counts and like counts

### Founding Members (First 50 Users)
- See "FOUNDING MEMBER" badge in profile header
- See special Crown badge section in profile
- Get "Early Supporter" and "Community Pioneer" badges

## Summary

You've now set up:
- ✅ Ranked voting system (1st, 2nd, 3rd place = 3, 2, 1 points)
- ✅ Automatic score calculation via database trigger
- ✅ Like system for all users
- ✅ Founding member badges
- ✅ Proper RLS security policies

The voting system is now live! Users can start voting on tournament submissions.

## Need Help?

If you encounter any issues:
1. Check the Supabase logs: **Database** → **Logs**
2. Check browser console: Press F12 → Console tab
3. Verify all SQL scripts ran successfully
4. Make sure your code is deployed to Vercel
