"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { VideoPlayer } from "./video-player"

type Submission = {
  id: string
  clip_url: string
  title: string
  description: string | null
  status: string
  created_at: string
  user: { display_name: string; email: string }
  tournament: { title: string; game: string }
}

export function SubmissionList({
  submissions,
  onUpdate,
}: {
  submissions: Submission[]
  onUpdate?: () => Promise<void>
}) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setIsUpdating(id)
    const supabase = createClient()

    const { error } = await supabase.from("submissions").update({ status: newStatus }).eq("id", id)

    if (error) {
      alert("Error updating submission: " + error.message)
    } else {
      if (onUpdate) {
        await onUpdate()
      }
    }

    setIsUpdating(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (submissions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-12 text-center">
        <p className="text-white/60">No submissions yet</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div key={submission.id} className="bg-gradient-to-r from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-6 hover:border-[#2a3342] transition-all hover:shadow-lg hover:shadow-[#4A6CFF]/5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{submission.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(submission.status)}`}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-1">
                  {submission.tournament.title} - {submission.tournament.game}
                </p>
                <p className="text-white/40 text-sm">
                  {submission.user.display_name} • {submission.user.email}
                </p>
                {submission.description && <p className="text-white/70 text-sm mt-3 leading-relaxed">{submission.description}</p>}
              </div>
            </div>

            <div className="mb-5 pb-5 border-b border-[#2a3342]/50">
              <button
                onClick={() => setSelectedSubmission(submission)}
                className="text-[#4A6CFF] hover:text-[#5A7CFF] text-sm font-medium transition-colors"
              >
                View Video
              </button>
            </div>

            <div className="flex gap-2">
              {submission.status !== "approved" && (
                <button
                  onClick={() => handleStatusUpdate(submission.id, "approved")}
                  disabled={isUpdating === submission.id}
                  className="px-3 py-2 bg-green-500/15 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/25 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating === submission.id ? "..." : "Approve"}
                </button>
              )}
              {submission.status !== "rejected" && (
                <button
                  onClick={() => handleStatusUpdate(submission.id, "rejected")}
                  disabled={isUpdating === submission.id}
                  className="px-3 py-2 bg-red-500/15 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/25 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating === submission.id ? "..." : "Reject"}
                </button>
              )}
              {submission.status !== "pending" && (
                <button
                  onClick={() => handleStatusUpdate(submission.id, "pending")}
                  disabled={isUpdating === submission.id}
                  className="px-3 py-2 bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/25 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating === submission.id ? "..." : "Pending"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50">
            <div className="sticky top-0 bg-[#0B1020]/80 backdrop-blur border-b border-[#2a3342]/50 p-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedSubmission.title}</h2>
                <p className="text-white/60 text-sm mt-1">{selectedSubmission.user.display_name}</p>
              </div>
              <button onClick={() => setSelectedSubmission(null)} className="text-white/60 hover:text-white transition-colors text-2xl font-light">
                ✕
              </button>
            </div>
            <div className="p-6">
              <VideoPlayer url={selectedSubmission.clip_url} title={selectedSubmission.title} />
              {selectedSubmission.description && <p className="text-white/70 mt-6 leading-relaxed">{selectedSubmission.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
