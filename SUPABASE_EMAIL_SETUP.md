# Supabase Email Configuration Guide

This guide will help you configure Supabase to send email verification links properly.

## Important: Email Confirmation Must Be Enabled

For the authentication flow to work correctly, you **must** enable email confirmation in Supabase.

## Step 1: Configure Email Settings

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers** → **Email**
3. Configure the following settings:
   - **Enable email provider**: ON
   - **Confirm email**: **ENABLED** (This is critical!)
   - **Secure email change**: ENABLED (recommended)

## Step 2: Set Site URL and Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Set the **Site URL**:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
3. Add **Redirect URLs** (one per line):
   \`\`\`
   http://localhost:3000/auth/callback
   http://localhost:3000/dashboard
   https://yourdomain.com/auth/callback
   https://yourdomain.com/dashboard
   \`\`\`

## Step 3: Configure Email Templates (Optional)

1. Navigate to **Authentication** → **Email Templates**
2. Select **Confirm signup** template
3. You can customize the email template if desired
4. Make sure the `{{ .ConfirmationURL }}` variable is present in the template

## Step 4: Test the Email Flow

1. Go to your app and sign up with a test email
2. Check your inbox for the verification email
3. Click the verification link
4. You should be redirected to `/auth/callback` and then to `/dashboard`

## Troubleshooting

### Emails Not Sending

- **Check Supabase email rate limits**: Free tier has limited email sends
- **Verify email provider is enabled**: Go to Authentication → Providers → Email
- **Check spam folder**: Verification emails might be filtered

### "Confirm email" is disabled

If you see this message, it means email confirmation is turned off. You must enable it:
1. Go to **Authentication** → **Providers** → **Email**
2. Toggle **Confirm email** to **ENABLED**

### Redirect not working

- Verify your redirect URLs are added in **Authentication** → **URL Configuration**
- Make sure the `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` environment variable is set for development
- Check that `/auth/callback` route exists in your app

## Environment Variables

Make sure these environment variables are set:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
\`\`\`

## Production Setup

For production:
1. Update Site URL to your production domain
2. Add production redirect URLs
3. Consider using a custom SMTP provider for better email deliverability
4. Monitor email sending in Supabase dashboard under **Authentication** → **Users**
