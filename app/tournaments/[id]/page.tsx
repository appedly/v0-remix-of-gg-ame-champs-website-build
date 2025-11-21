import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import { SubmissionForm } from "@/components/submission-form"
import { TournamentSubmissions } from "@/components/tournament-submissions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Calendar, 
  Users, 
  DollarSign, 
  Gamepad2, 
  Clock,
  Target,
  Zap,
  TrendingUp,
  Play
} from "lucide-react"

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
      user:users(display_name, id, founding_member)
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
    <div className="min-h-screen bg-slate-900 font-gaming">
      <UserNav userName={userData?.display_name || "User"} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Tournament Hero Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8 mb-8 relative overflow-hidden transition-all duration-300 hover:border-slate-600 hover:shadow-lg hover:shadow-blue-500/5">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <Gamepad2 className="text-blue-500" size={32} />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{tournament.title}</h1>
                    <p className="text-slate-400 text-lg flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      {tournament.game}
                    </p>
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  tournament.status === "active"
                    ? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20"
                    : tournament.status === "upcoming"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                      : "bg-slate-500/10 text-slate-400 border-slate-500/30 hover:bg-slate-500/20"
                }`}
              >
                {tournament.status === "active" && <Zap className="w-4 h-4 mr-1" />}
                {tournament.status === "upcoming" && <Clock className="w-4 h-4 mr-1" />}
                {tournament.status}
              </Badge>
            </div>

            {tournament.description && (
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">{tournament.description}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 border-t border-slate-700">
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="text-blue-500 w-5 h-5" />
                  </div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Prize Pool</p>
                  <p className="text-2xl font-bold text-blue-400">${tournament.prize_pool.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="text-green-500 w-5 h-5" />
                  </div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Start Date</p>
                  <p className="text-slate-300 font-semibold">{new Date(tournament.start_date).toLocaleDateString()}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="text-amber-500 w-5 h-5" />
                  </div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">End Date</p>
                  <p className="text-slate-300 font-semibold">{new Date(tournament.end_date).toLocaleDateString()}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="text-purple-500 w-5 h-5" />
                  </div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Submissions</p>
                  <p className="text-slate-300 font-semibold">{submissions?.length || 0}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submission Form */}
          <div className="lg:col-span-1">
            <Card className="border-slate-700 hover:border-slate-600 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Play className="w-5 h-5 text-blue-500" />
                  Submit Your Clip
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tournament.status === "active" ? (
                  userSubmission ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="text-blue-500 w-8 h-8" />
                      </div>
                      <p className="text-slate-400 mb-3">Already submitted</p>
                      <p className="text-white font-semibold mb-3">{userSubmission.title}</p>
                      <Badge
                        variant="outline"
                        className={
                          userSubmission.status === "approved"
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : userSubmission.status === "pending"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-red-500/10 text-red-400 border-red-500/30"
                        }
                      >
                        {userSubmission.status}
                      </Badge>
                    </div>
                  ) : (
                    <SubmissionForm tournamentId={tournament.id} userId={user.id} />
                  )
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="text-slate-400 w-8 h-8" />
                    </div>
                    <p className="text-slate-400">
                      {tournament.status === "upcoming"
                        ? "This tournament hasn't started yet"
                        : "This tournament has ended"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Submissions List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  Submissions
                </h2>
                <p className="text-slate-400">Top clips ranked by community votes</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Trophy className="w-4 h-4" />
                <span>Vote for your favorites</span>
              </div>
            </div>
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
