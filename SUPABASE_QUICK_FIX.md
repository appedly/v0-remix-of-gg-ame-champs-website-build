# 🔧 Quick Fix for SQL Errors

If you got SQL errors when running the scripts, use these **fixed** versions!

---

## ✅ Fixed Script 1: Founding Members

**Copy and paste this into Supabase SQL Editor:**

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

**Click "Run"** - You should see: `Success. No rows returned`

---

## ✅ Fixed Script 2: Voting System

**Copy and paste this into Supabase SQL Editor:**

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

-- Drop the old unique constraint if it exists
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_submission_id_user_id_key;
```

**Click "Run"** - You should see: `Success`

---

## ✅ Verify Everything Works

**Run this verification query:**

```sql
-- Quick verification
SELECT 
  'Votes table has rank column: ' || 
  EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'votes' AND column_name = 'rank'
  )::text as check_1,
  
  'Founding member column exists: ' || 
  EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'founding_member'
  )::text as check_2,
  
  'Trigger exists: ' || 
  EXISTS (
    SELECT FROM information_schema.triggers 
    WHERE trigger_name = 'votes_update_score'
  )::text as check_3,
  
  'Likes table exists: ' || 
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'likes'
  )::text as check_4,
  
  'Founding members count: ' || 
  (SELECT COUNT(*)::text FROM users WHERE founding_member = true) as check_5;
```

**Expected result:**
```
check_1: Votes table has rank column: true
check_2: Founding member column exists: true
check_3: Trigger exists: true
check_4: Likes table exists: true
check_5: Founding members count: 50 (or however many users you have, up to 50)
```

---

## 🎯 What Was Fixed?

### Error 1: `syntax error at or near "$"`
**Problem:** Used single `$` instead of double `$$` for function delimiter  
**Fixed:** Changed to `$$` in founding members script

### Error 2: `syntax error at or near "SELECT"`
**Problem:** Can't use subquery in functional index definition  
**Fixed:** Removed the complex index constraint, voting logic is handled in the frontend code

---

## ✅ Next Steps

1. **Deploy your code:**
   ```bash
   git add .
   git commit -m "Fix SQL syntax errors in voting system"
   git push
   ```

2. **Test the voting:**
   - Go to a tournament page
   - Vote on a submission (if you have approved clip)
   - Check if points increase

3. **Check your profile:**
   - Go to profile page
   - See if founding member badge shows (if applicable)

---

## 🐛 Still Having Issues?

### Issue: "likes table does not exist"

Run this:
```sql
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(submission_id, user_id)
);

CREATE INDEX idx_likes_submission_id ON likes(submission_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON likes FOR DELETE USING (auth.uid() = user_id);
```

### Issue: "rank column does not exist"

Run this:
```sql
ALTER TABLE votes ADD COLUMN IF NOT EXISTS rank INTEGER CHECK (rank IN (1, 2, 3));
CREATE INDEX IF NOT EXISTS idx_votes_rank ON votes(rank);
```

### Issue: Votes not updating score

Re-run the voting system script (Script 2 above)

---

## 📚 Full Documentation

- [QUICK_SETUP_CHECKLIST.md](./QUICK_SETUP_CHECKLIST.md) - Complete setup guide
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
- [VISUAL_SETUP_GUIDE.md](./VISUAL_SETUP_GUIDE.md) - Step-by-step with screenshots

---

## 🎉 You're All Set!

Once both scripts run successfully:
- ✅ Voting system is active
- ✅ Founding members are marked
- ✅ Scores will update automatically
- ✅ Ready to test!
