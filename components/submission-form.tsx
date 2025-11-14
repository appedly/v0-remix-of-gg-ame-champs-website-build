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
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4">
      <div>
        <Label htmlFor="title" className="text-slate-300 font-medium">
          Clip Title
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="My Epic Play"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
        />
      </div>

      <div>
        <Label htmlFor="videoUrl" className="text-slate-300 font-medium">
          Video URL
        </Label>
        <Input
          id="videoUrl"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          required
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="mt-2 bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
        />
        <p className="text-slate-500 text-xs mt-1">YouTube, Twitch, or direct video link</p>
      </div>

      <div>
        <Label htmlFor="description" className="text-slate-300 font-medium">
          Description (optional)
        </Label>
        <Textarea
          id="description"
          placeholder="Tell us about your play..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 min-h-[80px]"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Clip"}
      </Button>
    </form>
  )
}
