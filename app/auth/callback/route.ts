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
      if (accessCode) {
        const { data: codeData, error: codeError } = await supabase
          .from("access_codes")
          .select("*")
          .eq("code", accessCode.toUpperCase())

        if (!codeError && codeData && codeData.length > 0) {
          const accessCodeRecord = codeData[0]
          const { data: userData } = await supabase.auth.getUser()

          if (userData.user) {
            // Mark access code as used
            await supabase
              .from("access_codes")
              .update({ used_by: userData.user.id, used_at: new Date().toISOString() })
              .eq("id", accessCodeRecord.id)

            // Update user with access code
            await supabase.from("users").update({ access_code_id: accessCodeRecord.id }).eq("id", userData.user.id)
          }
        }
      } else {
        // Add to waitlist if no access code
        const { data: userData } = await supabase.auth.getUser()
        if (userData.user) {
          const { data: existingWaitlist } = await supabase
            .from("waitlist")
            .select("id")
            .eq("email", userData.user.email)

          if (existingWaitlist && existingWaitlist.length > 0) {
            await supabase
              .from("waitlist")
              .update({
                display_name: userData.user.user_metadata?.display_name || userData.user.email,
                access_code_used: false,
              })
              .eq("email", userData.user.email)
          } else {
            await supabase.from("waitlist").insert({
              email: userData.user.email,
              display_name: userData.user.user_metadata?.display_name || userData.user.email,
              access_code_used: false,
            })
          }
        }
      }

      if (isAdmin) {
        return NextResponse.redirect(`${origin}/admin/dashboard`)
      }

      return NextResponse.redirect(`${origin}/waitlist-confirmation`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
