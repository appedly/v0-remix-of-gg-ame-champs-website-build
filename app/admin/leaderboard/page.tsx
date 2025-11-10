"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"

interface LeaderboardEntry {
  user_id: string
  display_name: string
  total_votes: number
  approved_submissions: number
  rank: number
}

export default function AdminLeaderboardPage() {
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const adminSession = localStorage.getItem("admin_session")
    if (!adminSession) {
      router.push("/admin/login")
      return
    }

    fetchLeaderboard()
  }, [router])

  const fetchLeaderboard = async () => {
    const supabase = createClient()

    // Get all users with their submission counts and votes
    const { data: users } = await supabase.from("users").select("id, display_name, email")

    if (!users) {
      setIsLoading(false)
      return
    }

    // Get submission counts and votes for each user
    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        const { count: submissionCount } = await supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "approved")

        const { data: votes } = await supabase
          .from("votes")
          .select("submission_id")
          .in(
            "submission_id",
            (await supabase.from("submissions").select("id").eq("user_id", user.id).eq("status", "approved")).data?.map(
              (s) => s.id,
            ) || [],
          )

        return {
          user_id: user.id,
          display_name: user.display_name || user.email.split("@")[0],
          total_votes: votes?.length || 0,
          approved_submissions: submissionCount || 0,
          rank: 0,
        }
      }),
    )

    // Sort by votes and assign ranks
    const sorted = leaderboardData
      .sort((a, b) => b.total_votes - a.total_votes || b.approved_submissions - a.approved_submissions)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))

    setLeaderboard(sorted)
    setIsLoading(false)
    setIsRefreshing(false)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchLeaderboard()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="text-white">Loading leaderboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <AdminNav userName="Admin" />

      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">Leaderboard Management</h1>
            <p className="text-white/40 text-sm">{leaderboard.length} {leaderboard.length === 1 ? "player" : "players"}</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-[#4A6CFF] hover:bg-[#6A5CFF] text-white font-medium transition-all hover:shadow-lg hover:shadow-[#4A6CFF]/20"
          >
            {isRefreshing ? "..." : "Refresh"}
          </Button>
        </div>

        <div className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0B1020]/50 border-b border-[#2a3342]/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Total Votes
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Submissions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a3342]/30">
                {leaderboard.length > 0 ? (
                  leaderboard.map((entry, idx) => (
                    <tr key={entry.user_id} className={idx % 2 === 0 ? "bg-[#0F1823]/30" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`text-lg font-bold ${
                              entry.rank === 1
                                ? "text-yellow-400"
                                : entry.rank === 2
                                  ? "text-slate-300"
                                  : entry.rank === 3
                                    ? "text-orange-400"
                                    : "text-white/70"
                            }`}
                          >
                            #{entry.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{entry.display_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#00C2FF] font-semibold">{entry.total_votes}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/70">{entry.approved_submissions}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-white/60">
                      No leaderboard data available yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
