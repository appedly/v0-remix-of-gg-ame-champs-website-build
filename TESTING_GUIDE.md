# Quick Testing Guide for Authentication & Access Codes

## 🧪 How to Test All Functionality

### Prerequisites
1. Ensure Supabase is configured with proper environment variables
2. Run all database migrations (scripts 001-023)
3. Create at least one admin user in the database

---

## 📋 Test Checklist

### 1️⃣ **Access Code Generation** (Admin)

**Steps:**
1. Go to `/admin/login`
2. Login as admin
3. Navigate to `/admin/access-codes`
4. Set expiry days (e.g., 30) and quantity (e.g., 5)
5. Click "Generate"

**Expected Result:**
- ✅ 5 new access codes appear in "Active Codes" section
- ✅ Each code shows expiry date
- ✅ Codes are 8 characters, uppercase, alphanumeric

**Test Data Generated:** Copy one access code for next tests

---

### 2️⃣ **Signup with Access Code** (User)

**Steps:**
1. Go to `/signup`
2. Fill in:
   - Display Name: "TestUser1"
   - Email: "testuser1@example.com"
   - Password: "SecurePass123!"
   - Confirm Password: "SecurePass123!"
   - Access Code: [paste code from step 1]
3. Click "Create Account"

**Expected Result:**
- ✅ User account created
- ✅ Redirected to `/dashboard`
- ✅ Can see dashboard content

**Verify Admin:**
1. Go to `/admin/access-codes`
2. Code should now appear in "Used Codes" section
3. Go to `/admin/users`
4. User "TestUser1" should have `approved = true`

---

### 3️⃣ **Signup without Access Code** (User)

**Steps:**
1. Go to `/signup`
2. Fill in:
   - Display Name: "TestUser2"
   - Email: "testuser2@example.com"
   - Password: "SecurePass123!"
   - Confirm Password: "SecurePass123!"
   - Access Code: [leave empty]
3. Click "Create Account"

**Expected Result:**
- ✅ User account created
- ✅ Redirected to `/waitlist-confirmation`
- ✅ See message: "Thank you for joining! We will notify you when access is available"
- ✅ See access code redemption form
- ✅ See social links (Discord, Twitter)

**Verify Admin:**
1. Go to `/admin/waitlist`
2. "TestUser2" should appear with status "pending"
3. Go to `/admin/users`
4. User "TestUser2" should have `approved = false`

---

### 4️⃣ **Redeem Access Code on Waitlist** (User)

**Prerequisites:** Complete test 3️⃣ first

**Steps:**
1. While on `/waitlist-confirmation` page (after signup without code)
2. Enter a valid access code in the "Skip the waitlist" input
3. Click "Redeem"

**Expected Result:**
- ✅ "Verifying..." shown briefly
- ✅ Redirected to `/dashboard`
- ✅ Can see dashboard content

**Verify Admin:**
1. Go to `/admin/access-codes`
2. The redeemed code should now be in "Used Codes"
3. Go to `/admin/users`
4. User "TestUser2" should now have `approved = true`
5. Go to `/admin/waitlist`
6. User still appears but can now log in

---

### 5️⃣ **Login - Approved User** (User)

**Prerequisites:** Complete test 2️⃣ or 4️⃣

**Steps:**
1. Logout if currently logged in
2. Go to `/login`
3. Enter:
   - Email: "testuser1@example.com"
   - Password: "SecurePass123!"
4. Click "Sign In"

**Expected Result:**
- ✅ Successfully logged in
- ✅ Redirected to `/dashboard`
- ✅ Can see dashboard content

---

### 6️⃣ **Login - Non-Approved User** (User)

**Prerequisites:** Complete test 3️⃣ but NOT test 4️⃣

**Steps:**
1. Logout if currently logged in
2. Go to `/login`
3. Enter:
   - Email: "testuser2@example.com" (the one without access code)
   - Password: "SecurePass123!"
4. Click "Sign In"

**Expected Result:**
- ✅ Successfully authenticated
- ✅ Redirected to `/waitlist-confirmation` (NOT dashboard)
- ✅ See waitlist message
- ✅ Can redeem access code to get immediate access

---

### 7️⃣ **Admin Approves Waitlist** (Admin)

**Prerequisites:** Have a user on waitlist (test 3️⃣)

**Steps:**
1. Login as admin
2. Go to `/admin/waitlist`
3. Find user "TestUser2" or any pending user
4. Click "Approve" button

**Expected Result:**
- ✅ Status changes to "approved" (green badge)
- ✅ "Approving..." shows briefly during request

**Verify User Can Login:**
1. Logout from admin
2. Login as the approved user
3. Should now be redirected to `/dashboard` instead of waitlist

---

### 8️⃣ **Invalid Access Code** (User)

**Steps:**
1. Go to `/signup` or `/waitlist-confirmation`
2. Enter an invalid code like "INVALID1"
3. Submit form

**Expected Result:**
- ✅ Error message: "Invalid access code"
- ✅ User not approved
- ✅ Stays on current page

---

### 9️⃣ **Expired Access Code** (Admin + User)

**Admin Steps:**
1. Go to `/admin/access-codes`
2. Generate a code with expiry = 1 day
3. **Manually update in database:** Set `expires_at` to yesterday
   ```sql
   UPDATE access_codes 
   SET expires_at = NOW() - INTERVAL '1 day' 
   WHERE code = 'YOURCODE';
   ```

**User Steps:**
1. Try to use the expired code during signup or redemption

**Expected Result:**
- ✅ Error message: "Access code has expired"
- ✅ User not approved

---

### 🔟 **Reused Access Code** (User)

**Prerequisites:** Use an access code that's already been used

**Steps:**
1. Try to signup or redeem with a used code

**Expected Result:**
- ✅ Error message: "Access code has already been used"
- ✅ User not approved

---

### 1️⃣1️⃣ **Google OAuth Signup** (User)

**Prerequisites:** Google OAuth configured in Supabase

**Steps:**
1. Go to `/signup`
2. Click "Sign up with Google"
3. Complete Google authentication

**Expected Result:**
- ✅ Redirected to `/waitlist-confirmation`
- ✅ User added to waitlist
- ✅ Can redeem access code or wait for approval

**Verify Admin:**
1. Go to `/admin/waitlist`
2. New user should appear with email from Google account
3. Go to `/admin/users`
4. User should have `approved = false`

---

### 1️⃣2️⃣ **Google OAuth Login - Approved User** (User)

**Prerequisites:** 
- Complete test 1️⃣1️⃣
- Admin has approved the user OR user redeemed access code

**Steps:**
1. Logout
2. Go to `/login`
3. Click "Sign in with Google"
4. Complete Google authentication

**Expected Result:**
- ✅ Successfully authenticated
- ✅ Redirected to `/dashboard` (NOT waitlist)
- ✅ Can see dashboard content

---

### 1️⃣3️⃣ **Revoke Access Code** (Admin)

**Steps:**
1. Login as admin
2. Go to `/admin/access-codes`
3. Find an active (unused) code
4. Click "Revoke"
5. Confirm deletion

**Expected Result:**
- ✅ Code removed from active codes list
- ✅ Code deleted from database
- ✅ Cannot be used anymore

**Verify User:**
1. Try to signup with the revoked code
2. Should get "Invalid access code" error

---

### 1️⃣4️⃣ **Reject Waitlist Entry** (Admin)

**Steps:**
1. Login as admin
2. Go to `/admin/waitlist`
3. Find a pending user
4. Click "Reject"

**Expected Result:**
- ✅ User removed from waitlist
- ✅ Entry deleted from database

**Note:** User account still exists in `auth.users` and `users` table, but they can still log in (they just get redirected to waitlist confirmation page since they're not approved)

---

### 1️⃣5️⃣ **Password Reset Flow** (User)

**Steps:**
1. Go to `/login`
2. Click "Forgot password?"
3. Enter email address
4. Check email for reset link
5. Click link in email
6. Enter new password
7. Confirm new password
8. Submit

**Expected Result:**
- ✅ Password successfully reset
- ✅ Can login with new password

---

## 🎯 Complete Flow Test (End-to-End)

**Scenario:** New user joins, gets approved, and participates

1. **Admin generates codes** → `/admin/access-codes`
2. **User signs up without code** → `/signup` (no code) → `/waitlist-confirmation`
3. **Admin reviews waitlist** → `/admin/waitlist`
4. **Admin approves user** → Click "Approve"
5. **User logs in** → `/login` → `/dashboard` ✅
6. **User submits clip** → Browse tournament → Submit
7. **User votes** → Browse tournament → Vote
8. **User checks leaderboard** → `/leaderboard`

**Alternative Path:**
1. **Admin generates codes** → `/admin/access-codes`
2. **User signs up WITH code** → `/signup` (with code) → `/dashboard` ✅
3. **User can immediately participate**

---

## ⚠️ Common Issues & Solutions

### Issue: "Invalid access code" even with valid code
**Solution:** 
- Check if code is expired
- Check if code was already used
- Verify code is uppercase (codes are case-sensitive)

### Issue: User approved but still can't access dashboard
**Solution:**
- Check `users.approved` field in database (should be `true`)
- Try logging out and logging back in
- Clear browser cookies and session

### Issue: OAuth redirect not working
**Solution:**
- Verify `NEXT_PUBLIC_APP_URL` environment variable
- Check Supabase OAuth settings for correct redirect URLs
- Ensure Google OAuth is enabled in Supabase

### Issue: Admin can't see access codes or waitlist
**Solution:**
- Verify user has `role = 'admin'` in users table
- Check RLS policies are applied correctly
- Try hardcoded admin login if available

---

## 📊 Database Queries for Verification

### Check user approval status:
```sql
SELECT email, display_name, approved, access_code_id 
FROM users 
WHERE email = 'testuser@example.com';
```

### Check access code usage:
```sql
SELECT code, used_at, used_by, expires_at 
FROM access_codes 
WHERE code = 'YOURCODE';
```

### Check waitlist entries:
```sql
SELECT email, display_name, status, created_at 
FROM waitlist 
ORDER BY created_at DESC;
```

### Find all approved users:
```sql
SELECT email, display_name, approved 
FROM users 
WHERE approved = true;
```

### Find all pending waitlist users:
```sql
SELECT w.email, w.display_name, w.status, u.approved 
FROM waitlist w
LEFT JOIN users u ON w.email = u.email
WHERE w.status = 'pending';
```

---

## ✅ Success Criteria

All features are working if:
- ✅ Build passes without errors
- ✅ Users can signup with/without access codes
- ✅ Access code validation works correctly
- ✅ Approved users can access dashboard
- ✅ Non-approved users see waitlist confirmation
- ✅ Admin can generate and manage codes
- ✅ Admin can approve/reject waitlist entries
- ✅ OAuth flows work correctly
- ✅ Password reset works
- ✅ User approval propagates correctly

**All tests passing:** Authentication system is fully functional! 🎉
