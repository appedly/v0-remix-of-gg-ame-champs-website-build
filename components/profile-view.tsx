"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Heart, Award, CheckCircle2, Calendar, FileVideo, Play, Crown, Twitter, Youtube } from "lucide-react"
import { VideoPlayer } from "./video-player"
import { Button } from "./ui/button"
import Link from "next/link"

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
  twitter_url?: string | null
  discord_username?: string | null
  youtube_url?: string | null
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
        {/* Cover Image - Gradient pattern background */}
        <div className="h-48 relative overflow-hidden border-b border-slate-700">
          {/* Geometric pattern background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-slate-900 to-purple-900/20" />
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgb(59 130 246 / 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(59 130 246 / 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
        </div>

        {/* Profile Info Section */}
        <div className="px-4">
          <div className="relative">
            {/* Avatar - Overlapping cover with thicker border */}
            <div className="absolute -top-20 left-0">
              <div className="w-32 h-32 rounded-full border-[6px] border-slate-900 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-xl">
                <span className="text-4xl font-bold text-white">
                  {profileUser.display_name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Edit Profile Button or Founding Member Badge */}
            <div className="absolute -top-3 right-0">
              {isOwnProfile ? (
                <Link href="/profile">
                  <Button className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 transition-all duration-200">
                    Edit Profile
                  </Button>
                </Link>
              ) : (
                profileUser.founding_member && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm uppercase tracking-wide">Founding Member</span>
                  </div>
                )
              )}
            </div>

            {/* User Info */}
            <div className="pt-16">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-white">{profileUser.display_name}</h1>
                    {profileUser.founding_member && (
                      <CheckCircle2 className="w-6 h-6 text-blue-400 fill-blue-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {profileUser.bio && (
                <p className="text-slate-300 text-[15px] leading-relaxed mb-4">{profileUser.bio}</p>
              )}

              {/* Social Media Links */}
              {(profileUser.twitter_url || profileUser.discord_username || profileUser.youtube_url) && (
                <div className="flex items-center gap-3 mb-4">
                  {profileUser.twitter_url && (
                    <a
                      href={profileUser.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 border border-slate-700 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-200 group"
                    >
                      <Twitter className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    </a>
                  )}
                  {profileUser.discord_username && (
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all duration-200"
                      title={profileUser.discord_username}
                    >
                      <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                      <span className="text-xs text-slate-400">{profileUser.discord_username}</span>
                    </div>
                  )}
                  {profileUser.youtube_url && (
                    <a
                      href={profileUser.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 border border-slate-700 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200 group"
                    >
                      <Youtube className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
                    </a>
                  )}
                </div>
              )}

              {/* Meta info - X style */}
              <div className="flex items-center gap-4 text-slate-500 text-sm mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(profileUser.created_at)}</span>
                </div>
              </div>

              {/* Stats - X style inline with icons */}
              <div className="flex items-center gap-5 text-sm">
                <div className="flex items-center gap-1.5">
                  <FileVideo className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-white">{submissions.length}</span>
                  <span className="text-slate-500">Submissions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white">{totalVotes}</span>
                  <span className="text-slate-500">Votes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span className="font-bold text-white">{totalLikes}</span>
                  <span className="text-slate-500">Likes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-white">{totalPoints}</span>
                  <span className="text-slate-500">Points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section - Pill style tabs with filled active state */}
      <Tabs defaultValue="clips" className="w-full">
        <div className="border-b border-slate-700 px-4 mb-2">
          <TabsList className="w-auto h-auto p-1 bg-slate-800/50 border border-slate-700 rounded-lg">
            <TabsTrigger
              value="clips"
              className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 px-6 py-2.5 font-semibold hover:bg-slate-700/50 transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20"
            >
              Clips
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 px-6 py-2.5 font-semibold hover:bg-slate-700/50 transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20"
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

            {/* Averages - Compact */}
            <div className="py-6">
              <h3 className="text-white font-semibold text-sm mb-3">Average Performance</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50 text-center">
                  <div className="text-slate-400 text-xs mb-1">Avg. Points</div>
                  <div className="text-white font-bold text-lg">
                    {submissions.length > 0 ? (totalPoints / submissions.length).toFixed(1) : 0}
                  </div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50 text-center">
                  <div className="text-slate-400 text-xs mb-1">Avg. Likes</div>
                  <div className="text-white font-bold text-lg">
                    {submissions.length > 0 ? (totalLikes / submissions.length).toFixed(1) : 0}
                  </div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50 text-center">
                  <div className="text-slate-400 text-xs mb-1">Avg. Votes</div>
                  <div className="text-white font-bold text-lg">
                    {submissions.length > 0 ? (totalVotes / submissions.length).toFixed(1) : 0}
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
