"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Heart, Award, CheckCircle2, Calendar, FileVideo, Play } from "lucide-react"
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
    <main className="container mx-auto px-0 pb-8 max-w-3xl">
      {/* Header/Cover Section - X Style */}
      <div className="relative mb-16">
        {/* Cover Image - Simple gradient */}
        <div className="h-48 bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700" />

        {/* Profile Info Section */}
        <div className="px-4">
          <div className="relative">
            {/* Avatar - X style positioning */}
            <div className="absolute -top-16 left-0">
              <div className="w-32 h-32 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {profileUser.display_name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="pt-20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <h1 className="text-xl font-bold text-white">{profileUser.display_name}</h1>
                    {profileUser.founding_member && (
                      <CheckCircle2 className="w-5 h-5 text-blue-400 fill-blue-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {profileUser.bio && (
                <p className="text-slate-300 text-[15px] leading-normal mb-3">{profileUser.bio}</p>
              )}

              {/* Meta info - X style */}
              <div className="flex items-center gap-4 text-slate-500 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(profileUser.created_at)}</span>
                </div>
              </div>

              {/* Stats - X style inline */}
              <div className="flex items-center gap-5 text-sm">
                <div>
                  <span className="font-bold text-white">{submissions.length}</span>
                  <span className="text-slate-500 ml-1">Submissions</span>
                </div>
                <div>
                  <span className="font-bold text-white">{totalVotes}</span>
                  <span className="text-slate-500 ml-1">Votes</span>
                </div>
                <div>
                  <span className="font-bold text-white">{totalLikes}</span>
                  <span className="text-slate-500 ml-1">Likes</span>
                </div>
                <div>
                  <span className="font-bold text-white">{totalPoints}</span>
                  <span className="text-slate-500 ml-1">Points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section - X style underline tabs */}
      <Tabs defaultValue="clips" className="w-full">
        <div className="border-b border-slate-700">
          <TabsList className="w-full h-auto p-0 bg-transparent border-0 justify-start px-4">
            <TabsTrigger
              value="clips"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-white text-slate-500 px-4 py-4 font-medium hover:bg-slate-800/50 transition-colors"
            >
              Clips
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-white text-slate-500 px-4 py-4 font-medium hover:bg-slate-800/50 transition-colors"
            >
              Stats
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="clips" className="mt-0 px-4">
          {submissions.length === 0 ? (
            <div className="py-12 text-center border-b border-slate-700">
              <FileVideo className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                {isOwnProfile ? "You haven't submitted any clips yet" : "No clips yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {submissions.map((submission) => {
                const likeCount = Array.isArray(submission.likes) ? submission.likes.length : 0
                const voteCount = Array.isArray(submission.votes) ? submission.votes.length : 0

                return (
                  <div
                    key={submission.id}
                    className="py-4 hover:bg-slate-800/30 transition-colors cursor-pointer -mx-4 px-4"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="flex gap-3">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-32 h-20 bg-slate-800 rounded-lg overflow-hidden relative group">
                        <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white opacity-80 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-[15px] mb-1 line-clamp-1">{submission.title}</h3>
                        {submission.description && (
                          <p className="text-slate-400 text-sm mb-2 line-clamp-2">{submission.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-slate-500 text-sm">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{likeCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            <span>{voteCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            <span>{submission.score || 0} pts</span>
                          </div>
                          <span>·</span>
                          <span>{formatDate(submission.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stats" className="mt-0 px-4">
          <div className="divide-y divide-slate-700">
            {/* Top Performing */}
            {submissions.length > 0 && (
              <div className="py-6">
                <h3 className="text-white font-semibold text-sm mb-3">Top Performing Clip</h3>
                {(() => {
                  const topSubmission = [...submissions].sort((a, b) => (b.score || 0) - (a.score || 0))[0]
                  return (
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                      <div className="text-white font-medium mb-2">{topSubmission.title}</div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-amber-400" />
                          <span className="text-amber-400 font-semibold">{topSubmission.score || 0} pts</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{Array.isArray(topSubmission.likes) ? topSubmission.likes.length : 0} likes</span>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Averages */}
            <div className="py-6">
              <h3 className="text-white font-semibold text-sm mb-3">Average Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <div className="text-slate-400 text-xs mb-1">Avg. Points</div>
                  <div className="text-white font-bold text-xl">
                    {submissions.length > 0 ? (totalPoints / submissions.length).toFixed(1) : 0}
                  </div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <div className="text-slate-400 text-xs mb-1">Avg. Likes</div>
                  <div className="text-white font-bold text-xl">
                    {submissions.length > 0 ? (totalLikes / submissions.length).toFixed(1) : 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Tournaments */}
            <div className="py-6">
              <h3 className="text-white font-semibold text-sm mb-3">Tournaments</h3>
              <div className="text-white text-2xl font-bold mb-1">
                {new Set(submissions.map((s) => s.tournament?.title).filter(Boolean)).size}
              </div>
              <p className="text-slate-400 text-sm">
                Participated in {new Set(submissions.map((s) => s.tournament?.title).filter(Boolean)).size} unique
                tournament{new Set(submissions.map((s) => s.tournament?.title).filter(Boolean)).size !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Video Modal - Minimalistic */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="max-w-4xl w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
            <div className="p-4 border-b border-slate-700 flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-white mb-1 truncate">{selectedSubmission.title}</h2>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{Array.isArray(selectedSubmission.likes) ? selectedSubmission.likes.length : 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    <span>{Array.isArray(selectedSubmission.votes) ? selectedSubmission.votes.length : 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{selectedSubmission.score || 0} pts</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-white text-xl transition-colors p-1.5 hover:bg-slate-800 rounded ml-3 flex-shrink-0"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-black">
              <VideoPlayer url={selectedSubmission.clip_url} title={selectedSubmission.title} />
            </div>
            {selectedSubmission.description && (
              <div className="p-4 border-t border-slate-700">
                <p className="text-slate-300 text-sm">{selectedSubmission.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
