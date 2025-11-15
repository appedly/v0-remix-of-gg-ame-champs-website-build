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
  const [imageUrl, setImageUrl] = useState(tournament?.image_url || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleImageUpload = async (file: File) => {
    if (!file) return null

    setUploadingImage(true)
    const supabase = createClient()
    
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `tournament-images/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('tournament-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Image upload error:', error)
        throw error
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tournament-images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Image upload failed:', error)
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    // Validate image dimensions (recommend 1024x576 for 16:9 aspect ratio)
    const img = new Image()
    img.onload = function() {
      const width = this.width
      const height = this.height
      const aspectRatio = width / height
      
      // Check if aspect ratio is close to 16:9 (1.78)
      if (Math.abs(aspectRatio - 1.78) > 0.2) {
        console.warn('For best results, use images with 16:9 aspect ratio (1024x576 recommended)')
      }
    }
    img.src = URL.createObjectURL(file)

    setImageFile(file)
    
    // Preview the image immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

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

    // Upload image if a new file was selected
    let finalImageUrl = imageUrl
    if (imageFile && imageUrl.startsWith('blob:')) {
      const uploadedUrl = await handleImageUpload(imageFile)
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl
      } else {
        setError("Failed to upload image. Please try again.")
        setIsLoading(false)
        return
      }
    }

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
      image_url: finalImageUrl || null, // Add image_url field
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
        <Label htmlFor="image" className="text-white">
          Tournament Image (Recommended: 1024x576, 16:9 aspect ratio)
        </Label>
        <div className="mt-2 space-y-3">
          {imageUrl && (
            <div className="relative">
              <img
                src={imageUrl}
                alt="Tournament preview"
                className="w-full h-48 object-cover rounded-lg border border-[#2a3342]"
              />
              <button
                type="button"
                onClick={() => {
                  setImageUrl("")
                  setImageFile(null)
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="relative">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={uploadingImage}
            />
            <button
              type="button"
              onClick={() => document.getElementById('image')?.click()}
              disabled={uploadingImage}
              className="w-full px-4 py-3 bg-[#0B1020] border-[#2a3342] border-2 border-dashed rounded-lg text-white hover:bg-[#1a2332] transition-colors disabled:opacity-50"
            >
              {uploadingImage ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{imageUrl ? 'Change Image' : 'Upload Image'}</span>
                </div>
              )}
            </button>
          </div>
          <p className="text-xs text-white/60">
            • Max file size: 5MB<br/>
            • Recommended size: 1024x576px (16:9 aspect ratio)<br/>
            • Formats: JPG, PNG, WebP
          </p>
        </div>
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
        <Button 
          type="submit" 
          className="bg-[#4A6CFF] hover:bg-[#6A5CFF] text-white" 
          disabled={isLoading || uploadingImage}
        >
          {isLoading || uploadingImage ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{uploadingImage ? "Uploading Image..." : "Saving..."}</span>
            </div>
          ) : (
            tournament ? "Update Tournament" : "Create Tournament"
          )}
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
