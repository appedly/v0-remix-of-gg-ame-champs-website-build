import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"

export default async function MySubmissionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  const { data: submissions } = await supabase
    .from("submissions")
    .select(
      `
      *,
      tournament:tournaments(title, game, status),
      votes:votes(count)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const approvedCount = submissions?.filter((s) => s.status === "approved").length || 0
  const pendingCount = submissions?.filter((s) => s.status === "pending").length || 0
  const rejectedCount = submissions?.filter((s) => s.status === "rejected").length || 0
  const totalVotes = submissions?.reduce((sum, s) => sum + (s.votes?.length || 0), 0) || 0

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <UserNav userName={userData?.display_name || "User"} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Submissions</h1>
          <p className="text-white/60">Track your tournament submissions and performance</p>
        </div>

        {submissions && submissions.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-4">
              <div className="text-white/40 text-sm mb-1">Total Submissions</div>
              <div className="text-2xl font-bold text-white">{submissions.length}</div>
            </div>
            <div className="bg-[#1a2332] rounded-lg border border-green-500/20 p-4">
              <div className="text-white/40 text-sm mb-1">Approved</div>
              <div className="text-2xl font-bold text-green-400">{approvedCount}</div>
            </div>
            <div className="bg-[#1a2332] rounded-lg border border-yellow-500/20 p-4">
              <div className="text-white/40 text-sm mb-1">Pending Review</div>
              <div className="text-2xl font-bold text-yellow-400">{pendingCount}</div>
            </div>
            <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-4">
              <div className="text-white/40 text-sm mb-1">Total Votes</div>
              <div className="text-2xl font-bold text-[#00C2FF]">{totalVotes}</div>
            </div>
          </div>
        )}

        {submissions && submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.map((submission) => {
              const voteCount = submission.votes?.length || 0
              const submittedDate = new Date(submission.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })

              return (
                <div
                  key={submission.id}
                  className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 hover:border-[#4A6CFF]/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{submission.title}</h3>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            submission.status === "approved"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : submission.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                        <span className="font-medium">{submission.tournament.title}</span>
                        <span>•</span>
                        <span>{submission.tournament.game}</span>
                        <span>•</span>
                        <span className="text-white/40">{submittedDate}</span>
                      </div>
                      {submission.description && (
                        <p className="text-white/70 text-sm mt-2">{submission.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-[#2a3342]">
                    <a
                      href={submission.clip_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4A6CFF] hover:text-[#6A5CFF] text-sm font-medium transition-colors"
                    >
                      View Video →
                    </a>
                    <div className="flex items-center gap-1.5 text-white/40 text-sm">
                      <span className="text-[#00C2FF]">↑</span>
                      <span>{voteCount} votes</span>
                    </div>
                    <Link
                      href={`/tournaments/${submission.tournament_id}`}
                      className="ml-auto text-white/60 hover:text-white text-sm font-medium transition-colors"
                    >
                      View Tournament →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-[#4A6CFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-[#4A6CFF]">+</span>
              </div>
              <p className="text-white/60 mb-4">You haven't submitted any clips yet</p>
              <Link
                href="/tournaments"
                className="inline-block px-6 py-3 bg-[#4A6CFF] text-white rounded-lg hover:bg-[#6A5CFF] transition-colors font-medium"
              >
                Browse Tournaments
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
