# Automated Google OAuth Setup

To automatically configure Google OAuth without manual steps, follow this process:

## Using Supabase CLI

If you have the Supabase CLI installed, you can use environment variables to configure OAuth:

\`\`\`bash
# Set your Google OAuth credentials
export GOOGLE_CLIENT_ID="your-client-id-here"
export GOOGLE_CLIENT_SECRET="your-client-secret-here"

# These will be automatically picked up by Supabase
\`\`\`

## Environment Variables

Add these to your Vercel project settings:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

## Verification

To verify Google OAuth is working:

1. Check the Supabase dashboard under Authentication > Providers
2. Ensure Google is enabled with valid credentials
3. Test the OAuth flow on your signup page

## Support

If you encounter issues:
1. Check the Supabase logs in the dashboard
2. Verify all redirect URIs are correct
3. Ensure the Google Cloud project has the Google+ API enabled
4. Check that the OAuth consent screen is configured
