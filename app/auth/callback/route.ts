import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const accessCode = requestUrl.searchParams.get("accessCode")
  const isAdmin = requestUrl.searchParams.get("admin")
  const origin = requestUrl.origin

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      },
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: userData } = await supabase.auth.getUser()
      
      if (userData.user) {
        // Check if user already exists in users table
        const { data: existingUser, error: existingError } = await supabase
          .from("users")
          .select("id, approved, email, founding_member")
          .eq("id", userData.user.id)
          .maybeSingle()

        // If user doesn't exist in users table, they'll be created by the trigger
        // Wait a moment for the trigger to create the user
        if (!existingUser && !existingError) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Check again after waiting
          const { data: newUser } = await supabase
            .from("users")
            .select("id, approved, email, founding_member")
            .eq("id", userData.user.id)
            .maybeSingle()
          
          if (!newUser) {
            console.error("User not created in users table")
          }
        }

        // Handle access code if provided
        if (accessCode) {
          const { data: codeData, error: codeError } = await supabase
            .from("access_codes")
            .select("*")
            .eq("code", accessCode.toUpperCase())
            .maybeSingle()

          if (!codeError && codeData) {
            // Check if code is valid and not used
            if (!codeData.used_at && (!codeData.expires_at || new Date(codeData.expires_at) > new Date())) {
              // Mark access code as used
              await supabase
                .from("access_codes")
                .update({ 
                  used_by: userData.user.id, 
                  used_at: new Date().toISOString(),
                  is_used: true 
                })
                .eq("id", codeData.id)

              // Update user with access code and approve them
              await supabase
                .from("users")
                .update({ access_code_id: codeData.id, approved: true })
                .eq("id", userData.user.id)
              
              // If user used an access code, redirect to dashboard
              if (isAdmin) {
                return NextResponse.redirect(`${origin}/admin/dashboard`)
              }
              return NextResponse.redirect(`${origin}/dashboard`)
            }
          }
        }
        
        // Check approval status again (might have been updated)
        const { data: currentUser } = await supabase
          .from("users")
          .select("approved")
          .eq("id", userData.user.id)
          .maybeSingle()
        
        // If user is already approved, redirect to dashboard
        if (currentUser?.approved) {
          if (isAdmin) {
            return NextResponse.redirect(`${origin}/admin/dashboard`)
          }
          return NextResponse.redirect(`${origin}/dashboard`)
        }
        
        // Add to waitlist if no access code and not approved
        const userEmail = userData.user.email || ""
        const displayName = userData.user.user_metadata?.display_name || userData.user.user_metadata?.full_name || userEmail.split("@")[0]
        
        const { data: existingWaitlist } = await supabase
          .from("waitlist")
          .select("id")
          .eq("email", userEmail)
          .maybeSingle()

        if (existingWaitlist) {
          // Update existing waitlist entry
          await supabase
            .from("waitlist")
            .update({
              display_name: displayName,
              user_id: userData.user.id,
              access_code_used: false,
            })
            .eq("email", userEmail)
        } else {
          // Create new waitlist entry
          await supabase.from("waitlist").insert({
            email: userEmail,
            display_name: displayName,
            user_id: userData.user.id,
            access_code_used: false,
          })
        }
      }

      // Redirect to waitlist confirmation for non-approved users
      return NextResponse.redirect(`${origin}/waitlist-confirmation`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
