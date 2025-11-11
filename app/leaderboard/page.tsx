import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import { Trophy } from "lucide-react"

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Get top users by vote count
  const { data: leaderboard } = await supabase.rpc("get_leaderboard")

  const currentUserRank = leaderboard?.findIndex((entry: any) => entry.user_id === user.id) ?? -1
  const currentUserEntry = currentUserRank >= 0 ? leaderboard?.[currentUserRank] : null

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <UserNav userName={userData?.display_name || "User"} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-[#FFD166]" />
              Leaderboard
            </h1>
            <p className="text-white/60">Top players ranked by total points and performance</p>
          </div>

          {currentUserEntry && (
            <div className="bg-gradient-to-r from-[#4A6CFF]/20 to-[#6A5CFF]/20 rounded-lg border border-[#4A6CFF]/40 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/60 text-sm mb-1">Your Rank</div>
                  <div className="text-2xl font-bold text-white">#{currentUserRank + 1}</div>
                </div>
                <div>
                  <div className="text-white/60 text-sm mb-1">Total Points</div>
                  <div className="text-2xl font-bold text-[#FFD166]">{currentUserEntry.total_points || 0}</div>
                </div>
                <div>
                  <div className="text-white/60 text-sm mb-1">Total Votes</div>
                  <div className="text-2xl font-bold text-[#00C2FF]">{currentUserEntry.total_votes || 0}</div>
                </div>
                <div>
                  <div className="text-white/60 text-sm mb-1">Submissions</div>
                  <div className="text-2xl font-bold text-white">{currentUserEntry.submission_count}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0B1020] border-b border-[#2a3342]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                      Total Points
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                      Total Votes
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                      Submissions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a3342]">
                  {leaderboard && leaderboard.length > 0 ? (
                    leaderboard.map((entry: any, index: number) => {
                      const isCurrentUser = entry.user_id === user.id
                      return (
                        <tr
                          key={entry.user_id}
                          className={`${index < 3 ? "bg-[#FFD166]/5" : ""} ${isCurrentUser ? "bg-[#4A6CFF]/10" : ""} hover:bg-[#2a3342] transition-colors`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {index === 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                    1
                                  </span>
                                </div>
                              )}
                              {index === 1 && (
                                <div className="flex items-center gap-2">
                                  <span className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                    2
                                  </span>
                                </div>
                              )}
                              {index === 2 && (
                                <div className="flex items-center gap-2">
                                  <span className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                    3
                                  </span>
                                </div>
                              )}
                              {index > 2 && (
                                <span className="text-white/60 font-semibold text-lg w-8 text-center">
                                  {index + 1}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-white">{entry.display_name}</div>
                              {isCurrentUser && (
                                <span className="px-2 py-0.5 bg-[#4A6CFF]/20 text-[#4A6CFF] text-xs font-medium rounded-full border border-[#4A6CFF]/30">
                                  You
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[#FFD166] font-semibold">{entry.total_points || 0}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#00C2FF]">↑</span>
                              <span className="text-sm text-[#00C2FF] font-semibold">{entry.total_votes || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white/70">{entry.submission_count}</div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="max-w-md mx-auto">
                          <div className="w-16 h-16 bg-[#4A6CFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-8 h-8 text-[#4A6CFF]" />
                          </div>
                          <p className="text-white/60">No leaderboard data yet</p>
                          <p className="text-white/40 text-sm mt-2">
                            Submit clips and earn votes to climb the ranks
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
