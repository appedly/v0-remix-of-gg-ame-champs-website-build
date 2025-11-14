"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin-nav"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Tournament {
  id: string
  title: string
  game: string
  description: string
  prize_pool: number
  start_date: string
  end_date: string
  status: string
  rules: string
}

export default function TournamentsPage() {
  const router = useRouter()
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (userData?.role !== "admin") {
          router.push("/admin/login")
          return
        }

        await fetchTournaments()
        setIsLoading(false)
      } else {
        // Admin session found in localStorage (hardcoded credentials)
        await fetchTournaments()
        setIsLoading(false)
      }
    }

    const fetchTournaments = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("tournaments").select("*").order("start_date", { ascending: false })
      setTournaments(data || [])
    }

    checkAuth()
  }, [router])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return

    const supabase = createClient()
    const { error } = await supabase.from("tournaments").delete().eq("id", id)

    if (!error) {
      setTournaments(tournaments.filter((t) => t.id !== id))
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("tournaments").update({ status: newStatus }).eq("id", id)

    if (!error) {
      setTournaments(tournaments.map((t) => (t.id === id ? { ...t, status: newStatus } : t)))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <AdminNav userName="Admin" />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Tournaments</h1>
            <p className="text-slate-400">{tournaments.length} total tournaments</p>
          </div>
          <Link
            href="/admin/tournaments/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Tournament
          </Link>
        </div>

        <div className="space-y-4">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{tournament.title}</h3>
                  <p className="text-slate-400 text-sm mb-2">{tournament.game}</p>
                  {tournament.description && <p className="text-slate-400 text-sm line-clamp-2">{tournament.description}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pt-4 border-t border-slate-700">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Prize Pool</p>
                  <p className="text-white font-semibold">${tournament.prize_pool.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Start Date</p>
                  <p className="text-slate-300 text-sm">{new Date(tournament.start_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">End Date</p>
                  <p className="text-slate-300 text-sm">{new Date(tournament.end_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Status</p>
                  <p className="text-slate-300 text-sm capitalize">{tournament.status}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-700">
                <select
                  value={tournament.status}
                  onChange={(e) => handleStatusChange(tournament.id, e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-600 text-slate-300 rounded-lg text-sm hover:border-slate-500 transition-colors"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(tournament.id)}
                  className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {tournaments.length === 0 && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-slate-400">●</span>
                </div>
                <p className="text-slate-300 mb-4 font-medium">No tournaments created yet</p>
                <Link
                  href="/admin/tournaments/create"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Your First Tournament
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
