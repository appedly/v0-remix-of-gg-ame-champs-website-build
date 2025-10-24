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

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <UserNav userName={userData?.display_name || "User"} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">My Submissions</h1>

        {submissions && submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.map((submission) => {
              const voteCount = submission.votes?.length || 0

              return (
                <div key={submission.id} className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{submission.title}</h3>
                      <p className="text-white/60 text-sm mb-1">
                        {submission.tournament.title} - {submission.tournament.game}
                      </p>
                      {submission.description && <p className="text-white/70 text-sm">{submission.description}</p>}
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

                  <div className="flex items-center gap-4">
                    <a
                      href={submission.clip_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4A6CFF] hover:text-[#6A5CFF] text-sm"
                    >
                      View Video →
                    </a>
                    <span className="text-white/40 text-sm">{voteCount} votes</span>
                    <Link
                      href={`/tournaments/${submission.tournament_id}`}
                      className="ml-auto text-white/60 hover:text-white text-sm"
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
            <p className="text-white/60 mb-4">You haven't submitted any clips yet</p>
            <Link
              href="/tournaments"
              className="inline-block px-4 py-2 bg-[#4A6CFF] text-white rounded-lg hover:bg-[#6A5CFF] transition-colors"
            >
              Browse Tournaments
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
