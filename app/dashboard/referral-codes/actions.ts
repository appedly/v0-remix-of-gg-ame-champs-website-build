"use server"

import { createClient } from "@/lib/supabase/server"

export async function generateAccessCode(userId: string) {
  const supabase = await createClient()

  try {
    // Call the Supabase function
    const { data, error } = await supabase.rpc("create_user_access_code", {
      user_id: userId,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, code: data?.[0]?.code }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
