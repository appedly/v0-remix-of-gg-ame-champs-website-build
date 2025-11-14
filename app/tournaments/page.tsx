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
    <div className="min-h-screen bg-slate-900">
      <UserNav userName={userData?.display_name || "User"} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Tournaments</h1>
          <p className="text-slate-400 text-lg">Browse and compete in gaming tournaments</p>
        </div>

        {/* Active Tournaments */}
        {activeTournaments.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-white">Active Now</h2>
              <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                {activeTournaments.length} running
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
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-white">Upcoming</h2>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20">
                {upcomingTournaments.length} coming
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
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-white">Completed</h2>
              <span className="px-3 py-1 bg-slate-500/10 text-slate-400 text-xs font-medium rounded-full border border-slate-500/20">
                {completedTournaments.length} finished
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
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-slate-400">●</span>
              </div>
              <p className="text-slate-300 mb-2 font-medium">No tournaments available</p>
              <p className="text-slate-400 text-sm">Check back soon for new competitions</p>
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
      className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 group"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
          {tournament.title}
        </h3>
      </div>

      <p className="text-slate-400 text-sm mb-2">{tournament.game}</p>

      {tournament.description && <p className="text-slate-300 text-sm mb-4 line-clamp-2">{tournament.description}</p>}

      <div className="space-y-3 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 text-xs uppercase tracking-wide">Prize Pool</span>
          <span className="text-blue-400 font-semibold">${tournament.prize_pool.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 text-xs uppercase tracking-wide">Ends</span>
          <span className="text-slate-300 text-sm">{new Date(tournament.end_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              tournament.status === "active"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : tournament.status === "upcoming"
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
            }`}
          >
            {tournament.status}
          </span>
        </div>
      </div>
    </Link>
  )
}
