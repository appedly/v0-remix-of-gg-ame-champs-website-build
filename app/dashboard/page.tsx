"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Navigation } from "@/components/ui/navigation"
import { StatCard } from "@/components/ui/stat-card"
import { TournamentCard } from "@/components/ui/tournament-card"
import { SubmissionCard } from "@/components/ui/submission-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Progress } from "@/components/ui/progress"
import { 
  Trophy, 
  FileVideo, 
  Clock, 
  Users, 
  TrendingUp,
  Plus,
  ChevronRight,
  Activity
} from "lucide-react"
import Link from "next/link"

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
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-6" />
          <div className="text-h3 font-semibold text-primary mb-2">Loading your dashboard...</div>
          <div className="text-body-small text-secondary">Preparing your stats and tournaments</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <Navigation 
        user={user ? {
          username: userData?.display_name || user.email?.split("@")[0],
          email: user.email || '',
          avatar: undefined,
          notificationCount: 0
        } : undefined}
        currentPage="dashboard"
      />

      <main className="pt-20 px-4 lg:px-8 pb-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="bg-bg-elevated rounded-2xl border border-border p-8 relative overflow-hidden animate-slideInUp">
            <div className="relative z-10">
              <h1 className="text-h1 font-bold text-primary mb-4">
                Welcome back, <span className="text-primary">{userData?.display_name || user?.email?.split("@")[0]}</span>
              </h1>
              <p className="text-body-large text-secondary mb-6">Ready to compete? Your next challenge awaits.</p>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/tournaments">Browse Tournaments</Link>
                </Button>
                <Button variant="secondary">
                  <Link href="/tournaments">Submit Clip</Link>
                </Button>
                <Button variant="tertiary">
                  <Link href="/leaderboard">View Rankings</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid-12 mb-12">
          <StatCard
            size="primary"
            title="Total Submissions"
            value={userStats.totalSubmissions}
            icon={FileVideo}
            trend={{ value: 15, label: "vs last week" }}
            sparkline={[20, 35, 30, 45, 40, 55, 50]}
          />
          
          <StatCard
            size="primary"
            title="Active Tournaments Joined"
            value={userStats.joinedTournaments}
            icon={Trophy}
            trend={{ value: 8, label: "vs last week" }}
            sparkline={[10, 15, 12, 18, 16, 20, 22]}
          />

          <StatCard
            size="secondary"
            title="Approved Clips"
            value={userStats.approvedSubmissions}
            icon={Trophy}
            trend={{ value: 5, label: "vs last week" }}
            sparkline={[8, 12, 10, 14, 13, 16, 15]}
          />

          <StatCard
            size="secondary"
            title="Pending Review"
            value={userStats.pendingSubmissions}
            icon={Clock}
            trend={{ value: -2, label: "vs last week" }}
            sparkline={[6, 4, 5, 3, 4, 2, 3]}
          />

          <StatCard
            size="secondary"
            title="Votes Received"
            value={userStats.totalVotes}
            icon={Users}
            trend={{ value: 12, label: "vs last week" }}
            sparkline={[15, 22, 18, 25, 28, 30, 32]}
          />
        </div>

        {/* Active Tournaments */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-h2 font-bold text-primary mb-2">Active Tournaments</h2>
              <p className="text-body-standard text-secondary">Compete in these tournaments and win prizes</p>
            </div>
            <Button variant="tertiary">
              <Link href="/tournaments">View All <ChevronRight className="size-4" /></Link>
            </Button>
          </div>

          {activeTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeTournaments.slice(0, 8).map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  title={tournament.title}
                  game={tournament.game}
                  image={`/api/placeholder/400/225`}
                  prizePool={`${tournament.prize_pool.toLocaleString()}`}
                  participantCount={Math.floor(Math.random() * 50) + 10}
                  maxParticipants={100}
                  submissionCount={Math.floor(Math.random() * 30) + 5}
                  startDate={tournament.start_date}
                  endDate={tournament.end_date}
                  status={
                    new Date(tournament.end_date).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 
                      ? 'ending_soon' 
                      : 'active'
                  }
                  onJoin={() => router.push(`/tournaments/${tournament.id}`)}
                  onViewDetails={() => router.push(`/tournaments/${tournament.id}`)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center p-16">
              <div className="w-20 h-20 bg-bg-hover rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="size-10 text-muted" />
              </div>
              <h3 className="text-h3 font-bold text-primary mb-3">No Active Tournaments</h3>
              <p className="text-body-standard text-secondary mb-6 max-w-md mx-auto">
                Check back soon! New tournaments are launching regularly with prizes and competition.
              </p>
              <Button>
                <Link href="/tournaments">View All Tournaments</Link>
              </Button>
            </Card>
          )}
        </div>

        {/* User Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Submissions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-h2 font-bold text-primary mb-2">Your Recent Submissions</h2>
                <p className="text-body-standard text-secondary">Track your clip submissions and their status</p>
              </div>
              <Button variant="tertiary">
                <Link href="/submissions">View All <ChevronRight className="size-4" /></Link>
              </Button>
            </div>

            {submissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {submissions.slice(0, 4).map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    id={submission.id}
                    title={submission.title}
                    thumbnail={`/api/placeholder/400/225`}
                    game={submission.tournament.game}
                    tournament={submission.tournament.title}
                    status={submission.status as 'approved' | 'pending' | 'rejected'}
                    views={Math.floor(Math.random() * 1000) + 100}
                    votes={Math.floor(Math.random() * 50) + 1}
                    likes={Math.floor(Math.random() * 100) + 10}
                    submittedAt={new Date(submission.created_at).toLocaleDateString()}
                    author={{
                      username: userData?.display_name || user?.email?.split("@")[0],
                      avatar: undefined
                    }}
                    onShare={() => console.log('Share submission', submission.id)}
                    onAnalytics={() => router.push(`/submissions/${submission.id}/analytics`)}
                    onPlay={() => router.push(`/submissions/${submission.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center p-16">
                <div className="w-16 h-16 bg-bg-hover rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="size-8 text-muted" />
                </div>
                <h3 className="text-h3 font-bold text-primary mb-3">No Submissions Yet</h3>
                <p className="text-body-standard text-secondary mb-6">Start competing by submitting your best gaming clips!</p>
                <Button>
                  <Link href="/tournaments">Browse Tournaments</Link>
                </Button>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tournament Participation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-h4 font-bold text-primary">Tournament Participation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-bg-hover rounded-lg">
                  <span className="text-body-small text-secondary">Active Tournaments</span>
                  <span className="text-h4 font-bold text-success">{activeTournaments.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-bg-hover rounded-lg">
                  <span className="text-body-small text-secondary">Total Participated</span>
                  <span className="text-h4 font-bold text-primary">{userStats.joinedTournaments}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-h4 font-bold text-primary flex items-center gap-2">
                  <Activity className="size-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {submissions.slice(0, 3).map((submission) => (
                    <div key={submission.id} className="flex items-center gap-3 p-3 bg-bg-hover rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-body-small text-primary">
                          Submitted "{submission.title}" to {submission.tournament.title}
                        </p>
                        <p className="text-caption text-secondary">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {submissions.length === 0 && (
                    <p className="text-body-small text-secondary">No recent activity</p>
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
          className="w-16 h-16 rounded-full shadow-2xl hover:scale-110 transition-all"
        >
          <Link href="/tournaments">
            <Plus className="size-6" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
