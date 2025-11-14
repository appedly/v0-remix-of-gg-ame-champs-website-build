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
      // Check for admin_session flag set by hardcoded login
      const adminSession = localStorage.getItem("admin_session")
      
      if (!adminSession) {
        // Fallback to checking Supabase auth
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
      } else {
        // Admin session found in localStorage (hardcoded credentials)
        setUserName("Admin")
        
        // Fetch stats
        const supabase = createClient()
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
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <AdminNav userName={userName} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {userName}!</h1>
          <p className="text-slate-400">Manage your platform from here</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-slate-500 text-xs uppercase tracking-wide mb-3 font-medium">Total Users</h3>
            <p className="text-3xl font-bold text-white">{stats.usersCount}</p>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-slate-500 text-xs uppercase tracking-wide mb-3 font-medium">Active Tournaments</h3>
            <p className="text-3xl font-bold text-white">{stats.tournamentsCount}</p>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-slate-500 text-xs uppercase tracking-wide mb-3 font-medium">Total Submissions</h3>
            <p className="text-3xl font-bold text-white">{stats.submissionsCount}</p>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <h3 className="text-slate-500 text-xs uppercase tracking-wide mb-3 font-medium">Waitlist</h3>
            <p className="text-3xl font-bold text-white">{stats.waitlistCount}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="/admin/tournaments"
            className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all group block"
          >
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Manage Tournaments</h3>
            <p className="text-slate-400">Create, edit, and manage tournament schedules</p>
          </a>

          <a
            href="/admin/submissions"
            className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all group block"
          >
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Review Submissions</h3>
            <p className="text-slate-400">Approve or reject user clip submissions</p>
          </a>

          <a
            href="/admin/users"
            className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all group block"
          >
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">User Management</h3>
            <p className="text-slate-400">View and manage user accounts</p>
          </a>

          <a
            href="/admin/settings"
            className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all group block"
          >
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Platform Settings</h3>
            <p className="text-slate-400">Configure feature flags and platform settings</p>
          </a>
        </div>
      </main>
    </div>
  )
}
