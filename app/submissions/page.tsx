import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  FileVideo,
  CheckCircle2,
  Clock,
  XCircle,
  Trophy,
  Calendar,
  ExternalLink,
  Video,
  TrendingUp,
  Target,
  Sparkles,
  Award,
} from "lucide-react"

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
    <div className="min-h-screen bg-slate-900">
      <UserNav userName={userData?.display_name || "User"} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <FileVideo className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">My Submissions</h1>
              <p className="text-slate-400 mt-1">Track your tournament submissions and performance</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {submissions && submissions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-slate-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Target className="text-blue-500" size={24} />
                  </div>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                    Total
                  </Badge>
                </div>
                <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Total Submissions</h3>
                <p className="text-3xl font-bold text-white">{submissions.length}</p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="text-green-500" size={24} />
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                    Live
                  </Badge>
                </div>
                <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Approved</h3>
                <p className="text-3xl font-bold text-white">{approvedCount}</p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="text-amber-500" size={24} />
                  </div>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                    Review
                  </Badge>
                </div>
                <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Pending Review</h3>
                <p className="text-3xl font-bold text-white">{pendingCount}</p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Trophy className="text-purple-500" size={24} />
                  </div>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                    Score
                  </Badge>
                </div>
                <h3 className="text-slate-400 text-xs mb-1 uppercase tracking-wide">Total Votes</h3>
                <p className="text-3xl font-bold text-white">{totalVotes}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Submissions List */}
        {submissions && submissions.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-400" />
                Your Clips
              </h2>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/tournaments">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Submit New Clip
                </Link>
              </Button>
            </div>

            {submissions.map((submission) => {
              const voteCount = submission.votes?.length || 0
              const submittedDate = new Date(submission.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })

              const statusConfig = {
                approved: {
                  icon: CheckCircle2,
                  className: "bg-green-500/10 text-green-400 border-green-500/30",
                  label: "Approved",
                },
                pending: {
                  icon: Clock,
                  className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
                  label: "Pending",
                },
                rejected: {
                  icon: XCircle,
                  className: "bg-red-500/10 text-red-400 border-red-500/30",
                  label: "Rejected",
                },
              }

              const status = statusConfig[submission.status as keyof typeof statusConfig] || statusConfig.pending
              const StatusIcon = status.icon

              return (
                <Card
                  key={submission.id}
                  className="border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-white">{submission.title}</h3>
                          <Badge variant="outline" className={status.className}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-slate-400 text-sm mb-3">
                          <div className="flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-blue-400" />
                            <span className="font-medium text-white">{submission.tournament.title}</span>
                          </div>
                          <span className="text-slate-600">•</span>
                          <span>{submission.tournament.game}</span>
                          <span className="text-slate-600">•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{submittedDate}</span>
                          </div>
                        </div>

                        {submission.description && (
                          <p className="text-slate-400 text-sm leading-relaxed">{submission.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                      <Button asChild variant="outline" className="border-slate-600 hover:bg-slate-800">
                        <a
                          href={submission.clip_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Watch Clip
                        </a>
                      </Button>

                      <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <Trophy className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-medium">{voteCount}</span>
                        <span className="text-slate-400 text-sm">votes</span>
                      </div>

                      <Button asChild variant="outline" className="ml-auto border-slate-600 hover:bg-slate-800">
                        <Link href={`/tournaments/${submission.tournament_id}`} className="flex items-center gap-2">
                          View Tournament
                          <TrendingUp className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border-slate-700">
            <CardContent className="p-12">
              <div className="max-w-md mx-auto text-center">
                <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Video className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Submissions Yet</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  You haven't submitted any clips yet. Browse active tournaments and submit your best gaming moments to
                  compete for prizes!
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/tournaments" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Browse Tournaments
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
