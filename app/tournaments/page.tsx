import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import { TournamentFeaturedSlider } from "@/components/tournament-featured-slider"

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

  const allTournaments = tournaments || []

  return (
    <div className="min-h-screen bg-slate-900">
      <UserNav userName={userData?.display_name || "User"} />

      <main className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        {/* Page Header */}
        <div className="mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">Tournaments</h1>
          <p className="text-slate-400 text-lg">Discover and compete in epic tournaments</p>
        </div>

        {/* Featured Slider */}
        {allTournaments.length > 0 ? (
          <TournamentFeaturedSlider tournaments={allTournaments} />
        ) : (
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
