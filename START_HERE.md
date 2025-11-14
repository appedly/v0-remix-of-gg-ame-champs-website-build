# 🚀 START HERE - Complete Setup in 10 Minutes

## 📋 What You're Setting Up

✅ Ranked voting system (1st/2nd/3rd = 3/2/1 points)  
✅ Like system for all users  
✅ Founding member badges (first 50 users)  
✅ Automatic score calculations  

---

## Step 1: Go to Supabase (1 minute)

1. Open: https://supabase.com
2. Sign in
3. Select your project
4. Click **"SQL Editor"** in left sidebar

---

## Step 2: Run SQL Scripts (5 minutes)

### Script A: Voting System

1. Click **"+ New query"**
2. Copy and paste this:

```sql
-- Update voting system for ranked voting
DROP TRIGGER IF EXISTS votes_update_score ON public.votes;
DROP FUNCTION IF EXISTS public.update_submission_score();

CREATE OR REPLACE FUNCTION public.update_submission_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  points_value INTEGER;
BEGIN
  IF TG_OP = 'INSERT' THEN
    points_value := CASE 
      WHEN NEW.rank = 1 THEN 3
      WHEN NEW.rank = 2 THEN 2
      WHEN NEW.rank = 3 THEN 1
      ELSE 0
    END;
    UPDATE public.submissions SET score = score + points_value WHERE id = NEW.submission_id;
    
  ELSIF TG_OP = 'DELETE' THEN
    points_value := CASE 
      WHEN OLD.rank = 1 THEN 3
      WHEN OLD.rank = 2 THEN 2
      WHEN OLD.rank = 3 THEN 1
      ELSE 0
    END;
    UPDATE public.submissions SET score = score - points_value WHERE id = OLD.submission_id;
    
  ELSIF TG_OP = 'UPDATE' THEN
    DECLARE
      old_points INTEGER;
      new_points INTEGER;
    BEGIN
      old_points := CASE WHEN OLD.rank = 1 THEN 3 WHEN OLD.rank = 2 THEN 2 WHEN OLD.rank = 3 THEN 1 ELSE 0 END;
      new_points := CASE WHEN NEW.rank = 1 THEN 3 WHEN NEW.rank = 2 THEN 2 WHEN NEW.rank = 3 THEN 1 ELSE 0 END;
      UPDATE public.submissions SET score = score - old_points + new_points WHERE id = NEW.submission_id;
    END;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER votes_update_score
  AFTER INSERT OR UPDATE OR DELETE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_submission_score();

ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_submission_id_user_id_key;
```

3. Click **"Run"** ✓

---

### Script B: Founding Members

1. Click **"+ New query"** again
2. Copy and paste this:

```sql
-- Add founding member feature
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS founding_member BOOLEAN DEFAULT FALSE;

CREATE OR REPLACE FUNCTION mark_founding_members()
RETURNS void AS $$
BEGIN
  UPDATE public.users SET founding_member = TRUE
  WHERE id IN (SELECT id FROM public.users ORDER BY created_at ASC LIMIT 50);
END;
$$ LANGUAGE plpgsql;

SELECT mark_founding_members();
```

3. Click **"Run"** ✓

---

### Script C: Verify Setup

1. Click **"+ New query"** one more time
2. Copy and paste this:

```sql
-- Verify everything
SELECT 
  EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'rank')::text as rank_column,
  EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'founding_member')::text as founding_column,
  EXISTS (SELECT FROM information_schema.triggers WHERE trigger_name = 'votes_update_score')::text as trigger_exists,
  EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'likes')::text as likes_table,
  (SELECT COUNT(*) FROM users WHERE founding_member = true)::text as founding_members_count;
```

3. Click **"Run"**
4. **All should say "true"** ✓

---

## Step 3: Deploy Code (2 minutes)

```bash
# In your terminal/command prompt
git add .
git commit -m "Add voting system and founding member badges"
git push
```

Vercel will auto-deploy (wait 1-2 minutes)

---

## Step 4: Test It! (2 minutes)

1. **Open your website**
2. **Go to a tournament**
3. **Look for:**
   - 🏆 Points display
   - ❤️ Like button
   - 🥇 🥈 🥉 Vote buttons (if you have approved clip)

4. **Go to profile:**
   - Check for 👑 Founding Member badge (if you're in first 50)

---

## ✅ Success Checklist

- [ ] Ran voting system script in Supabase
- [ ] Ran founding members script in Supabase
- [ ] Verification shows all "true"
- [ ] Pushed code to GitHub
- [ ] Vercel shows "Ready"
- [ ] Can see voting buttons on tournament page
- [ ] Can vote and points increase
- [ ] Can like submissions
- [ ] Profile shows correctly

---

## 🐛 Quick Troubleshooting

### "Can't see voting buttons"
→ You need an **approved** submission in that tournament  
→ Ask admin to approve your clip

### "Votes don't update score"
→ Re-run Script A (voting system)  
→ Check Supabase logs for errors

### "SQL syntax error"
→ Make sure you copied the **entire** script  
→ Check [SUPABASE_QUICK_FIX.md](./SUPABASE_QUICK_FIX.md)

### "Likes not working"
→ Run this in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(submission_id, user_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON likes FOR DELETE USING (auth.uid() = user_id);
```

---

## 📚 Need More Help?

- **Quick fixes:** [SUPABASE_QUICK_FIX.md](./SUPABASE_QUICK_FIX.md)
- **Detailed guide:** [SUPABASE_VOTING_SETUP.md](./SUPABASE_VOTING_SETUP.md)
- **Visual guide:** [VISUAL_SETUP_GUIDE.md](./VISUAL_SETUP_GUIDE.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 🎮 How Voting Works

### Users WITH Approved Submissions
- ✅ Vote 1st/2nd/3rd on other clips
- ✅ 1st place = 3 points
- ✅ 2nd place = 2 points  
- ✅ 3rd place = 1 point
- ❌ Cannot vote on own submission

### Users WITHOUT Approved Submissions
- ✅ Can like any submission
- ❌ Cannot vote (shows message)

### Everyone
- ✅ See points and likes
- ✅ Clips ordered by points (highest first)

---

## 🎉 You're Done!

Your platform now has:
- 🏆 Ranked voting system
- ❤️ Like functionality
- 👑 Founding member badges
- 📊 Real-time score updates
- 🎨 Professional UI

**Enjoy your enhanced tournament platform!** 🚀
