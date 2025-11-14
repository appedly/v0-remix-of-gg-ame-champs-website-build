# Quick Setup Checklist ✓

Use this checklist to quickly set up the voting system in Supabase.

## 🎯 Quick Setup (5 Minutes)

### 1. Access Supabase
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Select your project
- [ ] Click **SQL Editor** in left sidebar

### 2. Run Voting System Script
- [ ] Click **"+ New query"**
- [ ] Copy/paste content from `scripts/024_update_voting_system.sql`
- [ ] Click **"Run"**
- [ ] Verify success message appears

### 3. Add Founding Member Feature
- [ ] Click **"+ New query"**
- [ ] Run this script:

```sql
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

- [ ] Click **"Run"**

### 4. Verify Likes Table Exists
- [ ] Run this query:

```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'likes'
);
```

- [ ] If it returns `false`, run the script from `scripts/014_create_likes_table.sql`

### 5. Check Rank Column in Votes
- [ ] Run this query:

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'votes' AND column_name = 'rank';
```

- [ ] If no result, run:

```sql
ALTER TABLE votes ADD COLUMN rank INTEGER CHECK (rank IN (1, 2, 3));
CREATE INDEX idx_votes_rank ON votes(rank);
```

### 6. Deploy Your Code
- [ ] Push code to GitHub: `git push`
- [ ] Wait for Vercel to auto-deploy
- [ ] Or manually redeploy in Vercel dashboard

### 7. Test It Out
- [ ] Open your site
- [ ] Go to a tournament page
- [ ] Check if voting buttons appear (1st, 2nd, 3rd)
- [ ] Try liking a submission (heart button)
- [ ] Go to profile page
- [ ] Check if founding member badge shows (if you're in first 50)

## ✅ Verification Commands

Run these in Supabase SQL Editor to verify everything is set up:

```sql
-- Check trigger exists
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_name = 'votes_update_score';

-- Check founding_member column
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'founding_member';

-- Check rank column
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'votes' AND column_name = 'rank';

-- Check likes table
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'likes';

-- Count founding members
SELECT COUNT(*) as founding_members 
FROM users WHERE founding_member = true;
```

## 🚨 Common Issues

### Can't see voting buttons?
✅ Check: Do you have an approved submission in that tournament?
✅ Users need approved submissions to vote

### Votes not updating score?
✅ Check: Did the trigger script run successfully?
✅ Re-run the `024_update_voting_system.sql` script

### No founding member badge?
✅ Check: Are you in the first 50 users?
✅ Run: `SELECT founding_member FROM users WHERE id = 'YOUR_USER_ID'`

### Likes not working?
✅ Check: Does the likes table exist?
✅ Run the likes table creation script

## 📝 What Changed

### Database:
- Updated `update_submission_score()` function for rank-based scoring
- Added `founding_member` column to users table
- Verified `rank` column exists in votes table
- Verified `likes` table exists with proper policies

### Frontend:
- Tournament submissions show 1st/2nd/3rd voting buttons
- Vote points and likes displayed with icons
- Profile page shows founding member badge
- Submissions ordered by score (highest first)

## 🎉 You're Done!

Your voting system is now live with:
- 🏆 Ranked voting (3-2-1 points)
- ❤️ Like system for all users
- 👑 Founding member badges
- 📊 Real-time score updates

Need detailed help? See `SUPABASE_VOTING_SETUP.md`
