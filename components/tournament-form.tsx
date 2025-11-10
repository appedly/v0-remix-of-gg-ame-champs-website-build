"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const games = [
  "Fortnite",
  "Valorant",
  "Call of Duty",
  "Apex Legends",
  "League of Legends",
  "CS2",
  "Overwatch 2",
  "Rocket League",
]

export function TournamentForm({ tournament }: { tournament?: any }) {
  const [title, setTitle] = useState(tournament?.title || "")
  const [game, setGame] = useState(tournament?.game || "")
  const [description, setDescription] = useState(tournament?.description || "")
  const [prizePool, setPrizePool] = useState(tournament?.prize_pool?.toString() || "")
  const [startDate, setStartDate] = useState(tournament?.start_date?.split("T")[0] || "")
  const [endDate, setEndDate] = useState(tournament?.end_date?.split("T")[0] || "")
  const [status, setStatus] = useState(tournament?.status || "upcoming")
  const [maxSubmissions, setMaxSubmissions] = useState(tournament?.max_submissions?.toString() || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!description.trim()) {
      setError("Description is required")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      setError("You must be logged in to create tournaments")
      setIsLoading(false)
      return
    }

    console.log("[v0] Creating tournament with user:", session.user.id)

    const tournamentData = {
      title,
      game,
      description: description.trim(),
      prize_pool: prizePool, // Store as plain number string without $ prefix
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      status,
      max_participants: maxSubmissions ? Number.parseInt(maxSubmissions) : null,
      created_by: session.user.id, // Add created_by field with authenticated user ID
    }

    console.log("[v0] Tournament data:", tournamentData)

    try {
      if (tournament) {
        const { data, error: updateError } = await supabase
          .from("tournaments")
          .update(tournamentData)
          .eq("id", tournament.id)
          .select()

        console.log("[v0] Update result:", { data, error: updateError })

        if (updateError) {
          console.error("[v0] Update error details:", {
            message: updateError.message,
            details: updateError.details,
            hint: updateError.hint,
            code: updateError.code,
          })
          throw updateError
        }
      } else {
        const { data, error: insertError } = await supabase.from("tournaments").insert(tournamentData).select()

        console.log("[v0] Insert result:", { data, error: insertError })

        if (insertError) {
          console.error("[v0] Insert error details:", {
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code,
          })
          throw insertError
        }
      }

      router.push("/admin/tournaments")
      router.refresh()
    } catch (err: any) {
      console.error("[v0] Tournament operation error:", err)
      setError(`Error: ${err.message || "An error occurred"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-8 space-y-6">
      <div>
        <Label htmlFor="title" className="text-white">
          Tournament Title
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Weekly Fortnite Championship"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 bg-[#0B1020] border-[#2a3342] text-white placeholder:text-white/40"
        />
      </div>

      <div>
        <Label htmlFor="game" className="text-white">
          Game
        </Label>
        <Select value={game} onValueChange={setGame} required>
          <SelectTrigger className="mt-2 bg-[#0B1020] border-[#2a3342] text-white">
            <SelectValue placeholder="Select a game" />
          </SelectTrigger>
          <SelectContent>
            {games.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description" className="text-white">
          Description *
        </Label>
        <Textarea
          id="description"
          placeholder="Tournament details and rules..."
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 bg-[#0B1020] border-[#2a3342] text-white placeholder:text-white/40 min-h-[100px]"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="prizePool" className="text-white">
            Prize Pool ($)
          </Label>
          <Input
            id="prizePool"
            type="number"
            placeholder="1000"
            required
            value={prizePool}
            onChange={(e) => setPrizePool(e.target.value)}
            className="mt-2 bg-[#0B1020] border-[#2a3342] text-white placeholder:text-white/40"
          />
        </div>

        <div>
          <Label htmlFor="maxSubmissions" className="text-white">
            Max Submissions (optional)
          </Label>
          <Input
            id="maxSubmissions"
            type="number"
            placeholder="Leave empty for unlimited"
            value={maxSubmissions}
            onChange={(e) => setMaxSubmissions(e.target.value)}
            className="mt-2 bg-[#0B1020] border-[#2a3342] text-white placeholder:text-white/40"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="startDate" className="text-white">
            Start Date
          </Label>
          <Input
            id="startDate"
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-2 bg-[#0B1020] border-[#2a3342] text-white"
          />
        </div>

        <div>
          <Label htmlFor="endDate" className="text-white">
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-2 bg-[#0B1020] border-[#2a3342] text-white"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="status" className="text-white">
          Status
        </Label>
        <Select value={status} onValueChange={setStatus} required>
          <SelectTrigger className="mt-2 bg-[#0B1020] border-[#2a3342] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" className="bg-[#4A6CFF] hover:bg-[#6A5CFF] text-white" disabled={isLoading}>
          {isLoading ? "Saving..." : tournament ? "Update Tournament" : "Create Tournament"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-[#2a3342] text-white hover:bg-white/10"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
