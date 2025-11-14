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

  // Get submissions for this tournament - ordered by score (vote points)
  const { data: submissionsData } = await supabase
    .from("submissions")
    .select(
      `
      *,
      user:users(display_name, id)
    `,
    )
    .eq("tournament_id", tournament.id)
    .eq("status", "approved")
    .order("score", { ascending: false })

  // Filter out submissions with null user data (deleted users or RLS restricted)
  const submissions = submissionsData?.filter(s => s.user !== null) || []

  // Check if user has already submitted and if it's approved
  const { data: userSubmission } = await supabase
    .from("submissions")
    .select("*")
    .eq("tournament_id", tournament.id)
    .eq("user_id", user.id)
    .maybeSingle()

  // Check if user has an approved submission (can vote)
  const canVote = userSubmission?.status === "approved"

  // Get all votes and likes for the submissions
  const submissionIds = submissions?.map((s) => s.id) || []

  const { data: allVotes } = await supabase
    .from("votes")
    .select("submission_id, user_id, rank")
    .in("submission_id", submissionIds)

  const { data: allLikes } = await supabase.from("likes").select("submission_id, user_id").in("submission_id", submissionIds)

  // Get user's votes for this tournament
  const { data: userVotes } = await supabase
    .from("votes")
    .select("submission_id, rank")
    .eq("user_id", user.id)
    .in("submission_id", submissionIds)

  // Get user's likes
  const { data: userLikes } = await supabase
    .from("likes")
    .select("submission_id")
    .eq("user_id", user.id)
    .in("submission_id", submissionIds)

  return (
    <div className="min-h-screen bg-slate-900">
      <UserNav userName={userData?.display_name || "User"} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Tournament Header */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{tournament.title}</h1>
              <p className="text-slate-400 text-lg">{tournament.game}</p>
            </div>
            <span
              className={`px-4 py-1 rounded-full text-sm font-medium ${
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

          {tournament.description && <p className="text-slate-300 mb-6">{tournament.description}</p>}

          <div className="grid md:grid-cols-4 gap-6 pt-6 border-t border-slate-700">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Prize Pool</p>
              <p className="text-2xl font-bold text-blue-400">${tournament.prize_pool.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Start Date</p>
              <p className="text-slate-300 font-semibold">{new Date(tournament.start_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">End Date</p>
              <p className="text-slate-300 font-semibold">{new Date(tournament.end_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Submissions</p>
              <p className="text-slate-300 font-semibold">{submissions?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submission Form */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-white mb-4">Submit Your Clip</h2>
            {tournament.status === "active" ? (
              userSubmission ? (
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <p className="text-slate-400 mb-3">Already submitted</p>
                  <p className="text-white font-semibold mb-3">{userSubmission.title}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      userSubmission.status === "approved"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : userSubmission.status === "pending"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {userSubmission.status}
                  </span>
                </div>
              ) : (
                <SubmissionForm tournamentId={tournament.id} userId={user.id} />
              )
            ) : (
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <p className="text-slate-400">
                  {tournament.status === "upcoming"
                    ? "This tournament hasn't started yet"
                    : "This tournament has ended"}
                </p>
              </div>
            )}
          </div>

          {/* Submissions List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">Submissions</h2>
            <TournamentSubmissions
              submissions={submissions || []}
              userId={user.id}
              tournamentId={tournament.id}
              canVote={canVote}
              allVotes={allVotes || []}
              allLikes={allLikes || []}
              userVotes={userVotes || []}
              userLikes={userLikes || []}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
