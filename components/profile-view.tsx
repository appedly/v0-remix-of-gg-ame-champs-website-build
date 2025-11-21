"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Heart, Award, CheckCircle2, Calendar, FileVideo, TrendingUp, Crown } from "lucide-react"
import { VideoPlayer } from "./video-player"

type Submission = {
  id: string
  title: string
  clip_url: string
  description: string | null
  score: number
  created_at: string
  tournament: { title: string; status: string } | null
  likes: any[]
  votes: any[]
}

type ProfileUser = {
  id: string
  display_name: string
  bio: string | null
  email: string
  created_at: string
  founding_member: boolean
}

interface ProfileViewProps {
  profileUser: ProfileUser
  submissions: Submission[]
  totalLikes: number
  totalVotes: number
  totalPoints: number
  isOwnProfile: boolean
}

export function ProfileView({
  profileUser,
  submissions,
  totalLikes,
  totalVotes,
  totalPoints,
  isOwnProfile,
}: ProfileViewProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <main className="container mx-auto px-4 pb-8 max-w-5xl">
      {/* Header/Cover Section */}
      <div className="relative mb-20">
        {/* Cover Image - Gradient Background */}
        <div className="h-48 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-b-xl border-b border-slate-700">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_40%,transparent_100%)] opacity-20" />
        </div>

        {/* Profile Info Section */}
        <div className="px-4 sm:px-6">
          <div className="relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-900">
                  <span className="text-4xl font-bold text-white">
                    {profileUser.display_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="pt-20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-white">{profileUser.display_name}</h1>
                    {profileUser.founding_member && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-500/30">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400" />
                        <span className="text-blue-400 font-semibold text-xs">Verified</span>
                      </div>
                    )}
                  </div>
                  {profileUser.founding_member && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                        <Crown className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold text-xs uppercase tracking-wide">
                          Founding Member
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profileUser.bio && (
                <p className="text-slate-300 text-sm leading-relaxed mb-4 max-w-2xl">{profileUser.bio}</p>
              )}

              {/* Join Date */}
              <div className="flex items-center gap-4 text-slate-400 text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(profileUser.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="border-slate-700 hover:border-slate-600 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                <FileVideo className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{submissions.length}</div>
              <div className="text-slate-400 text-xs uppercase tracking-wide">Submissions</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 hover:border-slate-600 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mb-3">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{totalLikes}</div>
              <div className="text-slate-400 text-xs uppercase tracking-wide">Likes</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 hover:border-slate-600 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-3">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{totalVotes}</div>
              <div className="text-slate-400 text-xs uppercase tracking-wide">Votes</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 hover:border-slate-600 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-3">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{totalPoints}</div>
              <div className="text-slate-400 text-xs uppercase tracking-wide">Points</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="clips" className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-slate-800 border border-slate-700 p-1 h-auto">
          <TabsTrigger
            value="clips"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 py-3 text-sm font-medium"
          >
            <FileVideo className="w-4 h-4 mr-2" />
            Submissions ({submissions.length})
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 py-3 text-sm font-medium"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clips" className="mt-6">
          {submissions.length === 0 ? (
            <Card className="border-slate-700">
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileVideo className="text-slate-400 w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">No submissions yet</h3>
                  <p className="text-slate-400">
                    {isOwnProfile
                      ? "You haven't submitted any clips yet. Head to tournaments to submit your first clip!"
                      : "This user hasn't submitted any clips yet."}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {submissions.map((submission) => {
                const likeCount = Array.isArray(submission.likes) ? submission.likes.length : 0
                const voteCount = Array.isArray(submission.votes) ? submission.votes.length : 0

                return (
                  <Card
                    key={submission.id}
                    className="border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer overflow-hidden group"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <CardContent className="p-0">
                      {/* Thumbnail/Preview */}
                      <div className="aspect-video bg-slate-800 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-all duration-300">
                          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <FileVideo className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        {/* Top Stats Badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-500/90 text-white border-blue-400 backdrop-blur-sm">
                            <Trophy className="w-3 h-3 mr-1" />
                            {submission.score || 0} pts
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-2 line-clamp-1">{submission.title}</h3>
                        {submission.tournament && (
                          <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600 mb-3 text-xs">
                            {submission.tournament.title}
                          </Badge>
                        )}
                        {submission.description && (
                          <p className="text-slate-400 text-sm mb-3 line-clamp-2">{submission.description}</p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1 text-pink-400">
                            <Heart className="w-3.5 h-3.5" />
                            <span>{likeCount}</span>
                          </div>
                          <div className="flex items-center gap-1 text-purple-400">
                            <Trophy className="w-3.5 h-3.5" />
                            <span>{voteCount}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(submission.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Performing Submission */}
            {submissions.length > 0 && (
              <Card className="border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <Trophy className="text-amber-400" size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Top Performing Clip</h3>
                      <p className="text-slate-400 text-xs">Most points earned</p>
                    </div>
                  </div>
                  {(() => {
                    const topSubmission = [...submissions].sort((a, b) => (b.score || 0) - (a.score || 0))[0]
                    return (
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="text-white font-medium mb-2 line-clamp-1">{topSubmission.title}</div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-amber-400">
                            <Award className="w-4 h-4" />
                            <span className="font-bold">{topSubmission.score || 0} pts</span>
                          </div>
                          <div className="flex items-center gap-1 text-pink-400">
                            <Heart className="w-4 h-4" />
                            <span>{Array.isArray(topSubmission.likes) ? topSubmission.likes.length : 0}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Average Stats */}
            <Card className="border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Average Performance</h3>
                    <p className="text-slate-400 text-xs">Per submission</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                    <div className="text-slate-400 text-xs mb-1">Avg. Points</div>
                    <div className="text-white font-bold text-lg">
                      {submissions.length > 0 ? (totalPoints / submissions.length).toFixed(1) : 0}
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                    <div className="text-slate-400 text-xs mb-1">Avg. Likes</div>
                    <div className="text-white font-bold text-lg">
                      {submissions.length > 0 ? (totalLikes / submissions.length).toFixed(1) : 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tournament Participation */}
            <Card className="border-slate-700 md:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <FileVideo className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Tournament Participation</h3>
                    <p className="text-slate-400 text-xs">Tournaments entered</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {new Set(submissions.map((s) => s.tournament?.title).filter(Boolean)).size}
                </div>
                <p className="text-slate-400 text-sm">
                  Participated in {new Set(submissions.map((s) => s.tournament?.title).filter(Boolean)).size} unique
                  tournament{new Set(submissions.map((s) => s.tournament?.title).filter(Boolean)).size !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Video Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden border-slate-700 shadow-2xl">
            <CardContent className="p-0">
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedSubmission.title}</h2>
                    <div className="flex items-center gap-3 flex-wrap">
                      {selectedSubmission.tournament && (
                        <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">
                          {selectedSubmission.tournament.title}
                        </Badge>
                      )}
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1 text-pink-400">
                          <Heart className="w-4 h-4" />
                          <span>{Array.isArray(selectedSubmission.likes) ? selectedSubmission.likes.length : 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-purple-400">
                          <Trophy className="w-4 h-4" />
                          <span>{Array.isArray(selectedSubmission.votes) ? selectedSubmission.votes.length : 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Award className="w-4 h-4" />
                          <span>{selectedSubmission.score || 0} pts</span>
                        </div>
                      </div>
                    </div>
                    {selectedSubmission.description && (
                      <p className="text-slate-300 mt-3 leading-relaxed text-sm">{selectedSubmission.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-slate-400 hover:text-white text-2xl transition-colors p-2 hover:bg-slate-700 rounded-lg ml-4"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="aspect-video bg-black">
                <VideoPlayer url={selectedSubmission.clip_url} title={selectedSubmission.title} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
