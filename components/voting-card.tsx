"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

interface VotingCardProps {
  submission: {
    id: string
    title: string
    description: string
    clip_url: string
    user: { display_name: string }
    votes: number
    likes: number
    comments: number
    userVoted: boolean
  }
  tournamentId: string
  userSession: any
  onVoteUpdate: () => void
}

export function VotingCard({ submission, tournamentId, userSession, onVoteUpdate }: VotingCardProps) {
  const [selectedRank, setSelectedRank] = useState<number | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [userVoted, setUserVoted] = useState(submission.userVoted)
  const [voteCount, setVoteCount] = useState(submission.votes)
  const [likeCount, setLikeCount] = useState(submission.likes)
  const [userLiked, setUserLiked] = useState(false)

  const handleRankedVote = async (rank: number) => {
    if (!userSession) {
      alert("Please log in to vote")
      return
    }

    if (userVoted) {
      alert("You have already voted for this submission")
      return
    }

    setIsVoting(true)
    const supabase = createClient()

    const { error } = await supabase.from("votes").insert({
      submission_id: submission.id,
      user_id: userSession.id,
      rank: rank,
    })

    if (!error) {
      setUserVoted(true)
      setSelectedRank(rank)
      setVoteCount(voteCount + 1)
      onVoteUpdate()
    } else {
      console.error("[v0] Vote error:", error)
      alert("Error voting: " + error.message)
    }

    setIsVoting(false)
  }

  const handleLike = async () => {
    if (!userSession) {
      alert("Please log in to like")
      return
    }

    setIsLiking(true)
    const supabase = createClient()

    if (userLiked) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("submission_id", submission.id)
        .eq("user_id", userSession.id)

      if (!error) {
        setLikeCount(Math.max(0, likeCount - 1))
        setUserLiked(false)
      }
    } else {
      const { error } = await supabase.from("likes").insert({
        submission_id: submission.id,
        user_id: userSession.id,
      })

      if (!error) {
        setLikeCount(likeCount + 1)
        setUserLiked(true)
      } else {
        console.error("[v0] Like error:", error)
        alert("Error liking: " + error.message)
      }
    }

    setIsLiking(false)
  }

  const getRankPoints = (rank: number) => {
    const points = { 1: 3, 2: 2, 3: 1 }
    return points[rank as keyof typeof points] || 0
  }

  return (
    <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] overflow-hidden hover:border-[#4A6CFF] transition-colors">
      <div className="aspect-video bg-[#0B1020] flex items-center justify-center">
        <a
          href={submission.clip_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4A6CFF] hover:text-[#5A7CFF] font-medium"
        >
          Watch Clip →
        </a>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2">{submission.title}</h3>
        <p className="text-white/60 text-sm mb-2">Posted by {submission.user.display_name}</p>
        {submission.description && <p className="text-white/40 text-sm mb-4 line-clamp-2">{submission.description}</p>}

        <div className="bg-[#0B1020]/50 rounded-lg p-4 mb-4">
          <p className="text-white/80 text-xs font-semibold mb-3">Vote for this clip:</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { rank: 1, label: "1st", points: 3 },
              { rank: 2, label: "2nd", points: 2 },
              { rank: 3, label: "3rd", points: 1 },
            ].map(({ rank, label, points }) => (
              <button
                key={rank}
                onClick={() => handleRankedVote(rank)}
                disabled={isVoting || userVoted}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  selectedRank === rank
                    ? "bg-[#4A6CFF] text-white"
                    : userVoted
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-[#4A6CFF]/20 text-[#4A6CFF] border border-[#4A6CFF]/30 hover:bg-[#4A6CFF]/30"
                }`}
              >
                <div>{label}</div>
                <div className="text-xs opacity-80">{points}pts</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleLike}
            disabled={isLiking}
            variant="outline"
            className={`${
              userLiked
                ? "bg-red-500/20 border-red-500/30 text-red-400"
                : "bg-white/5 border-white/10 text-white hover:bg-white/10"
            }`}
          >
            <Heart className={`w-4 h-4 ${userLiked ? "fill-current" : ""}`} />
            <span className="ml-2">{likeCount}</span>
          </Button>
          <span className="text-white/60 text-sm">{voteCount} votes</span>
        </div>
      </div>
    </div>
  )
}
