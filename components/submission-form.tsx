"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function SubmissionForm({ tournamentId, userId }: { tournamentId: string; userId: string }) {
  const [title, setTitle] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: insertError } = await supabase.from("submissions").insert({
        tournament_id: tournamentId,
        user_id: userId,
        title,
        clip_url: videoUrl,
        description: description || null,
        status: "pending",
      })

      if (insertError) throw insertError

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 space-y-4">
      <div>
        <Label htmlFor="title" className="text-white">
          Clip Title
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="My Epic Play"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 bg-[#0B1020] border-[#2a3342] text-white placeholder:text-white/40"
        />
      </div>

      <div>
        <Label htmlFor="videoUrl" className="text-white">
          Video URL
        </Label>
        <Input
          id="videoUrl"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          required
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="mt-2 bg-[#0B1020] border-[#2a3342] text-white placeholder:text-white/40"
        />
        <p className="text-white/40 text-xs mt-1">YouTube, Twitch, or direct video link</p>
      </div>

      <div>
        <Label htmlFor="description" className="text-white">
          Description (optional)
        </Label>
        <Textarea
          id="description"
          placeholder="Tell us about your play..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 bg-[#0B1020] border-[#2a3342] text-white placeholder:text-white/40 min-h-[80px]"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <Button type="submit" className="w-full bg-[#4A6CFF] hover:bg-[#6A5CFF] text-white" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Clip"}
      </Button>
    </form>
  )
}
