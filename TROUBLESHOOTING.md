# Troubleshooting Guide - Voting System

## 🔍 Quick Diagnostics

Before diving into specific issues, run these checks:

### Check 1: Database Tables
```sql
-- Run in Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'submissions', 'votes', 'likes', 'tournaments')
ORDER BY table_name;
```
✅ Should return all 5 tables

### Check 2: Required Columns
```sql
-- Check votes.rank column
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'votes' AND column_name = 'rank';

-- Check users.founding_member column  
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'founding_member';
```
✅ Both should exist

### Check 3: Database Trigger
```sql
SELECT trigger_name, event_manipulation FROM information_schema.triggers 
WHERE trigger_name = 'votes_update_score';
```
✅ Should show INSERT, UPDATE, DELETE events

---

## 🚨 Common Issues & Solutions

### Issue 1: "Voting buttons don't appear"

**Symptoms:**
- User sees only "Submit an approved clip to vote" message
- Or no voting interface at all

**Checklist:**
1. **Do you have a submission?**
   ```sql
   -- Check your submissions
   SELECT id, tournament_id, status, title 
   FROM submissions 
   WHERE user_id = 'YOUR_USER_ID';
   ```
   
2. **Is your submission approved?**
   - Status must be `approved`, not `pending` or `rejected`
   - Ask admin to approve your submission
   
3. **Are you on the correct tournament?**
   - Your approved submission must be in the SAME tournament
   
4. **Clear your browser cache:**
   - Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

**Solution:**
```sql
-- Admin: Approve a submission
UPDATE submissions 
SET status = 'approved' 
WHERE id = 'SUBMISSION_ID';
```

---

### Issue 2: "Votes not increasing score"

**Symptoms:**
- Click vote button
- Score stays at 0 or doesn't change

**Diagnosis:**
```sql
-- Check if vote was recorded
SELECT * FROM votes 
WHERE submission_id = 'SUBMISSION_ID';

-- Check submission score
SELECT id, title, score FROM submissions 
WHERE id = 'SUBMISSION_ID';
```

**Common Causes:**

#### A. Trigger not installed
```sql
-- Verify trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'votes_update_score';
```

**Solution:** Re-run the trigger script:
```sql
-- Re-install trigger (from 024_update_voting_system.sql)
DROP TRIGGER IF EXISTS votes_update_score ON public.votes;
DROP FUNCTION IF EXISTS public.update_submission_score();

-- Then copy/paste the full function and trigger from the script
```

#### B. Rank column missing
```sql
-- Check for rank column
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'votes' AND column_name = 'rank';
```

**Solution:** Add rank column:
```sql
ALTER TABLE votes ADD COLUMN rank INTEGER CHECK (rank IN (1, 2, 3));
CREATE INDEX idx_votes_rank ON votes(rank);
```

#### C. Existing votes without rank
```sql
-- Check for NULL ranks
SELECT COUNT(*) FROM votes WHERE rank IS NULL;
```

**Solution:** Update or delete old votes:
```sql
-- Delete old votes without rank
DELETE FROM votes WHERE rank IS NULL;

-- Or update them to rank 1
UPDATE votes SET rank = 1 WHERE rank IS NULL;
```

---

### Issue 3: "Cannot vote (button disabled)"

**Symptoms:**
- Vote buttons are visible but grayed out
- Or clicking does nothing

**Checklist:**

1. **Are you trying to vote on your own clip?**
   - This is intentional - users can't vote for themselves
   - You'll see: "Can't vote on own clip"

2. **Check browser console for errors:**
   - Press F12 → Console tab
   - Look for red error messages

3. **Check RLS policies:**
```sql
-- Verify vote policies exist
SELECT policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'votes';
```

**Solution:** Re-add policies:
```sql
-- Enable RLS
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "votes_select_all" ON votes FOR SELECT USING (true);
CREATE POLICY "votes_insert_own" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "votes_update_own" ON votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "votes_delete_own" ON votes FOR DELETE USING (auth.uid() = user_id);
```

---

### Issue 4: "Likes not working"

**Symptoms:**
- Heart button doesn't respond
- Like count doesn't update

**Diagnosis:**
```sql
-- Check if likes table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'likes'
);
```

**Solution A:** Create likes table (if it doesn't exist):
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
CREATE POLICY "Anyone can view likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON likes FOR DELETE USING (auth.uid() = user_id);
```

**Solution B:** Check RLS policies:
```sql
-- Verify like policies
SELECT policyname FROM pg_policies WHERE tablename = 'likes';
```

---

### Issue 5: "Founding Member badge not showing"

**Symptoms:**
- Profile page doesn't show Crown badge
- Even though user is in first 50

**Diagnosis:**
```sql
-- Check if column exists
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'founding_member';

-- Check your status
SELECT id, display_name, founding_member, created_at 
FROM users 
WHERE id = 'YOUR_USER_ID';

-- Check who is marked as founding member
SELECT COUNT(*) FROM users WHERE founding_member = true;
```

**Solution A:** Add column and mark members:
```sql
-- Add column
ALTER TABLE users ADD COLUMN IF NOT EXISTS founding_member BOOLEAN DEFAULT FALSE;

-- Mark first 50 users
UPDATE users SET founding_member = TRUE
WHERE id IN (
  SELECT id FROM users ORDER BY created_at ASC LIMIT 50
);
```

**Solution B:** Clear cache and reload:
- Log out
- Clear browser cache
- Log back in

---

### Issue 6: "Submissions not ordered by score"

**Symptoms:**
- Submissions appear in random order
- Or ordered by date, not score

**Diagnosis:**
```sql
-- Check submission scores
SELECT id, title, score, created_at 
FROM submissions 
WHERE tournament_id = 'TOURNAMENT_ID' 
AND status = 'approved'
ORDER BY score DESC;
```

**Cause:** Frontend code not deployed

**Solution:**
1. Make sure code is pushed to GitHub:
   ```bash
   git status
   git push origin main
   ```

2. Redeploy on Vercel:
   - Go to Vercel dashboard
   - Trigger manual redeploy if needed

3. Clear browser cache

---

### Issue 7: "Can change vote but score doesn't update"

**Symptoms:**
- User can click different rank buttons
- But submission score stays the same

**Diagnosis:**
```sql
-- Check if votes are being updated
SELECT * FROM votes 
WHERE user_id = 'YOUR_USER_ID' 
AND submission_id = 'SUBMISSION_ID';
```

**Cause:** Trigger doesn't handle UPDATE properly

**Solution:** Re-install the trigger with UPDATE support:
```sql
-- Make sure trigger handles all operations
DROP TRIGGER IF EXISTS votes_update_score ON public.votes;

CREATE TRIGGER votes_update_score
  AFTER INSERT OR UPDATE OR DELETE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_submission_score();
```

---

### Issue 8: "Authentication errors when voting"

**Symptoms:**
- Console shows: "User not authenticated"
- Or: "Invalid user_id"

**Checklist:**

1. **Are you logged in?**
   - Check if you see user menu in top right
   - If not, log in again

2. **Session expired?**
   - Log out
   - Log back in
   - Try voting again

3. **Check Supabase auth:**
```sql
-- In Supabase Dashboard → Authentication → Users
-- Verify your user exists
```

**Solution:** Refresh authentication:
1. Open browser DevTools (F12)
2. Go to Application → Cookies
3. Delete Supabase cookies
4. Log in again

---

### Issue 9: "Score calculation seems wrong"

**Symptoms:**
- Score doesn't match expected points
- Example: 2 votes of 3pts each = 6pts, but shows 2pts

**Diagnosis:**
```sql
-- Check all votes and their ranks
SELECT v.rank, COUNT(*) as count, 
  CASE 
    WHEN v.rank = 1 THEN COUNT(*) * 3
    WHEN v.rank = 2 THEN COUNT(*) * 2
    WHEN v.rank = 3 THEN COUNT(*) * 1
  END as total_points
FROM votes v
WHERE v.submission_id = 'SUBMISSION_ID'
GROUP BY v.rank;
```

**Common Causes:**

1. **Old votes without rank:**
```sql
-- Check for NULL ranks
SELECT COUNT(*) FROM votes 
WHERE submission_id = 'SUBMISSION_ID' AND rank IS NULL;
```

**Solution:**
```sql
-- Delete invalid votes
DELETE FROM votes WHERE rank IS NULL;
```

2. **Trigger using old logic:**
   - Re-run the `024_update_voting_system.sql` script

3. **Score not reset before trigger:**
```sql
-- Manually recalculate score
UPDATE submissions 
SET score = (
  SELECT COALESCE(SUM(
    CASE 
      WHEN rank = 1 THEN 3
      WHEN rank = 2 THEN 2
      WHEN rank = 3 THEN 1
      ELSE 0
    END
  ), 0)
  FROM votes 
  WHERE submission_id = submissions.id
)
WHERE id = 'SUBMISSION_ID';
```

---

### Issue 10: "Duplicate vote errors"

**Symptoms:**
- Error: "duplicate key value violates unique constraint"
- Cannot vote multiple times

**Cause:** This is intentional! Users should only vote once per rank.

**How it should work:**
- User can vote 1st, 2nd, and 3rd on DIFFERENT submissions
- User cannot vote 1st place on TWO submissions
- Each user gets one 1st place vote, one 2nd place vote, one 3rd place vote per tournament

**To check current votes:**
```sql
-- See your votes in a tournament
SELECT s.title, v.rank, 
  CASE 
    WHEN v.rank = 1 THEN '1st Place (3pts)'
    WHEN v.rank = 2 THEN '2nd Place (2pts)'
    WHEN v.rank = 3 THEN '3rd Place (1pt)'
  END as vote_type
FROM votes v
JOIN submissions s ON v.submission_id = s.id
WHERE v.user_id = 'YOUR_USER_ID'
AND s.tournament_id = 'TOURNAMENT_ID';
```

---

## 🛠️ Reset Everything (Nuclear Option)

If nothing works, reset the voting system:

```sql
-- DANGER: This deletes all votes and resets scores!

-- 1. Delete all votes
DELETE FROM votes;

-- 2. Reset all scores
UPDATE submissions SET score = 0;

-- 3. Re-install trigger
DROP TRIGGER IF EXISTS votes_update_score ON public.votes;
DROP FUNCTION IF EXISTS public.update_submission_score();

-- 4. Then run the full script from 024_update_voting_system.sql
```

---

## 📞 Still Need Help?

If you're still stuck:

1. **Check Supabase Logs:**
   - Go to Supabase Dashboard
   - Click "Logs" in left sidebar
   - Look for errors in the last hour

2. **Check Browser Console:**
   - Press F12
   - Go to Console tab
   - Look for red errors
   - Take a screenshot

3. **Verify Code Deployment:**
   - Check Vercel deployment status
   - Make sure latest commit is deployed
   - Check build logs for errors

4. **Test with SQL First:**
   - Before testing in UI, test with SQL
   - Make sure database operations work
   - Then test UI

---

## ✅ Verification Script

Run this complete verification script to check everything:

```sql
-- Complete System Check
DO $$
DECLARE
  result TEXT := '';
BEGIN
  -- Check tables
  result := result || '=== TABLE CHECK ===' || chr(10);
  result := result || 'Users table: ' || 
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') 
    THEN '✓' ELSE '✗' END || chr(10);
  result := result || 'Submissions table: ' || 
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'submissions') 
    THEN '✓' ELSE '✗' END || chr(10);
  result := result || 'Votes table: ' || 
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'votes') 
    THEN '✓' ELSE '✗' END || chr(10);
  result := result || 'Likes table: ' || 
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'likes') 
    THEN '✓' ELSE '✗' END || chr(10);
  
  -- Check columns
  result := result || chr(10) || '=== COLUMN CHECK ===' || chr(10);
  result := result || 'votes.rank: ' || 
    CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'rank') 
    THEN '✓' ELSE '✗' END || chr(10);
  result := result || 'users.founding_member: ' || 
    CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'founding_member') 
    THEN '✓' ELSE '✗' END || chr(10);
  
  -- Check trigger
  result := result || chr(10) || '=== TRIGGER CHECK ===' || chr(10);
  result := result || 'update_submission_score trigger: ' || 
    CASE WHEN EXISTS (SELECT FROM information_schema.triggers WHERE trigger_name = 'votes_update_score') 
    THEN '✓' ELSE '✗' END || chr(10);
  
  -- Stats
  result := result || chr(10) || '=== STATISTICS ===' || chr(10);
  result := result || 'Total users: ' || (SELECT COUNT(*)::TEXT FROM users) || chr(10);
  result := result || 'Founding members: ' || (SELECT COUNT(*)::TEXT FROM users WHERE founding_member = true) || chr(10);
  result := result || 'Total votes: ' || (SELECT COUNT(*)::TEXT FROM votes) || chr(10);
  result := result || 'Total likes: ' || (SELECT COUNT(*)::TEXT FROM likes) || chr(10);
  result := result || 'Submissions with votes: ' || (SELECT COUNT(DISTINCT submission_id)::TEXT FROM votes) || chr(10);
  
  RAISE NOTICE '%', result;
END $$;
```

This should output a complete status report! ✅
