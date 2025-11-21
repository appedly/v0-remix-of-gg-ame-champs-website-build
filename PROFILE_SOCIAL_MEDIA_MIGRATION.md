# Profile Social Media Migration

## Overview
This migration adds social media fields to user profiles, allowing users to connect their Twitter/X, Discord, and YouTube accounts.

## What's New

### Database Changes
- Added `twitter_url` column to `users` table
- Added `discord_username` column to `users` table
- Added `youtube_url` column to `users` table

### UI Improvements
1. **Profile Edit Page (`/profile`):**
   - New "Social Media" card for adding social links
   - Input fields for Twitter/X URL, Discord username, and YouTube URL

2. **Profile View Page (`/profile/[userId]`):**
   - Beautiful gradient pattern cover image (no more solid void)
   - Avatar now overlaps cover by ~40% with thicker border
   - Social media icons displayed below bio
   - "Edit Profile" button for own profile
   - Prominent "Founding Member" badge for verified users
   - Blue verified checkmark badge next to username
   - Improved tab design with filled active state
   - Icons added to stats for better visual hierarchy
   - Compact stats cards in 3-column grid

## How to Apply the Migration

### Step 1: Go to Supabase Dashboard

1. Open your Supabase project: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the Migration SQL

1. Click **+ New Query** button
2. Copy the entire SQL from `scripts/031_add_social_media_to_users.sql`:

```sql
-- Add social media fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS twitter_url TEXT,
ADD COLUMN IF NOT EXISTS discord_username TEXT,
ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.users.twitter_url IS 'Twitter/X profile URL';
COMMENT ON COLUMN public.users.discord_username IS 'Discord username or URL';
COMMENT ON COLUMN public.users.youtube_url IS 'YouTube channel URL';
```

3. Paste it into the SQL editor
4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

### Step 3: Verify Success

You should see a message like:
```
Query executed successfully. Rows returned: 0
```

## How to Test

### 1. Edit Your Profile
1. Navigate to `/profile`
2. Scroll down to the "Social Media" section
3. Add your social media links:
   - Twitter/X: `https://twitter.com/username`
   - Discord: `username#1234` or full username
   - YouTube: `https://youtube.com/@channel`
4. Click "Save Changes"

### 2. View Your Profile
1. Navigate to any page with your username link (leaderboard, submissions, etc.)
2. Click on your username
3. You should see:
   - Beautiful gradient cover image
   - Avatar overlapping the cover
   - Your social media icons below your bio
   - Blue verification badge if you're a founding member
   - "Founding Member" badge prominently displayed

### 3. View Other Profiles
1. Click on another user's name
2. If they've added social links, you'll see their icons
3. Click the icons to visit their social profiles

## Visual Changes

### Cover Banner
- **Before:** Solid dark gradient
- **After:** Blue geometric grid pattern with gradient overlay

### Avatar
- **Before:** Sits on background, 4px border
- **After:** Overlaps cover by 50px, 6px border, gradient background

### Social Media Icons
- **Twitter/X:** Blue hover effect
- **Discord:** Purple hover effect, shows username
- **YouTube:** Red hover effect

### Tabs
- **Before:** Underline style
- **After:** Pill style with filled blue background for active tab

### Stats
- **Before:** Text only
- **After:** Icons with colored indicators (Trophy, Heart, Award, FileVideo)

## Troubleshooting

### Social media links not saving
1. Check browser console for errors
2. Verify the migration ran successfully
3. Check Supabase table browser to confirm columns exist

### Icons not showing
1. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache
3. Verify the user has actually added social media links

### Profile looks broken
1. Clear browser cache
2. Check if migration ran successfully
3. Verify all users have `founding_member` field (boolean)

## Related Files

- Migration: `scripts/031_add_social_media_to_users.sql`
- Profile Edit: `app/profile/page.tsx`
- Profile View: `components/profile-view.tsx`
- Profile Route: `app/profile/[userId]/page.tsx`
