"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signup(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const displayName = formData.get("displayName") as string
  const accessCode = formData.get("accessCode") as string

  if (!email || !password || !displayName) {
    return { error: "Email, password, and display name are required" }
  }

  const supabase = await createClient()

  if (accessCode) {
    const { data: codeData, error: codeError } = await supabase
      .from("access_codes")
      .select("*")
      .eq("code", accessCode.toUpperCase())

    if (codeError || !codeData || codeData.length === 0) {
      return { error: "Invalid access code" }
    }

    const code = codeData[0]
    if (code.used_at) {
      return { error: "Access code has already been used" }
    }

    if (code.expires_at && new Date(code.expires_at) < new Date()) {
      return { error: "Access code has expired" }
    }
  }

  const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000"

  // Sign up user with display_name in metadata
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
      emailRedirectTo: `${redirectUrl}/auth/callback?accessCode=${accessCode || ""}`,
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: "Failed to create user" }
  }

  redirect("/confirmation-waitlist")
}
