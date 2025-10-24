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

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Tournaments</h1>

        {/* Active Tournaments */}
        {activeTournaments.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Active Now</h2>
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
            <h2 className="text-2xl font-bold text-white mb-4">Coming Soon</h2>
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
            <h2 className="text-2xl font-bold text-white mb-4">Past Tournaments</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          </div>
        )}

        {tournaments?.length === 0 && (
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-12 text-center">
            <p className="text-white/60">No tournaments available at the moment</p>
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
