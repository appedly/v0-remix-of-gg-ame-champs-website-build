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
import {
  FileText,
  CheckCircle2,
  Clock,
  Trophy,
  Award,
  Gamepad2,
  Circle,
  Plus,
  Square,
  Activity,
  TrendingUp,
  Zap,
  ChevronRight,
  Calendar,
  XCircle,
  ChevronLeft,
} from "lucide-react"
import { useRef } from "react"

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

function TournamentScrollContainer({ children }: { children: React.ReactNode }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollContainerRef.current) {
      setIsDragging(true)
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
      setScrollLeft(scrollContainerRef.current.scrollLeft)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
    checkScroll()
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
      setTimeout(checkScroll, 300)
    }
  }

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScroll)
      return () => container.removeEventListener('scroll', checkScroll)
    }
  }, [])

  return (
    <div className="relative group">
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-slate-900 to-transparent pl-2 pr-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          <ChevronLeft className="text-blue-500 hover:text-blue-400 transition-colors" size={28} />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        className={`overflow-x-auto pb-4 -mx-4 px-4 scroll-smooth ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as any}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {children}
      </div>

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-slate-900 to-transparent pr-2 pl-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          <ChevronRight className="text-blue-500 hover:text-blue-400 transition-colors" size={28} />
        </button>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [activeTournaments, setActiveTournaments] = useState<Tournament[]>([])
  const [upcomingTournaments, setUpcomingTournaments] = useState<Tournament[]>([])
  const [expiredTournaments, setExpiredTournaments] = useState<Tournament[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    totalSubmissions: 0,
    approvedSubmissions: 0,
    pendingSubmissions: 0,
    totalVotes: 0,
    joinedTournaments: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [contentVisible, setContentVisible] = useState(false)

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

        const { data: upcomingData } = await supabase
          .from("tournaments")
          .select("*")
          .eq("status", "upcoming")
          .order("start_date", { ascending: true })

        setUpcomingTournaments(upcomingData || [])

        const { data: expiredData } = await supabase
          .from("tournaments")
          .select("*")
          .eq("status", "completed")
          .order("end_date", { ascending: false })

        setExpiredTournaments(expiredData || [])

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
        
        // Trigger content animation after loading finishes
        setTimeout(() => {
          setContentVisible(true)
        }, 100)
      } catch (err: any) {
        console.error("[v0] Dashboard error:", err)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Game entry animation background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#475569_1px,transparent_1px),linear-gradient(to_bottom,#475569_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        
        <div className="relative z-10 text-center">
          <div className="mb-8 animate-in fade-in duration-500">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600/20 rounded-2xl mb-6 animate-pulse">
              <Gamepad2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
          </div>
          <div className="animate-in fade-in duration-700 delay-200">
            <h2 className="text-white text-2xl font-bold mb-2">Entering Tournament</h2>
            <p className="text-slate-400 text-base">Initializing your dashboard...</p>
          </div>
          <div className="mt-8 flex gap-2 justify-center animate-in fade-in duration-700 delay-300">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <UserNav userName={userData?.display_name || user?.email?.split("@")[0] || "User"} />

      <main className={`container mx-auto px-4 py-8 transition-all duration-1000 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Hero Section with Quick Actions and Recent Activity */}
        <div className={`mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Main Welcome Card */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-8 relative overflow-hidden transition-all duration-300 hover:border-slate-700 hover:shadow-lg hover:shadow-blue-500/5 h-full">
              <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  Welcome back, <span className="text-blue-500">{userData?.display_name || user?.email?.split("@")[0]}</span>
                </h1>
                <p className="text-slate-300 text-lg mb-8">Ready to compete? Your next challenge awaits.</p>

                {/* Quick Actions Inline */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-blue-500" />
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 justify-start">
                      <Link href="/tournaments" className="flex items-center gap-2">
                        <Plus size={18} />
                        Submit Clip
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 transition-all duration-300 justify-start">
                      <Link href="/profile" className="flex items-center gap-2">
                        <FileText size={18} />
                        Edit Profile
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 transition-all duration-300 justify-start">
                      <Link href="/leaderboard" className="flex items-center gap-2">
                        <Trophy size={18} />
                        Leaderboard
                      </Link>
                    </Button>
                  </div>
                </div>

                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300">
                  <Link href="/tournaments">Browse All Tournaments</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <Card className="border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity size={20} className="text-blue-500" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {submissions.slice(0, 4).map((submission) => (
                  <div key={submission.id} className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg transition-all duration-300 hover:bg-slate-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 text-sm truncate font-medium">
                        {submission.title}
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <div className={`transition-all duration-700 delay-200 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Card className="hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center transition-all duration-300">
                    <FileText className="text-blue-500" size={24} />
                  </div>
                </div>
                <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Total Submissions</h3>
                <p className="text-3xl font-bold text-white">{userStats.totalSubmissions}</p>
              </CardContent>
            </Card>
          </div>

          <div className={`transition-all duration-700 delay-300 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Card className="hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center transition-all duration-300">
                    <CheckCircle2 className="text-green-500" size={24} />
                  </div>
                </div>
                <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Approved Clips</h3>
                <p className="text-3xl font-bold text-white">{userStats.approvedSubmissions}</p>
              </CardContent>
            </Card>
          </div>

          <div className={`transition-all duration-700 delay-400 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Card className="hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center transition-all duration-300">
                    <Clock className="text-amber-500" size={24} />
                  </div>
                </div>
                <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Pending Review</h3>
                <p className="text-3xl font-bold text-white">{userStats.pendingSubmissions}</p>
              </CardContent>
            </Card>
          </div>

          <div className={`transition-all duration-700 delay-500 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Card className="hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center transition-all duration-300">
                    <Gamepad2 className="text-purple-500" size={24} />
                  </div>
                </div>
                <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Tournaments Joined</h3>
                <p className="text-3xl font-bold text-white">{userStats.joinedTournaments}</p>
              </CardContent>
            </Card>
          </div>

          <div className={`transition-all duration-700 delay-600 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Card className="hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center transition-all duration-300">
                    <Trophy className="text-red-500" size={24} />
                  </div>
                </div>
                <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Votes Received</h3>
                <p className="text-3xl font-bold text-white">{userStats.totalVotes}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Tournaments - Horizontal Scroller */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                <Zap size={32} className="text-blue-500" />
                Active Tournaments
              </h2>
              <p className="text-slate-400">Compete now and win prizes</p>
            </div>
            <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link href="/tournaments">View All →</Link>
            </Button>
          </div>

          {activeTournaments.length > 0 ? (
            <TournamentScrollContainer>
              <div className="flex gap-6 min-w-max">
                {activeTournaments.map((tournament) => (
                  <div key={tournament.id} className="w-96 flex-shrink-0">
                    <Card className="hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 border-slate-700 h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center transition-all duration-300">
                            <Gamepad2 className="text-blue-500" size={24} />
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

                        <Button asChild className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 group">
                          <Link href={`/tournaments/${tournament.id}`}>
                            View Details <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TournamentScrollContainer>
          ) : (
            <Card className="border-slate-700">
              <CardContent className="p-16 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                  <Circle className="text-slate-600" size={48} />
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

        {/* Upcoming Tournaments - Horizontal Scroller */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                <Calendar size={32} className="text-amber-500" />
                Upcoming Tournaments
              </h2>
              <p className="text-slate-400">Get ready for what's coming</p>
            </div>
            <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link href="/tournaments">View All →</Link>
            </Button>
          </div>

          {upcomingTournaments.length > 0 ? (
            <TournamentScrollContainer>
              <div className="flex gap-6 min-w-max">
                {upcomingTournaments.map((tournament) => (
                  <div key={tournament.id} className="w-96 flex-shrink-0">
                    <Card className="hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 border-slate-700 h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center transition-all duration-300">
                            <Calendar className="text-amber-500" size={24} />
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
                            <span className="text-amber-500 font-bold text-lg">${tournament.prize_pool.toLocaleString()}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-sm">Starts In</span>
                            <span className="text-slate-300 text-sm font-medium">
                              {Math.ceil((new Date(tournament.start_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                            </span>
                          </div>

                          <div className="pt-3 border-t border-slate-700">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">Starts</span>
                              <span className="text-slate-400">{new Date(tournament.start_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <Button asChild className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 group">
                          <Link href={`/tournaments/${tournament.id}`}>
                            View Details <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TournamentScrollContainer>
          ) : (
            <Card className="border-slate-700">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                  <Calendar className="text-slate-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">No Upcoming Tournaments</h3>
                <p className="text-slate-400 mb-6">Stay tuned for exciting new tournaments coming soon!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Expired Tournaments - Horizontal Scroller */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                <XCircle size={32} className="text-red-500" />
                Completed Tournaments
              </h2>
              <p className="text-slate-400">Review past tournaments and winners</p>
            </div>
            <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link href="/tournaments">View All →</Link>
            </Button>
          </div>

          {expiredTournaments.length > 0 ? (
            <TournamentScrollContainer>
              <div className="flex gap-6 min-w-max">
                {expiredTournaments.slice(0, 10).map((tournament) => (
                  <div key={tournament.id} className="w-96 flex-shrink-0">
                    <Card className="hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1 border-slate-700 h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center transition-all duration-300">
                            <XCircle className="text-red-500" size={24} />
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
                            <span className="text-red-500 font-bold text-lg">${tournament.prize_pool.toLocaleString()}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-sm">Ended</span>
                            <span className="text-slate-300 text-sm font-medium">
                              {new Date(tournament.end_date).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="pt-3 border-t border-slate-700">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">Duration</span>
                              <span className="text-slate-400">{Math.ceil((new Date(tournament.end_date).getTime() - new Date(tournament.start_date).getTime()) / (1000 * 60 * 60 * 24))} days</span>
                            </div>
                          </div>
                        </div>

                        <Button asChild variant="outline" className="w-full mt-4 border-slate-600 text-slate-300 hover:bg-slate-800 transition-all duration-300 group">
                          <Link href={`/tournaments/${tournament.id}`}>
                            View Results <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TournamentScrollContainer>
          ) : (
            <Card className="border-slate-700">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                  <XCircle className="text-slate-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">No Completed Tournaments Yet</h3>
                <p className="text-slate-400 mb-6">Check back after tournaments finish to see results and winners!</p>
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
                   <Card key={submission.id} className="hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 border-slate-700">
                     <CardContent className="p-6">
                       <div className="flex items-start justify-between">
                         <div className="flex-1">
                           <div className="flex items-center gap-3 mb-3">
                             <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center transition-all duration-300">
                               <Square className="text-blue-500" size={20} />
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
               <Card className="border-slate-700">
                 <CardContent className="p-12 text-center">
                   <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                     <TrendingUp className="text-slate-600" size={32} />
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
          <Card className="border-slate-700">
             <CardContent className="p-6">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <Award size={20} className="text-blue-500" />
                 Tournament Participation
               </h3>
               <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg transition-all duration-300 hover:bg-slate-700">
                   <span className="text-slate-400 flex items-center gap-2">
                     <Zap size={16} className="text-blue-500" />
                     Active Tournaments
                   </span>
                   <span className="text-2xl font-bold text-blue-500">{activeTournaments.length}</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg transition-all duration-300 hover:bg-slate-700">
                   <span className="text-slate-400 flex items-center gap-2">
                     <Activity size={16} className="text-green-500" />
                     Total Participated
                   </span>
                   <span className="text-2xl font-bold text-green-500">{userStats.joinedTournaments}</span>
                 </div>
               </div>
             </CardContent>
           </Card>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button
          asChild
          size="lg"
          className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300"
        >
          <Link href="/tournaments">
            <Plus size={28} />
          </Link>
        </Button>
      </div>
    </div>
  )
}
