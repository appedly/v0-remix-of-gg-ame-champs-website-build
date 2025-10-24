"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type Tournament = {
  id: string
  title: string
  game: string
  description: string | null
  prize_pool: number
  start_date: string
  end_date: string
  status: string
  max_submissions: number | null
  created_at: string
}

export function TournamentList({ tournaments }: { tournaments: Tournament[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return

    setIsDeleting(id)
    const supabase = createClient()

    const { error } = await supabase.from("tournaments").delete().eq("id", id)

    if (error) {
      alert("Error deleting tournament: " + error.message)
    } else {
      router.refresh()
    }

    setIsDeleting(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "upcoming":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "completed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (tournaments.length === 0) {
    return (
      <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-12 text-center">
        <p className="text-white/60 mb-4">No tournaments yet</p>
        <a
          href="/admin/tournaments/create"
          className="inline-block px-4 py-2 bg-[#4A6CFF] text-white rounded-lg hover:bg-[#6A5CFF] transition-colors"
        >
          Create Your First Tournament
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tournaments.map((tournament) => (
        <div key={tournament.id} className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-white">{tournament.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(tournament.status)}`}>
                  {tournament.status}
                </span>
              </div>
              <p className="text-white/60 text-sm mb-2">{tournament.game}</p>
              {tournament.description && <p className="text-white/70 text-sm">{tournament.description}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-white/40 text-xs mb-1">Prize Pool</p>
              <p className="text-white font-semibold">${tournament.prize_pool.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Start Date</p>
              <p className="text-white font-semibold">{new Date(tournament.start_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">End Date</p>
              <p className="text-white font-semibold">{new Date(tournament.end_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Max Submissions</p>
              <p className="text-white font-semibold">{tournament.max_submissions || "Unlimited"}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={`/admin/tournaments/${tournament.id}/edit`}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              Edit
            </a>
            <button
              onClick={() => handleDelete(tournament.id)}
              disabled={isDeleting === tournament.id}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm disabled:opacity-50"
            >
              {isDeleting === tournament.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
