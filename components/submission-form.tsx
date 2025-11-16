"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Play, FileText, Link } from "lucide-react"

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
    <Card className="border-slate-700 hover:border-slate-600 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Upload className="w-5 h-5 text-blue-500" />
          Submit Your Clip
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300 font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Clip Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="My Epic Play"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl" className="text-slate-300 font-medium flex items-center gap-2">
              <Link className="w-4 h-4" />
              Video URL
            </Label>
            <Input
              id="videoUrl"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              required
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
            />
            <p className="text-slate-500 text-xs flex items-center gap-1">
              <Play className="w-3 h-3" />
              YouTube, Twitch, or direct video link
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300 font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description (optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Tell us about your play..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 min-h-[100px] focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 resize-none"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Submit Clip
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
