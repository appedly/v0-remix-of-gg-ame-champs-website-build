"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"

interface Tournament {
  id: string
  title: string
  game: string
  prize_pool: number
  end_date: string
  status: string
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
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [activeTournaments, setActiveTournaments] = useState<Tournament[]>([])
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
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <UserNav userName={userData?.display_name || user?.email?.split("@")[0] || "User"} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Welcome back, {userData?.display_name || user?.email?.split("@")[0]}!
        </h1>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6">
            <h3 className="text-white/60 text-sm mb-2">Your Submissions</h3>
            <p className="text-3xl font-bold text-white">{submissions.length}</p>
          </div>
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6">
            <h3 className="text-white/60 text-sm mb-2">Active Tournaments</h3>
            <p className="text-3xl font-bold text-white">{activeTournaments.length}</p>
          </div>
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6">
            <h3 className="text-white/60 text-sm mb-2">Total Votes</h3>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
        </div>

        {/* Active Tournaments */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Active Tournaments</h2>
            <Link href="/tournaments" className="text-[#4A6CFF] hover:text-[#6A5CFF] text-sm">
              View All →
            </Link>
          </div>

          {activeTournaments.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {activeTournaments.slice(0, 4).map((tournament) => (
                <Link
                  key={tournament.id}
                  href={`/tournaments/${tournament.id}`}
                  className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 hover:border-[#4A6CFF] transition-colors group"
                >
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#4A6CFF]">
                    {tournament.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-3">{tournament.game}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#00C2FF] font-semibold">${tournament.prize_pool.toLocaleString()}</span>
                    <span className="text-white/40 text-sm">
                      Ends {new Date(tournament.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-12 text-center">
              <p className="text-white/60">No active tournaments at the moment</p>
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Your Recent Submissions</h2>
            <Link href="/submissions" className="text-[#4A6CFF] hover:text-[#6A5CFF] text-sm">
              View All →
            </Link>
          </div>

          {submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.slice(0, 3).map((submission) => (
                <div key={submission.id} className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{submission.title}</h3>
                      <p className="text-white/60 text-sm">
                        {submission.tournament.title} - {submission.tournament.game}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        submission.status === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : submission.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {submission.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-12 text-center">
              <p className="text-white/60 mb-4">You haven't submitted any clips yet</p>
              <Link
                href="/tournaments"
                className="inline-block px-4 py-2 bg-[#4A6CFF] text-white rounded-lg hover:bg-[#6A5CFF] transition-colors"
              >
                Browse Tournaments
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
