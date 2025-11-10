"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin-nav"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    usersCount: 0,
    tournamentsCount: 0,
    submissionsCount: 0,
    waitlistCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("Admin")

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
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
        router.push("/admin/login")
        return
      }

      setUserName(userData.display_name || "Admin")

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

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {userName}!</h1>
          <p className="text-white/40 text-sm">Manage tournaments, submissions, users, and platform settings</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-6 hover:border-[#2a3342] transition-all hover:shadow-lg hover:shadow-[#4A6CFF]/5">
            <h3 className="text-white/50 text-xs font-medium uppercase tracking-wide mb-3">Total Users</h3>
            <p className="text-4xl font-bold text-white">{stats.usersCount}</p>
          </div>
          <div className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-6 hover:border-[#2a3342] transition-all hover:shadow-lg hover:shadow-[#4A6CFF]/5">
            <h3 className="text-white/50 text-xs font-medium uppercase tracking-wide mb-3">Active Tournaments</h3>
            <p className="text-4xl font-bold text-white">{stats.tournamentsCount}</p>
          </div>
          <div className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-6 hover:border-[#2a3342] transition-all hover:shadow-lg hover:shadow-[#4A6CFF]/5">
            <h3 className="text-white/50 text-xs font-medium uppercase tracking-wide mb-3">Total Submissions</h3>
            <p className="text-4xl font-bold text-white">{stats.submissionsCount}</p>
          </div>
          <div className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-6 hover:border-[#2a3342] transition-all hover:shadow-lg hover:shadow-[#4A6CFF]/5">
            <h3 className="text-white/50 text-xs font-medium uppercase tracking-wide mb-3">Waitlist</h3>
            <p className="text-4xl font-bold text-white">{stats.waitlistCount}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="/admin/tournaments"
            className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-6 hover:border-[#4A6CFF]/30 hover:shadow-lg hover:shadow-[#4A6CFF]/10 transition-all group block"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white group-hover:text-[#4A6CFF] transition-colors">Manage Tournaments</h3>
              <div className="w-2 h-2 rounded-full bg-[#4A6CFF] group-hover:scale-150 transition-transform"></div>
            </div>
            <p className="text-white/60 text-sm">Create, edit, and manage tournament schedules</p>
          </a>

          <a
            href="/admin/submissions"
            className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-6 hover:border-[#4A6CFF]/30 hover:shadow-lg hover:shadow-[#4A6CFF]/10 transition-all group block"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white group-hover:text-[#4A6CFF] transition-colors">Review Submissions</h3>
              <div className="w-2 h-2 rounded-full bg-[#4A6CFF] group-hover:scale-150 transition-transform"></div>
            </div>
            <p className="text-white/60 text-sm">Approve or reject user clip submissions</p>
          </a>

          <a
            href="/admin/users"
            className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-6 hover:border-[#4A6CFF]/30 hover:shadow-lg hover:shadow-[#4A6CFF]/10 transition-all group block"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white group-hover:text-[#4A6CFF] transition-colors">User Management</h3>
              <div className="w-2 h-2 rounded-full bg-[#4A6CFF] group-hover:scale-150 transition-transform"></div>
            </div>
            <p className="text-white/60 text-sm">View and manage user accounts</p>
          </a>

          <a
            href="/admin/settings"
            className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-6 hover:border-[#4A6CFF]/30 hover:shadow-lg hover:shadow-[#4A6CFF]/10 transition-all group block"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white group-hover:text-[#4A6CFF] transition-colors">Platform Settings</h3>
              <div className="w-2 h-2 rounded-full bg-[#4A6CFF] group-hover:scale-150 transition-transform"></div>
            </div>
            <p className="text-white/60 text-sm">Configure feature flags and platform settings</p>
          </a>
        </div>
      </main>
    </div>
  )
}
