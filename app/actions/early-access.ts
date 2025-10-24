"use server"

import { createClient } from "@/lib/supabase/server"

export async function registerEarlyAccess(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
      data: {
        role: "user",
        early_access: true,
      },
    },
  })

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "This email is already registered!" }
    }
    return { error: error.message }
  }

  if (data.user) {
    return { success: true }
  }

  return { error: "Failed to create account" }
}
