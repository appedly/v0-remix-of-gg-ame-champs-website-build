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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-6" />
          <div className="text-white text-lg font-medium">Loading your dashboard...</div>
          <div className="text-slate-400 text-sm mt-2">Preparing your stats</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <UserNav userName={userData?.display_name || user?.email?.split("@")[0] || "User"} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome back, <span className="text-blue-500">{userData?.display_name || user?.email?.split("@")[0]}</span>
              </h1>
              <p className="text-slate-300 text-lg mb-6">Ready to compete? Your next challenge awaits.</p>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/tournaments">Browse Tournaments</Link>
                </Button>
                <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  <Link href="/tournaments">Submit Clip</Link>
                </Button>
                <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  <Link href="/leaderboard">View Rankings</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-500 text-xl">●</span>
                </div>
              </div>
              <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Total Submissions</h3>
              <p className="text-3xl font-bold text-white">{userStats.totalSubmissions}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-500 text-xl">✓</span>
                </div>
              </div>
              <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Approved Clips</h3>
              <p className="text-3xl font-bold text-white">{userStats.approvedSubmissions}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-amber-500 text-xl">◐</span>
                </div>
              </div>
              <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Pending Review</h3>
              <p className="text-3xl font-bold text-white">{userStats.pendingSubmissions}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-purple-500 text-xl">◆</span>
                </div>
              </div>
              <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Tournaments Joined</h3>
              <p className="text-3xl font-bold text-white">{userStats.joinedTournaments}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-red-500 text-xl">♦</span>
                </div>
              </div>
              <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Votes Received</h3>
              <p className="text-3xl font-bold text-white">{userStats.totalVotes}</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Tournaments */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Active Tournaments</h2>
              <p className="text-slate-400">Compete in these tournaments and win prizes</p>
            </div>
            <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link href="/tournaments">View All →</Link>
            </Button>
          </div>

          {activeTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTournaments.slice(0, 6).map((tournament) => (
                <Card key={tournament.id} className="hover:shadow-lg transition-all hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-blue-500 text-lg">■</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white line-clamp-1">
                          {tournament.title}
                        </h3>
                        <p className="text-slate-400 text-sm">{tournament.game}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Prize Pool</span>
                        <span className="text-blue-500 font-bold text-lg">${tournament.prize_pool.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Ends In</span>
                        <span className="text-slate-300 text-sm font-medium">
                          {Math.ceil((new Date(tournament.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>

                      <div className="pt-3 border-t border-slate-700">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Started</span>
                          <span className="text-slate-400">{new Date(tournament.start_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <Button asChild className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                      <Link href={`/tournaments/${tournament.id}`}>
                        View Tournament Details →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-16 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">○</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No Active Tournaments</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  Check back soon! New tournaments are launching regularly with prizes and competition.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/tournaments">View All Tournaments</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* User Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Submissions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Your Recent Submissions</h2>
                <p className="text-slate-400">Track your clip submissions and their status</p>
              </div>
              <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <Link href="/submissions">View All →</Link>
              </Button>
            </div>

            {submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.slice(0, 5).map((submission) => (
                  <Card key={submission.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-blue-500 text-sm">▣</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {submission.title}
                              </h3>
                              <p className="text-slate-400 text-sm">
                                {submission.tournament.title} • {submission.tournament.game}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-slate-500">
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
                            {submission.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">↑</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">No Submissions Yet</h3>
                  <p className="text-slate-400 mb-6">Start competing by submitting your best gaming clips!</p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/tournaments">Browse Tournaments</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Tournament Participation */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Tournament Participation</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <span className="text-slate-400">Active Tournaments</span>
                  <span className="text-2xl font-bold text-blue-500">{activeTournaments.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <span className="text-slate-400">Total Participated</span>
                  <span className="text-2xl font-bold text-green-500">{userStats.joinedTournaments}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Tips */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button asChild className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/tournaments">
                      Submit New Clip
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Link href="/profile">
                      Edit Profile
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Link href="/leaderboard">
                      View Leaderboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {submissions.slice(0, 3).map((submission) => (
                    <div key={submission.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-slate-300 text-sm">
                          Submitted "{submission.title}" to {submission.tournament.title}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {submissions.length === 0 && (
                    <p className="text-slate-400 text-sm">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button
          asChild
          size="lg"
          className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl hover:scale-110 transition-all"
        >
          <Link href="/tournaments">
            <span className="text-2xl">+</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}