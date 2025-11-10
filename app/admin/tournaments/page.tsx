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
    <div className="min-h-screen bg-[#0B1020]">
      <AdminNav userName="Admin" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Tournaments ({tournaments.length})</h1>
          <Link
            href="/admin/tournaments/create"
            className="px-4 py-2 bg-[#4A6CFF] text-white rounded-lg hover:bg-[#6A5CFF] transition-colors"
          >
            Create Tournament
          </Link>
        </div>

        <div className="space-y-4">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{tournament.title}</h3>
                  <p className="text-white/60 text-sm mb-2">{tournament.game}</p>
                  <p className="text-white/40 text-sm line-clamp-2">{tournament.description}</p>
                </div>
                <span
                                    className={`px-3 py-1 rounded text-xs font-medium ${
                                      tournament.status === "active"
                                        ? "bg-green-500/20 text-green-400"
                                        : tournament.status === "upcoming"
                                          ? "bg-blue-500/20 text-blue-400"
                                          : tournament.status === "ended"
                                            ? "bg-gray-500/20 text-gray-400"
                                            : "bg-red-500/20 text-red-400"
                                    }`}
                                  >
                                    {tournament.status === "ended" ? "Completed" : tournament.status}
                                  </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-white/40 text-xs mb-1">Prize Pool</p>
                  <p className="text-white font-semibold">${tournament.prize_pool.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">Start Date</p>
                  <p className="text-white text-sm">{new Date(tournament.start_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">End Date</p>
                  <p className="text-white text-sm">{new Date(tournament.end_date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={tournament.status}
                  onChange={(e) => handleStatusChange(tournament.id, e.target.value)}
                  className="px-3 py-1 bg-[#0B1020] border border-[#2a3342] text-white rounded text-sm"
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
            <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-12 text-center">
              <p className="text-white/60 mb-4">No tournaments created yet</p>
              <Link
                href="/admin/tournaments/create"
                className="inline-block px-4 py-2 bg-[#4A6CFF] text-white rounded-lg hover:bg-[#6A5CFF] transition-colors"
              >
                Create Your First Tournament
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
