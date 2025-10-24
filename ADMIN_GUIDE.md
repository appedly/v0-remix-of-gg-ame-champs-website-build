# GGameChamps Admin Portal Guide

## Accessing the Admin Portal

**URL:** `/admin/login`

**Credentials:**
- Username: `ggiscool`
- Password: `gg@coolasf17`

The admin portal uses localStorage-based authentication separate from user accounts.

---

## Admin Dashboard Overview

After logging in, you'll see the main dashboard with four key statistics:

1. **Total Users** - All registered users on the platform
2. **Active Tournaments** - Currently running tournaments
3. **Total Submissions** - All clip submissions across all tournaments
4. **Waitlist** - Early access waitlist entries

---

## Managing Tournaments

**Access:** Click "Manage Tournaments" or navigate to `/admin/tournaments`

### Creating a Tournament

1. Click "Create Tournament" button
2. Fill in the tournament details:
   - **Title:** Tournament name (e.g., "Valorant Ace Masters")
   - **Game:** Select from dropdown (Valorant, CS2, Fortnite, etc.)
   - **Description:** Detailed tournament information
   - **Prize Pool:** Amount in USD (e.g., 5000)
   - **Max Participants:** Maximum number of players
   - **Start Date:** When tournament begins
   - **End Date:** When tournament ends
   - **Status:** Draft, Active, or Completed
3. Click "Create Tournament"

### Editing a Tournament

1. Find the tournament in the list
2. Click "Edit" button
3. Modify any fields
4. Click "Update Tournament"

### Deleting a Tournament

1. Find the tournament in the list
2. Click "Delete" button
3. Confirm deletion

---

## Reviewing Submissions

**Access:** Click "Review Submissions" or navigate to `/admin/submissions`

### Submission Review Process

1. View all submissions with details:
   - User who submitted
   - Tournament name
   - Clip URL (Google Drive link)
   - Current status
   - Vote count

2. For each submission, you can:
   - **Approve:** Mark as approved (status: approved)
   - **Reject:** Mark as rejected (status: rejected)
   - **View Clip:** Click the Google Drive link to watch

### Submission Statuses

- **Pending:** Awaiting review
- **Approved:** Accepted for tournament
- **Rejected:** Not accepted

---

## User Management

**Access:** Click "User Management" or navigate to `/admin/users`

### User List Features

View all registered users with:
- Display name
- Email address
- Role (user/admin)
- Account creation date

### User Actions

Currently view-only. Future features may include:
- Banning users
- Changing user roles
- Viewing user submission history

---

## Platform Settings

**Access:** Click "Platform Settings" or navigate to `/admin/settings`

### Feature Flags

Control platform features:

1. **Pre-launch Mode**
   - When ON: Shows "Coming Soon" for tournaments
   - When OFF: Tournaments are fully functional

2. **Submissions Enabled**
   - When ON: Users can submit clips
   - When OFF: Submission form is disabled

3. **Voting Enabled**
   - When ON: Users can vote on submissions
   - When OFF: Voting is disabled

### How to Toggle Features

1. Find the feature flag
2. Click the toggle switch
3. Changes take effect immediately

---

## Best Practices

### Tournament Management

1. **Start with Draft Status:** Create tournaments as "Draft" first
2. **Set Clear Dates:** Ensure start/end dates are accurate
3. **Activate When Ready:** Change status to "Active" when ready to launch
4. **Monitor Submissions:** Regularly review pending submissions
5. **Complete Tournaments:** Change status to "Completed" when finished

### Submission Review

1. **Review Promptly:** Check submissions daily
2. **Watch Clips:** Always view the clip before approving
3. **Fair Judgment:** Apply consistent criteria
4. **Communicate:** Consider adding rejection reasons (future feature)

### Platform Settings

1. **Pre-launch Mode:** Keep ON until you have enough users
2. **Test Features:** Toggle features in staging before production
3. **Monitor Impact:** Watch user engagement after changes

---

## Common Tasks

### Launching a New Tournament

1. Go to `/admin/tournaments`
2. Click "Create Tournament"
3. Fill in all details with status "Draft"
4. Review and save
5. When ready, edit and change status to "Active"

### Processing Daily Submissions

1. Go to `/admin/submissions`
2. Filter by "Pending" status
3. Review each clip
4. Approve or reject based on criteria
5. Repeat daily

### Preparing for Launch

1. Go to `/admin/settings`
2. Create several tournaments (status: Active)
3. Turn OFF "Pre-launch Mode"
4. Ensure "Submissions Enabled" is ON
5. Ensure "Voting Enabled" is ON

---

## Logging Out

Click the "Sign Out" button in the admin navigation bar. This will:
- Clear your admin session
- Redirect you to the admin login page

---

## Security Notes

- Admin credentials are hardcoded for development
- For production, implement proper authentication
- Never share admin credentials
- Use HTTPS in production
- Consider implementing 2FA for admin accounts
