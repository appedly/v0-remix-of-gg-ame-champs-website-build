# GGameChamps Setup & Usage Guide

## Quick Start

### 1. Database Setup

Run the SQL scripts in order from the `scripts/` folder:

1. `001_create_users_table.sql` - Creates users table
2. `002_create_tournaments_table.sql` - Creates tournaments table
3. `003_create_submissions_table.sql` - Creates submissions table
4. `004_create_votes_table.sql` - Creates votes table
5. `005_create_feature_flags_table.sql` - Creates feature flags table
6. `006_create_waitlist_table.sql` - Creates waitlist table
7. `007_create_test_accounts.sql` - Creates helper function for roles

### 2. Disable Email Confirmation (For Testing)

**Important:** For local development and testing, you need to disable email confirmation in Supabase:

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers** → **Email**
3. **Disable** "Confirm email" option
4. Click **Save**

This allows users to sign up and login immediately without email verification.

### 3. Create Test Accounts

#### Test User Account
- **Email:** `testuser@ggamechamps.com`
- **Password:** `TestUser123!`
- **Role:** User

**To create:**
1. Go to `/signup` on your site
2. Fill in the form with the above credentials
3. Display Name: `TestGamer`
4. Click "Create Account"
5. You'll be automatically logged in and redirected to `/dashboard`

#### Admin Account
- **Email:** `admin@ggamechamps.com`  
- **Password:** `Admin123!`
- **Role:** Admin

**To create:**
1. Go to `/signup` on your site
2. Fill in the form with the above credentials
3. Display Name: `Admin`
4. Click "Create Account"

**To set admin role:**
1. Go to Supabase Dashboard → **SQL Editor**
2. Run this command:
\`\`\`sql
SELECT set_user_role('admin@ggamechamps.com', 'admin');
\`\`\`
3. Logout and login again at `/admin/login`

#### Hardcoded Admin Login (Alternative)
The admin panel at `/admin` also accepts these hardcoded credentials:
- **Username:** `ggiscool`
- **Password:** `gg@coolasf17`

## User Features

### For Regular Users

1. **Sign Up** (`/signup`)
   - Create account with email and password
   - Choose a display name (gamer tag)
   - Automatically logged in after signup

2. **Login** (`/login`)
   - Sign in with email and password
   - Redirected to dashboard

3. **Dashboard** (`/dashboard`)
   - View your profile stats
   - See active tournaments
   - Track your submissions
   - View leaderboard rankings

4. **Tournaments** (`/tournaments`)
   - Browse all tournaments (Active, Upcoming, Completed)
   - Filter by game
   - View tournament details

5. **Submit Clips** (`/tournaments/[id]`)
   - Upload your gaming clips via Google Drive link
   - Add title and description
   - Submit to active tournaments

6. **Vote on Submissions** (`/tournaments/[id]`)
   - View other players' submissions
   - Vote for your favorites
   - See vote counts

7. **My Submissions** (`/submissions`)
   - Track all your submissions
   - See status (pending, approved, rejected)
   - View vote counts

8. **Leaderboard** (`/leaderboard`)
   - See top players by votes
   - View rankings and stats

## Admin Features

### Admin Panel Access

**Option 1: Supabase Auth Admin**
- URL: `/admin/login`
- Email: `admin@ggamechamps.com`
- Password: `Admin123!`
- Must have `role: 'admin'` in user metadata

**Option 2: Hardcoded Admin**
- URL: `/admin/login`
- Username: `ggiscool`
- Password: `gg@coolasf17`

### Admin Dashboard (`/admin/dashboard`)

**Statistics Overview:**
- Total Users count
- Active Tournaments count
- Total Submissions count
- Waitlist entries count

**Navigation:**
- Dashboard - Overview and stats
- Tournaments - Manage tournaments
- Submissions - Review and moderate
- Users - View all users
- Settings - Platform configuration

### Tournament Management (`/admin/tournaments`)

**View Tournaments:**
- See all tournaments with status
- Filter by status (draft, active, completed)
- View participant counts

**Create Tournament:**
1. Click "Create Tournament"
2. Fill in details:
   - Title
   - Description
   - Game
   - Prize pool
   - Start and end dates
   - Max participants
   - Rules
3. Set status (draft/active)
4. Click "Create Tournament"

**Edit Tournament:**
1. Click "Edit" on any tournament
2. Update details
3. Change status
4. Save changes

**Delete Tournament:**
1. Click "Delete" on any tournament
2. Confirm deletion
3. All associated submissions will be affected

### Submission Review (`/admin/submissions`)

**View Submissions:**
- See all submissions across tournaments
- Filter by status (pending, approved, rejected)
- View submission details and clips

**Moderate Submissions:**
1. Click on a submission
2. Review the clip (Google Drive link)
3. Actions:
   - **Approve** - Makes submission visible and votable
   - **Reject** - Hides submission from tournament
   - **Delete** - Permanently removes submission

**Bulk Actions:**
- Select multiple submissions
- Approve/reject in bulk

### User Management (`/admin/users`)

**View Users:**
- See all registered users
- View user details (email, display name, role)
- See registration dates

**User Actions:**
- View user profile
- See user's submissions
- Check user activity

### Platform Settings (`/admin/settings`)

**Feature Flags:**
- Enable/disable tournaments
- Enable/disable submissions
- Enable/disable voting
- Maintenance mode

**Configuration:**
- Update platform settings
- Manage game list
- Configure prize pools

## Email Configuration (Optional)

If you want to enable email verification:

1. **Configure Supabase Email:**
   - Go to Supabase Dashboard → **Authentication** → **Email Templates**
   - Customize the verification email template
   - Use the provided `email-templates/verification.html` as reference

2. **Enable Email Confirmation:**
   - Go to **Authentication** → **Providers** → **Email**
   - **Enable** "Confirm email"
   - Save changes

3. **Update Code:**
   - Remove the auto-login code from signup pages
   - Users will need to verify email before accessing dashboard

## Troubleshooting

### "Email not confirmed" error
- Disable email confirmation in Supabase (see step 2 above)
- Or verify email through Supabase dashboard

### Can't access admin panel
- Make sure you've set the admin role using the SQL command
- Or use the hardcoded credentials: `ggiscool` / `gg@coolasf17`

### Submissions not showing
- Check if tournament is "active"
- Verify submission was approved by admin
- Check RLS policies in Supabase

### Can't vote on submissions
- Make sure you're logged in
- Can't vote on your own submissions
- Check if tournament is still active

## Development

### Local Development
\`\`\`bash
npm install
npm run dev
\`\`\`

### Environment Variables
Required in Vercel or `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (for local dev)

### Deployment
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

## Support

For issues or questions:
1. Check this guide first
2. Review Supabase logs
3. Check browser console for errors
4. Contact support at support@ggamechamps.com
