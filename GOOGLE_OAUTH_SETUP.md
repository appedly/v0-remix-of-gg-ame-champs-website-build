# Google OAuth Setup Guide for GGameChamps

This guide will help you configure Google OAuth authentication for your GGameChamps platform.

## Prerequisites

- A Google Cloud Project
- Access to Google Cloud Console (https://console.cloud.google.com)
- Your Supabase project URL and API keys

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter "GGameChamps" as the project name
5. Click "CREATE"
6. Wait for the project to be created (this may take a minute)

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "ENABLE"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "CREATE CREDENTIALS" > "OAuth client ID"
3. If prompted, click "CONFIGURE CONSENT SCREEN" first
4. Choose "External" for User Type
5. Fill in the OAuth consent screen:
   - App name: "GGameChamps"
   - User support email: Your email
   - Developer contact: Your email
6. Click "SAVE AND CONTINUE"
7. On the Scopes page, click "SAVE AND CONTINUE"
8. On the Test users page, click "SAVE AND CONTINUE"
9. Review and click "BACK TO DASHBOARD"

## Step 4: Create OAuth 2.0 Client ID

1. Go back to "APIs & Services" > "Credentials"
2. Click "CREATE CREDENTIALS" > "OAuth client ID"
3. Select "Web application"
4. Name it "GGameChamps Web"
5. Under "Authorized redirect URIs", add:
   - `https://YOUR_SUPABASE_URL/auth/v1/callback?provider=google`
   - `http://localhost:3000/auth/callback` (for local development)
6. Click "CREATE"
7. Copy the "Client ID" and "Client Secret"

## Step 5: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" and click to expand
4. Toggle "Enable Sign in with Google"
5. Paste your Google Client ID in the "Client ID" field
6. Paste your Google Client Secret in the "Client Secret" field
7. Click "Save"

## Step 6: Update Redirect URLs

1. In Supabase, go to "Authentication" > "URL Configuration"
2. Add your production URL to "Redirect URLs":
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.com/signup-success`
   - `https://yourdomain.com/admin/signup-success`

## Step 7: Test Google OAuth

1. Go to your app's signup page
2. Click "Sign up with Google"
3. You should be redirected to Google's login
4. After logging in, you should be redirected back to your app

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure the redirect URI in Google Cloud Console exactly matches your Supabase callback URL
- Check for trailing slashes and protocol (http vs https)

### "Invalid Client ID" error
- Verify you copied the Client ID correctly from Google Cloud Console
- Make sure you enabled the Google+ API

### Users not being created
- Check that the invite code system is working
- Verify the user is being added to the waitlist if no invite code is provided
- Check Supabase logs for any errors

## Next Steps

- Users can now sign up with Google
- They will follow the same invite code/waitlist flow as email signups
- Test with a few users to ensure everything works correctly
