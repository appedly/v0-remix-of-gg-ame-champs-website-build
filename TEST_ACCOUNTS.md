# Test Accounts for GGameChamps

## Quick Reference

### Regular User Account
\`\`\`
Email: testuser@ggamechamps.com
Password: TestUser123!
Access: /login → /dashboard
\`\`\`

### Admin Account (Supabase Auth)
\`\`\`
Email: admin@ggamechamps.com
Password: Admin123!
Access: /admin/login → /admin/dashboard
\`\`\`

### Admin Account (Hardcoded)
\`\`\`
Username: ggiscool
Password: gg@coolasf17
Access: /admin/login → /admin/dashboard
\`\`\`

## How to Create Test Accounts

### Step 1: Disable Email Confirmation
1. Go to Supabase Dashboard
2. Authentication → Providers → Email
3. **Disable** "Confirm email"
4. Save

### Step 2: Create User Account
1. Go to `/signup`
2. Enter:
   - Display Name: `TestGamer`
   - Email: `testuser@ggamechamps.com`
   - Password: `TestUser123!`
   - Confirm Password: `TestUser123!`
3. Click "Create Account"
4. You'll be auto-logged in and redirected to `/dashboard`

### Step 3: Create Admin Account
1. Go to `/signup`
2. Enter:
   - Display Name: `Admin`
   - Email: `admin@ggamechamps.com`
   - Password: `Admin123!`
   - Confirm Password: `Admin123!`
3. Click "Create Account"

### Step 4: Set Admin Role
1. Go to Supabase Dashboard → SQL Editor
2. Run:
\`\`\`sql
SELECT set_user_role('admin@ggamechamps.com', 'admin');
\`\`\`
3. Logout and login at `/admin/login`

## Testing Checklist

### User Flow
- [ ] Sign up at `/signup`
- [ ] Login at `/login`
- [ ] View dashboard at `/dashboard`
- [ ] Browse tournaments at `/tournaments`
- [ ] Submit a clip to a tournament
- [ ] Vote on other submissions
- [ ] View leaderboard at `/leaderboard`
- [ ] Check your submissions at `/submissions`

### Admin Flow
- [ ] Login at `/admin/login` (use either account)
- [ ] View admin dashboard statistics
- [ ] Create a new tournament
- [ ] Edit existing tournament
- [ ] Review pending submissions
- [ ] Approve/reject submissions
- [ ] View all users
- [ ] Toggle feature flags in settings

## Notes

- **No email verification required** when email confirmation is disabled
- **Instant login** after signup
- **Hardcoded admin** works without database setup
- **Supabase admin** requires role to be set via SQL
