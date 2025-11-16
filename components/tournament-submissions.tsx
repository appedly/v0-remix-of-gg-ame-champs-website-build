"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Heart, Trophy, Medal, Award, Play, User, Eye } from "lucide-react"
import { VideoPlayer } from "./video-player"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Submission = {
  id: string
  title: string
  clip_url: string
  description: string | null
  score: number
  user_id: string
  user: { display_name: string; id: string } | null
}

type Vote = {
  submission_id: string
  user_id: string
  rank: number
}

type Like = {
  submission_id: string
  user_id: string
}

interface TournamentSubmissionsProps {
  submissions: Submission[]
  userId: string
  tournamentId: string
  canVote: boolean
  allVotes: Vote[]
  allLikes: Like[]
  userVotes: { submission_id: string; rank: number }[]
  userLikes: { submission_id: string }[]
}

export function TournamentSubmissions({
  submissions,
  userId,
  tournamentId,
  canVote,
  allVotes,
  allLikes,
  userVotes,
  userLikes,
}: TournamentSubmissionsProps) {
  const [votingFor, setVotingFor] = useState<string | null>(null)
  const [likingFor, setLikingFor] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const router = useRouter()

  // Calculate points for each submission
  const getSubmissionStats = (submissionId: string) => {
    const votes = allVotes.filter((v) => v.submission_id === submissionId)
    const likes = allLikes.filter((l) => l.submission_id === submissionId)

    // Calculate total points from votes
    const totalPoints = votes.reduce((sum, vote) => {
      if (vote.rank === 1) return sum + 3
      if (vote.rank === 2) return sum + 2
      if (vote.rank === 3) return sum + 1
      return sum
    }, 0)

    const userVote = userVotes.find((v) => v.submission_id === submissionId)
    const userLiked = userLikes.some((l) => l.submission_id === submissionId)

    return {
      totalPoints,
      voteCount: votes.length,
      likeCount: likes.length,
      userVote: userVote?.rank,
      userLiked,
    }
  }

  const handleVote = async (submissionId: string, rank: number) => {
    setVotingFor(submissionId)
    const supabase = createClient()

    const stats = getSubmissionStats(submissionId)

    if (stats.userVote === rank) {
      // Remove vote if clicking the same rank
      await supabase.from("votes").delete().eq("submission_id", submissionId).eq("user_id", userId).eq("rank", rank)
    } else if (stats.userVote) {
      // Update existing vote to new rank
      await supabase
        .from("votes")
        .update({ rank })
        .eq("submission_id", submissionId)
        .eq("user_id", userId)
        .eq("rank", stats.userVote)
    } else {
      // Add new vote
      await supabase.from("votes").insert({
        submission_id: submissionId,
        user_id: userId,
        rank,
      })
    }

    router.refresh()
    setVotingFor(null)
  }

  const handleLike = async (submissionId: string) => {
    setLikingFor(submissionId)
    const supabase = createClient()

    const stats = getSubmissionStats(submissionId)

    if (stats.userLiked) {
      // Remove like
      await supabase.from("likes").delete().eq("submission_id", submissionId).eq("user_id", userId)
    } else {
      // Add like
      await supabase.from("likes").insert({
        submission_id: submissionId,
        user_id: userId,
      })
    }

    router.refresh()
    setLikingFor(null)
  }

  if (submissions.length === 0) {
    return (
      <Card className="border-slate-700">
        <CardContent className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Play className="text-slate-400 w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">No submissions yet</h3>
            <p className="text-slate-400 mb-6">Be the first to submit your clip and compete for the prize!</p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <Trophy className="w-4 h-4" />
              <span>Submit your clip to start the competition</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {submissions.map((submission, index) => {
          const stats = getSubmissionStats(submission.id)
          const isOwnSubmission = submission.user_id === userId
          const isTopSubmission = index === 0 && stats.totalPoints > 0

          return (
            <Card
              key={submission.id}
              className={`border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 ${
                isTopSubmission ? 'ring-2 ring-blue-500/20 bg-slate-800/30' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {isTopSubmission && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full">
                          <Trophy className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 text-xs font-bold">TOP RANKED</span>
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-white">{submission.title}</h3>
                      {isOwnSubmission && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                          <User className="w-3 h-3 mr-1" />
                          Your Clip
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                      <User className="w-4 h-4" />
                      <span>by {submission.user?.display_name || "Unknown User"}</span>
                    </div>
                    {submission.description && (
                      <p className="text-slate-300 text-sm leading-relaxed">{submission.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-4">
                    {/* Watch Video Button */}
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <Play className="w-4 h-4" />
                      <span className="font-medium">Watch Clip</span>
                    </button>

                    {/* Vote Points Display */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <Trophy className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-bold">{stats.totalPoints}</span>
                      <span className="text-slate-400 text-xs">pts</span>
                    </div>

                    {/* Vote Count */}
                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                      <Eye className="w-4 h-4" />
                      <span>{stats.voteCount} votes</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Like Button */}
                    <button
                      onClick={() => handleLike(submission.id)}
                      disabled={likingFor === submission.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 ${
                        stats.userLiked
                          ? "bg-pink-500/10 text-pink-400 border border-pink-500/20 hover:bg-pink-500/20"
                          : "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white border border-slate-600"
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={stats.userLiked ? "currentColor" : "none"} />
                      <span className="text-sm font-medium">{stats.likeCount}</span>
                    </button>

                    {/* Voting Buttons - Only for users with approved submissions */}
                    {canVote && !isOwnSubmission && (
                      <div className="flex items-center gap-1 border-l border-slate-600 pl-3">
                        {/* 1st Place Vote */}
                        <button
                          onClick={() => handleVote(submission.id, 1)}
                          disabled={votingFor === submission.id}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 ${
                            stats.userVote === 1
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 hover:bg-yellow-500/30"
                              : "bg-slate-700 text-slate-400 hover:bg-yellow-500/10 hover:text-yellow-400 border border-slate-600 hover:border-yellow-500/30"
                          }`}
                          title="1st Place (3 points)"
                        >
                          <Trophy className="w-4 h-4" />
                          <span className="text-xs font-bold">1st</span>
                        </button>

                        {/* 2nd Place Vote */}
                        <button
                          onClick={() => handleVote(submission.id, 2)}
                          disabled={votingFor === submission.id}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 ${
                            stats.userVote === 2
                              ? "bg-slate-400/20 text-slate-300 border border-slate-400/40 hover:bg-slate-400/30"
                              : "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white border border-slate-600"
                          }`}
                          title="2nd Place (2 points)"
                        >
                          <Medal className="w-4 h-4" />
                          <span className="text-xs font-bold">2nd</span>
                        </button>

                        {/* 3rd Place Vote */}
                        <button
                          onClick={() => handleVote(submission.id, 3)}
                          disabled={votingFor === submission.id}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 ${
                            stats.userVote === 3
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/30"
                              : "bg-slate-700 text-slate-400 hover:bg-orange-500/10 hover:text-orange-400 border border-slate-600 hover:border-orange-500/30"
                          }`}
                          title="3rd Place (1 point)"
                        >
                          <Award className="w-4 h-4" />
                          <span className="text-xs font-bold">3rd</span>
                        </button>
                      </div>
                    )}

                    {canVote && isOwnSubmission && (
                      <div className="text-slate-500 text-xs italic pl-3 border-l border-slate-600">Cannot vote on own clip</div>
                    )}

                    {!canVote && (
                      <div className="text-slate-500 text-xs italic pl-3 border-l border-slate-600">
                        Submit clip to vote
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden border-slate-700">
            <CardContent className="p-0">
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedSubmission.title}</h2>
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>By {selectedSubmission.user?.display_name || "Unknown User"}</span>
                      </div>
                      {selectedSubmission.description && (
                        <p className="text-slate-300 mt-3 leading-relaxed">{selectedSubmission.description}</p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedSubmission(null)} 
                    className="text-slate-400 hover:text-white text-2xl transition-colors p-2 hover:bg-slate-700 rounded-lg"
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
    </>
  )
}
