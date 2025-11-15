"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"
import { Trophy, Zap, Target, TrendingUp, Clock, AlertCircle, ChevronRight, Bell } from "lucide-react"

interface Tournament {
  id: string
  title: string
  game: string
  prize_pool: number
  end_date: string
  status: string
  start_date: string
}

interface Submission {
  id: string
  title: string
  status: string
  tournament: {
    title: string
    game: string
  }
  tournament_id: string
  created_at: string
}

interface UserStats {
  totalSubmissions: number
  approvedSubmissions: number
  pendingSubmissions: number
  totalVotes: number
  joinedTournaments: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [activeTournaments, setActiveTournaments] = useState<Tournament[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    totalSubmissions: 0,
    approvedSubmissions: 0,
    pendingSubmissions: 0,
    totalVotes: 0,
    joinedTournaments: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatTab, setSelectedStatTab] = useState(0)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (!session || sessionError) {
          router.push("/login")
          return
        }

        setUser(session.user)

        const { data: userDataResult, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (userError && userError.code === "PGRST116") {
          const { data: newUser, error: createError } = await supabase
            .from("users")
            .insert({
              id: session.user.id,
              email: session.user.email,
              display_name: session.user.email?.split("@")[0] || "User",
            })
            .select()
            .single()

          if (!createError) {
            setUserData(newUser)
          }
        } else {
          setUserData(userDataResult)
        }

        const { data: submissionsData } = await supabase
          .from("submissions")
          .select(`
          *,
          tournament:tournaments(title, game)
        `)
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        setSubmissions(submissionsData || [])

        const { data: tournamentsData } = await supabase
          .from("tournaments")
          .select("*")
          .eq("status", "active")
          .order("start_date", { ascending: true })

        setActiveTournaments(tournamentsData || [])

        const totalSubmissions = submissionsData?.length || 0
        const approvedSubmissions = submissionsData?.filter(s => s.status === "approved").length || 0
        const pendingSubmissions = submissionsData?.filter(s => s.status === "pending").length || 0
        const uniqueTournaments = new Set(submissionsData?.map(s => s.tournament_id) || [])
        const joinedTournaments = uniqueTournaments.size

        setUserStats({
          totalSubmissions,
          approvedSubmissions,
          pendingSubmissions,
          totalVotes: 0,
          joinedTournaments,
        })

        setIsLoading(false)
      } catch (err: any) {
        console.error("Dashboard error:", err)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white font-semibold">Loading dashboard...</div>
          <div className="text-slate-400 text-sm mt-1">Setting up your gaming hub</div>
        </div>
      </div>
    )
  }

  const displayName = userData?.display_name || user?.email?.split("@")[0] || "Player"

  return (
    <div className="min-h-screen bg-slate-900">
      <UserNav userName={displayName} />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Top Sticky Bar - Quick Stats & Actions */}
        <div className="sticky top-20 z-30 -mx-4 px-4 py-3 bg-slate-900/95 backdrop-blur border-b border-slate-800 mb-6">
          <div className="flex items-center justify-between gap-4 overflow-x-auto">
            <div className="flex items-center gap-3 min-w-fit">
              <Zap className="w-5 h-5 text-blue-400" />
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-xs text-slate-400 font-semibold">APPROVED</div>
                  <div className="text-lg font-bold text-green-400">{userStats.approvedSubmissions}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-400 font-semibold">PENDING</div>
                  <div className="text-lg font-bold text-amber-400">{userStats.pendingSubmissions}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-400 font-semibold">TOURNAMENTS</div>
                  <div className="text-lg font-bold text-blue-400">{userStats.joinedTournaments}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-all">
                <Bell className="w-5 h-5 text-slate-400 hover:text-blue-400" />
              </button>
              <Link
                href="/tournaments"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all"
              >
                Browse Tournaments
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Welcome Section - Compact */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400 font-semibold mb-1">WELCOME BACK</div>
                  <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
                    <span className="text-blue-400">{displayName}</span>
                  </h1>
                  <p className="text-sm text-slate-400">You have <span className="text-green-400 font-semibold">{userStats.approvedSubmissions}</span> approved clips competing</p>
                </div>
                <div className="text-right hidden md:block">
                  <div className="text-xs text-slate-500 mb-2">Rank</div>
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">#1,234</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tournaments & Submissions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Tournaments - Horizontal Scroll */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-white">Active Tournaments</h2>
                <Link href="/tournaments" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {activeTournaments.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                  {activeTournaments.slice(0, 4).map((tournament) => (
                    <Link
                      key={tournament.id}
                      href={`/tournaments/${tournament.id}`}
                      className="flex-shrink-0 w-48 md:w-56 p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-lg transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-xs text-blue-400 font-bold uppercase mb-1">{tournament.game}</p>
                          <h3 className="text-sm font-bold text-white group-hover:text-blue-400 line-clamp-2 transition-colors">
                            {tournament.title}
                          </h3>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Prize</span>
                          <span className="text-blue-400 font-bold">${(tournament.prize_pool / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Ends</span>
                          <span className="text-slate-300">
                            {Math.ceil((new Date(tournament.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-800/30 border border-slate-700 rounded-lg text-center">
                  <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No active tournaments right now</p>
                </div>
              )}
            </div>

            {/* Recent Submissions - Compact List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-white">Your Submissions</h2>
                <Link href="/submissions" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {submissions.length > 0 ? (
                <div className="space-y-2">
                  {submissions.slice(0, 4).map((submission) => (
                    <div key={submission.id} className="p-3 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 rounded-lg transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white truncate">{submission.title}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {submission.tournament.game} • {new Date(submission.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
                              submission.status === "approved"
                                ? "bg-green-500/20 text-green-400"
                                : submission.status === "pending"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-800/30 border border-slate-700 rounded-lg text-center">
                  <Target className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No submissions yet - start competing!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-4">
            {/* Performance Stats - Compact Card Stack */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white px-1">Performance</h3>

              {/* Stat Cards */}
              <div className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-lg p-4 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-bold uppercase">Total Submissions</div>
                  <div className="w-8 h-8 bg-blue-500/10 group-hover:bg-blue-500/20 rounded-lg flex items-center justify-center transition-all">
                    <Trophy className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{userStats.totalSubmissions}</div>
                <div className="text-xs text-slate-500 mt-2">Across {userStats.joinedTournaments} tournaments</div>
              </div>

              <div className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-lg p-4 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-bold uppercase">Approved Rate</div>
                  <div className="w-8 h-8 bg-green-500/10 group-hover:bg-green-500/20 rounded-lg flex items-center justify-center transition-all">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">
                  {userStats.totalSubmissions > 0 ? Math.round((userStats.approvedSubmissions / userStats.totalSubmissions) * 100) : 0}%
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                    style={{ width: `${userStats.totalSubmissions > 0 ? (userStats.approvedSubmissions / userStats.totalSubmissions) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-lg p-4 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-bold uppercase">Under Review</div>
                  <div className="w-8 h-8 bg-amber-500/10 group-hover:bg-amber-500/20 rounded-lg flex items-center justify-center transition-all">
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{userStats.pendingSubmissions}</div>
                <div className="text-xs text-slate-500 mt-2">Waiting for admin review</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4 space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Quick Actions</h3>
              <Link
                href="/tournaments"
                className="flex items-center gap-2 w-full px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all"
              >
                <Zap className="w-4 h-4" />
                Submit Clip
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center gap-2 w-full px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-lg transition-all"
              >
                <TrendingUp className="w-4 h-4" />
                View Leaderboard
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 w-full px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-lg transition-all"
              >
                <Target className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {submissions.slice(0, 3).map((submission) => (
                  <div key={submission.id} className="flex items-start gap-2 p-2 bg-slate-900/50 rounded">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-300 truncate">Submitted "{submission.title}"</p>
                      <p className="text-xs text-slate-500">{new Date(submission.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                ))}
                {submissions.length === 0 && (
                  <p className="text-xs text-slate-500">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
