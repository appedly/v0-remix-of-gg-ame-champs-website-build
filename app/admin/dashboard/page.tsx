"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAdminAuth } from "@/lib/admin-auth"
import { AdminNav } from "@/components/admin-nav"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { handleAuthFailure, checkAuth } = useAdminAuth()
  const [stats, setStats] = useState({
    usersCount: 0,
    tournamentsCount: 0,
    submissionsCount: 0,
    waitlistCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("Admin")

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const authResult = await checkAuth()
        if (!authResult.success) {
          await handleAuthFailure(authResult.error)
          return
        }

        // Get user data and stats
        const supabase = createClient()
        const { data: userData } = await supabase
          .from("users")
          .select("display_name")
          .eq("id", authResult.userId)
          .single()

        setUserName(userData?.display_name || "Admin")

        // Fetch stats
        const [users, tournaments, submissions, waitlist] = await Promise.all([
          supabase.from("users").select("*", { count: "exact", head: true }),
          supabase.from("tournaments").select("*", { count: "exact", head: true }).eq("status", "active"),
          supabase.from("submissions").select("*", { count: "exact", head: true }),
          supabase.from("waitlist").select("*", { count: "exact", head: true }),
        ])

        setStats({
          usersCount: users.count || 0,
          tournamentsCount: tournaments.count || 0,
          submissionsCount: submissions.count || 0,
          waitlistCount: waitlist.count || 0,
        })
        setIsLoading(false)
      } catch (error) {
        console.error("[Dashboard] Error initializing:", error)
        await handleAuthFailure("Dashboard initialization failed")
      }
    }

    initializeDashboard()
  }, [router, checkAuth, handleAuthFailure])

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

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Welcome back, {userName}!</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6">
            <h3 className="text-white/60 text-sm mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-white">{stats.usersCount}</p>
          </div>
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6">
            <h3 className="text-white/60 text-sm mb-2">Active Tournaments</h3>
            <p className="text-3xl font-bold text-white">{stats.tournamentsCount}</p>
          </div>
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6">
            <h3 className="text-white/60 text-sm mb-2">Total Submissions</h3>
            <p className="text-3xl font-bold text-white">{stats.submissionsCount}</p>
          </div>
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6">
            <h3 className="text-white/60 text-sm mb-2">Waitlist</h3>
            <p className="text-3xl font-bold text-white">{stats.waitlistCount}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="/admin/tournaments"
            className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 hover:border-[#4A6CFF] transition-colors group block"
          >
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#4A6CFF]">Manage Tournaments</h3>
            <p className="text-white/60">Create, edit, and manage tournament schedules</p>
          </a>

          <a
            href="/admin/submissions"
            className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 hover:border-[#4A6CFF] transition-colors group block"
          >
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#4A6CFF]">Review Submissions</h3>
            <p className="text-white/60">Approve or reject user clip submissions</p>
          </a>

          <a
            href="/admin/users"
            className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 hover:border-[#4A6CFF] transition-colors group block"
          >
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#4A6CFF]">User Management</h3>
            <p className="text-white/60">View and manage user accounts</p>
          </a>

          <a
            href="/admin/settings"
            className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 hover:border-[#4A6CFF] transition-colors group block"
          >
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#4A6CFF]">Platform Settings</h3>
            <p className="text-white/60">Configure feature flags and platform settings</p>
          </a>
        </div>
      </main>
    </div>
  )
}
