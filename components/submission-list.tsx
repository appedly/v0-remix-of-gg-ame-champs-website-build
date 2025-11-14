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
  user: { display_name: string; email: string } | null
  tournament: { title: string; game: string } | null
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
      <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-12 text-center">
        <p className="text-white/60">No submissions yet</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div key={submission.id} className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">{submission.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(submission.status)}`}>
                    {submission.status}
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-1">
                   {submission.tournament?.title || "Unknown Tournament"} - {submission.tournament?.game || "Unknown Game"}
                 </p>
                 <p className="text-white/40 text-sm">
                   By {submission.user?.display_name || "Unknown User"} ({submission.user?.email || "No email"})
                 </p>
                {submission.description && <p className="text-white/70 text-sm mt-2">{submission.description}</p>}
              </div>
            </div>

            <div className="mb-4">
              <button
                onClick={() => setSelectedSubmission(submission)}
                className="text-[#4A6CFF] hover:text-[#6A5CFF] text-sm"
              >
                View Video →
              </button>
            </div>

            <div className="flex gap-2">
              {submission.status !== "approved" && (
                <button
                  onClick={() => handleStatusUpdate(submission.id, "approved")}
                  disabled={isUpdating === submission.id}
                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm disabled:opacity-50"
                >
                  {isUpdating === submission.id ? "Updating..." : "Approve"}
                </button>
              )}
              {submission.status !== "rejected" && (
                <button
                  onClick={() => handleStatusUpdate(submission.id, "rejected")}
                  disabled={isUpdating === submission.id}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm disabled:opacity-50"
                >
                  {isUpdating === submission.id ? "Updating..." : "Reject"}
                </button>
              )}
              {submission.status !== "pending" && (
                <button
                  onClick={() => handleStatusUpdate(submission.id, "pending")}
                  disabled={isUpdating === submission.id}
                  className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm disabled:opacity-50"
                >
                  {isUpdating === submission.id ? "Updating..." : "Set Pending"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedSubmission.title}</h2>
                  <p className="text-white/60 text-sm mt-1">By {selectedSubmission.user?.display_name || "Unknown User"}</p>
                </div>
                <button onClick={() => setSelectedSubmission(null)} className="text-white/60 hover:text-white text-2xl">
                  ×
                </button>
              </div>

              <VideoPlayer url={selectedSubmission.clip_url} title={selectedSubmission.title} />

              {selectedSubmission.description && <p className="text-white/70 mt-4">{selectedSubmission.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
