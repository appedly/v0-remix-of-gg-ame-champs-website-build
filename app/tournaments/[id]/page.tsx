import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import { SubmissionForm } from "@/components/submission-form"
import { TournamentSubmissions } from "@/components/tournament-submissions"

export default async function TournamentDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  const { data: tournament } = await supabase.from("tournaments").select("*").eq("id", params.id).single()

  if (!tournament) {
    notFound()
  }

  // Get submissions for this tournament
  const { data: submissions } = await supabase
    .from("submissions")
    .select(
      `
      *,
      user:users(display_name),
      votes:votes(count)
    `,
    )
    .eq("tournament_id", tournament.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  // Check if user has already submitted
  const { data: userSubmission } = await supabase
    .from("submissions")
    .select("*")
    .eq("tournament_id", tournament.id)
    .eq("user_id", user.id)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <UserNav userName={userData?.display_name || "User"} />

      <main className="container mx-auto px-4 py-8">
        {/* Tournament Header */}
        <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{tournament.title}</h1>
              <p className="text-white/60 text-lg">{tournament.game}</p>
            </div>
            <span
              className={`px-3 py-1 rounded text-sm font-medium ${
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

          {tournament.description && <p className="text-white/70 mb-6">{tournament.description}</p>}

          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-white/40 text-sm mb-1">Prize Pool</p>
              <p className="text-2xl font-bold text-[#00C2FF]">${tournament.prize_pool.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-white/40 text-sm mb-1">Start Date</p>
              <p className="text-white font-semibold">{new Date(tournament.start_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-white/40 text-sm mb-1">End Date</p>
              <p className="text-white font-semibold">{new Date(tournament.end_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-white/40 text-sm mb-1">Submissions</p>
              <p className="text-white font-semibold">{submissions?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submission Form */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-4">Submit Your Clip</h2>
            {tournament.status === "active" ? (
              userSubmission ? (
                <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6">
                  <p className="text-white/60 mb-2">You've already submitted to this tournament</p>
                  <p className="text-white font-semibold">{userSubmission.title}</p>
                  <span
                    className={`inline-block mt-3 px-2 py-1 rounded text-xs font-medium ${
                      userSubmission.status === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : userSubmission.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {userSubmission.status}
                  </span>
                </div>
              ) : (
                <SubmissionForm tournamentId={tournament.id} userId={user.id} />
              )
            ) : (
              <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6">
                <p className="text-white/60">
                  {tournament.status === "upcoming"
                    ? "This tournament hasn't started yet"
                    : "This tournament has ended"}
                </p>
              </div>
            )}
          </div>

          {/* Submissions List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4">Submissions</h2>
            <TournamentSubmissions submissions={submissions || []} userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
