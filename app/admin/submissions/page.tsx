"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin-nav"
import { SubmissionList } from "@/components/submission-list"

type Submission = {
  id: string
  video_url: string
  title: string
  description: string | null
  status: string
  created_at: string
  user: { display_name: string; email: string }
  tournament: { title: string; game: string }
}

export default function SubmissionsPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
        .select("role")
        .eq("id", session.user.id)
        .single()

      if (userData?.role !== "admin") {
        // Clear localStorage and redirect if not admin
        localStorage.removeItem("admin_session")
        await supabase.auth.signOut()
        router.push("/admin/login")
        return
      }

      // If all checks pass, fetch submissions
      await fetchSubmissions()
    }

    const fetchSubmissions = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("submissions")
        .select(
          `
          *,
          user:users(display_name, email),
          tournament:tournaments(title, game)
        `,
        )
        .order("created_at", { ascending: false })

      setSubmissions(data || [])
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const refreshSubmissions = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("submissions")
      .select(
        `
        *,
        user:users(display_name, email),
        tournament:tournaments(title, game)
      `,
      )
      .order("created_at", { ascending: false })

    setSubmissions(data || [])
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <AdminNav userName="Admin" />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Submissions ({submissions.length})</h1>
        <SubmissionList submissions={submissions} onUpdate={refreshSubmissions} />
      </main>
    </div>
  )
}
