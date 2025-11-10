import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"

export default async function TournamentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  const { data: tournaments } = await supabase.from("tournaments").select("*").order("start_date", { ascending: false })

  const activeTournaments = tournaments?.filter((t) => t.status === "active") || []
  const upcomingTournaments = tournaments?.filter((t) => t.status === "upcoming") || []
  const completedTournaments = tournaments?.filter((t) => t.status === "completed") || []

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <UserNav userName={userData?.display_name || "User"} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Tournaments</h1>
          <p className="text-white/60">Browse and compete in active gaming tournaments</p>
        </div>

        {/* Active Tournaments */}
        {activeTournaments.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <h2 className="text-2xl font-bold text-white">Active Now</h2>
              <span className="ml-2 px-2 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full">
                {activeTournaments.length}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Tournaments */}
        {upcomingTournaments.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
              <span className="ml-2 px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full">
                {upcomingTournaments.length}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tournaments */}
        {completedTournaments.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <h2 className="text-2xl font-bold text-white">Past Tournaments</h2>
              <span className="ml-2 px-2 py-1 bg-gray-500/10 text-gray-400 text-xs font-medium rounded-full">
                {completedTournaments.length}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          </div>
        )}

        {tournaments?.length === 0 && (
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-[#4A6CFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-[#4A6CFF]">●</span>
              </div>
              <p className="text-white/60 mb-2">No tournaments available at the moment</p>
              <p className="text-white/40 text-sm">Check back soon for new competitions</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function TournamentCard({ tournament }: { tournament: any }) {
  return (
    <Link
      href={`/tournaments/${tournament.id}`}
      className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 hover:border-[#4A6CFF] transition-all hover:shadow-[0_0_20px_rgba(74,108,255,0.3)] group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-white group-hover:text-[#4A6CFF] transition-colors">
          {tournament.title}
        </h3>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            tournament.status === "active"
              ? "bg-green-500/20 text-green-400"
              : tournament.status === "upcoming"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-gray-500/20 text-gray-400"
          }`}
        >
          {tournament.status}
        </span>
      </div>

      <p className="text-white/60 text-sm mb-4">{tournament.game}</p>

      {tournament.description && <p className="text-white/70 text-sm mb-4 line-clamp-2">{tournament.description}</p>}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white/40 text-sm">Prize Pool</span>
          <span className="text-[#00C2FF] font-semibold">${tournament.prize_pool.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/40 text-sm">Ends</span>
          <span className="text-white/70 text-sm">{new Date(tournament.end_date).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  )
}
