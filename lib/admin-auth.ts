import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export async function checkAdminAuth(): Promise<{ success: boolean; userId?: string; error?: string }> {
  // Check localStorage admin session first
  const adminSession = localStorage.getItem("admin_session")
  if (!adminSession) {
    return { success: false, error: "No admin session found" }
  }

  // Then verify Supabase auth session
  const supabase = createClient()
  
  // Wait a moment for session to be available
  let attempts = 0
  let session = null
  
  while (attempts < 3 && !session) {
    const { data: sessionData } = await supabase.auth.getSession()
    session = sessionData.session
    if (!session) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }
  }

  if (!session) {
    // Clear localStorage if no Supabase session
    localStorage.removeItem("admin_session")
    return { success: false, error: "No Supabase session found" }
  }

  // Verify admin role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single()

  if (userError || userData?.role !== "admin") {
    // Clear localStorage and sign out if not admin
    localStorage.removeItem("admin_session")
    await supabase.auth.signOut()
    return { success: false, error: userError ? "Error verifying admin role" : "Not an admin user" }
  }

  return { success: true, userId: session.user.id }
}

export function useAdminAuth() {
  const router = useRouter()

  const redirectToLogin = () => {
    router.push("/admin/login")
  }

  const handleAuthFailure = async (error?: string) => {
    console.error("[Admin Auth] Authentication failed:", error)
    const supabase = createClient()
    localStorage.removeItem("admin_session")
    await supabase.auth.signOut()
    redirectToLogin()
  }

  return {
    checkAuth: checkAdminAuth,
    handleAuthFailure,
    redirectToLogin
  }
}