"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Progress } from "@/components/ui/progress"

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        console.log("[v0] Dashboard - Session check:", { session: !!session, error: sessionError })

        if (!session || sessionError) {
          console.log("[v0] No active session, redirecting to login")
          router.push("/login")
          return
        }

        setUser(session.user)

        const { data: userDataResult, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        console.log("[v0] User data fetch:", { data: userDataResult, error: userError })

        if (userError && userError.code === "PGRST116") {
          console.log("[v0] User not found in users table, creating...")
          const { data: newUser, error: createError } = await supabase
            .from("users")
            .insert({
              id: session.user.id,
              email: session.user.email,
              display_name: session.user.email?.split("@")[0] || "User",
            })
            .select()
            .single()

          if (createError) {
            console.error("[v0] Error creating user:", createError)
          } else {
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

        // Calculate user stats
        const totalSubmissions = submissionsData?.length || 0
        const approvedSubmissions = submissionsData?.filter(s => s.status === "approved").length || 0
        const pendingSubmissions = submissionsData?.filter(s => s.status === "pending").length || 0
        
        // Get unique tournaments user has participated in
        const uniqueTournaments = new Set(submissionsData?.map(s => s.tournament_id) || [])
        const joinedTournaments = uniqueTournaments.size

        setUserStats({
          totalSubmissions,
          approvedSubmissions,
          pendingSubmissions,
          totalVotes: 0, // TODO: Implement votes counting
          joinedTournaments,
        })

        setIsLoading(false)
      } catch (err: any) {
        console.error("[v0] Dashboard error:", err)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1020] via-[#1a1f3a] to-[#0B1020] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-6" />
          <div className="text-white text-lg font-medium">Loading your dashboard...</div>
          <div className="text-white/60 text-sm mt-2">Preparing your gaming stats</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1020] via-[#1a1f3a] to-[#0B1020]">
      <UserNav userName={userData?.display_name || user?.email?.split("@")[0] || "User"} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-[#4A6CFF]/20 to-[#00C2FF]/20 backdrop-blur-sm rounded-2xl border border-[#2a3342] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4A6CFF]/10 to-transparent rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome back, <span className="bg-gradient-to-r from-[#4A6CFF] to-[#00C2FF] bg-clip-text text-transparent">{userData?.display_name || user?.email?.split("@")[0]}</span>! 👋
              </h1>
              <p className="text-white/70 text-lg mb-6">Ready to dominate the competition? Your next victory awaits!</p>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-gradient-to-r from-[#4A6CFF] to-[#6A5CFF] hover:from-[#6A5CFF] hover:to-[#4A6CFF] text-white border-0">
                  <Link href="/tournaments">Browse Tournaments</Link>
                </Button>
                <Button asChild variant="outline" className="border-[#4A6CFF]/50 text-[#4A6CFF] hover:bg-[#4A6CFF]/10">
                  <Link href="/submissions/new">Submit Clip</Link>
                </Button>
                <Button asChild variant="outline" className="border-[#00C2FF]/50 text-[#00C2FF] hover:bg-[#00C2FF]/10">
                  <Link href="/leaderboard">View Rankings</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <div className="bg-gradient-to-br from-[#1a2332] to-[#2a3342] rounded-xl border border-[#3a4352] p-6 hover:border-[#4A6CFF]/50 transition-all duration-300 group hover-lift relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4A6CFF]/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4A6CFF] to-[#6A5CFF] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform group-hover:rotate-12">
                  <span className="text-white text-xl">📊</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-400 text-xs font-medium">+12%</span>
                  <span className="text-green-400 text-xs">↑</span>
                </div>
              </div>
              <h3 className="text-white/60 text-xs mb-1 uppercase tracking-wide">Total Submissions</h3>
              <p className="text-3xl font-bold text-white group-hover:text-[#4A6CFF] transition-colors">{userStats.totalSubmissions}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a2332] to-[#2a3342] rounded-xl border border-[#3a4352] p-6 hover:border-[#00C2FF]/50 transition-all duration-300 group hover-lift relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#00C2FF]/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00C2FF] to-[#00E5FF] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform group-hover:rotate-12">
                  <span className="text-white text-xl">✅</span>
                </div>
                <Badge variant="success" className="text-xs">Active</Badge>
              </div>
              <h3 className="text-white/60 text-xs mb-1 uppercase tracking-wide">Approved Clips</h3>
              <p className="text-3xl font-bold text-white group-hover:text-[#00C2FF] transition-colors">{userStats.approvedSubmissions}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a2332] to-[#2a3342] rounded-xl border border-[#3a4352] p-6 hover:border-[#FFB800]/50 transition-all duration-300 group hover-lift relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FFB800]/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFB800] to-[#FFC107] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform group-hover:rotate-12">
                  <span className="text-white text-xl">⏳</span>
                </div>
                <Badge variant="warning" className="text-xs animate-pulse">Review</Badge>
              </div>
              <h3 className="text-white/60 text-xs mb-1 uppercase tracking-wide">Pending Review</h3>
              <p className="text-3xl font-bold text-white group-hover:text-[#FFB800] transition-colors">{userStats.pendingSubmissions}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a2332] to-[#2a3342] rounded-xl border border-[#3a4352] p-6 hover:border-[#FF6B6B]/50 transition-all duration-300 group hover-lift relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FF6B6B]/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform group-hover:rotate-12">
                  <span className="text-white text-xl">🏆</span>
                </div>
                <Badge variant="info" className="text-xs">Competing</Badge>
              </div>
              <h3 className="text-white/60 text-xs mb-1 uppercase tracking-wide">Tournaments Joined</h3>
              <p className="text-3xl font-bold text-white group-hover:text-[#FF6B6B] transition-colors">{userStats.joinedTournaments}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a2332] to-[#2a3342] rounded-xl border border-[#3a4352] p-6 hover:border-[#9C27B0]/50 transition-all duration-300 group hover-lift relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#9C27B0]/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#9C27B0] to-[#E91E63] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform group-hover:rotate-12">
                  <span className="text-white text-xl">❤️</span>
                </div>
                <Badge variant="info" className="text-xs">Community</Badge>
              </div>
              <h3 className="text-white/60 text-xs mb-1 uppercase tracking-wide">Votes Received</h3>
              <p className="text-3xl font-bold text-white group-hover:text-[#9C27B0] transition-colors">{userStats.totalVotes}</p>
            </div>
          </div>
        </div>

        {/* Active Tournaments */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">🔥 Active Tournaments</h2>
              <p className="text-white/60">Compete in these exciting tournaments and win amazing prizes!</p>
            </div>
            <Button asChild variant="outline" className="border-[#4A6CFF]/50 text-[#4A6CFF] hover:bg-[#4A6CFF]/10">
              <Link href="/tournaments">View All →</Link>
            </Button>
          </div>

          {activeTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTournaments.slice(0, 6).map((tournament) => (
                <Link
                  key={tournament.id}
                  href={`/tournaments/${tournament.id}`}
                  className="group relative bg-gradient-to-br from-[#1a2332] to-[#2a3342] rounded-xl border border-[#3a4352] p-6 hover:border-[#4A6CFF]/50 transition-all duration-300 hover:transform hover:scale-[1.02] overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4A6CFF]/5 to-[#00C2FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="live">🔴 LIVE</Badge>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#4A6CFF] to-[#6A5CFF] rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">🎮</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-[#4A6CFF] transition-colors line-clamp-1">
                          {tournament.title}
                        </h3>
                        <p className="text-white/60 text-sm">{tournament.game}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Prize Pool</span>
                        <span className="text-[#00C2FF] font-bold text-lg">${tournament.prize_pool.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Ends In</span>
                        <span className="text-white/80 text-sm font-medium">
                          {Math.ceil((new Date(tournament.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>

                      <div className="pt-3 border-t border-[#3a4352]">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/50">Started</span>
                          <span className="text-white/70">{new Date(tournament.start_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full mt-4 bg-gradient-to-r from-[#4A6CFF] to-[#6A5CFF] hover:from-[#6A5CFF] hover:to-[#4A6CFF] text-white border-0 group-hover:shadow-lg transition-all duration-300">
                      Join Tournament →
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#1a2332] to-[#2a3342] rounded-xl border border-[#3a4352] p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4A6CFF]/20 to-[#00C2FF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Active Tournaments</h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Check back soon! New tournaments are launching regularly with amazing prizes and competition.
              </p>
              <Button asChild className="bg-gradient-to-r from-[#4A6CFF] to-[#6A5CFF] hover:from-[#6A5CFF] hover:to-[#4A6CFF] text-white border-0">
                <Link href="/tournaments">Browse All Tournaments</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Recent Submissions & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Submissions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">📹 Your Recent Submissions</h2>
                <p className="text-white/60">Track your clip submissions and their status</p>
              </div>
              <Button asChild variant="outline" className="border-[#4A6CFF]/50 text-[#4A6CFF] hover:bg-[#4A6CFF]/10">
                <Link href="/submissions">View All →</Link>
              </Button>
            </div>

            {submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="bg-gradient-to-r from-[#1a2332] to-[#2a3342] rounded-xl border border-[#3a4352] p-6 hover:border-[#4A6CFF]/30 transition-all duration-300 group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#4A6CFF] to-[#6A5CFF] rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">🎬</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-[#4A6CFF] transition-colors">
                              {submission.title}
                            </h3>
                            <p className="text-white/60 text-sm">
                              {submission.tournament.title} • {submission.tournament.game}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-white/50">
                          <span>Submitted {new Date(submission.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>ID: {submission.id.slice(0, 8)}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={
                            submission.status === "approved"
                              ? "success"
                              : submission.status === "pending"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {submission.status === "approved" ? "✅ " : submission.status === "pending" ? "⏳ " : "❌ "}{submission.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#1a2332] to-[#2a3342] rounded-xl border border-[#3a4352] p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4A6CFF]/20 to-[#00C2FF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">📤</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">No Submissions Yet</h3>
                <p className="text-white/60 mb-6">Start competing by submitting your best gaming clips!</p>
                <Button asChild className="bg-gradient-to-r from-[#4A6CFF] to-[#6A5CFF] hover:from-[#6A5CFF] hover:to-[#4A6CFF] text-white border-0">
                  <Link href="/tournaments">Browse Tournaments</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Quick Actions & Tips */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#1a2332] to-[#2a3342] rounded-xl border border-[#3a4352] p-6">
              <h3 className="text-lg font-bold text-white mb-4">⚡ Quick Actions</h3>
              <div className="space-y-3">
                <Button asChild className="w-full justify-start bg-gradient-to-r from-[#4A6CFF] to-[#6A5CFF] hover:from-[#6A5CFF] hover:to-[#4A6CFF] text-white border-0">
                  <Link href="/submissions/new">
                    <span className="mr-2">📤</span> Submit New Clip
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start border-[#00C2FF]/50 text-[#00C2FF] hover:bg-[#00C2FF]/10">
                  <Link href="/profile">
                    <span className="mr-2">👤</span> Edit Profile
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start border-[#FFB800]/50 text-[#FFB800] hover:bg-[#FFB800]/10">
                  <Link href="/leaderboard">
                    <span className="mr-2">🏆</span> View Leaderboard
                  </Link>
                </Button>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-gradient-to-br from-[#4A6CFF]/10 to-[#00C2FF]/10 rounded-xl border border-[#4A6CFF]/30 p-6">
              <h3 className="text-lg font-bold text-white mb-4">💡 Pro Tips</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-[#4A6CFF] text-lg">🎯</span>
                  <p className="text-white/80 text-sm">Submit clips early to maximize voting time</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#00C2FF] text-lg">🔥</span>
                  <p className="text-white/80 text-sm">High-quality clips get more engagement</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#FFB800] text-lg">🏅</span>
                  <p className="text-white/80 text-sm">Participate daily to climb the rankings</p>
                </div>
              </div>
            </div>

            {/* Achievement Progress */}
            <div className="bg-gradient-to-br from-[#1a2332] to-[#2a3342] rounded-xl border border-[#3a4352] p-6">
              <h3 className="text-lg font-bold text-white mb-4">🎖️ Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Submission Streak</span>
                    <span className="text-white font-medium">3 days</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Tournament Rank</span>
                    <span className="text-white font-medium">#42</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button
          asChild
          size="lg"
          className="w-16 h-16 rounded-full bg-gradient-to-r from-[#4A6CFF] to-[#6A5CFF] hover:from-[#6A5CFF] hover:to-[#4A6CFF] shadow-2xl hover:scale-110 transition-all duration-300 border-0 group"
        >
          <Link href="/submissions/new">
            <span className="text-2xl group-hover:rotate-12 transition-transform">📤</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
