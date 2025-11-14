# 📸 Visual Setup Guide - Screenshots & Steps

This guide shows you **exactly** what to click and where to paste code.

---

## 🎯 Part 1: Access Supabase (2 minutes)

### Step 1: Go to Supabase

```
1. Open browser
2. Go to: https://supabase.com
3. Click "Sign In"
```

**What you should see:**
```
┌────────────────────────────────────────┐
│  Supabase Dashboard                    │
├────────────────────────────────────────┤
│                                        │
│  Your Projects:                        │
│                                        │
│  ┌──────────────────────────────┐    │
│  │  GGameChamps Project          │    │
│  │  PostgreSQL • Active          │    │
│  └──────────────────────────────┘    │
│                                        │
└────────────────────────────────────────┘
```

### Step 2: Open SQL Editor

```
1. Click your project name
2. Look at left sidebar
3. Find "SQL Editor" (has a database icon)
4. Click it
```

**What you should see:**
```
┌────────────────────────────────────────┐
│  SQL Editor                            │
├────────────────────────────────────────┤
│                                        │
│  [+ New query]  [Templates ▼]         │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ -- Write your SQL here           │ │
│  │                                  │ │
│  │                                  │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  [Run] [Save]                          │
└────────────────────────────────────────┘
```

---

## 🎯 Part 2: Run Voting System Script (3 minutes)

### Step 3: Create New Query

```
1. Click "+ New query" button (top left)
2. You'll see empty editor
```

### Step 4: Copy the Voting Script

```
1. Open this file on your computer:
   scripts/024_update_voting_system.sql

2. Select ALL text (Ctrl+A or Cmd+A)

3. Copy (Ctrl+C or Cmd+C)
```

**The file should start with:**
```sql
-- Update voting system for ranked voting (1st, 2nd, 3rd place)
-- 1st place = 3 points, 2nd place = 2 points, 3rd place = 1 point
```

### Step 5: Paste and Run

```
1. Go back to Supabase SQL Editor

2. Click in the query box

3. Paste (Ctrl+V or Cmd+V)

4. Click "Run" button (bottom right)
   OR press Ctrl+Enter (Windows) or Cmd+Enter (Mac)
```

**What you should see after clicking Run:**
```
┌────────────────────────────────────────┐
│  Results                               │
├────────────────────────────────────────┤
│  ✓ Success                            │
│  Rows: 0                               │
│  Time: 45ms                            │
└────────────────────────────────────────┘
```

✅ **Success!** The voting system is now installed.

---

## 🎯 Part 3: Add Founding Members (2 minutes)

### Step 6: Create Another New Query

```
1. Click "+ New query" again
2. Empty editor appears
```

### Step 7: Paste Founding Member Script

```
1. Copy this text:
```

```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS founding_member BOOLEAN DEFAULT FALSE;

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

SELECT mark_founding_members();
```

```
2. Paste into SQL Editor

3. Click "Run"
```

**What you should see:**
```
┌────────────────────────────────────────┐
│  Results                               │
├────────────────────────────────────────┤
│  ✓ Success                            │
│  Rows returned: 0                      │
│  Time: 120ms                           │
└────────────────────────────────────────┘
```

✅ **Success!** First 50 users are now founding members.

---

## 🎯 Part 4: Verify Setup (2 minutes)

### Step 8: Check if Everything Works

```
1. Click "+ New query" one more time

2. Copy and paste this verification script:
```

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
  )::text as check_4;
```

```
3. Click "Run"
```

**What you WANT to see:**
```
┌────────────────────────────────────────────────────────┐
│  Results                                               │
├────────────────────────────────────────────────────────┤
│  check_1: Votes table has rank column: true          │
│  check_2: Founding member column exists: true        │
│  check_3: Trigger exists: true                       │
│  check_4: Likes table exists: true                   │
└────────────────────────────────────────────────────────┘
```

✅ **All true = Perfect!**

❌ **If any say 'false':**
- Go to [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Find the issue and follow the fix

---

## 🎯 Part 5: Deploy Code (3 minutes)

### Step 9: Push Code to GitHub

**Open Terminal/Command Prompt on your computer:**

```bash
# Navigate to your project folder
cd path/to/your/project

# Check what changed
git status

# Add all changes
git add .

# Commit changes
git commit -m "Add ranked voting system and founding member badges"

# Push to GitHub
git push origin main
```

**What you should see:**
```
Enumerating objects: 12, done.
Counting objects: 100% (12/12), done.
Writing objects: 100% (8/8), 2.45 KiB | 2.45 MiB/s, done.
To github.com:yourusername/ggamechamps.git
   abc1234..def5678  main -> main
```

✅ **Code pushed successfully!**

### Step 10: Check Vercel Deployment

```
1. Go to: https://vercel.com

2. Sign in

3. Click your project

4. You should see "Building..." or "Ready"
```

**What you should see:**
```
┌────────────────────────────────────────┐
│  GGameChamps                           │
├────────────────────────────────────────┤
│                                        │
│  Production Deployment                 │
│  ● Building...                         │
│                                        │
│  Latest Commit:                        │
│  Add ranked voting system              │
│  2 minutes ago                         │
│                                        │
└────────────────────────────────────────┘
```

**Wait for it to say:**
```
│  ✓ Ready                              │
│  https://your-site.vercel.app         │
```

✅ **Deployment complete!**

---

## 🎯 Part 6: Test It Works (5 minutes)

### Step 11: Open Your Website

```
1. Go to your website URL
2. Log in (or sign up if new)
```

### Step 12: Test Voting

```
1. Go to "Tournaments" page

2. Click on an active tournament

3. What you should see:
```

**If you have NO submission yet:**
```
┌────────────────────────────────────────────────────┐
│  Amazing Headshot Clip              by ProGamer     │
│  ──────────────────────────────────────────────────│
│  Watch Video → | 🏆 5 pts | ❤️ 3 |                 │
│  "Submit an approved clip to vote"                  │
└────────────────────────────────────────────────────┘
```

**If you have APPROVED submission:**
```
┌────────────────────────────────────────────────────┐
│  Amazing Headshot Clip              by ProGamer     │
│  ──────────────────────────────────────────────────│
│  Watch Video → | 🏆 5 | ❤️ 3 | [1st] [2nd] [3rd] │
└────────────────────────────────────────────────────┘
       ↑
   Click these!
```

### Step 13: Click Vote Button

```
1. Click "1st" button (if you have approved clip)

2. Button should turn yellow/gold

3. Points should increase by 3

4. Page refreshes automatically
```

**Before clicking:**
```
| 🏆 5 pts | [1st] [2nd] [3rd] |
```

**After clicking 1st place:**
```
| 🏆 8 pts | [🥇 1st] [2nd] [3rd] |
              ↑ highlighted in gold
```

✅ **Voting works!**

### Step 14: Test Likes

```
1. Click the ❤️ (heart) button

2. Heart should fill in

3. Number should increase
```

**Before:**
```
| ❤️ 3 |
```

**After:**
```
| ❤️ 4 |
  ↑ filled/pink
```

✅ **Likes work!**

### Step 15: Check Profile

```
1. Click your username (top right)

2. Select "Profile"

3. Scroll to top
```

**If you're a founding member (first 50 users):**
```
┌────────────────────────────────────────────────────┐
│  Profile Settings      [👑 FOUNDING MEMBER]         │
│  ──────────────────────────────────────────────────│
│                                                     │
│  ┌────────────────────────────────────────────┐   │
│  │  👑  Founding Member                        │   │
│  │                                              │   │
│  │  You're one of the first 50 members!       │   │
│  │  [⚡ Early Supporter] [🏆 Community Pioneer]│   │
│  └────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

✅ **Profile looks great!**

---

## 🎉 You're Done!

### ✅ Everything Working Checklist

- [ ] Clicked "Run" on voting script ✓
- [ ] Clicked "Run" on founding member script ✓
- [ ] Ran verification query (all true) ✓
- [ ] Pushed code to GitHub ✓
- [ ] Vercel deployed successfully ✓
- [ ] Can see voting buttons on tournament page ✓
- [ ] Can vote and points increase ✓
- [ ] Can like submissions ✓
- [ ] Profile shows correct badges ✓

---

## 🐛 Something Not Working?

### Quick Fixes

**Can't see voting buttons:**
```
→ Do you have an approved submission?
→ Ask admin to approve your clip
→ Refresh the page (Ctrl+F5)
```

**Vote doesn't increase score:**
```
→ Go back to Supabase SQL Editor
→ Re-run the voting script from Step 4
→ Try voting again
```

**No founding member badge:**
```
→ Check if you're in first 50 users
→ Run: SELECT * FROM users WHERE id = 'YOUR_ID'
→ If founding_member = false, you're not in first 50
```

**Detailed troubleshooting:**
👉 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 📞 Still Stuck?

1. **Take screenshots** of:
   - SQL Editor after running scripts
   - Any error messages
   - Browser console (F12 → Console)

2. **Check these:**
   - [ ] All 3 SQL scripts ran successfully
   - [ ] Code is pushed to GitHub
   - [ ] Vercel shows "Ready"
   - [ ] Browser cache cleared

3. **Review:**
   - [QUICK_SETUP_CHECKLIST.md](./QUICK_SETUP_CHECKLIST.md)
   - [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 🎮 Enjoy Your New Voting System!

Your users can now:
- 🏆 Vote 1st, 2nd, 3rd place (3-2-1 points)
- ❤️ Like any submission
- 👑 See founding member badges
- 📊 View rankings by points

Good luck with your tournaments! 🚀
