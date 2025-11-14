"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Heart, Trophy, Medal, Award } from "lucide-react"
import { VideoPlayer } from "./video-player"

type Submission = {
  id: string
  title: string
  clip_url: string
  description: string | null
  score: number
  user_id: string
  user: { display_name: string; id: string }
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
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
        <p className="text-slate-400">No submissions yet. Be the first!</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {submissions.map((submission) => {
          const stats = getSubmissionStats(submission.id)
          const isOwnSubmission = submission.user_id === userId

          return (
            <div
              key={submission.id}
              className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{submission.title}</h3>
                    {isOwnSubmission && (
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">
                        Your Clip
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">by {submission.user.display_name}</p>
                  {submission.description && <p className="text-slate-300 text-sm mt-2">{submission.description}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-slate-700 pt-4">
                <button
                  onClick={() => setSelectedSubmission(submission)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Watch Video →
                </button>

                <div className="ml-auto flex items-center gap-3">
                  {/* Vote Points Display */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Trophy className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 font-semibold">{stats.totalPoints}</span>
                    <span className="text-slate-400 text-xs">pts</span>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(submission.id)}
                    disabled={likingFor === submission.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all disabled:opacity-50 ${
                      stats.userLiked
                        ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                        : "bg-slate-700 text-slate-400 hover:bg-slate-600 border border-slate-600"
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
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all disabled:opacity-50 ${
                          stats.userVote === 1
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
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
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all disabled:opacity-50 ${
                          stats.userVote === 2
                            ? "bg-slate-400/20 text-slate-300 border border-slate-400/40"
                            : "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300 border border-slate-600"
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
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all disabled:opacity-50 ${
                          stats.userVote === 3
                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
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
                    <div className="text-slate-500 text-xs italic pl-3 border-l border-slate-600">Can't vote on own clip</div>
                  )}

                  {!canVote && (
                    <div className="text-slate-500 text-xs italic pl-3 border-l border-slate-600">
                      Submit an approved clip to vote
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedSubmission.title}</h2>
                  <p className="text-slate-400 text-sm mt-1">By {selectedSubmission.user.display_name}</p>
                </div>
                <button onClick={() => setSelectedSubmission(null)} className="text-slate-400 hover:text-white text-2xl">
                  ×
                </button>
              </div>

              <VideoPlayer url={selectedSubmission.clip_url} title={selectedSubmission.title} />

              {selectedSubmission.description && <p className="text-slate-300 mt-4">{selectedSubmission.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
