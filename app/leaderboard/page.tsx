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
    <div className="min-h-screen bg-slate-900">
      <UserNav userName={userData?.display_name || "User"} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400" />
              Leaderboard
            </h1>
            <p className="text-slate-400">Top players ranked by total points and performance</p>
          </div>

          {currentUserEntry && (
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/40 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Your Rank</div>
                  <div className="text-2xl font-bold text-white">#{currentUserRank + 1}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Total Points</div>
                  <div className="text-2xl font-bold text-amber-400">{currentUserEntry.total_points || 0}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Total Votes</div>
                  <div className="text-2xl font-bold text-blue-400">{currentUserEntry.total_votes || 0}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Submissions</div>
                  <div className="text-2xl font-bold text-white">{currentUserEntry.submission_count}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Total Points
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Total Votes
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Submissions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {leaderboard && leaderboard.length > 0 ? (
                    leaderboard.map((entry: any, index: number) => {
                      const isCurrentUser = entry.user_id === user.id
                      return (
                        <tr
                          key={entry.user_id}
                          className={`${index < 3 ? "bg-amber-400/5" : ""} ${isCurrentUser ? "bg-blue-600/10" : ""} hover:bg-slate-700 transition-colors`}
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
                                <span className="text-slate-400 font-semibold text-lg w-8 text-center">
                                  {index + 1}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-white">{entry.display_name}</div>
                              {isCurrentUser && (
                                <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
                                  You
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-amber-400 font-semibold">{entry.total_points || 0}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Trophy className="w-4 h-4 text-blue-400" />
                              <span className="text-sm text-blue-400 font-semibold">{entry.total_votes || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-300">{entry.submission_count}</div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="max-w-md mx-auto">
                          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-8 h-8 text-blue-400" />
                          </div>
                          <p className="text-slate-400">No leaderboard data yet</p>
                          <p className="text-slate-500 text-sm mt-2">
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
