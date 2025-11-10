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
    const adminSession = localStorage.getItem("admin_session")
    if (!adminSession) {
      router.push("/admin/login")
      return
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

    fetchSubmissions()
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

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-1">Submissions</h1>
          <p className="text-white/40 text-sm">{submissions.length} {submissions.length === 1 ? "submission" : "submissions"}</p>
        </div>
        <SubmissionList submissions={submissions} onUpdate={refreshSubmissions} />
      </main>
    </div>
  )
}
