"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalVotes: 0,
    approvedSubmissions: 0,
    activeTournaments: 0,
  })

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      console.log("[v0] Profile - Session check:", { session: !!session, error: sessionError })

      if (!session || sessionError) {
        router.push("/login")
        return
      }

      setUser(session.user)

      // Fetch user profile data
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single()

      console.log("[v0] Profile data fetch:", { data: userData, error: userError })

      if (userData) {
        setDisplayName(userData.display_name || "")
        setBio(userData.bio || "")
      }

      // Fetch user stats
      const { data: submissions } = await supabase
        .from("submissions")
        .select("*, votes:votes(count), tournament:tournaments(status)")
        .eq("user_id", session.user.id)

      if (submissions) {
        const totalVotes = submissions.reduce((sum, sub) => sum + (sub.votes?.length || 0), 0)
        const approvedSubmissions = submissions.filter((sub) => sub.status === "approved").length
        const activeTournaments = new Set(
          submissions.filter((sub) => sub.tournament?.status === "active").map((sub) => sub.tournament_id),
        ).size

        setStats({
          totalSubmissions: submissions.length,
          totalVotes,
          approvedSubmissions,
          activeTournaments,
        })
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    const supabase = createClient()

    console.log("[v0] Updating profile for user:", user.id)

    const { data, error } = await supabase
      .from("users")
      .update({
        display_name: displayName,
        bio: bio || null,
      })
      .eq("id", user.id)
      .select()

    console.log("[v0] Profile update result:", { data, error })

    if (error) {
      setMessage({ type: "error", text: `Error: ${error.message}` })
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" })
    }

    setIsSaving(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingPassword(true)
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" })
      setIsChangingPassword(false)
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      setIsChangingPassword(false)
      return
    }

    const supabase = createClient()

    console.log("[v0] Changing password for user:", user.id)

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    console.log("[v0] Password change result:", { error })

    if (error) {
      setMessage({ type: "error", text: `Error: ${error.message}` })
    } else {
      setMessage({ type: "success", text: "Password changed successfully!" })
      setNewPassword("")
      setConfirmPassword("")
    }

    setIsChangingPassword(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <UserNav userName={user?.display_name || "User"} />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-white/60">Manage your account and view your stats</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-4">
            <div className="text-white/40 text-sm mb-1">Total Submissions</div>
            <div className="text-2xl font-bold text-white">{stats.totalSubmissions}</div>
          </div>
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-4">
            <div className="text-white/40 text-sm mb-1">Approved</div>
            <div className="text-2xl font-bold text-green-400">{stats.approvedSubmissions}</div>
          </div>
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-4">
            <div className="text-white/40 text-sm mb-1">Total Votes</div>
            <div className="text-2xl font-bold text-[#00C2FF]">{stats.totalVotes}</div>
          </div>
          <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-4">
            <div className="text-white/40 text-sm mb-1">Active Tournaments</div>
            <div className="text-2xl font-bold text-[#4A6CFF]">{stats.activeTournaments}</div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <form
            onSubmit={handleUpdateProfile}
            className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 md:p-8 space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
              <p className="text-white/60 text-sm mb-6">Update your display name and bio</p>
            </div>

            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="mt-2 bg-[#0B1020] border-[#2a3342] text-white/60"
              />
              <p className="text-white/40 text-xs mt-1">Email cannot be changed</p>
            </div>

            <div>
              <Label htmlFor="displayName" className="text-white">
                Display Name
              </Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="mt-2 bg-[#0B1020] border-[#2a3342] text-white placeholder:text-white/40"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-white">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="mt-2 bg-[#0B1020] border-[#2a3342] text-white placeholder:text-white/40 min-h-[100px]"
              />
            </div>

            <Button type="submit" className="bg-[#4A6CFF] hover:bg-[#6A5CFF] text-white" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </form>

          {/* Change Password */}
          <form
            onSubmit={handleChangePassword}
            className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 md:p-8 space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
              <p className="text-white/60 text-sm mb-6">Update your password to keep your account secure</p>
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-white">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                className="mt-2 bg-[#0B1020] border-[#2a3342] text-white placeholder:text-white/40"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                className="mt-2 bg-[#0B1020] border-[#2a3342] text-white placeholder:text-white/40"
              />
            </div>

            <Button type="submit" className="bg-[#4A6CFF] hover:bg-[#6A5CFF] text-white" disabled={isChangingPassword}>
              {isChangingPassword ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
