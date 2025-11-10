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
    const adminSession = localStorage.getItem("admin_session")
    if (!adminSession) {
      router.push("/admin/login")
      return
    }

    const fetchTournaments = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("tournaments").select("*").order("start_date", { ascending: false })
      setTournaments(data || [])
      setIsLoading(false)
    }

    fetchTournaments()
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

      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">Tournaments</h1>
            <p className="text-white/40 text-sm">{tournaments.length} {tournaments.length === 1 ? "tournament" : "tournaments"}</p>
          </div>
          <Link
            href="/admin/tournaments/create"
            className="px-4 py-2 bg-[#4A6CFF] text-white rounded-lg hover:bg-[#6A5CFF] transition-all hover:shadow-lg hover:shadow-[#4A6CFF]/20 font-medium"
          >
            Create Tournament
          </Link>
        </div>

        <div className="space-y-4">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-gradient-to-r from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-6 hover:border-[#2a3342] transition-all hover:shadow-lg hover:shadow-[#4A6CFF]/5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{tournament.title}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${
                        tournament.status === "active"
                          ? "bg-green-500/15 text-green-400 border-green-500/30"
                          : tournament.status === "upcoming"
                            ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                            : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                      }`}
                    >
                      {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-1">{tournament.game}</p>
                  <p className="text-white/40 text-sm line-clamp-2">{tournament.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5 pb-5 border-b border-[#2a3342]/50">
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">Prize Pool</p>
                  <p className="text-white font-semibold">${tournament.prize_pool.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">Starts</p>
                  <p className="text-white text-sm">{new Date(tournament.start_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">Ends</p>
                  <p className="text-white text-sm">{new Date(tournament.end_date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={tournament.status}
                  onChange={(e) => handleStatusChange(tournament.id, e.target.value)}
                  className="px-3 py-2 bg-[#0B1020] border border-[#2a3342]/50 text-white rounded-lg text-sm font-medium hover:border-[#2a3342] transition-colors"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(tournament.id)}
                  className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {tournaments.length === 0 && (
            <div className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-12 text-center">
              <p className="text-white/60 mb-4">No tournaments created yet</p>
              <Link
                href="/admin/tournaments/create"
                className="inline-block px-4 py-2 bg-[#4A6CFF] text-white rounded-lg hover:bg-[#6A5CFF] transition-all hover:shadow-lg hover:shadow-[#4A6CFF]/20 font-medium"
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
