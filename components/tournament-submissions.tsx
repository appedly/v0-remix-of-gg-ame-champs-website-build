"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { ThumbsUp, Heart } from "lucide-react"
import { VideoPlayer } from "./video-player"

type Submission = {
  id: string
  title: string
  clip_url: string
  description: string | null
  user: { display_name: string }
  votes: any[]
}

export function TournamentSubmissions({ submissions, userId }: { submissions: Submission[]; userId: string }) {
  const [votingFor, setVotingFor] = useState<string | null>(null)
  const [likingFor, setLikingFor] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [likes, setLikes] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const handleVote = async (submissionId: string) => {
    setVotingFor(submissionId)
    const supabase = createClient()

    // Check if already voted
    const { data: existingVote } = await supabase
      .from("votes")
      .select("*")
      .eq("submission_id", submissionId)
      .eq("user_id", userId)
      .maybeSingle()

    if (existingVote) {
      // Remove vote
      await supabase.from("votes").delete().eq("id", existingVote.id)
    } else {
      // Add vote
      await supabase.from("votes").insert({
        submission_id: submissionId,
        user_id: userId,
      })
    }

    router.refresh()
    setVotingFor(null)
  }

  const handleLike = async (submissionId: string) => {
    setLikingFor(submissionId)
    const supabase = createClient()

    // Check if already liked
    const { data: existingLike } = await supabase
      .from("likes")
      .select("*")
      .eq("submission_id", submissionId)
      .eq("user_id", userId)
      .maybeSingle()

    if (existingLike) {
      // Remove like
      await supabase.from("likes").delete().eq("id", existingLike.id)
      setLikes((prev) => ({ ...prev, [submissionId]: false }))
    } else {
      // Add like
      await supabase.from("likes").insert({
        submission_id: submissionId,
        user_id: userId,
      })
      setLikes((prev) => ({ ...prev, [submissionId]: true }))
    }

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
          const voteCount = submission.votes?.length || 0

          return (
            <div key={submission.id} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{submission.title}</h3>
                  <p className="text-slate-400 text-sm">by {submission.user.display_name}</p>
                  {submission.description && <p className="text-slate-300 text-sm mt-2">{submission.description}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-slate-700 pt-4">
                <button
                  onClick={() => setSelectedSubmission(submission)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  Watch Video →
                </button>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => handleLike(submission.id)}
                    disabled={likingFor === submission.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                      likes[submission.id]
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={likes[submission.id] ? "currentColor" : "none"} />
                  </button>

                  <button
                    onClick={() => handleVote(submission.id)}
                    disabled={votingFor === submission.id}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors disabled:opacity-50 border border-blue-500/20"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">{voteCount}</span>
                  </button>
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
