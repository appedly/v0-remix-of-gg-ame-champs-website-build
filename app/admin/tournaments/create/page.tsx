"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin-nav"
import { TournamentForm } from "@/components/tournament-form"

export default function CreateTournamentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("Admin")

  useEffect(() => {
    const checkAuth = async () => {
      // Check localStorage admin session first
      const adminSession = localStorage.getItem("admin_session")
      if (!adminSession) {
        router.push("/admin/login")
        return
      }

      // Then verify Supabase auth session
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        // Clear localStorage if no Supabase session
        localStorage.removeItem("admin_session")
        router.push("/admin/login")
        return
      }

      // Verify admin role
      const { data: userData } = await supabase
        .from("users")
        .select("role, display_name")
        .eq("id", session.user.id)
        .single()

      if (userData?.role !== "admin") {
        // Clear localStorage and redirect if not admin
        localStorage.removeItem("admin_session")
        await supabase.auth.signOut()
        router.push("/admin/login")
        return
      }

      setUserName(userData.display_name || "Admin")
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <AdminNav userName={userName} />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-8">Create Tournament</h1>
        <TournamentForm />
      </main>
    </div>
  )
}
