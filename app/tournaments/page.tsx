import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import TournamentHeroCarousel from "@/components/tournament-hero-carousel"

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

  return (
    <div className="min-h-screen bg-slate-900">
      <UserNav userName={userData?.display_name || "User"} />

      <main className="w-full">
        <TournamentHeroCarousel tournaments={tournaments || []} />
      </main>
    </div>
  )
}
